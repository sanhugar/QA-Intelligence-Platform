import { exportJWK, generateKeyPair, SignJWT } from 'jose';
import {
  AuthError,
  AuthErrorCodes,
  FoundationRoles,
  authenticateAccessToken,
  authenticateServicePrincipal,
  authorize,
  createStaticIdentityProvider,
  isPublicRoute,
  loadAuthConfig,
  normalizeClaims,
  redactAuthorizationHeader,
  redactJwt,
  validateAccessToken,
} from './index';

async function buildTestHarness(overrides?: {
  audience?: string;
  issuer?: string;
  roles?: string[];
  alg?: string;
}) {
  const issuer = overrides?.issuer ?? 'https://idp.example.test/';
  const audience = overrides?.audience ?? 'ati-api';
  const { privateKey, publicKey } = await generateKeyPair('RS256');
  const jwk = await exportJWK(publicKey);
  jwk.kid = 'test-kid';
  jwk.alg = 'RS256';
  jwk.use = 'sig';

  const provider = createStaticIdentityProvider({ keys: [jwk] });
  const config = loadAuthConfig({
    env: {
      ATI_AUTH_ENABLED: 'true',
      ATI_AUTH_ISSUER: issuer,
      ATI_AUTH_AUDIENCE: audience,
      ATI_AUTH_JWKS_URI: 'https://idp.example.test/jwks',
      ATI_AUTH_ALGORITHMS: 'RS256',
      ATI_NODE_ENV: 'test',
    },
  });

  // Prefer static provider over remote URI for unit tests
  const tokenBuilder = async (claims?: Record<string, unknown>) => {
    let builder = new SignJWT({
      roles: overrides?.roles ?? ['authenticated'],
      ...claims,
    })
      .setProtectedHeader({ alg: overrides?.alg ?? 'RS256', kid: 'test-kid' })
      .setSubject('user-1')
      .setIssuer(issuer)
      .setAudience(audience)
      .setIssuedAt()
      .setExpirationTime('2h');
    return builder.sign(privateKey);
  };

  return { provider, config, tokenBuilder, issuer, audience, privateKey };
}

