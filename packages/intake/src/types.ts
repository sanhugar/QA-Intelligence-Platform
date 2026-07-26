/** Approved sync lifecycle states (WP-3.1 D2). */
export const IntakeStates = {
  RECEIVED: 'received',
  VALIDATED: 'validated',
  ACCEPTED: 'accepted',
  ACCEPTED_PENDING_PARSER: 'accepted_pending_parser',
  FAILED: 'failed',
} as const;

export type IntakeState = (typeof IntakeStates)[keyof typeof IntakeStates];

export const IntakeTerminalStates = [
  IntakeStates.ACCEPTED,
  IntakeStates.ACCEPTED_PENDING_PARSER,
  IntakeStates.FAILED,
] as const;

export type IntakeTerminalState = (typeof IntakeTerminalStates)[number];

/** Supported production format catalog (membership only — no parsing). */
export const IntakeSupportedFormats = {
  MARKDOWN: 'markdown',
  FDD: 'fdd',
  PRD: 'prd',
  USER_STORY: 'user_story',
} as const;

export type IntakeSupportedFormat =
  (typeof IntakeSupportedFormats)[keyof typeof IntakeSupportedFormats];

export const INTAKE_SUPPORTED_FORMAT_SET = new Set<string>(
  Object.values(IntakeSupportedFormats),
);

/** Product path must reject engine test stub as a declared format. */
export const INTAKE_FORBIDDEN_PRODUCT_FORMATS = new Set<string>(['stub']);

export class IntakeError extends Error {
  constructor(
    message: string,
    readonly code: string,
  ) {
    super(message);
    this.name = 'IntakeError';
  }
}

export const IntakeErrorCodes = {
  VALIDATION_ERROR: 'validation_error',
  UNSUPPORTED_FORMAT: 'unsupported_format',
  FORBIDDEN_FORMAT: 'forbidden_format',
  AUTH_FAILED: 'auth_failed',
  ORCHESTRATION_ERROR: 'orchestration_error',
  NOT_READY: 'intake_not_ready',
  DISABLED: 'intake_disabled',
} as const;

export type IntakeFailureReasonCode =
  (typeof IntakeErrorCodes)[keyof typeof IntakeErrorCodes];
