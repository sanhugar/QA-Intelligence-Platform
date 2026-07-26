import { AppError } from '@ati/errors';

export const AuthErrorCodes = {
  AUTH_UNAUTHORIZED: 'AUTH_UNAUTHORIZED',
  AUTH_FORBIDDEN: 'AUTH_FORBIDDEN',
  AUTH_TOKEN_INVALID: 'AUTH_TOKEN_INVALID',
  AUTH_CONFIG_INVALID: 'AUTH_CONFIG_INVALID',
} as const;

export type AuthErrorCode = (typeof AuthErrorCodes)[keyof typeof AuthErrorCodes];

export class AuthError extends AppError {
  constructor(message: string, code: AuthErrorCode, details?: Record<string, unknown>) {
    super(message, code, details);
    this.name = 'AuthError';
  }
}
