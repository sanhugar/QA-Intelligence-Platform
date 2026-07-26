import type { ClassificationResult } from '@ati/classification';
import type { IntakeRecord } from '@ati/intake';
import type { FeatureVersionInput } from './model';

export interface EngineSummary {
  sectionCount?: number;
  sectionKinds?: string[];
  requirementId?: string;
}

/**
 * Map terminal IntakeRecord + ClassificationResult (+ optional engine summary)
 * to allow-listed FeatureVersionInput. Never copies payload body (D3).
 * Never recreates classification axes (D4).
 */
export function toFeatureVersionInput(
  record: IntakeRecord,
  classification: ClassificationResult,
  engineSummary?: EngineSummary,
): FeatureVersionInput {
  const source = record.request.source;
  const metadata = record.request.metadata ?? {};
  return {
    intakeId: record.intakeId,
    correlationId: record.audit.correlationId || record.request.correlationId || record.intakeId,
    tenantId: record.request.tenantId ?? record.audit.tenantId,
    workspaceId: record.request.workspaceId ?? record.audit.workspaceId,
    intakeState: record.state,
    sourceIdentity: source.sourceIdentity || undefined,
    sourceVersion: source.sourceVersion || undefined,
    checksum: source.checksum || undefined,
    declaredFormat: source.declaredFormat || undefined,
    channel: metadata.channel,
    featureNameHint: metadata.notes,
    designation: classification.designation,
    knowledgeRole: classification.knowledgeRole,
    classificationEvaluatedAt: classification.evaluatedAt,
    sectionCount: engineSummary?.sectionCount,
    sectionKinds: engineSummary?.sectionKinds,
    requirementId: engineSummary?.requirementId,
  };
}

export function buildClassificationResultRef(classification: ClassificationResult): string {
  return `${classification.intakeId}@${classification.evaluatedAt}`;
}
