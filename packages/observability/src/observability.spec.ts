import {
  AUTH_OUTCOME_METRIC,
  filterMetricLabels,
  InMemoryMetrics,
  InMemoryTracer,
  loadObservabilityConfig,
  mintCorrelationId,
  normalizeCorrelationId,
  resolveApiCorrelationId,
  resolveTrustedJobCorrelation,
} from './index';

describe('@ati/observability', () => {
  it('mints and validates correlation ids', () => {
    const id = mintCorrelationId();
    expect(normalizeCorrelationId(id)).toBe(id);
    expect(normalizeCorrelationId('bad id with spaces')).toBeNull();
    expect(resolveApiCorrelationId('req-1')).toBe('req-1');
    expect(resolveApiCorrelationId('')).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );
  });

  it('accepts trusted job envelope correlation only', () => {
    expect(
      resolveTrustedJobCorrelation({
        trusted: true,
        correlationId: 'job-corr-1',
      }),
    ).toBe('job-corr-1');
    const minted = resolveTrustedJobCorrelation({
      trusted: false,
      correlationId: 'spoofed',
    });
    expect(minted).not.toBe('spoofed');
  });

  it('filters metric labels to allow-list', () => {
    expect(
      filterMetricLabels({
        host: 'api',
        outcome: 'allow',
        authorization: 'secret',
        subject: 'user-1',
        unknown: 'x',
        tenantId: 'tenant-a',
        workspaceId: 'ws-1',
      }),
    ).toEqual({
      host: 'api',
      outcome: 'allow',
      tenantId: 'tenant-a',
      workspaceId: 'ws-1',
    });
  });

  it('records in-memory metrics and traces', () => {
    const metrics = new InMemoryMetrics();
    const tracer = new InMemoryTracer();
    metrics.increment(AUTH_OUTCOME_METRIC, { host: 'api', outcome: 'allow' });
    const span = tracer.startSpan('http.request', { host: 'api', route: '/health/live' });
    span.setAttribute('correlationId', 'c-1');
    span.end('ok');
    expect(metrics.sum(AUTH_OUTCOME_METRIC, { outcome: 'allow' })).toBe(1);
    expect(tracer.spans[0]?.attributes.correlationId).toBe('c-1');
  });

  it('loads obs config without requiring OTLP', () => {
    const config = loadObservabilityConfig({
      host: 'api',
      env: {
        ATI_OBS_ENABLED: 'true',
        ATI_OTEL_ENABLED: 'false',
      },
    });
    expect(config.enabled).toBe(true);
    expect(config.otelEnabled).toBe(false);
    expect(config.serviceName).toBe('ati-api');
  });
});
