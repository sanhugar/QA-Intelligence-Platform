export type {
  IntakeState,
  IntakeTerminalState,
  IntakeSupportedFormat,
  IntakeFailureReasonCode,
} from './types';
export {
  IntakeStates,
  IntakeTerminalStates,
  IntakeSupportedFormats,
  INTAKE_SUPPORTED_FORMAT_SET,
  INTAKE_FORBIDDEN_PRODUCT_FORMATS,
  IntakeError,
  IntakeErrorCodes,
} from './types';

export type {
  IntakeSource,
  IntakeMetadata,
  IntakeRequest,
  IntakeAuditMetadata,
  IntakeRecord,
} from './model';
export {
  intakeSourceSchema,
  intakeMetadataSchema,
  intakeRequestSchema,
  buildIdempotencyKey,
  isCatalogFormat,
} from './model';

export {
  validateIntakeRequest,
  assertValidIntakeRequest,
  type ValidationResult,
} from './validation';

export { IntakeRegistry } from './registry';

export {
  mapEngineResultToIntake,
  toPipelineInput,
  invokeRequirementEngine,
  type EngineOutcomeMapping,
} from './orchestration';

export {
  intakeConfigSchema,
  loadIntakeConfig,
  type IntakeConfig,
  type LoadIntakeConfigOptions,
} from './config';

export {
  IntakeWorkflow,
  type IntakeWorkflowOptions,
  type IntakeObservabilityHooks,
} from './workflow';
