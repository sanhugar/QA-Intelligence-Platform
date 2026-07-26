import { AppError, ErrorCodes } from '@ati/errors';
import { isPositiveFiniteNumber } from '@ati/shared-utils';

export function parsePositivePort(raw: string | undefined, key: string, fallback: number): number {
  const port = Number(raw ?? fallback);
  if (!isPositiveFiniteNumber(port)) {
    throw new AppError(`Invalid ${key}`, ErrorCodes.CONFIG_INVALID);
  }
  return port;
}
