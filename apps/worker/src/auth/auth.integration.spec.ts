import { exportJWK, generateKeyPair, SignJWT } from 'jose';
import { createStaticIdentityProvider, FoundationRoles } from '@ati/auth';
import { ServicePrincipalAuthGuard } from './service-principal-auth.guard';
import { WorkerAuthRuntime } from './worker-auth-runtime';
import { ATI_PRINCIPAL_REQUEST_KEY } from './auth-request';

async function createWorkerFixture(roles: string[]) {
  const issuer = 'https://idp.example.test/';
  const audience = 'ati-worker';
  const { privateKey, publicKey } = await generateKeyPair('RS256');
  const jwk = await exportJWK(publicKey);
  jwk.kid = 'worker-test';
  jwk.alg = 'RS256';
  const provider = createStaticIdentityProvider({ keys: [jwk] });
  const runtime = WorkerAuthRuntime.create({
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
    .setProtectedHeader({ alg: 'RS256', kid: 'worker-test' })
    .setSubject(roles.includes('service') ? 'svc-worker-1' : 'human-1')
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

describe('Worker service-principal auth', () => {
  it('allows health without token when auth enabled', async () => {
    const { runtime } = await createWorkerFixture(['service']);
    const guard = new ServicePrincipalAuthGuard(runtime);
    await expect(guard.canActivate(mockContext('/health/ready') as never)).resolves.toBe(true);
  });

  it('denies probe without token', async () => {
    const { runtime } = await createWorkerFixture(['service']);
    const guard = new ServicePrincipalAuthGuard(runtime);
    await expect(guard.canActivate(mockContext('/platform/auth/probe') as never)).rejects.toThrow();
  });

  it('authenticates explicit service principal only (no user propagation)', async () => {
    const { runtime, token } = await createWorkerFixture(['service']);
    const guard = new ServicePrincipalAuthGuard(runtime);
    const ctx = mockContext('/platform/auth/probe', `Bearer ${token}`);
    await expect(guard.canActivate(ctx as never)).resolves.toBe(true);
    expect(ctx.request[ATI_PRINCIPAL_REQUEST_KEY]).toMatchObject({
      subject: 'svc-worker-1',
      kind: 'service',
      roles: expect.arrayContaining([FoundationRoles.SERVICE]),
    });
  });

  it('rejects human-only token on worker probe (Finding 2)', async () => {
    const { runtime, token } = await createWorkerFixture(['authenticated']);
    const guard = new ServicePrincipalAuthGuard(runtime);
    await expect(
      guard.canActivate(mockContext('/platform/auth/probe', `Bearer ${token}`) as never),
    ).rejects.toThrow();
  });

  it('rejects token with empty roles on worker probe', async () => {
    const { runtime, token } = await createWorkerFixture([]);
    const guard = new ServicePrincipalAuthGuard(runtime);
    await expect(
      guard.canActivate(mockContext('/platform/auth/probe', `Bearer ${token}`) as never),
    ).rejects.toThrow();
  });
});
