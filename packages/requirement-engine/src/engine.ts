import { loadRequirementEngineConfig, type RequirementEngineConfig } from './config';
import { validateRequirement } from './model';
import {
  assembleRequirement,
  createNoOpNormalizePort,
  type EngineResult,
  type NormalizePort,
  type ParsePort,
  type RequirementPipelineInput,
} from './pipeline';
import { createStubParsePort } from './stub-parse-port';
import {
  RequirementEngineError,
  RequirementEngineErrorCodes,
  RequirementFormatKeys,
  type RequirementEngineLifecycleState,
  type RequirementFormatKey,
} from './types';

export interface RequirementEngineOptions {
  config?: RequirementEngineConfig;
  env?: NodeJS.ProcessEnv;
  normalizePort?: NormalizePort;
  /** Injected id factory for deterministic tests. */
  createRequirementId?: () => string;
}

/**
 * Requirement Intelligence Engine Foundation facade (WP-2.5).
 * Nest-free; no persistence; no real format parsers.
 */
export class RequirementEngine {
  private state: RequirementEngineLifecycleState = 'created';
  private config!: RequirementEngineConfig;
  private readonly parsers = new Map<string, ParsePort>();
  private normalizePort: NormalizePort;
  private readonly createRequirementId: () => string;

  constructor(private readonly options: RequirementEngineOptions = {}) {
    this.normalizePort = options.normalizePort ?? createNoOpNormalizePort();
    this.createRequirementId =
      options.createRequirementId ?? (() => `req-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`);
  }

  getLifecycleState(): RequirementEngineLifecycleState {
    return this.state;
  }

  getConfig(): RequirementEngineConfig {
    this.ensureNotShutdown();
    if (this.state === 'created') {
      throw new RequirementEngineError(
        'Engine not initialized',
        RequirementEngineErrorCodes.NOT_READY,
      );
    }
    return this.config;
  }

  /** Init: load/validate config; optionally register stub parser. */
  initialize(): void {
    this.ensureNotShutdown();
    if (this.state !== 'created' && this.state !== 'initialized') {
      if (this.state === 'ready') {
        return;
      }
    }
    this.config =
      this.options.config ?? loadRequirementEngineConfig({ env: this.options.env });
    this.state = 'initialized';
    if (!this.config.enabled) {
      return;
    }
    if (this.config.registerStubParser) {
      this.registerParsePort(createStubParsePort());
    }
  }

  /** Mark ready for invoke. */
  ready(): void {
    this.ensureNotShutdown();
    if (this.state === 'created') {
      this.initialize();
    }
    if (!this.config.enabled) {
      this.state = 'ready';
      return;
    }
    this.state = 'ready';
  }

  shutdown(): void {
    this.parsers.clear();
    this.state = 'shutdown';
  }

  registerParsePort(port: ParsePort): void {
    this.ensureNotShutdown();
    if (this.state === 'created') {
      throw new RequirementEngineError(
        'Initialize engine before registering ports',
        RequirementEngineErrorCodes.NOT_READY,
      );
    }
    this.parsers.set(String(port.format), port);
  }

  unregisterParsePort(format: RequirementFormatKey): boolean {
    this.ensureNotShutdown();
    return this.parsers.delete(String(format));
  }

  listRegisteredFormats(): string[] {
    return [...this.parsers.keys()].sort();
  }

  /**
   * Run foundation pipeline. Fail-closed when format has no registered parser.
   */
  async runFoundationPipeline(input: RequirementPipelineInput): Promise<EngineResult> {
    const base = {
      correlationId: input.correlationId,
      tenantId: input.tenantId,
      workspaceId: input.workspaceId,
    };

    try {
      this.ensureReady();
      if (!this.config.enabled) {
        return {
          status: 'failed',
          code: RequirementEngineErrorCodes.NOT_READY,
          message: 'Requirement engine is disabled',
          ...base,
        };
      }

      const format = String(input.format);
      const parser = this.parsers.get(format);
      if (!parser) {
        return {
          status: 'failed',
          code: RequirementEngineErrorCodes.PARSER_NOT_REGISTERED,
          message: `No parser registered for format '${format}' (fail-closed)`,
          ...base,
        };
      }

      const parsed = await parser.parse(input);
      const normalized = await this.normalizePort.normalize(parsed, input);
      const assembled = assembleRequirement(
        input,
        normalized,
        this.createRequirementId(),
      );
      const requirement = validateRequirement(assembled);

      return {
        status: 'completed',
        requirement,
        ...base,
      };
    } catch (err) {
      if (err instanceof RequirementEngineError) {
        return {
          status: 'failed',
          code: err.code,
          message: err.message,
          ...base,
        };
      }
      return {
        status: 'failed',
        code: RequirementEngineErrorCodes.PARSE_FAILED,
        message: err instanceof Error ? err.message : 'Pipeline failed',
        ...base,
      };
    }
  }

  /** Convenience: create, initialize, ready. */
  static createReady(options?: RequirementEngineOptions): RequirementEngine {
    const engine = new RequirementEngine(options);
    engine.initialize();
    engine.ready();
    return engine;
  }

  private ensureReady(): void {
    this.ensureNotShutdown();
    if (this.state !== 'ready') {
      throw new RequirementEngineError(
        `Engine not ready (state=${this.state})`,
        RequirementEngineErrorCodes.NOT_READY,
      );
    }
  }

  private ensureNotShutdown(): void {
    if (this.state === 'shutdown') {
      throw new RequirementEngineError(
        'Engine is shut down',
        RequirementEngineErrorCodes.SHUTDOWN,
      );
    }
  }
}

export { RequirementFormatKeys };
