/**
 * Shared application error base. Host-specific errors extend or wrap this class.
 */
export class AppError extends Error {
  constructor(
    message: string,
    readonly code: string,
    readonly details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = 'AppError';
  }
}
