export {
  FoundationRoles,
  type FoundationRole,
  type PrincipalKind,
  type AtiIdentityClaims,
  type AtiPrincipal,
} from './types';
export { AuthError, AuthErrorCodes, type AuthErrorCode } from './errors';
export {
  DEFAULT_AUTH_ALGORITHMS,
  DEFAULT_PUBLIC_ROUTES,
  authConfigSchema,
  type AuthConfig,
} from './auth-config-schema';
export {
  loadAuthConfig,
  isPublicRoute,
  normalizeRequestPath,
  type LoadAuthConfigOptions,
} from './load-auth-config';
export {
  createRemoteIdentityProvider,
  createStaticIdentityProvider,
  type IdentityProviderPort,
} from './identity-provider';
export { validateAccessToken, type ValidateAccessTokenOptions } from './token-validator';
export { normalizeClaims } from './claims-normalizer';
export { createIdentityContext } from './identity-context-factory';
export { authorize, hasRole, type AuthorizeOptions } from './authorization-evaluator';
export {
  authenticateAccessToken,
  authenticateServicePrincipal,
  type AuthenticateAccessTokenOptions,
} from './authenticate';
export { redactAuthorizationHeader, redactJwt } from './redact';
