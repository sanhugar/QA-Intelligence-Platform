import {
  assertNoCrossTenantBleed,
  loadContextConfig,
  resolveApiContext,
  requireContextOrThrow,
  ContextError,
  ContextErrorCodes,
} from '@ati/context';
import { HttpHeaders } from '@ati/shared-constants';
import { ApiContextRuntime } from './api-context-runtime';
import { ContextMiddleware } from './context.middleware';
import { ApiAuthRuntime } from '../auth/api-auth-runtime';
import { ATI_PRINCIPAL_REQUEST_KEY } from '../auth/auth-request';
import { ATI_EXECUTION_CONTEXT_KEY } from './context-request';

describe('API context integration', () => {
  it('ignores spoofed tenant headers when resolving from subject map', () => {
    const runtime = ApiContextRuntime.create({
      env: {
        ATI_AUTH_ENABLED: 'true',
        ATI_CONTEXT_ENABLED: 'true',
        ATI_CONTEXT_ENFORCE_ON_PROTECTED: 'true',
        ATI_CONTEXT_SUBJECT_TENANT_MAP: 'human-a=tenant-a,human-b=tenant-b:ws-b',
      },
    });

    const forA = resolveApiContext({
      config: runtime.config,
      authEnabled: true,
      principal: { subject: 'human-a' },
      untrustedHeaderTenantId: 'tenant-b',
      untrustedHeaderWorkspaceId: 'ws-b',
    });
    const forB = resolveApiContext({
      config: runtime.config,
      authEnabled: true,
      principal: { subject: 'human-b' },
      untrustedHeaderTenantId: 'tenant-a',
    });

    expect(forA).toEqual({ tenantId: 'tenant-a' });
    expect(forB).toEqual({ tenantId: 'tenant-b', workspaceId: 'ws-b' });
    expect(() => assertNoCrossTenantBleed(forA, forB)).toThrow(/bleed/i);
  });

  it('fail-closes when protected enforcement requires context', () => {
    const config = loadContextConfig({
      env: {
        ATI_CONTEXT_ENABLED: 'true',
        ATI_CONTEXT_ENFORCE_ON_PROTECTED: 'true',
      },
    });
    const resolved = resolveApiContext({
      config,
      authEnabled: true,
      principal: { subject: 'unmapped-user' },
      untrustedHeaderTenantId: 'spoofed',
    });
    expect(resolved).toBeNull();
    expect(() => requireContextOrThrow(resolved, true)).toThrow(ContextError);
    try {
      requireContextOrThrow(resolved, true);
    } catch (e) {
      expect((e as ContextError).code).toBe(ContextErrorCodes.MISSING);
    }
  });

  it('binds scaffold defaults when auth is disabled', () => {
    const runtime = ApiContextRuntime.create({
      env: {
        ATI_AUTH_ENABLED: 'false',
        ATI_CONTEXT_ENABLED: 'true',
        ATI_CONTEXT_DEFAULT_TENANT_ID: 'dev-tenant',
        ATI_CONTEXT_DEFAULT_WORKSPACE_ID: 'dev-ws',
      },
    });
    expect(runtime.authEnabled).toBe(false);
    expect(
      resolveApiContext({
        config: runtime.config,
        authEnabled: false,
        untrustedHeaderTenantId: 'header-tenant',
      }),
    ).toEqual({ tenantId: 'dev-tenant', workspaceId: 'dev-ws' });
  });

  it('middleware leaves health routes context-free', () => {
    const contextRuntime = ApiContextRuntime.create({
      env: {
        ATI_AUTH_ENABLED: 'true',
        ATI_CONTEXT_ENABLED: 'true',
        ATI_CONTEXT_SUBJECT_TENANT_MAP: 'human-1=tenant-a',
        ATI_CONTEXT_ENFORCE_ON_PROTECTED: 'true',
      },
    });
    const authRuntime = ApiAuthRuntime.create({
      env: {
        ATI_AUTH_ENABLED: 'true',
        ATI_AUTH_ISSUER: 'https://idp.example.test/',
        ATI_AUTH_AUDIENCE: 'ati-api',
        ATI_AUTH_JWKS_URI: 'https://idp.example.test/jwks',
        ATI_NODE_ENV: 'test',
      },
    });
    const middleware = new ContextMiddleware(contextRuntime, authRuntime);
    const req: Record<string, unknown> = {
      path: '/health/live',
      headers: {
        [HttpHeaders.TENANT_ID]: 'spoofed-tenant',
        authorization: 'Bearer ignored',
      },
      [ATI_PRINCIPAL_REQUEST_KEY]: { subject: 'human-1', roles: [] },
    };
    let nextCalled = false;
    middleware.use(req as never, {} as never, () => {
      nextCalled = true;
    });
    expect(nextCalled).toBe(true);
    expect(req[ATI_EXECUTION_CONTEXT_KEY]).toBeUndefined();
  });

  it('middleware binds mapped context on protected path and ignores headers', () => {
    const contextRuntime = ApiContextRuntime.create({
      env: {
        ATI_AUTH_ENABLED: 'true',
        ATI_CONTEXT_ENABLED: 'true',
        ATI_CONTEXT_SUBJECT_TENANT_MAP: 'human-1=tenant-a:ws-1',
        ATI_CONTEXT_ENFORCE_ON_PROTECTED: 'true',
      },
    });
    const authRuntime = ApiAuthRuntime.create({
      env: {
        ATI_AUTH_ENABLED: 'true',
        ATI_AUTH_ISSUER: 'https://idp.example.test/',
        ATI_AUTH_AUDIENCE: 'ati-api',
        ATI_AUTH_JWKS_URI: 'https://idp.example.test/jwks',
        ATI_NODE_ENV: 'test',
      },
    });
    const middleware = new ContextMiddleware(contextRuntime, authRuntime);
    const req: Record<string, unknown> = {
      path: '/platform/context/probe',
      headers: {
        [HttpHeaders.TENANT_ID]: 'spoofed-tenant',
        [HttpHeaders.WORKSPACE_ID]: 'spoofed-ws',
      },
      [ATI_PRINCIPAL_REQUEST_KEY]: { subject: 'human-1', roles: ['ati.authenticated'] },
    };
    middleware.use(req as never, {} as never, () => undefined);
    expect(req[ATI_EXECUTION_CONTEXT_KEY]).toEqual({
      tenantId: 'tenant-a',
      workspaceId: 'ws-1',
    });
  });

  it('dual-tenant isolation: sequential requests do not leak context', () => {
    const contextRuntime = ApiContextRuntime.create({
      env: {
        ATI_AUTH_ENABLED: 'true',
        ATI_CONTEXT_ENABLED: 'true',
        ATI_CONTEXT_SUBJECT_TENANT_MAP: 'user-a=tenant-a,user-b=tenant-b',
        ATI_CONTEXT_ENFORCE_ON_PROTECTED: 'true',
      },
    });
    const authRuntime = ApiAuthRuntime.create({
      env: {
        ATI_AUTH_ENABLED: 'true',
        ATI_AUTH_ISSUER: 'https://idp.example.test/',
        ATI_AUTH_AUDIENCE: 'ati-api',
        ATI_AUTH_JWKS_URI: 'https://idp.example.test/jwks',
        ATI_NODE_ENV: 'test',
      },
    });
    const middleware = new ContextMiddleware(contextRuntime, authRuntime);

    const reqA: Record<string, unknown> = {
      path: '/platform/context/probe',
      headers: {},
      [ATI_PRINCIPAL_REQUEST_KEY]: { subject: 'user-a', roles: [] },
    };
    middleware.use(reqA as never, {} as never, () => undefined);
    expect(reqA[ATI_EXECUTION_CONTEXT_KEY]).toEqual({ tenantId: 'tenant-a' });

    const reqB: Record<string, unknown> = {
      path: '/platform/context/probe',
      headers: { [HttpHeaders.TENANT_ID]: 'tenant-a' },
      [ATI_PRINCIPAL_REQUEST_KEY]: { subject: 'user-b', roles: [] },
    };
    middleware.use(reqB as never, {} as never, () => undefined);
    expect(reqB[ATI_EXECUTION_CONTEXT_KEY]).toEqual({ tenantId: 'tenant-b' });
    expect(reqA[ATI_EXECUTION_CONTEXT_KEY]).toEqual({ tenantId: 'tenant-a' });
  });
});
