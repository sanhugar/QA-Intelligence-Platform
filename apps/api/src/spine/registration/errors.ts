import { AppError } from '@ati/errors';

export class RegistrationError extends AppError {
  constructor(message: string, code: string) {
    super(message, code);
    this.name = 'RegistrationError';
  }
}

export class PlatformStartupError extends AppError {
  constructor(message: string, code: string) {
    super(message, code);
    this.name = 'PlatformStartupError';
  }
}
