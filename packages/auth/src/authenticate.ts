import type { AuthConfig } from './auth-config-schema';
import { normalizeClaims } from './claims-normalizer';
import { createIdentityContext } from './identity-context-factory';
import type { IdentityProviderPort } from './identity-provider';
import { validateAccessToken } from './token-validator';
import type { AtiPrincipal } from './types';

export interface AuthenticateAccessTokenOptions {
  token: string;
  config: AuthConfig;
  identityProvider: IdentityProviderPort;
}

/** Full AuthN pipeline: validate → normalize → principal. */
export async function authenticateAccessToken(
  options: AuthenticateAccessTokenOptions,
): Promise<AtiPrincipal> {
  const payload = await validateAccessToken(options);
  const claims = normalizeClaims(payload);
  return createIdentityContext(claims, options.config);
}

/** Worker service-principal authentication (no user propagation). */
export async function authenticateServicePrincipal(
  options: AuthenticateAccessTokenOptions,
): Promise<AtiPrincipal> {
  const config: AuthConfig = {
    ...options.config,
    expectedPrincipalKind: 'service',
  };
  return authenticateAccessToken({ ...options, config });
}
