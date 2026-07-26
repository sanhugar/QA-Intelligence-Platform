import type { ClassificationResult } from '@ati/classification';
import type { IntakeRecord } from '@ati/intake';
import {
  buildClassificationResultRef,
  toFeatureVersionInput,
  type EngineSummary,
} from './adapter';
import { loadFeatureVersionConfig, type FeatureVersionConfig } from './config';
import { deriveIdentities } from './derive';
import {
  featureVersionInputSchema,
  type FeatureVersionInput,
  type FeatureVersionResult,
  validateFeatureVersionResult,
} from './model';
import { FeatureVersionRegistry } from './registry';
import {
  FEATURE_VERSION_SCHEMA_VERSION,
  FeatureVersionError,
  FeatureVersionErrorCodes,
  FeatureVersionStatuses,
} from './types';

export interface FeatureVersionObservabilityHooks {
  onResolved?(result: FeatureVersionResult): void;
}

export interface FeatureVersionServiceOptions {
  config?: FeatureVersionConfig;
  env?: NodeJS.ProcessEnv;
  obs?: FeatureVersionObservabilityHooks;
  now?: () => string;
  /** Optional process-local registry for predecessor lookup / tests (D6). */
  registry?: FeatureVersionRegistry;
  rememberResults?: boolean;
}

/**
 * Deterministic Feature Version & Lineage service (WP-3.3).
 * Sync resolve API — no workflow orchestration.
 */
export class FeatureVersionService {
  private readonly obs: FeatureVersionObservabilityHooks;
  private readonly now: () => string;
  private readonly registry: FeatureVersionRegistry;
  private readonly rememberResults: boolean;
  private config: FeatureVersionConfig;
  private ready = false;

  constructor(private readonly options: FeatureVersionServiceOptions = {}) {
    this.obs = options.obs ?? {};
    this.now = options.now ?? (() => new Date().toISOString());
    this.registry = options.registry ?? new FeatureVersionRegistry();
    this.rememberResults = options.rememberResults ?? false;
    this.config = options.config ?? loadFeatureVersionConfig({ env: options.env });
  }

  static createReady(options?: FeatureVersionServiceOptions): FeatureVersionService {
    const svc = new FeatureVersionService(options);
    svc.initialize();
    return svc;
  }

  initialize(): void {
    this.config =
      this.options.config ?? loadFeatureVersionConfig({ env: this.options.env });
    this.ready = true;
  }

  getRegistry(): FeatureVersionRegistry {
    return this.registry;
  }

  /**
   * Sync resolve from allow-listed input.
   */
  resolveFeatureVersion(input: FeatureVersionInput): FeatureVersionResult {
    this.ensureReady();
    const parsed = featureVersionInputSchema.safeParse(input);
    if (!parsed.success) {
      throw new FeatureVersionError(
        parsed.error.issues.map((i) => i.message).join('; ') || 'Invalid feature version input',
        FeatureVersionErrorCodes.INVALID_INPUT,
      );
    }
    return this.evaluate(parsed.data);
  }

  /**
   * Resolve from terminal IntakeRecord + ClassificationResult (+ optional engine summary).
   * Does not mutate intake or classification; does not recreate classification axes.
   */
  resolveFromIntake(
    record: IntakeRecord,
    classification: ClassificationResult,
    engineSummary?: EngineSummary,
  ): FeatureVersionResult {
    const input = toFeatureVersionInput(record, classification, engineSummary);
    const result = this.resolveFeatureVersion(input);
    // Ensure classificationResultRef when ClassificationResult supplied (product path).
    if (!result.classificationResultRef) {
      return validateFeatureVersionResult({
        ...result,
        classificationResultRef: buildClassificationResultRef(classification),
        knowledgeRole: classification.knowledgeRole,
      });
    }
    return result;
  }

  private evaluate(input: FeatureVersionInput): FeatureVersionResult {
    const derived = deriveIdentities(input);
    const ruleIds = [...derived.derivationRuleIds];

    let predecessorVersion = input.predecessorVersionHint?.trim() || undefined;
    let parentFeatureId = input.parentFeatureIdHint?.trim() || undefined;
    let status = derived.status;

    if (!predecessorVersion) {
      const prior = this.registry.latestForFeature(derived.featureId);
      if (prior && prior.versionIdentifier !== derived.versionIdentifier) {
        predecessorVersion = prior.versionIdentifier;
        ruleIds.push('lineage-predecessor-from-registry-v1');
      }
    } else {
      ruleIds.push('lineage-predecessor-from-hint-v1');
    }

    if (parentFeatureId) {
      ruleIds.push('lineage-parent-from-hint-v1');
    }

    if (predecessorVersion && status === FeatureVersionStatuses.ACTIVE) {
      // New version is active; emit-only — do not rewrite prior registry entries.
      status = FeatureVersionStatuses.ACTIVE;
    }

    const classificationResultRef =
      input.classificationEvaluatedAt != null
        ? `${input.intakeId}@${input.classificationEvaluatedAt}`
        : undefined;

    const result = validateFeatureVersionResult({
      schemaVersion: FEATURE_VERSION_SCHEMA_VERSION,
      featureId: derived.featureId,
      versionIdentifier: derived.versionIdentifier,
      lineageIdentifier: derived.lineageIdentifier,
      status,
      confidence: derived.confidence,
      derivationRuleIds: ruleIds,
      intakeId: input.intakeId,
      correlationId: input.correlationId,
      evaluatedAt: this.now(),
      featureName: derived.featureName,
      parentFeatureId,
      predecessorVersion,
      // successorVersion normally unset at creation (D6)
      tenantId: input.tenantId,
      workspaceId: input.workspaceId,
      classificationResultRef,
      knowledgeRole: input.knowledgeRole,
    });

    if (this.rememberResults) {
      this.registry.remember(result);
    }

    this.obs.onResolved?.(result);
    return result;
  }

  private ensureReady(): void {
    if (!this.ready) {
      throw new FeatureVersionError(
        'Feature version service not initialized',
        FeatureVersionErrorCodes.NOT_READY,
      );
    }
    if (!this.config.enabled) {
      throw new FeatureVersionError(
        'Feature version service is disabled',
        FeatureVersionErrorCodes.DISABLED,
      );
    }
  }
}
