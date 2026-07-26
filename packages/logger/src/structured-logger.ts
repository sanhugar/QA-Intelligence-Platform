import { normalizeLogLevel, shouldLog, type LogLevel } from './log-level';
import { redact } from './redact';

export interface StructuredLogger {
  readonly correlationId: string;
  info(message: string, fields?: Record<string, unknown>): void;
  warn(message: string, fields?: Record<string, unknown>): void;
  error(message: string, fields?: Record<string, unknown>): void;
  debug(message: string, fields?: Record<string, unknown>): void;
  child(bindings: Record<string, unknown>): StructuredLogger;
}

export interface CreateStructuredLoggerOptions {
  host: string;
  logLevel?: string;
  correlationId?: string;
  /** Injectable sink for tests; when omitted uses console (or Pino when requested). */
  sink?: Pick<Console, 'log' | 'error' | 'warn'>;
  /** Prefer Pino when available; falls back to JSON console sink. */
  preferPino?: boolean;
}

class JsonStructuredLogger implements StructuredLogger {
  constructor(
    private readonly host: string,
    private readonly level: LogLevel,
    readonly correlationId: string,
    private readonly sink: Pick<Console, 'log' | 'error' | 'warn'>,
    private readonly bindings: Record<string, unknown> = {},
  ) {}

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

  child(bindings: Record<string, unknown>): StructuredLogger {
    const nextCorrelation =
      typeof bindings.correlationId === 'string'
        ? bindings.correlationId
        : this.correlationId;
    return new JsonStructuredLogger(this.host, this.level, nextCorrelation, this.sink, {
      ...this.bindings,
      ...bindings,
    });
  }

  private write(level: LogLevel, message: string, fields?: Record<string, unknown>): void {
    if (!shouldLog(this.level, level)) {
      return;
    }
    const line = JSON.stringify({
      level,
      message,
      host: this.host,
      correlationId: this.correlationId,
      timestamp: new Date().toISOString(),
      ...redact({ ...this.bindings, ...(fields ?? {}) }),
    });
    if (level === 'error') {
      this.sink.error(line);
    } else if (level === 'warn') {
      this.sink.warn(line);
    } else {
      this.sink.log(line);
    }
  }
}

/**
 * Create the single structured logging pipeline.
 * Uses Pino when preferPino is true and pino is installed; otherwise JSON console.
 */
export function createStructuredLogger(
  options: CreateStructuredLoggerOptions,
): StructuredLogger {
  const level = normalizeLogLevel(options.logLevel ?? 'info');
  if (!level) {
    throw new Error('Invalid log level');
  }
  const correlationId = options.correlationId ?? `boot-${Date.now()}`;
  const sink = options.sink ?? console;

  if (options.preferPino !== false && !options.sink) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const pino = require('pino') as typeof import('pino');
      const logger = pino({
        level,
        base: { host: options.host, correlationId },
        redact: {
          paths: ['password', 'secret', 'token', 'authorization', '*.password', '*.token'],
          censor: '[REDACTED]',
        },
      });
      return new PinoStructuredLogger(logger, correlationId, options.host, level);
    } catch {
      // Fall through to JSON console — still a single write path.
    }
  }

  return new JsonStructuredLogger(options.host, level, correlationId, sink);
}

class PinoStructuredLogger implements StructuredLogger {
  constructor(
    private readonly logger: {
      info: (obj: object, msg?: string) => void;
      warn: (obj: object, msg?: string) => void;
      error: (obj: object, msg?: string) => void;
      debug: (obj: object, msg?: string) => void;
      child: (bindings: object) => PinoStructuredLogger['logger'];
    },
    readonly correlationId: string,
    private readonly host: string,
    private readonly level: LogLevel,
  ) {}

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

  child(bindings: Record<string, unknown>): StructuredLogger {
    const nextCorrelation =
      typeof bindings.correlationId === 'string'
        ? bindings.correlationId
        : this.correlationId;
    return new PinoStructuredLogger(
      this.logger.child({ ...bindings, correlationId: nextCorrelation }),
      nextCorrelation,
      this.host,
      this.level,
    );
  }

  private write(level: LogLevel, message: string, fields?: Record<string, unknown>): void {
    if (!shouldLog(this.level, level)) {
      return;
    }
    const payload = redact({ host: this.host, ...(fields ?? {}) });
    this.logger[level](payload, message);
  }
}
