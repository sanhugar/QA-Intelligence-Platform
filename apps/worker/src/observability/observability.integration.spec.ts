import { HttpHeaders } from '@ati/shared-constants';
import {
  AUTH_OUTCOME_METRIC,
  InMemoryMetrics,
  InMemoryTracer,
  JOB_COUNT_METRIC,
} from '@ati/observability';
import { WorkerCorrelationMiddleware } from './correlation.middleware';
import { WorkerObservabilityRuntime } from './observability-runtime';
import { ATI_CORRELATION_REQUEST_KEY } from './obs-request';
import { platformReadiness } from '../spine/registration/platform-readiness';

describe('Worker observability integration', () => {
  it('mints HTTP correlation and ignores client spoofing', () => {
    const metrics = new InMemoryMetrics();
    const tracer = new InMemoryTracer();
    const runtime = WorkerObservabilityRuntime.create({
      env: { ATI_OBS_ENABLED: 'true' },
      metrics,
      tracer,
    });
    const middleware = new WorkerCorrelationMiddleware(runtime);
    const headers: Record<string, string> = {};
    const req = {
      headers: { [HttpHeaders.CORRELATION_ID]: 'spoofed-client' },
      originalUrl: '/health/live',
      path: '/health/live',
    };
    const res = {
      setHeader: (k: string, v: string) => {
        headers[k] = v;
      },
      on: (_event: string, cb: () => void) => {
        cb();
      },
      statusCode: 200,
    };
    middleware.use(req as never, res as never, () => undefined);
    const minted = req[ATI_CORRELATION_REQUEST_KEY as keyof typeof req] as string;
    expect(minted).toBeTruthy();
    expect(minted).not.toBe('spoofed-client');
    expect(headers[HttpHeaders.CORRELATION_ID]).toBe(minted);
    expect(tracer.spans).toHaveLength(1);
  });

  it('proves trusted job envelope harness (not a job bus)', () => {
    const metrics = new InMemoryMetrics();
    const tracer = new InMemoryTracer();
    const runtime = WorkerObservabilityRuntime.create({
      env: { ATI_OBS_ENABLED: 'true' },
      metrics,
      tracer,
    });
    const seen: string[] = [];
    const correlationId = runtime.runTrustedJobHarness(
      'demo-job',
      { trusted: true, correlationId: 'job-corr-9' },
      (id) => {
        seen.push(id);
      },
    );
    expect(correlationId).toBe('job-corr-9');
    expect(seen).toEqual(['job-corr-9']);
    expect(metrics.sum(JOB_COUNT_METRIC)).toBe(1);
    expect(tracer.spans.some((s) => s.name === 'job.execute')).toBe(true);
  });

  it('records auth deny metrics without identity', () => {
    const metrics = new InMemoryMetrics();
    const runtime = WorkerObservabilityRuntime.create({
      env: { ATI_OBS_ENABLED: 'true' },
      metrics,
    });
    runtime.recordAuthOutcome('deny', '/platform/worker/auth/probe');
    expect(metrics.sum(AUTH_OUTCOME_METRIC, { outcome: 'deny' })).toBe(1);
  });

  it('READY remains independently controllable when otel enabled', () => {
    platformReadiness.setReady(false);
    WorkerObservabilityRuntime.create({
      env: {
        ATI_OBS_ENABLED: 'true',
        ATI_OTEL_ENABLED: 'true',
        ATI_OTEL_EXPORTER_OTLP_ENDPOINT: 'http://127.0.0.1:4318',
      },
    });
    platformReadiness.setReady(true);
    expect(platformReadiness.isReady()).toBe(true);
  });
});
