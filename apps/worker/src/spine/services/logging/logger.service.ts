import { normalizeLogLevel, redact, shouldLog, type LogLevel } from '@ati/logger';
import { SharedServiceError } from '../types';

export type { LogLevel };
export { redact };

export interface LoggerServiceOptions {
  host: string;
  logLevel?: string;
  correlationId?: string;
  sink?: Pick<Console, 'log' | 'error' | 'warn'>;
}

/**
 * Bootstrap-critical structured logger shell with redaction hooks.
 * Level/redact helpers live in @ati/logger.
 */
export class LoggerService {
  private initialized = false;
  private host = '';
  private level: LogLevel = 'info';
  private correlationId = '';
  private sink: Pick<Console, 'log' | 'error' | 'warn'> = console;

  initialize(options: LoggerServiceOptions): void {
    const level = normalizeLogLevel(options.logLevel ?? 'info');
    if (!level) {
      throw new SharedServiceError('Invalid log level', 'LOGGER_INVALID');
    }
    this.host = options.host;
    this.level = level;
    this.correlationId = options.correlationId ?? `boot-${Date.now()}`;
    this.sink = options.sink ?? console;
    this.initialized = true;
  }

  isInitialized(): boolean {
    return this.initialized;
  }

  getCorrelationId(): string {
    this.ensureInitialized();
    return this.correlationId;
  }

  info(message: string, fields?: Record<string, unknown>): void {
    this.write('info', message, fields);
  }

  warn(message: string, fields?: Record<string, unknown>): void {
    this.write('warn', message, fields);
  }

  error(message: string, fields?: Record<string, unknown>): void {
    this.write('error', message, fields);
  }

  debug(message: string, fields?: Record<string, unknown>): void {
    this.write('debug', message, fields);
  }

  private write(level: LogLevel, message: string, fields?: Record<string, unknown>): void {
    this.ensureInitialized();
    if (!shouldLog(this.level, level)) {
      return;
    }
    const line = JSON.stringify({
      level,
      message,
      host: this.host,
      correlationId: this.correlationId,
      timestamp: new Date().toISOString(),
      ...redact(fields ?? {}),
    });
    if (level === 'error') {
      this.sink.error(line);
    } else if (level === 'warn') {
      this.sink.warn(line);
    } else {
      this.sink.log(line);
    }
  }

  private ensureInitialized(): void {
    if (!this.initialized) {
      throw new SharedServiceError('Logger not initialized', 'LOGGER_NOT_INITIALIZED');
    }
  }
}
