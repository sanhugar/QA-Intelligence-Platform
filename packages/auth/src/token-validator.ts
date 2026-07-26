import { jwtVerify, type JWTPayload } from 'jose';
import type { AuthConfig } from './auth-config-schema';
import { AuthError, AuthErrorCodes } from './errors';
import type { IdentityProviderPort } from './identity-provider';

export interface ValidateAccessTokenOptions {
  token: string;
  config: AuthConfig;
  identityProvider: IdentityProviderPort;
}

/**
 * Validate a Bearer access token. Fail-closed on any verification failure.
 */
export async function validateAccessToken(
  options: ValidateAccessTokenOptions,
): Promise<JWTPayload> {
  const { token, config, identityProvider } = options;
  if (!token || !token.trim()) {
    throw new AuthError('Missing access token', AuthErrorCodes.AUTH_TOKEN_INVALID);
  }

  // Reject clearly unsigned / empty alg tokens early (header inspection)
  const headerPart = token.split('.')[0];
  if (!headerPart) {
    throw new AuthError('Malformed token', AuthErrorCodes.AUTH_TOKEN_INVALID);
  }
  try {
    const headerJson = Buffer.from(headerPart, 'base64url').toString('utf8');
    const header = JSON.parse(headerJson) as { alg?: string };
    if (!header.alg || header.alg === 'none' || header.alg.toLowerCase() === 'none') {
      throw new AuthError('Unsigned tokens are rejected', AuthErrorCodes.AUTH_TOKEN_INVALID);
    }
    if (!config.algorithms.includes(header.alg)) {
      throw new AuthError('Token algorithm not allowed', AuthErrorCodes.AUTH_TOKEN_INVALID, {
        alg: header.alg,
      });
    }
  } catch (error) {
    if (error instanceof AuthError) {
      throw error;
    }
    throw new AuthError('Malformed token header', AuthErrorCodes.AUTH_TOKEN_INVALID);
  }

  if (!config.issuer || !config.audience) {
    throw new AuthError(
      'Issuer and audience are required for token validation',
      AuthErrorCodes.AUTH_CONFIG_INVALID,
    );
  }

  try {
    const { payload } = await jwtVerify(token, identityProvider.getKey, {
      issuer: config.issuer,
      audience: config.audience,
      algorithms: config.algorithms,
      clockTolerance: config.clockSkewSeconds,
    });
    return payload;
  } catch (error) {
    if (error instanceof AuthError) {
      throw error;
    }
    throw new AuthError('Access token validation failed', AuthErrorCodes.AUTH_TOKEN_INVALID, {
      reason: error instanceof Error ? error.message : String(error),
    });
  }
}
