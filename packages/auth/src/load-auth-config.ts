import { EnvKeys } from '@ati/shared-constants';
import { trimToEmpty } from '@ati/shared-utils';
import {
  DEFAULT_AUTH_ALGORITHMS,
  DEFAULT_PUBLIC_ROUTES,
  authConfigSchema,
  type AuthConfig,
} from './auth-config-schema';
import { AuthError, AuthErrorCodes } from './errors';
import { FoundationRoles, type FoundationRole } from './types';

export interface LoadAuthConfigOptions {
  env?: NodeJS.ProcessEnv;
  /** Default principal kind hint for hosts (worker → service). */
  expectedPrincipalKind?: AuthConfig['expectedPrincipalKind'];
}

function parseBooleanFlag(raw: string | undefined, defaultValue: boolean): boolean {
  if (raw === undefined || raw.trim() === '') {
    return defaultValue;
  }
  const v = raw.trim().toLowerCase();
  if (v === 'true' || v === '1' || v === 'yes') {
    return true;
  }
  if (v === 'false' || v === '0' || v === 'no') {
    return false;
  }
  throw new AuthError(`Invalid boolean for auth flag: ${raw}`, AuthErrorCodes.AUTH_CONFIG_INVALID);
}

function parseCsv(raw: string | undefined, fallback: readonly string[]): string[] {
  if (raw === undefined || raw.trim() === '') {
    return [...fallback];
  }
  return raw
    .split(',')
    .map((p) => p.trim())
    .filter(Boolean);
}

/** Parse `claimValue=ati.authenticated,svc=ati.service` maps. */
function parseClaimRoleMap(raw: string | undefined): Record<string, FoundationRole> {
  if (raw === undefined || raw.trim() === '') {
    return {
      authenticated: FoundationRoles.AUTHENTICATED,
      service: FoundationRoles.SERVICE,
      'ati.authenticated': FoundationRoles.AUTHENTICATED,
      'ati.service': FoundationRoles.SERVICE,
    };
  }
  const out: Record<string, FoundationRole> = {};
  for (const part of raw.split(',')) {
    const trimmed = part.trim();
    if (!trimmed) {
      continue;
    }
    const eq = trimmed.indexOf('=');
    if (eq <= 0) {
      throw new AuthError(
        `Invalid claim role map entry: ${trimmed}`,
        AuthErrorCodes.AUTH_CONFIG_INVALID,
      );
    }
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (value !== FoundationRoles.AUTHENTICATED && value !== FoundationRoles.SERVICE) {
      throw new AuthError(
        `Claim map may only assign foundation roles, got: ${value}`,
        AuthErrorCodes.AUTH_CONFIG_INVALID,
      );
    }
    out[key] = value;
  }
  return out;
}

/**
 * Load auth configuration from environment.
 * When enabled=false, issuer/audience/jwks are not required.
 * Production default for enabled is true when unset and NODE_ENV=production.
 */
export function loadAuthConfig(options: LoadAuthConfigOptions = {}): AuthConfig {
  const env = options.env ?? process.env;
  const nodeEnv = trimToEmpty(env[EnvKeys.NODE_ENV] ?? env.NODE_ENV ?? 'development').toLowerCase();
  const productionDefault = nodeEnv === 'production';
  const enabled = parseBooleanFlag(env[EnvKeys.AUTH_ENABLED], productionDefault);

  const algorithms = parseCsv(env[EnvKeys.AUTH_ALGORITHMS], DEFAULT_AUTH_ALGORITHMS);
  const publicRoutes = parseCsv(env[EnvKeys.AUTH_PUBLIC_ROUTES], DEFAULT_PUBLIC_ROUTES);
  // Ensure mandatory health routes always present
  for (const required of DEFAULT_PUBLIC_ROUTES) {
    if (!publicRoutes.includes(required)) {
      publicRoutes.push(required);
    }
  }

  const clockRaw = trimToEmpty(env[EnvKeys.AUTH_CLOCK_SKEW_SECONDS] ?? '60');
  const clockSkewSeconds = Number(clockRaw);
  if (!Number.isFinite(clockSkewSeconds) || clockSkewSeconds < 0) {
    throw new AuthError('ATI_AUTH_CLOCK_SKEW_SECONDS must be >= 0', AuthErrorCodes.AUTH_CONFIG_INVALID);
  }

  const issuer = trimToEmpty(env[EnvKeys.AUTH_ISSUER]) || undefined;
  const audience = trimToEmpty(env[EnvKeys.AUTH_AUDIENCE]) || undefined;
  const jwksUri = trimToEmpty(env[EnvKeys.AUTH_JWKS_URI]) || undefined;
  const claimRoleMap = parseClaimRoleMap(env[EnvKeys.AUTH_CLAIM_ROLE_MAP]);

  if (enabled) {
    if (!issuer || !audience || !jwksUri) {
      throw new AuthError(
        'ATI_AUTH_ISSUER, ATI_AUTH_AUDIENCE, and ATI_AUTH_JWKS_URI are required when ATI_AUTH_ENABLED=true',
        AuthErrorCodes.AUTH_CONFIG_INVALID,
      );
    }
  }

  const candidate = {
    enabled,
    issuer,
    audience,
    jwksUri,
    algorithms,
    publicRoutes,
    claimRoleMap,
    clockSkewSeconds,
    expectedPrincipalKind: options.expectedPrincipalKind,
  };

  const parsed = authConfigSchema.safeParse(candidate);
  if (!parsed.success) {
    throw new AuthError('Authentication configuration invalid', AuthErrorCodes.AUTH_CONFIG_INVALID, {
      issues: parsed.error.issues,
    });
  }
  return parsed.data;
}

/**
 * Normalize a request path for allow-list comparison:
 * strip query string, ensure leading slash, collapse duplicate slashes,
 * drop trailing slash (except root). Exact equality only — no suffix matching.
 */
export function normalizeRequestPath(pathname: string): string {
  let path = (pathname.split('?')[0] ?? pathname).trim();
  if (!path.startsWith('/')) {
    path = `/${path}`;
  }
  path = path.replace(/\/+/g, '/');
  if (path.length > 1 && path.endsWith('/')) {
    path = path.slice(0, -1);
  }
  return path;
}

/** Exact normalized path membership in the public allow-list (D5 / Finding 1 remediation). */
export function isPublicRoute(pathname: string, publicRoutes: readonly string[]): boolean {
  const path = normalizeRequestPath(pathname);
  return publicRoutes.some((route) => normalizeRequestPath(route) === path);
}
