import type { JWTPayload } from 'jose';
import { AuthError, AuthErrorCodes } from './errors';
import type { AtiIdentityClaims } from './types';

function asStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((v): v is string => typeof v === 'string');
  }
  if (typeof value === 'string' && value.trim()) {
    return [value];
  }
  return [];
}

/**
 * Map IdP JWT payload to IdP-agnostic claims. No vendor SDK types.
 */
export function normalizeClaims(payload: JWTPayload): AtiIdentityClaims {
  const subject = typeof payload.sub === 'string' ? payload.sub.trim() : '';
  if (!subject) {
    throw new AuthError('Token subject is required', AuthErrorCodes.AUTH_TOKEN_INVALID);
  }
  const issuer = typeof payload.iss === 'string' ? payload.iss : '';
  if (!issuer) {
    throw new AuthError('Token issuer is required', AuthErrorCodes.AUTH_TOKEN_INVALID);
  }
  if (payload.exp === undefined || typeof payload.exp !== 'number') {
    throw new AuthError('Token expiry is required', AuthErrorCodes.AUTH_TOKEN_INVALID);
  }

  const roles = [
    ...asStringArray(payload.roles),
    ...asStringArray(payload.role),
    ...asStringArray((payload as Record<string, unknown>)['ati_roles']),
  ];
  const groups = [
    ...asStringArray(payload.groups),
    ...asStringArray((payload as Record<string, unknown>).group),
  ];

  return {
    subject,
    issuer,
    audience: payload.aud ?? '',
    expiresAt: payload.exp,
    issuedAt: typeof payload.iat === 'number' ? payload.iat : undefined,
    email: typeof payload.email === 'string' ? payload.email : undefined,
    preferredUsername:
      typeof payload.preferred_username === 'string'
        ? payload.preferred_username
        : typeof payload.name === 'string'
          ? payload.name
          : undefined,
    roles,
    groups,
    tokenId: typeof payload.jti === 'string' ? payload.jti : undefined,
  };
}
