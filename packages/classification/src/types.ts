/** ClassificationResult schema version (WP-3.2 D6). */
export const CLASSIFICATION_SCHEMA_VERSION = '1.0' as const;

export const ClassificationCategories = {
  FUNCTIONAL: 'functional',
  NON_FUNCTIONAL: 'non_functional',
  BUSINESS: 'business',
  TECHNICAL: 'technical',
  CONFIGURATION: 'configuration',
  UNKNOWN: 'unknown',
} as const;

export type ClassificationCategory =
  (typeof ClassificationCategories)[keyof typeof ClassificationCategories];

export const CLASSIFICATION_CATEGORY_SET = new Set<string>(
  Object.values(ClassificationCategories),
);

export const DesignationKeys = {
  FEATURE: 'feature',
  ENHANCEMENT: 'enhancement',
  DEFECT: 'defect',
  TECHNICAL_DEBT: 'technical_debt',
  DOCUMENTATION: 'documentation',
  INVESTIGATION: 'investigation',
  UNKNOWN: 'unknown',
} as const;

export type DesignationKey = (typeof DesignationKeys)[keyof typeof DesignationKeys];

export const DESIGNATION_KEY_SET = new Set<string>(Object.values(DesignationKeys));

export const KnowledgeRoles = {
  ARS_CANDIDATE: 'ars_candidate',
  SUPPORTING: 'supporting',
  UNKNOWN: 'unknown',
} as const;

export type KnowledgeRole = (typeof KnowledgeRoles)[keyof typeof KnowledgeRoles];

export const KNOWLEDGE_ROLE_SET = new Set<string>(Object.values(KnowledgeRoles));

export class ClassificationError extends Error {
  constructor(
    message: string,
    readonly code: string,
  ) {
    super(message);
    this.name = 'ClassificationError';
  }
}

export const ClassificationErrorCodes = {
  INVALID_INPUT: 'classification_invalid_input',
  NOT_READY: 'classification_not_ready',
  DISABLED: 'classification_disabled',
} as const;
