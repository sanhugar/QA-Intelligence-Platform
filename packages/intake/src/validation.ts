import { intakeRequestSchema, type IntakeRequest } from './model';
import {
  INTAKE_FORBIDDEN_PRODUCT_FORMATS,
  IntakeError,
  IntakeErrorCodes,
  INTAKE_SUPPORTED_FORMAT_SET,
} from './types';

export interface ValidationSuccess {
  ok: true;
  request: IntakeRequest;
}

export interface ValidationFailure {
  ok: false;
  reason: string;
  message: string;
}

export type ValidationResult = ValidationSuccess | ValidationFailure;

/**
 * Validate request structure, required metadata, and format catalog membership.
 * Does NOT inspect document contents (D5).
 */
export function validateIntakeRequest(input: unknown): ValidationResult {
  const parsed = intakeRequestSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      reason: IntakeErrorCodes.VALIDATION_ERROR,
      message: parsed.error.issues.map((i) => i.message).join('; ') || 'Invalid intake request',
    };
  }

  const request = parsed.data;
  const format = request.source.declaredFormat;

  if (INTAKE_FORBIDDEN_PRODUCT_FORMATS.has(format)) {
    return {
      ok: false,
      reason: IntakeErrorCodes.FORBIDDEN_FORMAT,
      message: `Format '${format}' is forbidden on product intake paths`,
    };
  }

  if (!INTAKE_SUPPORTED_FORMAT_SET.has(format)) {
    return {
      ok: false,
      reason: IntakeErrorCodes.UNSUPPORTED_FORMAT,
      message: `Unsupported declared format '${format}'`,
    };
  }

  return { ok: true, request };
}

export function assertValidIntakeRequest(input: unknown): IntakeRequest {
  const result = validateIntakeRequest(input);
  if (!result.ok) {
    throw new IntakeError(result.message, result.reason);
  }
  return result.request;
}
