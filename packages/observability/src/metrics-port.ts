import type { MetricLabels } from './types';

export type { MetricLabels };

export interface MetricsPort {
  increment(name: string, labels?: MetricLabels, value?: number): void;
  record(name: string, value: number, labels?: MetricLabels): void;
}

export interface TraceSpan {
  setAttribute(key: string, value: string | number | boolean): void;
  end(outcome?: 'ok' | 'error'): void;
}

export interface TracePort {
  startSpan(name: string, attributes?: MetricLabels): TraceSpan;
}
