import type { AtiExecutionContext } from './types';
import { ContextError, ContextErrorCodes } from './types';
import { validateExecutionContext } from './validate';

export const TRUSTED_CONTEXT_FIELD = 'executionContext';

export interface TrustedContextEnvelope {
  trusted?: boolean;
  [TRUSTED_CONTEXT_FIELD]?: {
    tenantId?: unknown;
    workspaceId?: unknown;
  };
}

/**
 * Resolve worker context from trusted envelope only (D4).
 * Client-supplied context must not be passed here as authoritative.
 */
export function resolveTrustedContext(
  envelope: TrustedContextEnvelope,
): AtiExecutionContext {
  if (envelope.trusted !== true) {
    throw new ContextError(
      'Worker context requires trusted envelope',
      ContextErrorCodes.UNTRUSTED,
    );
  }
  const raw = envelope[TRUSTED_CONTEXT_FIELD];
  if (!raw) {
    throw new ContextError('Trusted envelope missing executionContext', ContextErrorCodes.MISSING);
  }
  return validateExecutionContext(raw);
}
