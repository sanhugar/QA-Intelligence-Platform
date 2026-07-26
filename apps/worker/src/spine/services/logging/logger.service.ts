import { SharedServiceError } from '../types';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LoggerServiceOptions {
  host: string;
  logLevel?: string;
  correlationId?: string;
  sink?: Pick<Console, 'log' | 'error' | 'warn'>;
}

const SENSITIVE_KEY = /(password|secret|token|authorization|api[_-]?key)/i;

/**
 * Bootstrap-critical structured logger shell with redaction hooks.
 */
export class LoggerService {
  private initialized = false;
  private host = '';
  private level: LogLevel = 'info';
  private correlationId = '';
  private sink: Pick<Console, 'log' | 'error' | 'warn'> = console;

  initialize(options: LoggerServiceOptions): void {
    const level = normalizeLevel(options.logLevel ?? 'info');
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

function normalizeLevel(value: string): LogLevel | null {
  const v = value.trim().toLowerCase();
  if (v === 'debug' || v === 'info' || v === 'warn' || v === 'error') {
    return v;
  }
  return null;
}

function shouldLog(configured: LogLevel, level: LogLevel): boolean {
  const order: LogLevel[] = ['debug', 'info', 'warn', 'error'];
  return order.indexOf(level) >= order.indexOf(configured);
}

export function redact(fields: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(fields)) {
    if (SENSITIVE_KEY.test(key)) {
      out[key] = '[REDACTED]';
    } else if (value && typeof value === 'object' && !Array.isArray(value)) {
      out[key] = redact(value as Record<string, unknown>);
    } else {
      out[key] = value;
    }
  }
  return out;
}
