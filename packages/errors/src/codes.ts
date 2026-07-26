/** Stable shared error codes (hosts may define additional codes). */
export const ErrorCodes = {
  CONFIG_INVALID: 'CONFIG_INVALID',
  CONFIG_NOT_INITIALIZED: 'CONFIG_NOT_INITIALIZED',
  LOGGER_INVALID: 'LOGGER_INVALID',
  LOGGER_NOT_INITIALIZED: 'LOGGER_NOT_INITIALIZED',
  VALIDATION_FAILED: 'VALIDATION_FAILED',
  UNKNOWN: 'UNKNOWN',
} as const;

export type SharedErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];
