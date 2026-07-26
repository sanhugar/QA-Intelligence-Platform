import {
  ClassificationCategories,
  ClassificationError,
  ClassificationErrorCodes,
  ClassificationService,
  CLASSIFICATION_SCHEMA_VERSION,
  DesignationKeys,
  KnowledgeRoles,
  createDefaultRulePack,
  evaluateAxis,
  toClassificationInput,
  toEngineSummary,
  validateClassificationResult,
  type ClassificationInput,
  type ClassificationResult,
} from './index';
import type { IntakeRecord } from '@ati/intake';
import type { Requirement } from '@ati/requirement-engine';

function baseInput(overrides: Partial<ClassificationInput> = {}): ClassificationInput {
  return {
    intakeId: 'in-1',
    correlationId: 'corr-1',
    tenantId: 't1',
    workspaceId: 'w1',
    intakeState: 'accepted_pending_parser',
    declaredFormat: 'prd',
    hasSourceIdentity: true,
    hasSourceVersion: true,
    hasChecksum: true,
    ...overrides,
  };
}

function sampleRecord(overrides: Partial<IntakeRecord> = {}): IntakeRecord {
  return {
    intakeId: 'in-1',
    state: 'accepted_pending_parser',
    idempotencyKey: 'k',
    request: {
      source: {
        sourceIdentity: 'doc-1',
        sourceVersion: '1',
        checksum: 'abc',
        declaredFormat: 'user_story',
      },
      metadata: { channel: 'api', notes: 'enhancement request' },
      payload: 'SECRET_BODY_MUST_NOT_BE_USED',
      correlationId: 'corr-1',
      tenantId: 't1',
      workspaceId: 'w1',
    },
    audit: {
      receivedAt: '2026-07-26T00:00:00.000Z',
      sourceIdentity: 'doc-1',
      sourceVersion: '1',
      checksum: 'abc',
      declaredFormat: 'user_story',
      correlationId: 'corr-1',
      tenantId: 't1',
      workspaceId: 'w1',
    },
    ...overrides,
  };
}

