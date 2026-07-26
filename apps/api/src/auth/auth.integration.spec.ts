import { exportJWK, generateKeyPair, SignJWT } from 'jose';
import {
  createStaticIdentityProvider,
  FoundationRoles,
  loadAuthConfig,
} from '@ati/auth';
import { ApiAuthRuntime } from './api-auth-runtime';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ATI_PRINCIPAL_REQUEST_KEY } from './auth-request';
import { redactAuthorizationHeader, redactJwt } from '@ati/auth';

async function createRuntimeAndToken(roles: string[] = ['authenticated']) {
  const issuer = 'https://idp.example.test/';
  const audience = 'ati-api';
  const { privateKey, publicKey } = await generateKeyPair('RS256');
  const jwk = await exportJWK(publicKey);
  jwk.kid = 'api-test';
  jwk.alg = 'RS256';
  const provider = createStaticIdentityProvider({ keys: [jwk] });
  const runtime = ApiAuthRuntime.create({
    env: {
      ATI_AUTH_ENABLED: 'true',
      ATI_AUTH_ISSUER: issuer,
      ATI_AUTH_AUDIENCE: audience,
      ATI_AUTH_JWKS_URI: 'https://idp.example.test/jwks',
      ATI_NODE_ENV: 'test',
    },
    identityProvider: provider,
  });
  const token = await new SignJWT({ roles })
    .setProtectedHeader({ alg: 'RS256', kid: 'api-test' })
    .setSubject('human-1')
    .setIssuer(issuer)
    .setAudience(audience)
    .setExpirationTime('1h')
    .sign(privateKey);
  return { runtime, token };
}

function mockContext(path: string, authorization?: string) {
  const request: Record<string, unknown> = {
    path,
    headers: authorization ? { authorization } : {},
  };
  return {
    switchToHttp: () => ({
      getRequest: () => request,
    }),
    request,
  };
}

describe('API auth integration', () => {
  it('allows health routes without token when auth enabled', async () => {
    const { runtime } = await createRuntimeAndToken();
    const guard = new JwtAuthGuard(runtime);
    const ctx = mockContext('/health/live');
    await expect(guard.canActivate(ctx as never)).resolves.toBe(true);
  });

  it('denies protected probe without token (fail-closed)', async () => {
    const { runtime } = await createRuntimeAndToken();
    const guard = new JwtAuthGuard(runtime);
    const ctx = mockContext('/platform/auth/probe');
    await expect(guard.canActivate(ctx as never)).rejects.toThrow();
  });

  it('binds identity context for valid bearer token', async () => {
    const { runtime, token } = await createRuntimeAndToken();
    const guard = new JwtAuthGuard(runtime);
    const ctx = mockContext('/platform/auth/probe', `Bearer ${token}`);
    await expect(guard.canActivate(ctx as never)).resolves.toBe(true);
    expect(ctx.request[ATI_PRINCIPAL_REQUEST_KEY]).toMatchObject({
      subject: 'human-1',
      roles: expect.arrayContaining([FoundationRoles.AUTHENTICATED]),
    });
  });

  it('preserves disabled-auth developer experience', () => {
    const runtime = ApiAuthRuntime.create({
      env: { ATI_AUTH_ENABLED: 'false', ATI_NODE_ENV: 'development' },
    });
    expect(runtime.config.enabled).toBe(false);
    expect(loadAuthConfig({ env: { ATI_AUTH_ENABLED: 'false' } }).publicRoutes).toEqual(
      expect.arrayContaining(['/health/live', '/health/ready']),
    );
  });

  it('does not expose approval permissions in foundation roles', async () => {
    const { runtime, token } = await createRuntimeAndToken();
    const principal = await runtime.authenticateBearerToken(token);
    expect(principal.roles).not.toContain('ai.approve');
    expect(Object.values(FoundationRoles)).not.toContain('ai.approve');
  });

  it('redacts secrets for security logging', () => {
    expect(redactAuthorizationHeader('Bearer abc')).toBe('[REDACTED]');
    expect(redactJwt('a.b.c')).toBe('[REDACTED]');
  });
});