describe('@ati/auth', () => {
  it('loads disabled auth config without requiring OIDC settings', () => {
    const config = loadAuthConfig({
      env: { ATI_AUTH_ENABLED: 'false', ATI_NODE_ENV: 'development' },
    });
    expect(config.enabled).toBe(false);
    expect(config.publicRoutes).toEqual(expect.arrayContaining(['/health/live', '/health/ready']));
  });

  it('fails fast when enabled without OIDC settings', () => {
    expect(() =>
      loadAuthConfig({
        env: { ATI_AUTH_ENABLED: 'true', ATI_NODE_ENV: 'production' },
      }),
    ).toThrow(AuthError);
  });

  it('validates a signed access token and builds principal', async () => {
    const { provider, config, tokenBuilder } = await buildTestHarness();
    const token = await tokenBuilder();
    const principal = await authenticateAccessToken({ token, config, identityProvider: provider });
    expect(principal.subject).toBe('user-1');
    expect(principal.roles).toContain(FoundationRoles.AUTHENTICATED);
    expect(principal.kind).toBe('human');
  });

  it('rejects unsigned none algorithm tokens', async () => {
    const { provider, config } = await buildTestHarness();
    const header = Buffer.from(JSON.stringify({ alg: 'none', typ: 'JWT' })).toString('base64url');
    const payload = Buffer.from(JSON.stringify({ sub: 'x', iss: config.issuer, aud: config.audience, exp: 9999999999 })).toString(
      'base64url',
    );
    const token = `${header}.${payload}.`;
    await expect(validateAccessToken({ token, config, identityProvider: provider })).rejects.toMatchObject({
      code: AuthErrorCodes.AUTH_TOKEN_INVALID,
    });
  });

  it('rejects wrong audience', async () => {
    const { provider, config, tokenBuilder } = await buildTestHarness();
    const token = await tokenBuilder();
    const badConfig = { ...config, audience: 'other-api' };
    await expect(
      authenticateAccessToken({ token, config: badConfig, identityProvider: provider }),
    ).rejects.toMatchObject({ code: AuthErrorCodes.AUTH_TOKEN_INVALID });
  });

  it('maps service principal when explicit service evidence exists', async () => {
    const { provider, config, tokenBuilder } = await buildTestHarness({ roles: ['service'] });
    const token = await tokenBuilder();
    const principal = await authenticateServicePrincipal({
      token,
      config,
      identityProvider: provider,
    });
    expect(principal.kind).toBe('service');
    expect(principal.roles).toContain(FoundationRoles.SERVICE);
  });

  it('rejects human-only token for service principal path', async () => {
    const { provider, config, tokenBuilder } = await buildTestHarness({ roles: ['authenticated'] });
    const token = await tokenBuilder();
    await expect(
      authenticateServicePrincipal({ token, config, identityProvider: provider }),
    ).rejects.toMatchObject({ code: AuthErrorCodes.AUTH_FORBIDDEN });
  });

  it('rejects service principal when role list is empty', async () => {
    const { provider, config, tokenBuilder } = await buildTestHarness({ roles: [] });
    const token = await tokenBuilder({ roles: [] });
    await expect(
      authenticateServicePrincipal({ token, config, identityProvider: provider }),
    ).rejects.toMatchObject({ code: AuthErrorCodes.AUTH_FORBIDDEN });
  });

  it('rejects service path token with missing subject', async () => {
    const issuer = 'https://idp.example.test/';
    const audience = 'ati-api';
    const { privateKey, publicKey } = await generateKeyPair('RS256');
    const jwk = await exportJWK(publicKey);
    jwk.kid = 'nosub';
    const provider = createStaticIdentityProvider({ keys: [jwk] });
    const config = loadAuthConfig({
      env: {
        ATI_AUTH_ENABLED: 'true',
        ATI_AUTH_ISSUER: issuer,
        ATI_AUTH_AUDIENCE: audience,
        ATI_AUTH_JWKS_URI: 'https://idp.example.test/jwks',
        ATI_NODE_ENV: 'test',
      },
    });
    const token = await new SignJWT({ roles: ['service'] })
      .setProtectedHeader({ alg: 'RS256', kid: 'nosub' })
      .setIssuer(issuer)
      .setAudience(audience)
      .setExpirationTime('1h')
      .sign(privateKey);
    await expect(
      authenticateServicePrincipal({ token, config, identityProvider: provider }),
    ).rejects.toMatchObject({ code: AuthErrorCodes.AUTH_TOKEN_INVALID });
  });

  it('authorizes deny-by-default', async () => {
    const { provider, config, tokenBuilder } = await buildTestHarness();
    const token = await tokenBuilder();
    const principal = await authenticateAccessToken({ token, config, identityProvider: provider });
    expect(authorize({ principal })).toBe(true);
    expect(() => authorize({ principal: null })).toThrow(AuthError);
    expect(() =>
      authorize({ principal, requiredRoles: [FoundationRoles.SERVICE] }),
    ).toThrow(AuthError);
  });

  it('normalizes claims without vendor types', () => {
    const claims = normalizeClaims({
      sub: 'abc',
      iss: 'https://idp',
      aud: 'ati-api',
      exp: 9999999999,
      roles: ['authenticated'],
      groups: ['service'],
    });
    expect(claims.subject).toBe('abc');
    expect(claims.roles).toContain('authenticated');
    expect(claims.groups).toContain('service');
  });

  describe('public route exact matching (Finding 1)', () => {
    const allow = ['/health/live', '/health/ready'];

    it('allows exact health routes', () => {
      expect(isPublicRoute('/health/live', allow)).toBe(true);
      expect(isPublicRoute('/health/ready', allow)).toBe(true);
    });

    it('rejects suffix over-matches', () => {
      expect(isPublicRoute('/anything/health/live', allow)).toBe(false);
      expect(isPublicRoute('/prefix/health/ready', allow)).toBe(false);
      expect(isPublicRoute('/api/health/live', allow)).toBe(false);
      expect(isPublicRoute('/platform/auth/probe', allow)).toBe(false);
    });

    it('strips query strings and normalizes trailing slash', () => {
      expect(isPublicRoute('/health/live?x=1', allow)).toBe(true);
      expect(isPublicRoute('/health/ready/?y=2', allow)).toBe(true);
      expect(isPublicRoute('/health/live/', allow)).toBe(true);
      expect(isPublicRoute('/anything/health/live?x=1', allow)).toBe(false);
    });
  });

  it('redacts authorization and jwt material', () => {
    expect(redactAuthorizationHeader('Bearer secret.token.value')).toBe('[REDACTED]');
    expect(redactJwt('a.b.c')).toBe('[REDACTED]');
  });
});
