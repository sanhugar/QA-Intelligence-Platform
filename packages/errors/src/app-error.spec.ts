import { AppError } from './app-error';
import { ErrorCodes } from './codes';
import { isAppError, toErrorView } from './mappers';

describe('@ati/errors', () => {
  it('creates AppError with code', () => {
    const err = new AppError('bad', ErrorCodes.CONFIG_INVALID);
    expect(err).toBeInstanceOf(Error);
    expect(err.code).toBe('CONFIG_INVALID');
    expect(isAppError(err)).toBe(true);
  });

  it('maps unknown errors', () => {
    expect(toErrorView(new Error('x')).code).toBe(ErrorCodes.UNKNOWN);
    expect(toErrorView('boom').message).toBe('boom');
  });
});
