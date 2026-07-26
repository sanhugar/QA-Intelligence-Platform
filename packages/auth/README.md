# @ati/auth

Framework-independent Authentication & Authorization foundation (WP-2.2).

## Public API

Import only from `@ati/auth` (exports via `src/index.ts`).

## Contents

- Token validation (OIDC JWT Bearer)
- Claims normalization + static foundation role mapping
- `IdentityProviderPort` / JWKS key resolution
- `IdentityContextFactory` / `AuthorizationEvaluator`
- Foundation roles: `ati.authenticated`, `ati.service`
- Auth configuration loading (`ATI_AUTH_*`)

## Rules

- No Nest/React/Express imports
- No Domain, tenant, user-admin, Spine, or Approval logic
- Nest guards/middleware stay in `apps/*`
