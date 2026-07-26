import type { ClassificationResult } from '@ati/classification';
import type { IntakeRecord } from '@ati/intake';
import {
  FEATURE_VERSION_SCHEMA_VERSION,
  FeatureVersionError,
  FeatureVersionErrorCodes,
  FeatureVersionService,
  FeatureVersionStatuses,
  deriveIdentities,
  toFeatureVersionInput,
  validateFeatureVersionResult,
  type FeatureVersionInput,
  type FeatureVersionResult,
} from './index';

function baseInput(overrides: Partial<FeatureVersionInput> = {}): FeatureVersionInput {
  return {
    intakeId: 'in-1',
    correlationId: 'corr-1',
    tenantId: 't1',
    workspaceId: 'w1',
    intakeState: 'accepted_pending_parser',
    sourceIdentity: 'doc-feature-a',
    sourceVersion: '1.0.0',
    checksum: 'abc123',
    declaredFormat: 'prd',
    designation: 'feature',
    knowledgeRole: 'ars_candidate',
    classificationEvaluatedAt: '2026-07-26T12:00:00.000Z',
    ...overrides,
  };
}

function sampleClassification(): ClassificationResult {
  return {
    schemaVersion: '1.0',
    classification: 'business',
    designation: 'feature',
    knowledgeRole: 'ars_candidate',
    classificationConfidence: 0.7,
    designationConfidence: 0.65,
    knowledgeRoleConfidence: 0.6,
    classificationRuleIds: ['r1'],
    designationRuleIds: ['r2'],
    knowledgeRoleRuleIds: ['r3'],
    intakeId: 'in-1',
    correlationId: 'corr-1',
    tenantId: 't1',
    workspaceId: 'w1',
    evaluatedAt: '2026-07-26T12:00:00.000Z',
  };
}

function sampleRecord(): IntakeRecord {
  return {
    intakeId: 'in-1',
    state: 'accepted_pending_parser',
    idempotencyKey: 'k',
    request: {
      source: {
        sourceIdentity: 'doc-feature-a',
        sourceVersion: '1.0.0',
        checksum: 'abc123',
        declaredFormat: 'prd',
      },
      metadata: { channel: 'api', notes: 'Payments Portal' },
      payload: 'SECRET_BODY_MUST_NOT_BE_USED',
      correlationId: 'corr-1',
      tenantId: 't1',
      workspaceId: 'w1',
    },
    audit: {
      receivedAt: '2026-07-26T00:00:00.000Z',
      sourceIdentity: 'doc-feature-a',
      sourceVersion: '1.0.0',
      checksum: 'abc123',
      declaredFormat: 'prd',
      correlationId: 'corr-1',
      tenantId: 't1',
      workspaceId: 'w1',
    },
  };
}

