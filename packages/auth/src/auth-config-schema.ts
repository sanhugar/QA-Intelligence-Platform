import { z } from 'zod';
import { FoundationRoles, type FoundationRole, type PrincipalKind } from './types';

export const DEFAULT_AUTH_ALGORITHMS = ['RS256'] as const;

export const DEFAULT_PUBLIC_ROUTES = ['/health/live', '/health/ready'] as const;

export const authConfigSchema = z.object({
  enabled: z.boolean(),
  issuer: z.string().trim().min(1).optional(),
  audience: z.string().trim().min(1).optional(),
  jwksUri: z.string().url().optional(),
  algorithms: z.array(z.string().trim().min(1)).min(1),
  publicRoutes: z.array(z.string().trim().min(1)).min(1),
  claimRoleMap: z.record(z.string(), z.enum([FoundationRoles.AUTHENTICATED, FoundationRoles.SERVICE])),
  clockSkewSeconds: z.number().int().nonnegative(),
  expectedPrincipalKind: z.enum(['human', 'service']).optional(),
});

export type AuthConfig = z.infer<typeof authConfigSchema> & {
  claimRoleMap: Record<string, FoundationRole>;
  expectedPrincipalKind?: PrincipalKind;
};
