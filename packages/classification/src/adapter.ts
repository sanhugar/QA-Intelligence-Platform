import type { IntakeRecord } from '@ati/intake';
import type { Requirement } from '@ati/requirement-engine';
import type { ClassificationInput } from './model';

export interface EngineSummary {
  sectionCount?: number;
  sectionKinds?: string[];
}

/**
 * Structural summary from a Requirement — counts/kinds only (D7).
 * Never copies fragment text or payload body.
 */
export function toEngineSummary(requirement: Requirement): EngineSummary {
  const kinds = requirement.sections
    .map((s) => s.kind)
    .filter((k): k is string => Boolean(k));
  return {
    sectionCount: requirement.sections.length,
    sectionKinds: kinds.length > 0 ? [...new Set(kinds)] : undefined,
  };
}

/**
 * Map terminal IntakeRecord (+ optional engine summary) to allow-listed ClassificationInput.
 * Never copies payload body (D7).
 */
export function toClassificationInput(
  record: IntakeRecord,
  engineSummary?: EngineSummary,
): ClassificationInput {
  const source = record.request.source;
  const metadata = record.request.metadata ?? {};
  return {
    intakeId: record.intakeId,
    correlationId: record.audit.correlationId || record.request.correlationId || record.intakeId,
    tenantId: record.request.tenantId ?? record.audit.tenantId,
    workspaceId: record.request.workspaceId ?? record.audit.workspaceId,
    intakeState: record.state,
    declaredFormat: source.declaredFormat || undefined,
    hasSourceIdentity: Boolean(source.sourceIdentity),
    hasSourceVersion: Boolean(source.sourceVersion),
    hasChecksum: Boolean(source.checksum),
    channel: metadata.channel,
    designationHint: metadata.notes,
    sectionCount: engineSummary?.sectionCount,
    sectionKinds: engineSummary?.sectionKinds,
  };
}
