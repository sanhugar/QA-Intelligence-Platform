import type { CorrelationId, HostKind, ReasoningRunId } from './index';

describe('@ati/shared-types', () => {
  it('exports host kind literals usable as values', () => {
    const host: HostKind = 'api';
    const correlationId: CorrelationId = 'c-1';
    const reasoningRunId: ReasoningRunId = 'r-1';
    expect(host).toBe('api');
    expect(correlationId).toBe('c-1');
    expect(reasoningRunId).toBe('r-1');
  });
});
