import { z } from 'zod';
import { INTAKE_SUPPORTED_FORMAT_SET } from './types';

export const intakeSourceSchema = z.object({
  sourceIdentity: z.string().min(1),
  sourceVersion: z.string().min(1),
  checksum: z.string().min(1),
  declaredFormat: z.string().min(1),
  /** Optional algorithm label; when present must be allow-listed. */
  checksumAlgorithm: z.enum(['sha256', 'sha1', 'md5']).optional(),
  locator: z.string().optional(),
});

export type IntakeSource = z.infer<typeof intakeSourceSchema>;

export const intakeMetadataSchema = z.object({
  actorSubject: z.string().optional(),
  channel: z.string().optional(),
  notes: z.string().optional(),
});

export type IntakeMetadata = z.infer<typeof intakeMetadataSchema>;

/**
 * Intake request — payload is an opaque in-memory handle for the engine.
 * Intake MUST NOT inspect document contents (D5).
 */
export const intakeRequestSchema = z.object({
  source: intakeSourceSchema,
  metadata: intakeMetadataSchema.optional().default({}),
  /** Opaque payload string passed through to the engine — not parsed by intake. */
  payload: z.string(),
  correlationId: z.string().min(1).optional(),
  tenantId: z.string().min(1).optional(),
  workspaceId: z.string().optional(),
});

export type IntakeRequest = z.infer<typeof intakeRequestSchema>;

export interface IntakeAuditMetadata {
  actorSubject?: string;
  receivedAt: string;
  terminalAt?: string;
  sourceIdentity: string;
  sourceVersion: string;
  checksum: string;
  declaredFormat: string;
  correlationId: string;
  tenantId?: string;
  workspaceId?: string;
}

export interface IntakeRecord {
  intakeId: string;
  state: string;
  idempotencyKey: string;
  request: IntakeRequest;
  audit: IntakeAuditMetadata;
  failureReason?: string;
  failureMessage?: string;
  engineStatus?: string;
  engineCode?: string;
  engineMessage?: string;
  requirementId?: string;
}

/** D8 idempotency tuple. */
export function buildIdempotencyKey(input: {
  tenantId?: string;
  workspaceId?: string;
  sourceIdentity: string;
  sourceVersion: string;
  checksum: string;
}): string {
  return [
    input.tenantId ?? '',
    input.workspaceId ?? '',
    input.sourceIdentity,
    input.sourceVersion,
    input.checksum,
  ].join('|');
}

export function isCatalogFormat(format: string): boolean {
  return INTAKE_SUPPORTED_FORMAT_SET.has(format);
}
