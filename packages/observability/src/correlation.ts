import { randomUUID } from 'node:crypto';
import type { CorrelationId } from '@ati/shared-types';

const MAX_CORRELATION_LENGTH = 128;
const SAFE_CORRELATION = /^[A-Za-z0-9._:-]+$/;

/** Mint a new opaque correlation identifier. */
export function mintCorrelationId(): CorrelationId {
  return randomUUID();
}

/**
 * Validate an inbound correlation candidate.
 * Returns normalized id or null when missing/unsafe.
 */
export function normalizeCorrelationId(raw: unknown): CorrelationId | null {
  if (typeof raw !== 'string') {
    return null;
  }
  const value = raw.trim();
  if (!value || value.length > MAX_CORRELATION_LENGTH) {
    return null;
  }
  if (!SAFE_CORRELATION.test(value)) {
    return null;
  }
  return value;
}

/** Resolve API request correlation: accept well-formed inbound or mint. */
export function resolveApiCorrelationId(inbound: unknown): CorrelationId {
  return normalizeCorrelationId(inbound) ?? mintCorrelationId();
}
