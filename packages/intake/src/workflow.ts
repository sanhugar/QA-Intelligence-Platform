import { RequirementEngine } from '@ati/requirement-engine';
import { loadIntakeConfig, type IntakeConfig } from './config';
import {
  buildIdempotencyKey,
  type IntakeRecord,
  type IntakeRequest,
} from './model';
import { invokeRequirementEngine, mapEngineResultToIntake } from './orchestration';
import { IntakeRegistry } from './registry';
import {
  IntakeError,
  IntakeErrorCodes,
  IntakeStates,
} from './types';
import { validateIntakeRequest } from './validation';

export interface IntakeObservabilityHooks {
  onState?(intakeId: string, state: string, correlationId: string): void;
  onTerminal?(record: IntakeRecord): void;
}

export interface IntakeWorkflowOptions {
  engine?: RequirementEngine;
  config?: IntakeConfig;
  env?: NodeJS.ProcessEnv;
  registry?: IntakeRegistry;
  obs?: IntakeObservabilityHooks;
  createIntakeId?: () => string;
  createCorrelationId?: () => string;
  /** When true, reject submits missing tenantId (auth-enforced host surfaces). */
  requireTenant?: boolean;
}

/**
 * Synchronous Intake Entry Workflow (WP-3.1).
 * Thin orchestration over `@ati/requirement-engine`. In-memory only.
 */
export class IntakeWorkflow {
  private readonly engine: RequirementEngine;
  private readonly registry: IntakeRegistry;
  private readonly obs: IntakeObservabilityHooks;
  private readonly createIntakeId: () => string;
  private readonly createCorrelationId: () => string;
  private readonly requireTenant: boolean;
  private config: IntakeConfig;
  private ready = false;

  constructor(private readonly options: IntakeWorkflowOptions = {}) {
    this.engine =
      options.engine ??
      RequirementEngine.createReady({
        config: { enabled: true, registerStubParser: false },
      });
    this.registry = options.registry ?? new IntakeRegistry();
    this.obs = options.obs ?? {};
    this.createIntakeId =
      options.createIntakeId ??
      (() => `intake-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`);
    this.createCorrelationId =
      options.createCorrelationId ??
      (() => `corr-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`);
    this.requireTenant = options.requireTenant ?? false;
    this.config = options.config ?? loadIntakeConfig({ env: options.env });
  }

  static createReady(options?: IntakeWorkflowOptions): IntakeWorkflow {
    const wf = new IntakeWorkflow(options);
    wf.initialize();
    return wf;
  }

  initialize(): void {
    this.config = this.options.config ?? loadIntakeConfig({ env: this.options.env });
    this.ready = true;
  }

  getRegistry(): IntakeRegistry {
    return this.registry;
  }

  getEngine(): RequirementEngine {
    return this.engine;
  }

  /**
   * Run full sync lifecycle: received → validated → accepted | accepted_pending_parser | failed.
   */
  async submit(input: unknown): Promise<IntakeRecord> {
    if (!this.ready) {
      throw new IntakeError('Intake workflow not initialized', IntakeErrorCodes.NOT_READY);
    }
    if (!this.config.enabled) {
      throw new IntakeError('Intake workflow is disabled', IntakeErrorCodes.DISABLED);
    }

    const validation = validateIntakeRequest(input);
    if (!validation.ok) {
      // Still allocate a failed record for audit when structure is partially usable
      return this.failEarly(input, validation.reason, validation.message);
    }

    let request = validation.request;
    if (!request.correlationId) {
      request = { ...request, correlationId: this.createCorrelationId() };
    }

    if (this.requireTenant && !request.tenantId) {
      return this.terminalFailedFromRequest(
        request,
        IntakeErrorCodes.AUTH_FAILED,
        'tenantId required when auth-enforced intake surface is enabled',
      );
    }

    const idempotencyKey = buildIdempotencyKey({
      tenantId: request.tenantId,
      workspaceId: request.workspaceId,
      sourceIdentity: request.source.sourceIdentity,
      sourceVersion: request.source.sourceVersion,
      checksum: request.source.checksum,
    });

    const prior = this.registry.findTerminalByIdempotency(idempotencyKey);
    if (prior) {
      return prior;
    }

    const intakeId = this.createIntakeId();
    const receivedAt = new Date().toISOString();

    let record: IntakeRecord = {
      intakeId,
      state: IntakeStates.RECEIVED,
      idempotencyKey,
      request,
      audit: {
        actorSubject: request.metadata.actorSubject,
        receivedAt,
        sourceIdentity: request.source.sourceIdentity,
        sourceVersion: request.source.sourceVersion,
        checksum: request.source.checksum,
        declaredFormat: request.source.declaredFormat,
        correlationId: request.correlationId!,
        tenantId: request.tenantId,
        workspaceId: request.workspaceId,
      },
    };
    this.registry.put(record);
    this.obs.onState?.(intakeId, record.state, record.audit.correlationId);

    record = { ...record, state: IntakeStates.VALIDATED };
    this.registry.put(record);
    this.obs.onState?.(intakeId, record.state, record.audit.correlationId);

    try {
      const engineResult = await invokeRequirementEngine(this.engine, request);
      const mapped = mapEngineResultToIntake(engineResult);
      const terminalAt = new Date().toISOString();

      if (mapped.terminalState === IntakeStates.ACCEPTED) {
        record = {
          ...record,
          state: IntakeStates.ACCEPTED,
          requirementId: mapped.requirementId,
          engineStatus: engineResult.status,
          audit: { ...record.audit, terminalAt },
        };
      } else if (mapped.terminalState === IntakeStates.ACCEPTED_PENDING_PARSER) {
        record = {
          ...record,
          state: IntakeStates.ACCEPTED_PENDING_PARSER,
          engineStatus: engineResult.status,
          engineCode: engineResult.status === 'failed' ? engineResult.code : undefined,
          engineMessage: engineResult.status === 'failed' ? engineResult.message : undefined,
          audit: { ...record.audit, terminalAt },
        };
      } else {
        record = {
          ...record,
          state: IntakeStates.FAILED,
          failureReason: mapped.reason,
          failureMessage: mapped.message,
          engineStatus: engineResult.status,
          engineCode: engineResult.status === 'failed' ? engineResult.code : undefined,
          engineMessage: engineResult.status === 'failed' ? engineResult.message : undefined,
          audit: { ...record.audit, terminalAt },
        };
      }

      this.registry.put(record);
      this.obs.onState?.(intakeId, record.state, record.audit.correlationId);
      this.obs.onTerminal?.(record);
      return record;
    } catch (err) {
      const terminalAt = new Date().toISOString();
      record = {
        ...record,
        state: IntakeStates.FAILED,
        failureReason: IntakeErrorCodes.ORCHESTRATION_ERROR,
        failureMessage: err instanceof Error ? err.message : 'Engine orchestration failed',
        audit: { ...record.audit, terminalAt },
      };
      this.registry.put(record);
      this.obs.onState?.(intakeId, record.state, record.audit.correlationId);
      this.obs.onTerminal?.(record);
      return record;
    }
  }

