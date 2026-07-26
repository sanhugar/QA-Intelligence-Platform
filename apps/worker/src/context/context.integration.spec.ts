import {
  assertNoCrossTenantBleed,
  resolveTrustedContext,
  ContextError,
} from '@ati/context';
import { HttpHeaders } from '@ati/shared-constants';
import { WorkerContextRuntime } from './worker-context-runtime';
import { WorkerContextMiddleware } from './context.middleware';
import { WorkerAuthRuntime } from '../auth/worker-auth-runtime';
import { ATI_EXECUTION_CONTEXT_KEY } from './context-request';

describe('Worker context integration', () => {
  it('accepts trusted envelope and rejects untrusted', () => {
    const runtime = WorkerContextRuntime.create({
      env: { ATI_CONTEXT_ENABLED: 'true' },
    });
    expect(
      runtime.bindFromTrustedEnvelope({
        trusted: true,
        executionContext: { tenantId: 'tenant-w', workspaceId: 'ws-w' },
      }),
    ).toEqual({ tenantId: 'tenant-w', workspaceId: 'ws-w' });

    expect(() =>
      runtime.bindFromTrustedEnvelope({
        trusted: false,
        executionContext: { tenantId: 'tenant-w' },
      }),
    ).toThrow(ContextError);
  });

  it('does not treat client headers as authoritative', () => {
    const contextRuntime = WorkerContextRuntime.create({
      env: {
        ATI_AUTH_ENABLED: 'true',
        ATI_CONTEXT_ENABLED: 'true',
        ATI_CONTEXT_ENFORCE_ON_PROTECTED: 'false',
      },
    });
    const authRuntime = WorkerAuthRuntime.create({
      env: {
        ATI_AUTH_ENABLED: 'true',
        ATI_AUTH_ISSUER: 'https://idp.example.test/',
        ATI_AUTH_AUDIENCE: 'ati-worker',
        ATI_AUTH_JWKS_URI: 'https://idp.example.test/jwks',
        ATI_NODE_ENV: 'test',
      },
    });
    const middleware = new WorkerContextMiddleware(contextRuntime, authRuntime);
    const req: Record<string, unknown> = {
      path: '/platform/context/bind',
      headers: {
        [HttpHeaders.TENANT_ID]: 'spoofed-tenant',
        [HttpHeaders.WORKSPACE_ID]: 'spoofed-ws',
      },
      body: {},
    };
    middleware.use(req as never, {} as never, () => undefined);
    expect(req[ATI_EXECUTION_CONTEXT_KEY]).toBeUndefined();
  });

  it('binds from trusted body envelope on protected path', () => {
    const contextRuntime = WorkerContextRuntime.create({
      env: {
        ATI_AUTH_ENABLED: 'true',
        ATI_CONTEXT_ENABLED: 'true',
        ATI_CONTEXT_ENFORCE_ON_PROTECTED: 'true',
      },
    });
    const authRuntime = WorkerAuthRuntime.create({
      env: {
        ATI_AUTH_ENABLED: 'true',
        ATI_AUTH_ISSUER: 'https://idp.example.test/',
        ATI_AUTH_AUDIENCE: 'ati-worker',
        ATI_AUTH_JWKS_URI: 'https://idp.example.test/jwks',
        ATI_NODE_ENV: 'test',
      },
    });
    const middleware = new WorkerContextMiddleware(contextRuntime, authRuntime);
    const req: Record<string, unknown> = {
      path: '/platform/context/bind',
      headers: { [HttpHeaders.TENANT_ID]: 'spoofed' },
      body: {
        trusted: true,
        executionContext: { tenantId: 'tenant-trusted' },
      },
    };
    middleware.use(req as never, {} as never, () => undefined);
    expect(req[ATI_EXECUTION_CONTEXT_KEY]).toEqual({ tenantId: 'tenant-trusted' });
  });

  it('leaves health context-free', () => {
    const contextRuntime = WorkerContextRuntime.create({
      env: {
        ATI_AUTH_ENABLED: 'true',
        ATI_CONTEXT_ENABLED: 'true',
        ATI_CONTEXT_ENFORCE_ON_PROTECTED: 'true',
      },
    });
    const authRuntime = WorkerAuthRuntime.create({
      env: {
        ATI_AUTH_ENABLED: 'true',
        ATI_AUTH_ISSUER: 'https://idp.example.test/',
        ATI_AUTH_AUDIENCE: 'ati-worker',
        ATI_AUTH_JWKS_URI: 'https://idp.example.test/jwks',
        ATI_NODE_ENV: 'test',
      },
    });
    const middleware = new WorkerContextMiddleware(contextRuntime, authRuntime);
    const req: Record<string, unknown> = {
      path: '/health/ready',
      headers: { [HttpHeaders.TENANT_ID]: 'spoofed' },
      body: {
        trusted: true,
        executionContext: { tenantId: 'should-not-bind' },
      },
    };
    middleware.use(req as never, {} as never, () => undefined);
    expect(req[ATI_EXECUTION_CONTEXT_KEY]).toBeUndefined();
  });

  it('dual-tenant isolation via trusted envelopes', () => {
    const a = resolveTrustedContext({
      trusted: true,
      executionContext: { tenantId: 'tenant-a' },
    });
    const b = resolveTrustedContext({
      trusted: true,
      executionContext: { tenantId: 'tenant-b' },
    });
    expect(a.tenantId).not.toBe(b.tenantId);
    expect(() => assertNoCrossTenantBleed(a, b)).toThrow(/bleed/i);
  });
});
