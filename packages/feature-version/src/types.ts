/** FeatureVersionResult schema version (WP-3.3). */
export const FEATURE_VERSION_SCHEMA_VERSION = '1.0' as const;

export const FeatureVersionStatuses = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  SUPERSEDED: 'superseded',
  UNKNOWN: 'unknown',
} as const;

export type FeatureVersionStatus =
  (typeof FeatureVersionStatuses)[keyof typeof FeatureVersionStatuses];

export const FEATURE_VERSION_STATUS_SET = new Set<string>(
  Object.values(FeatureVersionStatuses),
);

export class FeatureVersionError extends Error {
  constructor(
    message: string,
    readonly code: string,
  ) {
    super(message);
    this.name = 'FeatureVersionError';
  }
}

export const FeatureVersionErrorCodes = {
  INVALID_INPUT: 'feature_version_invalid_input',
  NOT_READY: 'feature_version_not_ready',
  DISABLED: 'feature_version_disabled',
} as const;