  private failEarly(input: unknown, reason: string, message: string): IntakeRecord {
    const correlationId = this.createCorrelationId();
    const intakeId = this.createIntakeId();
    const receivedAt = new Date().toISOString();
    const terminalAt = receivedAt;

    // Best-effort extract for audit without content inspection
    const raw = input && typeof input === 'object' ? (input as Record<string, unknown>) : {};
    const source =
      raw.source && typeof raw.source === 'object'
        ? (raw.source as Record<string, unknown>)
        : {};

    const record: IntakeRecord = {
      intakeId,
      state: IntakeStates.FAILED,
      idempotencyKey: buildIdempotencyKey({
        tenantId: typeof raw.tenantId === 'string' ? raw.tenantId : undefined,
        workspaceId: typeof raw.workspaceId === 'string' ? raw.workspaceId : undefined,
        sourceIdentity: typeof source.sourceIdentity === 'string' ? source.sourceIdentity : '',
        sourceVersion: typeof source.sourceVersion === 'string' ? source.sourceVersion : '',
        checksum: typeof source.checksum === 'string' ? source.checksum : '',
      }),
      request: {
        source: {
          sourceIdentity: typeof source.sourceIdentity === 'string' ? source.sourceIdentity : '',
          sourceVersion: typeof source.sourceVersion === 'string' ? source.sourceVersion : '',
          checksum: typeof source.checksum === 'string' ? source.checksum : '',
          declaredFormat: typeof source.declaredFormat === 'string' ? source.declaredFormat : '',
        },
        metadata: {},
        payload: typeof raw.payload === 'string' ? raw.payload : '',
        correlationId,
        tenantId: typeof raw.tenantId === 'string' ? raw.tenantId : undefined,
        workspaceId: typeof raw.workspaceId === 'string' ? raw.workspaceId : undefined,
      },
      audit: {
        receivedAt,
        terminalAt,
        sourceIdentity: typeof source.sourceIdentity === 'string' ? source.sourceIdentity : '',
        sourceVersion: typeof source.sourceVersion === 'string' ? source.sourceVersion : '',
        checksum: typeof source.checksum === 'string' ? source.checksum : '',
        declaredFormat: typeof source.declaredFormat === 'string' ? source.declaredFormat : '',
        correlationId,
        tenantId: typeof raw.tenantId === 'string' ? raw.tenantId : undefined,
        workspaceId: typeof raw.workspaceId === 'string' ? raw.workspaceId : undefined,
      },
      failureReason: reason,
      failureMessage: message,
    };

    this.registry.put(record);
    this.obs.onState?.(intakeId, record.state, correlationId);
    this.obs.onTerminal?.(record);
    return record;
  }

  private terminalFailedFromRequest(
    request: IntakeRequest,
    reason: string,
    message: string,
  ): IntakeRecord {
    const intakeId = this.createIntakeId();
    const receivedAt = new Date().toISOString();
    const idempotencyKey = buildIdempotencyKey({
      tenantId: request.tenantId,
      workspaceId: request.workspaceId,
      sourceIdentity: request.source.sourceIdentity,
      sourceVersion: request.source.sourceVersion,
      checksum: request.source.checksum,
    });
    const record: IntakeRecord = {
      intakeId,
      state: IntakeStates.FAILED,
      idempotencyKey,
      request,
      audit: {
        actorSubject: request.metadata.actorSubject,
        receivedAt,
        terminalAt: receivedAt,
        sourceIdentity: request.source.sourceIdentity,
        sourceVersion: request.source.sourceVersion,
        checksum: request.source.checksum,
        declaredFormat: request.source.declaredFormat,
        correlationId: request.correlationId!,
        tenantId: request.tenantId,
        workspaceId: request.workspaceId,
      },
      failureReason: reason,
      failureMessage: message,
    };
    this.registry.put(record);
    this.obs.onTerminal?.(record);
    return record;
  }
}
