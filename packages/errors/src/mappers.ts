import { AppError } from './app-error';
import { ErrorCodes } from './codes';

export interface ErrorView {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

/** Map unknown failures to a stable ErrorView without throwing. */
export function toErrorView(error: unknown): ErrorView {
  if (error instanceof AppError) {
    return {
      code: error.code,
      message: error.message,
      details: error.details,
    };
  }
  if (error instanceof Error) {
    return {
      code: ErrorCodes.UNKNOWN,
      message: error.message,
    };
  }
  return {
    code: ErrorCodes.UNKNOWN,
    message: String(error),
  };
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}
