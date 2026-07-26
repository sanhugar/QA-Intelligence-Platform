import type { MetricLabels } from './types';
import type { TracePort, TraceSpan } from './metrics-port';
import { filterMetricLabels } from './attributes';

export interface TraceSample {
  name: string;
  attributes: MetricLabels;
  outcome: 'ok' | 'error' | 'open';
}

class InMemorySpan implements TraceSpan {
  outcome: 'ok' | 'error' | 'open' = 'open';
  readonly attributes: Record<string, string> = {};

  constructor(
    readonly name: string,
    initial: MetricLabels,
    private readonly onEnd: (span: InMemorySpan) => void,
  ) {
    Object.assign(this.attributes, filterMetricLabels(initial));
  }

  setAttribute(key: string, value: string | number | boolean): void {
    const filtered = filterMetricLabels({ [key]: String(value) });
    Object.assign(this.attributes, filtered);
  }

  end(outcome: 'ok' | 'error' = 'ok'): void {
    this.outcome = outcome;
    this.onEnd(this);
  }
}

/** In-memory tracer for tests and degrade path. */
export class InMemoryTracer implements TracePort {
  readonly spans: TraceSample[] = [];

  startSpan(name: string, attributes: MetricLabels = {}): TraceSpan {
    const span = new InMemorySpan(name, attributes, (finished) => {
      this.spans.push({
        name: finished.name,
        attributes: finished.attributes,
        outcome: finished.outcome,
      });
    });
    return span;
  }
}
