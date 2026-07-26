export type {
  RequirementFormatKey,
  RequirementEngineLifecycleState,
} from './types';
export {
  RequirementFormatKeys,
  RequirementEngineError,
  RequirementEngineErrorCodes,
} from './types';

export type {
  Requirement,
  RequirementSection,
  RequirementFragment,
  RequirementMetadata,
  RequirementSourceReference,
} from './model';
export {
  requirementSchema,
  requirementSectionSchema,
  requirementFragmentSchema,
  requirementMetadataSchema,
  requirementSourceReferenceSchema,
  validateRequirement,
  validateSourceReference,
  freezeRequirement,
} from './model';

export type {
  RequirementPipelineInput,
  ParseResult,
  ParsePort,
  NormalizePort,
  EngineResult,
  EngineResultSuccess,
  EngineResultFailure,
  EngineResultStatus,
} from './pipeline';
export {
  createNoOpNormalizePort,
  assembleRequirement,
} from './pipeline';

export {
  requirementEngineConfigSchema,
  loadRequirementEngineConfig,
  type RequirementEngineConfig,
  type LoadRequirementEngineConfigOptions,
} from './config';

export { createStubParsePort } from './stub-parse-port';

export {
  RequirementEngine,
  type RequirementEngineOptions,
} from './engine';
