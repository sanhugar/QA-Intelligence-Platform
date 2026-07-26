import { z } from 'zod';
import {
  CLASSIFICATION_CATEGORY_SET,
  CLASSIFICATION_SCHEMA_VERSION,
  DESIGNATION_KEY_SET,
  KNOWLEDGE_ROLE_SET,
  type ClassificationCategory,
  type DesignationKey,
  type KnowledgeRole,
} from './types';

/**
 * Allow-listed classification input (D7) — never includes raw payload body.
 */
export const classificationInputSchema = z.object({
  intakeId: z.string().min(1),
  correlationId: z.string().min(1),
  tenantId: z.string().optional(),
  workspaceId: z.string().optional(),
  intakeState: z.string().min(1),
  declaredFormat: z.string().optional(),
  hasSourceIdentity: z.boolean(),
  hasSourceVersion: z.boolean(),
  hasChecksum: z.boolean(),
  channel: z.string().optional(),
  /** Optional designation hint from intake metadata channel/notes tokens — not body text. */
  designationHint: z.string().optional(),
  /** Optional structural summary when intake accepted — counts/kinds only. */
  sectionCount: z.number().int().nonnegative().optional(),
  sectionKinds: z.array(z.string()).optional(),
});

export type ClassificationInput = z.infer<typeof classificationInputSchema>;

export const classificationResultSchema = z.object({
  schemaVersion: z.literal(CLASSIFICATION_SCHEMA_VERSION),
  classification: z.string().refine((v) => CLASSIFICATION_CATEGORY_SET.has(v)),
  designation: z.string().refine((v) => DESIGNATION_KEY_SET.has(v)),
  knowledgeRole: z.string().refine((v) => KNOWLEDGE_ROLE_SET.has(v)),
  classificationConfidence: z.number().min(0).max(1),
  designationConfidence: z.number().min(0).max(1),
  knowledgeRoleConfidence: z.number().min(0).max(1),
  classificationRuleIds: z.array(z.string()),
  designationRuleIds: z.array(z.string()),
  knowledgeRoleRuleIds: z.array(z.string()),
  intakeId: z.string().min(1),
  correlationId: z.string().min(1),
  tenantId: z.string().optional(),
  workspaceId: z.string().optional(),
  evaluatedAt: z.string().min(1),
});

export type ClassificationResult = z.infer<typeof classificationResultSchema> & {
  classification: ClassificationCategory;
  designation: DesignationKey;
  knowledgeRole: KnowledgeRole;
};

export function validateClassificationResult(input: unknown): ClassificationResult {
  return classificationResultSchema.parse(input) as ClassificationResult;
}
