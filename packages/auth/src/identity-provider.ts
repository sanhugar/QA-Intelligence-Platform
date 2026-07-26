import type { JWK, JWTVerifyGetKey } from 'jose';
import { createLocalJWKSet, createRemoteJWKSet } from 'jose';
import { AuthError, AuthErrorCodes } from './errors';

/**
 * Abstraction over IdP key material. Hosts/tests may supply static JWKS;
 * production typically uses remote JWKS URI via createRemoteIdentityProvider.
 */
export interface IdentityProviderPort {
  /** jose-compatible key resolver (supports kid miss refresh for remote sets). */
  getKey: JWTVerifyGetKey;
}

export function createRemoteIdentityProvider(jwksUri: string): IdentityProviderPort {
  try {
    const url = new URL(jwksUri);
    // createRemoteJWKSet refreshes on unknown kid (jose behaviour)
    return { getKey: createRemoteJWKSet(url) };
  } catch {
    throw new AuthError('Invalid JWKS URI', AuthErrorCodes.AUTH_CONFIG_INVALID, { jwksUri });
  }
}

export function createStaticIdentityProvider(jwks: { keys: JWK[] }): IdentityProviderPort {
  return { getKey: createLocalJWKSet(jwks) };
}
