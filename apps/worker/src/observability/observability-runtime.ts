import {
  AUTH_OUTCOME_METRIC,
  ERROR_COUNT_METRIC,
  InMemoryMetrics,
  InMemoryTracer,
  loadObservabilityConfig,
  mintCorrelationId,
  REQUEST_COUNT_METRIC,
  resolveTrustedJobCorrelation,
  type AuthOutcome,
  type MetricsPort,
  type ObservabilityConfig,
  type TracePort,
  type TraceSpan,
  type TrustedJobEnvelope,
} from '@ati/observability';

export interface WorkerObservabilityRuntimeOptions {
  env?: NodeJS.ProcessEnv;
  metrics?: MetricsPort;
  tracer?: TracePort;
}

/**
 * Worker observability runtime.
 * HTTP surfaces mint correlation (untrusted client headers ignored).
 * Job harness uses resolveTrustedJobCorrelation.
 */
export class WorkerObservabilityRuntime {
  readonly config: ObservabilityConfig;
  readonly metrics: MetricsPort;
  readonly tracer: TracePort;
  readonly host = 'worker' as const;
  private otelActive = false;

  private constructor(options: WorkerObservabilityRuntimeOptions) {
    this.config = loadObservabilityConfig({ host: 'worker', env: options.env });
    this.metrics = options.metrics ?? new InMemoryMetrics();
    this.tracer = options.tracer ?? new InMemoryTracer();
  }

  static create(options: WorkerObservabilityRuntimeOptions = {}): WorkerObservabilityRuntime {
    const runtime = new WorkerObservabilityRuntime(options);
    runtime.tryInitOtel();
    return runtime;
  }

  get isOtelActive(): boolean {
    return this.otelActive;
  }

  /** HTTP worker paths: always mint — client correlation is not authoritative. */
  mintHttpCorrelationId(): string {
    return mintCorrelationId();
  }

  /** Trusted job envelope / harness path. */
  resolveJobCorrelation(envelope: TrustedJobEnvelope): string {
    return resolveTrustedJobCorrelation(envelope);
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
   * In-process harness proving trusted envelope propagation (L5).
   * Not a BullMQ/Redis bus.
   */
  runTrustedJobHarness(
    jobName: string,
    envelope: TrustedJobEnvelope,
    work: (correlationId: string) => void,
  ): string {
    const correlationId = this.resolveJobCorrelation(envelope);
    this.recordJob(jobName);
    const span = this.startJobSpan(jobName, correlationId);
    try {
      work(correlationId);
      span.end('ok');
    } catch (error) {
      span.end('error');
      this.recordError('JOB_FAILED');
      throw error;
    }
    return correlationId;
  }

  private tryInitOtel(): void {
    if (!this.config.otelEnabled) {
      return;
    }
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      require('@opentelemetry/api');
      this.otelActive = true;
    } catch {
      this.otelActive = false;
    }
  }
}
