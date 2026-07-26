import type { IntakeRecord } from '@ati/intake';
import { toClassificationInput, type EngineSummary } from './adapter';
import { loadClassificationConfig, type ClassificationConfig } from './config';
import {
  classificationInputSchema,
  type ClassificationInput,
  type ClassificationResult,
  validateClassificationResult,
} from './model';
import {
  createDefaultRulePack,
  evaluateAxis,
  type RulePack,
} from './rules';
import {
  CLASSIFICATION_SCHEMA_VERSION,
  ClassificationCategories,
  ClassificationError,
  ClassificationErrorCodes,
  DesignationKeys,
  KnowledgeRoles,
} from './types';

export interface ClassificationObservabilityHooks {
  onEvaluated?(result: ClassificationResult): void;
}

export interface ClassificationServiceOptions {
  config?: ClassificationConfig;
  env?: NodeJS.ProcessEnv;
  rulePack?: RulePack;
  obs?: ClassificationObservabilityHooks;
  now?: () => string;
}

/**
 * Deterministic Classification & Designation service (WP-3.2).
 * Sync evaluate API — no workflow orchestration.
 */
export class ClassificationService {
  private readonly rulePack: RulePack;
  private readonly obs: ClassificationObservabilityHooks;
  private readonly now: () => string;
  private config: ClassificationConfig;
  private ready = false;

  constructor(private readonly options: ClassificationServiceOptions = {}) {
    this.rulePack = options.rulePack ?? createDefaultRulePack();
    this.obs = options.obs ?? {};
    this.now = options.now ?? (() => new Date().toISOString());
    this.config = options.config ?? loadClassificationConfig({ env: options.env });
  }

  static createReady(options?: ClassificationServiceOptions): ClassificationService {
    const svc = new ClassificationService(options);
    svc.initialize();
    return svc;
  }

  initialize(): void {
    this.config =
      this.options.config ?? loadClassificationConfig({ env: this.options.env });
    this.ready = true;
  }

  getRulePack(): RulePack {
    return this.rulePack;
  }

  /**
   * Sync classify from allow-listed input.
   */
  classify(input: ClassificationInput): ClassificationResult {
    this.ensureReady();
    const parsed = classificationInputSchema.safeParse(input);
    if (!parsed.success) {
      throw new ClassificationError(
        parsed.error.issues.map((i) => i.message).join('; ') || 'Invalid classification input',
        ClassificationErrorCodes.INVALID_INPUT,
      );
    }
    return this.evaluate(parsed.data);
  }

  /**
   * Classify from terminal IntakeRecord (+ optional engine summary).
   * Does not mutate intake or own lifecycle.
   */
  classifyIntakeRecord(
    record: IntakeRecord,
    engineSummary?: EngineSummary,
  ): ClassificationResult {
    return this.classify(toClassificationInput(record, engineSummary));
  }

  private evaluate(input: ClassificationInput): ClassificationResult {
    const classification = evaluateAxis(
      this.rulePack.rules,
      'classification',
      input,
      ClassificationCategories.UNKNOWN,
    );
    const designation = evaluateAxis(
      this.rulePack.rules,
      'designation',
      input,
      DesignationKeys.UNKNOWN,
    );
    const knowledgeRole = evaluateAxis(
      this.rulePack.rules,
      'knowledgeRole',
      input,
      KnowledgeRoles.UNKNOWN,
    );

    const result = validateClassificationResult({
      schemaVersion: CLASSIFICATION_SCHEMA_VERSION,
      classification: classification.value,
      designation: designation.value,
      knowledgeRole: knowledgeRole.value,
      classificationConfidence: classification.confidence,
      designationConfidence: designation.confidence,
      knowledgeRoleConfidence: knowledgeRole.confidence,
      classificationRuleIds: classification.ruleIds,
      designationRuleIds: designation.ruleIds,
      knowledgeRoleRuleIds: knowledgeRole.ruleIds,
      intakeId: input.intakeId,
      correlationId: input.correlationId,
      tenantId: input.tenantId,
      workspaceId: input.workspaceId,
      evaluatedAt: this.now(),
    });

    this.obs.onEvaluated?.(result);
    return result;
  }

  private ensureReady(): void {
    if (!this.ready) {
      throw new ClassificationError(
        'Classification service not initialized',
        ClassificationErrorCodes.NOT_READY,
      );
    }
    if (!this.config.enabled) {
      throw new ClassificationError(
        'Classification service is disabled',
        ClassificationErrorCodes.DISABLED,
      );
    }
  }
}
