import type { CorrelationId } from '@ati/shared-types';

/** Diagnostic correlation context — never used for AuthZ. */
export interface CorrelationContext {
  correlationId: CorrelationId;
}

export type MetricLabels = Readonly<Record<string, string>>;

export type AuthOutcome = 'allow' | 'deny' | 'error';

export const AUTH_OUTCOME_METRIC = 'ati.auth.outcome';
export const REQUEST_COUNT_METRIC = 'ati.http.requests';
export const JOB_COUNT_METRIC = 'ati.job.executions';
export const ERROR_COUNT_METRIC = 'ati.errors';
