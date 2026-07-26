import { createHash } from 'node:crypto';
import type { FeatureVersionInput } from './model';
import { FeatureVersionStatuses, type FeatureVersionStatus } from './types';

const ID_PREFIX_LEN = 32;

function canon(value: string | undefined): string {
  return (value ?? '').trim().toLowerCase();
}

/** Stable SHA-256 hex digest of a canonical key (deterministic; not UUID). */
export function stableDigest(parts: Array<string | undefined>): string {
  const key = parts.map(canon).join('|');
  return createHash('sha256').update(key, 'utf8').digest('hex').slice(0, ID_PREFIX_LEN);
}

export interface DerivedIdentities {
  featureId: string;
  versionIdentifier: string;
  lineageIdentifier: string;
  status: FeatureVersionStatus;
  confidence: number;
  derivationRuleIds: string[];
  featureName?: string;
}

/**
 * Pure deterministic identity derivation (D3 / D8).
 */
export function deriveIdentities(input: FeatureVersionInput): DerivedIdentities {
  const hasSourceIdentity = Boolean(input.sourceIdentity?.trim());
  const hasSourceVersion = Boolean(input.sourceVersion?.trim());
  const hasChecksum = Boolean(input.checksum?.trim());
  const signalsOk = hasSourceIdentity && hasSourceVersion && hasChecksum;

  const ruleIds: string[] = [];

  const featureHint = input.designation ?? input.featureNameHint;
  const featureId = `fvf_${stableDigest([
    input.tenantId,
    input.workspaceId,
    input.sourceIdentity ?? 'missing-source',
    featureHint,
  ])}`;
  ruleIds.push('derive-feature-id-v1');

  const versionIdentifier = `fvv_${stableDigest([
    featureId,
    input.sourceVersion ?? 'missing-version',
    input.checksum ?? 'missing-checksum',
    input.intakeId,
  ])}`;
  ruleIds.push('derive-version-id-v1');

  const lineageIdentifier = `fvl_${stableDigest([featureId])}`;
  ruleIds.push('derive-lineage-id-v1');

  let featureName: string | undefined;
  const nameHint = input.featureNameHint?.trim();
  if (nameHint) {
    featureName = nameHint.slice(0, 256);
    ruleIds.push('derive-feature-name-from-hint-v1');
  }

  if (!signalsOk) {
    ruleIds.push('derive-failsafe-unknown-v1');
    return {
      featureId,
      versionIdentifier,
      lineageIdentifier,
      status: FeatureVersionStatuses.UNKNOWN,
      confidence: 0,
      derivationRuleIds: ruleIds,
      featureName,
    };
  }

  ruleIds.push('derive-status-active-v1');
  return {
    featureId,
    versionIdentifier,
    lineageIdentifier,
    status: FeatureVersionStatuses.ACTIVE,
    confidence: 0.85,
    derivationRuleIds: ruleIds,
    featureName,
  };
}
