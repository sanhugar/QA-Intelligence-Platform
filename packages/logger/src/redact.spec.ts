import { normalizeLogLevel, redact, shouldLog } from './index';

describe('@ati/logger', () => {
  it('redacts sensitive keys', () => {
    expect(redact({ password: 'x', ok: true })).toEqual({
      password: '[REDACTED]',
      ok: true,
    });
  });

  it('normalizes levels and compares severity', () => {
    expect(normalizeLogLevel('INFO')).toBe('info');
    expect(normalizeLogLevel('verbose')).toBeNull();
    expect(shouldLog('warn', 'error')).toBe(true);
    expect(shouldLog('warn', 'info')).toBe(false);
  });
});
