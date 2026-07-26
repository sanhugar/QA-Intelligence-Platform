import type { CorrelationId } from '@ati/shared-types';
import { mintCorrelationId, normalizeCorrelationId } from './correlation';

/** Trusted in-process / job-envelope correlation field name. */
export const TRUSTED_JOB_CORRELATION_FIELD = 'correlationId';

export interface TrustedJobEnvelope {
  [TRUSTED_JOB_CORRELATION_FIELD]?: unknown;
  /** Explicit trust marker required for accepting inbound correlation. */
  trusted?: boolean;
}

/**
 * Resolve worker/job correlation from a trusted envelope or mint.
 * Untrusted envelopes never take client-supplied correlation as authoritative.
 */
export function resolveTrustedJobCorrelation(envelope: TrustedJobEnvelope): CorrelationId {
  if (envelope.trusted === true) {
    const fromEnvelope = normalizeCorrelationId(envelope[TRUSTED_JOB_CORRELATION_FIELD]);
    if (fromEnvelope) {
      return fromEnvelope;
    }
  }
  return mintCorrelationId();
}
