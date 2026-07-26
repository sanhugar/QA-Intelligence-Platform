import { z } from 'zod';

export const contextConfigSchema = z.object({
  enabled: z.boolean(),
  /** When true, protected routes require a resolved tenant (auth-enabled paths). */
  enforceOnProtected: z.boolean(),
  defaultTenantId: z.string().optional(),
  defaultWorkspaceId: z.string().optional(),
  /**
   * Host-validated subject → tenant map (claim subject key).
   * Format: `sub1=tenant-a,sub2=tenant-b:workspace-1`
   */
  subjectTenantMap: z.record(
    z.object({
      tenantId: z.string().min(1),
      workspaceId: z.string().min(1).optional(),
    }),
  ),
});

export type ContextConfig = z.infer<typeof contextConfigSchema>;