describe('@ati/feature-version (WP-3.3)', () => {
  describe('schema', () => {
    it('validates FeatureVersionResult schema v1.0', () => {
      const result = validateFeatureVersionResult({
        schemaVersion: FEATURE_VERSION_SCHEMA_VERSION,
        featureId: 'fvf_x',
        versionIdentifier: 'fvv_y',
        lineageIdentifier: 'fvl_z',
        status: FeatureVersionStatuses.ACTIVE,
        confidence: 0.8,
        derivationRuleIds: ['r1'],
        intakeId: 'in-1',
        correlationId: 'c1',
        evaluatedAt: '2026-07-26T00:00:00.000Z',
      });
      expect(result.schemaVersion).toBe('1.0');
    });
  });

  describe('derivation', () => {
    it('is deterministic for identical input', () => {
      const a = deriveIdentities(baseInput());
      const b = deriveIdentities(baseInput());
      expect(a.featureId).toBe(b.featureId);
      expect(a.versionIdentifier).toBe(b.versionIdentifier);
      expect(a.lineageIdentifier).toBe(b.lineageIdentifier);
    });

    it('fails safe to unknown when source signals missing', () => {
      const d = deriveIdentities(
        baseInput({
          sourceIdentity: undefined,
          sourceVersion: undefined,
          checksum: undefined,
        }),
      );
      expect(d.status).toBe(FeatureVersionStatuses.UNKNOWN);
      expect(d.confidence).toBe(0);
      expect(d.derivationRuleIds).toContain('derive-failsafe-unknown-v1');
    });

    it('omits featureName when hint absent (D8)', () => {
      const d = deriveIdentities(baseInput({ featureNameHint: undefined }));
      expect(d.featureName).toBeUndefined();
    });

    it('sets featureName from allow-listed hint only', () => {
      const d = deriveIdentities(baseInput({ featureNameHint: 'Billing Hub' }));
      expect(d.featureName).toBe('Billing Hub');
    });
  });

  describe('resolveFeatureVersion', () => {
    it('resolves reproducibly with fixed now', () => {
      const svc = FeatureVersionService.createReady({
        now: () => '2026-07-26T12:00:00.000Z',
      });
      const a = svc.resolveFeatureVersion(baseInput());
      const b = svc.resolveFeatureVersion(baseInput());
      expect(a).toEqual(b);
      expect(a.schemaVersion).toBe('1.0');
      expect(a.status).toBe(FeatureVersionStatuses.ACTIVE);
      expect(a.classificationResultRef).toBe('in-1@2026-07-26T12:00:00.000Z');
      expect(a.knowledgeRole).toBe('ars_candidate');
      expect(a.successorVersion).toBeUndefined();
    });

    it('emits predecessor from hint without rewriting history', () => {
      const svc = FeatureVersionService.createReady({
        now: () => '2026-07-26T12:00:00.000Z',
      });
      const result = svc.resolveFeatureVersion(
        baseInput({ predecessorVersionHint: 'fvv_prior' }),
      );
      expect(result.predecessorVersion).toBe('fvv_prior');
    });

    it('uses process-local registry for predecessor when rememberResults enabled', () => {
      const svc = FeatureVersionService.createReady({
        now: () => '2026-07-26T12:00:00.000Z',
        rememberResults: true,
      });
      const first = svc.resolveFeatureVersion(baseInput({ sourceVersion: '1.0.0' }));
      const second = svc.resolveFeatureVersion(
        baseInput({ sourceVersion: '2.0.0', checksum: 'def456' }),
      );
      expect(first.featureId).toBe(second.featureId);
      expect(second.predecessorVersion).toBe(first.versionIdentifier);
      // Historical result unchanged in registry
      expect(svc.getRegistry().getByVersion(first.versionIdentifier)?.predecessorVersion).toBeUndefined();
    });

    it('fails closed when disabled', () => {
      const svc = FeatureVersionService.createReady({ config: { enabled: false } });
      expect(() => svc.resolveFeatureVersion(baseInput())).toThrow(FeatureVersionError);
      try {
        svc.resolveFeatureVersion(baseInput());
      } catch (e) {
        expect((e as FeatureVersionError).code).toBe(FeatureVersionErrorCodes.DISABLED);
      }
    });

    it('invokes observability hook', () => {
      const seen: FeatureVersionResult[] = [];
      const svc = FeatureVersionService.createReady({
        now: () => '2026-07-26T12:00:00.000Z',
        obs: { onResolved: (r) => seen.push(r) },
      });
      svc.resolveFeatureVersion(baseInput());
      expect(seen).toHaveLength(1);
    });
  });

  describe('adapters', () => {
    it('maps IntakeRecord without using payload body', () => {
      const input = toFeatureVersionInput(sampleRecord(), sampleClassification());
      expect(JSON.stringify(input)).not.toContain('SECRET_BODY');
      expect(input.sourceIdentity).toBe('doc-feature-a');
      expect(input.featureNameHint).toBe('Payments Portal');
      expect(input.designation).toBe('feature');
      expect(input.knowledgeRole).toBe('ars_candidate');
    });

    it('resolveFromIntake carries classificationRef and knowledgeRole', () => {
      const svc = FeatureVersionService.createReady({
        now: () => '2026-07-26T12:00:00.000Z',
      });
      const result = svc.resolveFromIntake(sampleRecord(), sampleClassification());
      expect(result.featureName).toBe('Payments Portal');
      expect(result.classificationResultRef).toBe('in-1@2026-07-26T12:00:00.000Z');
      expect(result.knowledgeRole).toBe('ars_candidate');
      expect(result.knowledgeRole).not.toBe('approved_requirements_source');
    });
  });
});
