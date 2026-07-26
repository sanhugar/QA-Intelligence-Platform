import { createStructuredLogger, normalizeLogLevel, redact, shouldLog } from './index';

describe('@ati/logger', () => {
  it('redacts sensitive keys', () => {
    expect(redact({ password: 'x', ok: true })).toEqual({
      password: '[REDACTED]',
      ok: true,
    });
  });

  it('redacts bearer/JWT-shaped values under benign keys', () => {
    const jwt =
      'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIn0.dGVzdHNpZ25hdHVyZQ';
    expect(redact({ payload: `Bearer ${jwt}`, note: 'ok' })).toEqual({
      payload: '[REDACTED]',
      note: 'ok',
    });
    expect(redact({ weird: jwt }).weird).toBe('[REDACTED]');
  });

  it('normalizes levels and compares severity', () => {
    expect(normalizeLogLevel('INFO')).toBe('info');
    expect(normalizeLogLevel('verbose')).toBeNull();
    expect(shouldLog('warn', 'error')).toBe(true);
    expect(shouldLog('warn', 'info')).toBe(false);
  });

  it('writes a single structured JSON line via injectable sink', () => {
    const lines: string[] = [];
    const logger = createStructuredLogger({
      host: 'api',
      correlationId: 'c-1',
      preferPino: false,
      sink: {
        log: (m) => lines.push(String(m)),
        warn: (m) => lines.push(String(m)),
        error: (m) => lines.push(String(m)),
      },
    });
    logger.info('hello', { authorization: 'Bearer secret', ok: 1 });
    expect(lines).toHaveLength(1);
    const parsed = JSON.parse(lines[0]!) as Record<string, unknown>;
    expect(parsed.correlationId).toBe('c-1');
    expect(parsed.authorization).toBe('[REDACTED]');
    expect(parsed.ok).toBe(1);
  });
});
