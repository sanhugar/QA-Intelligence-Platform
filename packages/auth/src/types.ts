/** Foundation platform roles only (WP-2.2). No Domain/business roles. */
export const FoundationRoles = {
  AUTHENTICATED: 'ati.authenticated',
  SERVICE: 'ati.service',
} as const;

export type FoundationRole = (typeof FoundationRoles)[keyof typeof FoundationRoles];

export type PrincipalKind = 'human' | 'service';

/** Normalized IdP-agnostic identity claims. */
export interface AtiIdentityClaims {
  subject: string;
  issuer: string;
  audience: string | string[];
  expiresAt: number;
  issuedAt?: number;
  email?: string;
  preferredUsername?: string;
  /** Raw IdP role/group claim values (pre-mapping). */
  roles: string[];
  groups: string[];
  tokenId?: string;
}

/** Request/job identity principal. */
export interface AtiPrincipal {
  subject: string;
  kind: PrincipalKind;
  roles: FoundationRole[];
  claims: AtiIdentityClaims;
}
