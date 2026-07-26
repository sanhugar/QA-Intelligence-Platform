import { LoggerService, redact } from './logger.service';
import { SharedServiceError } from '../types';

describe('LoggerService', () => {
  it('initializes and redacts sensitive fields', () => {
    const sink = { log: jest.fn(), error: jest.fn(), warn: jest.fn() };
    const logger = new LoggerService();
    logger.initialize({ host: 'worker', logLevel: 'info', sink });
    logger.info('hello', { password: 'secret', ok: true });
    expect(sink.log).toHaveBeenCalled();
    const payload = JSON.parse(sink.log.mock.calls[0][0] as string);
    expect(payload.password).toBe('[REDACTED]');
    expect(payload.ok).toBe(true);
  });

  it('fails on invalid log level', () => {
    const logger = new LoggerService();
    expect(() => logger.initialize({ host: 'worker', logLevel: 'verbose' })).toThrow(
      SharedServiceError,
    );
  });

  it('redact helper masks nested secrets', () => {
    expect(redact({ nested: { token: 'x' } })).toEqual({ nested: { token: '[REDACTED]' } });
  });
});
