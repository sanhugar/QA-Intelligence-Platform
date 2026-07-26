import {
  AUTH_OUTCOME_METRIC,
  ERROR_COUNT_METRIC,
  InMemoryMetrics,
  InMemoryTracer,
  loadObservabilityConfig,
  REQUEST_COUNT_METRIC,
  type AuthOutcome,
  type MetricsPort,
  type ObservabilityConfig,
  type TracePort,
  type TraceSpan,
} from '@ati/observability';

export interface ObservabilityRuntimeOptions {
  host: 'api' | 'worker';
  env?: NodeJS.ProcessEnv;
  metrics?: MetricsPort;
  tracer?: TracePort;
}

/**
 * Host observability runtime — in-memory ports always available for tests/ops.
 * OTel SDK init is best-effort and must never throw to callers (READY degrade).
 */
export class ObservabilityRuntime {
  readonly config: ObservabilityConfig;
  readonly metrics: MetricsPort;
  readonly tracer: TracePort;
  readonly host: 'api' | 'worker';
  private otelInitAttempted = false;
  private otelActive = false;

  private constructor(options: ObservabilityRuntimeOptions) {
    this.host = options.host;
    this.config = loadObservabilityConfig({ host: options.host, env: options.env });
    this.metrics = options.metrics ?? new InMemoryMetrics();
    this.tracer = options.tracer ?? new InMemoryTracer();
  }

  static create(options: ObservabilityRuntimeOptions): ObservabilityRuntime {
    const runtime = new ObservabilityRuntime(options);
    runtime.tryInitOtel();
    return runtime;
  }

  get isOtelActive(): boolean {
    return this.otelActive;
  }

  recordAuthOutcome(outcome: AuthOutcome, route?: string): void {
    if (!this.config.enabled) {
      return;
    }
    this.metrics.increment(AUTH_OUTCOME_METRIC, {
      host: this.host,
      outcome,
      ...(route ? { route } : {}),
    });
  }

  recordRequest(route: string): void {
    if (!this.config.enabled) {
      return;
    }
    this.metrics.increment(REQUEST_COUNT_METRIC, { host: this.host, route });
  }

  recordJob(jobName: string): void {
    if (!this.config.enabled) {
      return;
    }
    this.metrics.increment('ati.job.executions', { host: this.host, jobName });
  }

  recordError(errorCode: string): void {
    if (!this.config.enabled) {
      return;
    }
    this.metrics.increment(ERROR_COUNT_METRIC, { host: this.host, errorCode });
  }

  startRequestSpan(route: string, correlationId: string): TraceSpan {
    return this.tracer.startSpan('http.request', {
      host: this.host,
      route,
      correlationId,
      service: this.config.serviceName,
    });
  }

  startJobSpan(jobName: string, correlationId: string): TraceSpan {
    return this.tracer.startSpan('job.execute', {
      host: this.host,
      jobName,
      correlationId,
      service: this.config.serviceName,
    });
  }

  /**
   * Best-effort OTel SDK/API bootstrap. Failures are swallowed (D-Obs-4).
   */
  private tryInitOtel(): void {
    if (this.otelInitAttempted || !this.config.otelEnabled) {
      return;
    }
    this.otelInitAttempted = true;
    try {
      // Soft dependency: presence of @opentelemetry/api marks host OTel integration.
      // Full OTLP SDK registration is optional; missing/failing exporter must not throw.
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      require('@opentelemetry/api');
      if (this.config.otlpEndpoint) {
        // Endpoint configured — mark as active intent; export is async/no-op without SDK.
        this.otelActive = true;
      } else {
        this.otelActive = true;
      }
    } catch {
      this.otelActive = false;
    }
  }
}
