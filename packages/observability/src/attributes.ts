import type { MetricLabels } from './types';

/** Allow-listed metric/trace attribute keys (WP-2.3). */
export const ALLOWED_ATTRIBUTE_KEYS = new Set([
  'service',
  'host',
  'correlationId',
  'route',
  'outcome',
  'errorCode',
  'jobName',
  /** Opaque scope ids only (WP-2.4 D6) — never PII. */
  'tenantId',
  'workspaceId',
]);

const FORBIDDEN_KEY = /(authorization|token|password|secret|api[_-]?key|email|subject)/i;

/**
 * Keep only allow-listed, non-forbidden labels.
 * Drops Authorization/token-shaped keys.
 */
export function filterMetricLabels(labels: MetricLabels): MetricLabels {
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(labels)) {
    if (!ALLOWED_ATTRIBUTE_KEYS.has(key)) {
      continue;
    }
    if (FORBIDDEN_KEY.test(key)) {
      continue;
    }
    if (typeof value !== 'string' || value.length === 0) {
      continue;
    }
    out[key] = value.slice(0, 256);
  }
  return out;
}
