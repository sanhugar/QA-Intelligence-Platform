import type { AuthConfig } from './auth-config-schema';
import { AuthError, AuthErrorCodes } from './errors';
import type { AtiIdentityClaims, AtiPrincipal, FoundationRole, PrincipalKind } from './types';
import { FoundationRoles } from './types';

function mapFoundationRoles(
  claims: AtiIdentityClaims,
  claimRoleMap: Record<string, FoundationRole>,
): FoundationRole[] {
  const candidates = [...claims.roles, ...claims.groups];
  const roles = new Set<FoundationRole>();
  for (const candidate of candidates) {
    const mapped = claimRoleMap[candidate];
    if (mapped) {
      roles.add(mapped);
    }
  }
  return [...roles];
}

function resolveKind(roles: FoundationRole[]): PrincipalKind {
  if (roles.includes(FoundationRoles.SERVICE) && !roles.includes(FoundationRoles.AUTHENTICATED)) {
    return 'service';
  }
  if (roles.includes(FoundationRoles.SERVICE)) {
    return 'service';
  }
  return 'human';
}

/**
 * Build AtiPrincipal from normalized claims + static foundation map.
 * Service principals require explicit mapped `ati.service` evidence (Finding 2 remediation).
 * No automatic service role assignment or role coercion.
 */
export function createIdentityContext(
  claims: AtiIdentityClaims,
  config: Pick<AuthConfig, 'claimRoleMap' | 'expectedPrincipalKind'>,
): AtiPrincipal {
  let roles = mapFoundationRoles(claims, config.claimRoleMap);

  if (config.expectedPrincipalKind === 'service') {
    if (!roles.includes(FoundationRoles.SERVICE)) {
      throw new AuthError(
        'Service principal requires explicit ati.service evidence',
        AuthErrorCodes.AUTH_FORBIDDEN,
        { subject: claims.subject, roles },
      );
    }
    return {
      subject: claims.subject,
      kind: 'service',
      roles,
      claims,
    };
  }

  // Human / default API path: map miss → ati.authenticated (foundation scaffold only).
  if (roles.length === 0) {
    roles = [FoundationRoles.AUTHENTICATED];
  }

  return {
    subject: claims.subject,
    kind: resolveKind(roles),
    roles,
    claims,
  };
}
