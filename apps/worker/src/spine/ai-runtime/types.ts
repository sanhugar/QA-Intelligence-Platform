/**
 * WP-1.4 AI Runtime Host types.
 * Execution context is limited to approved fields only (no user/tenant/auth).
 */

export type EngineInvocationStatus = 'completed' | 'failed';

export interface EngineManifest {
  engineId: string;
  engineVersion: string;
  /** Platform stub engines are not Brain catalog engines. */
  platformStub: boolean;
  enabled: boolean;
}

/** Approved execution context fields only (D7). */
export interface EngineExecutionContext {
  reasoningRunId: string;
  correlationId: string;
  engineId: string;
}

/** Invocation envelope for test-harness use (D5). */
export interface EngineInvocationEnvelope {
  reasoningRunId: string;
  correlationId: string;
  engineId: string;
}

export interface EngineInvocationResult {
  status: EngineInvocationStatus;
  engineId: string;
  engineVersion: string;
  reasoningRunId: string;
  correlationId: string;
  message?: string;
}

export class AiRuntimeError extends Error {
  constructor(
    message: string,
    readonly code: string,
  ) {
    super(message);
    this.name = 'AiRuntimeError';
  }
}
