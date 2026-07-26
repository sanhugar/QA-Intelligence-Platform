import { createStructuredLogger, type LogLevel, type StructuredLogger } from '@ati/logger';
import { SharedServiceError } from '../types';

export type { LogLevel };
export { redact } from '@ati/logger';

export interface LoggerServiceOptions {
  host: string;
  logLevel?: string;
  correlationId?: string;
  sink?: Pick<Console, 'log' | 'error' | 'warn'>;
  /** When false, use JSON sink (tests). Default true for runtime Pino path. */
  preferPino?: boolean;
}

/**
 * Bootstrap-critical structured logger shell.
 * Single write path via @ati/logger createStructuredLogger (Pino or JSON).
 */
export class LoggerService {
  private initialized = false;
  private inner: StructuredLogger | null = null;

  initialize(options: LoggerServiceOptions): void {
    try {
      this.inner = createStructuredLogger({
        host: options.host,
        logLevel: options.logLevel,
        correlationId: options.correlationId,
        sink: options.sink,
        preferPino: options.preferPino ?? !options.sink,
      });
    } catch {
      throw new SharedServiceError('Invalid log level', 'LOGGER_INVALID');
    }
    this.initialized = true;
  }

  isInitialized(): boolean {
    return this.initialized;
  }

  getCorrelationId(): string {
    this.ensureInitialized();
    return this.inner!.correlationId;
  }

  /** Bind correlation for request/job scope — still one write path. */
  withCorrelation(correlationId: string): StructuredLogger {
    this.ensureInitialized();
    return this.inner!.child({ correlationId });
  }

  info(message: string, fields?: Record<string, unknown>): void {
    this.ensureInitialized();
    this.inner!.info(message, fields);
  }

  warn(message: string, fields?: Record<string, unknown>): void {
    this.ensureInitialized();
    this.inner!.warn(message, fields);
  }

  error(message: string, fields?: Record<string, unknown>): void {
    this.ensureInitialized();
    this.inner!.error(message, fields);
  }

  debug(message: string, fields?: Record<string, unknown>): void {
    this.ensureInitialized();
    this.inner!.debug(message, fields);
  }

  private ensureInitialized(): void {
    if (!this.initialized || !this.inner) {
      throw new SharedServiceError('Logger not initialized', 'LOGGER_NOT_INITIALIZED');
    }
  }
}
