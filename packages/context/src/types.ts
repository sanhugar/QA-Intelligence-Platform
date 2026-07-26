/** Opaque Organization (tenant) boundary identifier. */
export type TenantId = string;

/** Opaque Workspace collaboration-scope identifier. */
export type WorkspaceId = string;

/**
 * Execution scope carrier — not AuthZ, not Domain SoT.
 * tenantId ≡ Organization; workspaceId ≡ Workspace.
 */
export interface AtiExecutionContext {
  tenantId: TenantId;
  workspaceId?: WorkspaceId;
}

export class ContextError extends Error {
  constructor(
    message: string,
    readonly code: string,
  ) {
    super(message);
    this.name = 'ContextError';
  }
}

export const ContextErrorCodes = {
  INVALID: 'CONTEXT_INVALID',
  MISSING: 'CONTEXT_MISSING',
  WORKSPACE_WITHOUT_TENANT: 'CONTEXT_WORKSPACE_WITHOUT_TENANT',
  UNTRUSTED: 'CONTEXT_UNTRUSTED',
} as const;
