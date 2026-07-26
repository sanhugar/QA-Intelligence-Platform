import type { MetricLabels, MetricsPort } from './metrics-port';
import { filterMetricLabels } from './attributes';

export interface MetricSample {
  name: string;
  value: number;
  labels: MetricLabels;
}

/** In-memory metrics for tests and degrade path. */
export class InMemoryMetrics implements MetricsPort {
  readonly samples: MetricSample[] = [];

  increment(name: string, labels: MetricLabels = {}, value = 1): void {
    this.samples.push({ name, value, labels: filterMetricLabels(labels) });
  }

  record(name: string, value: number, labels: MetricLabels = {}): void {
    this.samples.push({ name, value, labels: filterMetricLabels(labels) });
  }

  sum(name: string, labels?: MetricLabels): number {
    return this.samples
      .filter((s) => s.name === name && (!labels || labelsMatch(s.labels, labels)))
      .reduce((acc, s) => acc + s.value, 0);
  }
}

function labelsMatch(actual: MetricLabels, expected: MetricLabels): boolean {
  return Object.entries(expected).every(([k, v]) => actual[k] === v);
}
