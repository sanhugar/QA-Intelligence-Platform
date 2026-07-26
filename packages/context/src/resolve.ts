import type { AtiExecutionContext } from './types';
import { ContextError, ContextErrorCodes } from './types';
import type { ContextConfig } from './context-config-schema';
import { tryValidateExecutionContext, validateExecutionContext } from './validate';

export interface PrincipalContextInput {
  subject: string;
}

export interface ResolveApiContextOptions {
  config: ContextConfig;
  /** Whether host authentication is enabled. */
  authEnabled: boolean;
  /** Present after successful AuthN on protected routes. */
  principal?: PrincipalContextInput | null;
  /**
   * Raw client header candidates — NEVER used as authoritative source (D2).
   * Accepted only to prove they are ignored in tests.
   */
  untrustedHeaderTenantId?: unknown;
  untrustedHeaderWorkspaceId?: unknown;
}

/**
 * Resolve API execution context.
 * Authoritative: subject map (claims/host-validated) or auth-disabled scaffold.
 * Raw headers are ignored.
 */
export function resolveApiContext(options: ResolveApiContextOptions): AtiExecutionContext | null {
  void options.untrustedHeaderTenantId;
  void options.untrustedHeaderWorkspaceId;

  const { config, authEnabled, principal } = options;
  if (!config.enabled) {
    return null;
  }

  if (!authEnabled) {
    if (!config.defaultTenantId) {
      return null;
    }
    return validateExecutionContext({
      tenantId: config.defaultTenantId,
      workspaceId: config.defaultWorkspaceId,
    });
  }

  if (principal?.subject) {
    const mapped = config.subjectTenantMap[principal.subject];
    if (mapped) {
      return validateExecutionContext(mapped);
    }
  }

  // No authoritative mapping — unset (caller may fail-closed on protected routes).
  return null;
}

export function requireContextOrThrow(
  ctx: AtiExecutionContext | null,
  enforce: boolean,
): AtiExecutionContext | null {
  if (!enforce) {
    return ctx;
  }
  if (!ctx) {
    throw new ContextError('Execution context required', ContextErrorCodes.MISSING);
  }
  return ctx;
}

export function contextsEqual(a: AtiExecutionContext, b: AtiExecutionContext): boolean {
  return a.tenantId === b.tenantId && (a.workspaceId ?? '') === (b.workspaceId ?? '');
}

/** Detect cross-tenant bleed: same holder must not switch tenants mid-flight. */
export function assertNoCrossTenantBleed(
  previous: AtiExecutionContext | null,
  next: AtiExecutionContext | null,
): void {
  if (!previous || !next) {
    return;
  }
  if (previous.tenantId !== next.tenantId) {
    throw new ContextError(
      'Cross-tenant context bleed detected',
      ContextErrorCodes.INVALID,
    );
  }
}

export { tryValidateExecutionContext };
