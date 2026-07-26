export {
  CLASSIFICATION_SCHEMA_VERSION,
  ClassificationCategories,
  DesignationKeys,
  KnowledgeRoles,
  CLASSIFICATION_CATEGORY_SET,
  DESIGNATION_KEY_SET,
  KNOWLEDGE_ROLE_SET,
  ClassificationError,
  ClassificationErrorCodes,
  type ClassificationCategory,
  type DesignationKey,
  type KnowledgeRole,
} from './types';

export {
  classificationInputSchema,
  classificationResultSchema,
  validateClassificationResult,
  type ClassificationInput,
  type ClassificationResult,
} from './model';

export {
  createDefaultRulePack,
  evaluateAxis,
  type ClassificationRule,
  type RulePack,
  type RuleAxis,
  type AxisMatch,
  type AxisEvaluation,
} from './rules';

export {
  toClassificationInput,
  toEngineSummary,
  type EngineSummary,
} from './adapter';

export {
  classificationConfigSchema,
  loadClassificationConfig,
  type ClassificationConfig,
  type LoadClassificationConfigOptions,
} from './config';

export {
  ClassificationService,
  type ClassificationServiceOptions,
  type ClassificationObservabilityHooks,
} from './service';
