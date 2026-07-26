import { AuthError, AuthErrorCodes } from './errors';
import type { AtiPrincipal, FoundationRole } from './types';

export interface AuthorizeOptions {
  principal: AtiPrincipal | null | undefined;
  /** If empty, any authenticated principal is allowed. */
  requiredRoles?: FoundationRole[];
}

/**
 * Deny-by-default authorization evaluator (foundation roles only).
 */
export function authorize(options: AuthorizeOptions): true {
  const { principal, requiredRoles = [] } = options;
  if (!principal) {
    throw new AuthError('Unauthenticated', AuthErrorCodes.AUTH_UNAUTHORIZED);
  }
  if (requiredRoles.length === 0) {
    return true;
  }
  const hasAll = requiredRoles.every((role) => principal.roles.includes(role));
  if (!hasAll) {
    throw new AuthError('Forbidden', AuthErrorCodes.AUTH_FORBIDDEN, {
      requiredRoles,
      actualRoles: principal.roles,
    });
  }
  return true;
}

export function hasRole(principal: AtiPrincipal, role: FoundationRole): boolean {
  return principal.roles.includes(role);
}
