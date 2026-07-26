/**
 * WP-1.4 AI Runtime Host types.
 * Execution context is limited to approved fields only (no user/tenant/auth).
 */

import { AppError } from '@ati/errors';

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

/** Host-specific AI Runtime error wrapping @ati/errors AppError. */
export class AiRuntimeError extends AppError {
  constructor(message: string, code: string) {
    super(message, code);
    this.name = 'AiRuntimeError';
  }
}