describe('@ati/classification (WP-3.2)', () => {
  describe('schema', () => {
    it('validates ClassificationResult schema v1.0', () => {
      const result = validateClassificationResult({
        schemaVersion: CLASSIFICATION_SCHEMA_VERSION,
        classification: ClassificationCategories.FUNCTIONAL,
        designation: DesignationKeys.FEATURE,
        knowledgeRole: KnowledgeRoles.SUPPORTING,
        classificationConfidence: 0.5,
        designationConfidence: 0.5,
        knowledgeRoleConfidence: 0.5,
        classificationRuleIds: ['r1'],
        designationRuleIds: ['r2'],
        knowledgeRoleRuleIds: ['r3'],
        intakeId: 'in-1',
        correlationId: 'c1',
        evaluatedAt: '2026-07-26T00:00:00.000Z',
      });
      expect(result.schemaVersion).toBe('1.0');
    });

    it('rejects invalid knowledgeRole (Option A)', () => {
      expect(() =>
        validateClassificationResult({
          schemaVersion: '1.0',
          classification: 'functional',
          designation: 'feature',
          knowledgeRole: 'approved_requirements_source',
          classificationConfidence: 1,
          designationConfidence: 1,
          knowledgeRoleConfidence: 1,
          classificationRuleIds: [],
          designationRuleIds: [],
          knowledgeRoleRuleIds: [],
          intakeId: 'in-1',
          correlationId: 'c1',
          evaluatedAt: '2026-07-26T00:00:00.000Z',
        }),
      ).toThrow();
    });
  });

  describe('rule engine', () => {
    it('is deterministic for identical input', () => {
      const svc = ClassificationService.createReady({
        now: () => '2026-07-26T12:00:00.000Z',
      });
      const a = svc.classify(baseInput({ declaredFormat: 'user_story' }));
      const b = svc.classify(baseInput({ declaredFormat: 'user_story' }));
      expect(a).toEqual(b);
    });

    it('applies first-match-by-priority for classification', () => {
      const pack = createDefaultRulePack();
      const hit = evaluateAxis(
        pack.rules,
        'classification',
        baseInput({
          declaredFormat: 'prd',
          channel: 'nfr',
        }),
        ClassificationCategories.UNKNOWN,
      );
      expect(hit.value).toBe(ClassificationCategories.NON_FUNCTIONAL);
      expect(hit.ruleIds).toEqual(['cls-channel-nfr']);
    });

    it('returns unknown with confidence 0 when no rule matches', () => {
      const pack = createDefaultRulePack();
      const hit = evaluateAxis(
        pack.rules,
        'designation',
        baseInput({
          declaredFormat: 'markdown',
          channel: undefined,
          designationHint: undefined,
        }),
        DesignationKeys.UNKNOWN,
      );
      expect(hit.value).toBe(DesignationKeys.UNKNOWN);
      expect(hit.confidence).toBe(0);
      expect(hit.ruleIds).toEqual([]);
    });
  });

  describe('classify', () => {
    it('classifies PRD as business + pending parser as supporting', () => {
      const svc = ClassificationService.createReady({
        now: () => '2026-07-26T12:00:00.000Z',
      });
      const result = svc.classify(
        baseInput({
          declaredFormat: 'prd',
          intakeState: 'accepted_pending_parser',
        }),
      );
      expect(result.classification).toBe(ClassificationCategories.BUSINESS);
      expect(result.knowledgeRole).toBe(KnowledgeRoles.SUPPORTING);
      expect(result.schemaVersion).toBe('1.0');
      expect(result.classificationRuleIds.length).toBeGreaterThan(0);
    });

    it('maps accepted + sections to ars_candidate (metadata only)', () => {
      const svc = ClassificationService.createReady({
        now: () => '2026-07-26T12:00:00.000Z',
      });
      const result = svc.classify(
        baseInput({
          intakeState: 'accepted',
          sectionCount: 2,
          declaredFormat: 'fdd',
        }),
      );
      expect(result.knowledgeRole).toBe(KnowledgeRoles.ARS_CANDIDATE);
      expect(result.knowledgeRole).not.toBe('approved_requirements_source');
    });

    it('fails closed when disabled', () => {
      const svc = ClassificationService.createReady({
        config: { enabled: false },
      });
      expect(() => svc.classify(baseInput())).toThrow(ClassificationError);
      try {
        svc.classify(baseInput());
      } catch (e) {
        expect((e as ClassificationError).code).toBe(ClassificationErrorCodes.DISABLED);
      }
    });

    it('fails when not initialized', () => {
      const svc = new ClassificationService();
      expect(() => svc.classify(baseInput())).toThrow(ClassificationError);
    });

    it('invokes observability hook', () => {
      const seen: ClassificationResult[] = [];
      const svc = ClassificationService.createReady({
        now: () => '2026-07-26T12:00:00.000Z',
        obs: { onEvaluated: (r) => seen.push(r) },
      });
      svc.classify(baseInput());
      expect(seen).toHaveLength(1);
    });
  });

  describe('adapter / intake integration', () => {
    it('maps IntakeRecord without using payload body', () => {
      const input = toClassificationInput(sampleRecord());
      expect(JSON.stringify(input)).not.toContain('SECRET_BODY');
      expect(input.declaredFormat).toBe('user_story');
      expect(input.channel).toBe('api');
      expect(input.designationHint).toBe('enhancement request');
    });

    it('classifyIntakeRecord produces designation from notes hint', () => {
      const svc = ClassificationService.createReady({
        now: () => '2026-07-26T12:00:00.000Z',
      });
      const result = svc.classifyIntakeRecord(sampleRecord());
      expect(result.classification).toBe(ClassificationCategories.FUNCTIONAL);
      expect(result.designation).toBe(DesignationKeys.ENHANCEMENT);
      expect(result.knowledgeRole).toBe(KnowledgeRoles.SUPPORTING);
    });

    it('toEngineSummary uses section kinds only (no fragment text)', () => {
      const requirement: Requirement = {
        requirementId: 'req-1',
        sections: [
          {
            sectionId: 's1',
            kind: 'acceptance',
            fragments: [{ fragmentId: 'f1', text: 'BODY_TEXT_MUST_NOT_LEAK' }],
          },
        ],
        metadata: { attributes: {} },
        sourceReferences: [{ sourceId: 'src-1' }],
      };
      const summary = toEngineSummary(requirement);
      expect(summary.sectionCount).toBe(1);
      expect(summary.sectionKinds).toEqual(['acceptance']);
      expect(JSON.stringify(summary)).not.toContain('BODY_TEXT');
    });
  });
});
