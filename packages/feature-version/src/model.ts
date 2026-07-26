import { z } from 'zod';
import {
  FEATURE_VERSION_SCHEMA_VERSION,
  FEATURE_VERSION_STATUS_SET,
  type FeatureVersionStatus,
} from './types';

/**
 * Allow-listed Feature Version input (D3) — never includes raw payload body.
 */
export const featureVersionInputSchema = z.object({
  intakeId: z.string().min(1),
  correlationId: z.string().min(1),
  tenantId: z.string().optional(),
  workspaceId: z.string().optional(),
  intakeState: z.string().min(1),
  sourceIdentity: z.string().optional(),
  sourceVersion: z.string().optional(),
  checksum: z.string().optional(),
  declaredFormat: z.string().optional(),
  channel: z.string().optional(),
  /** Optional name/hint tokens from intake metadata notes — not body text. */
  featureNameHint: z.string().optional(),
  designation: z.string().optional(),
  knowledgeRole: z.string().optional(),
  classificationEvaluatedAt: z.string().optional(),
  /** Explicit prior version id for emit-only predecessor link. */
  predecessorVersionHint: z.string().optional(),
  parentFeatureIdHint: z.string().optional(),
  sectionCount: z.number().int().nonnegative().optional(),
  sectionKinds: z.array(z.string()).optional(),
  requirementId: z.string().optional(),
});

export type FeatureVersionInput = z.infer<typeof featureVersionInputSchema>;

export const featureVersionResultSchema = z.object({
  schemaVersion: z.literal(FEATURE_VERSION_SCHEMA_VERSION),
  featureId: z.string().min(1),
  versionIdentifier: z.string().min(1),
  lineageIdentifier: z.string().min(1),
  status: z.string().refine((v) => FEATURE_VERSION_STATUS_SET.has(v)),
  confidence: z.number().min(0).max(1),
  derivationRuleIds: z.array(z.string()),
  intakeId: z.string().min(1),
  correlationId: z.string().min(1),
  evaluatedAt: z.string().min(1),
  featureName: z.string().optional(),
  parentFeatureId: z.string().optional(),
  predecessorVersion: z.string().optional(),
  successorVersion: z.string().optional(),
  tenantId: z.string().optional(),
  workspaceId: z.string().optional(),
  classificationResultRef: z.string().optional(),
  knowledgeRole: z.string().optional(),
});

export type FeatureVersionResult = z.infer<typeof featureVersionResultSchema> & {
  status: FeatureVersionStatus;
};

export function validateFeatureVersionResult(input: unknown): FeatureVersionResult {
  return featureVersionResultSchema.parse(input) as FeatureVersionResult;
}
