import { ContextError, ContextErrorCodes, type AtiExecutionContext } from './types';

const MAX_ID_LENGTH = 128;
const SAFE_ID = /^[A-Za-z0-9._:-]+$/;

export function normalizeContextId(raw: unknown): string | null {
  if (typeof raw !== 'string') {
    return null;
  }
  const value = raw.trim();
  if (!value || value.length > MAX_ID_LENGTH) {
    return null;
  }
  if (!SAFE_ID.test(value)) {
    return null;
  }
  return value;
}

/**
 * Validate context combinations (D3).
 * Rejects workspace without tenant.
 */
export function validateExecutionContext(
  partial: { tenantId?: unknown; workspaceId?: unknown },
): AtiExecutionContext {
  const tenantId = normalizeContextId(partial.tenantId);
  const workspaceId = normalizeContextId(partial.workspaceId);

  if (!tenantId && workspaceId) {
    throw new ContextError(
      'workspaceId requires tenantId',
      ContextErrorCodes.WORKSPACE_WITHOUT_TENANT,
    );
  }
  if (!tenantId) {
    throw new ContextError('tenantId is required', ContextErrorCodes.MISSING);
  }
  return workspaceId ? { tenantId, workspaceId } : { tenantId };
}

/** Try validate; returns null if empty; throws on invalid combo. */
export function tryValidateExecutionContext(
  partial: { tenantId?: unknown; workspaceId?: unknown },
): AtiExecutionContext | null {
  const tenantId = normalizeContextId(partial.tenantId);
  const workspaceId = normalizeContextId(partial.workspaceId);
  if (!tenantId && !workspaceId) {
    return null;
  }
  return validateExecutionContext({ tenantId, workspaceId });
}
