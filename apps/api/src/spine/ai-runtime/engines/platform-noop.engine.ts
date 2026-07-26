import {
  AiRuntimeError,
  type EngineInvocationEnvelope,
  type EngineInvocationResult,
  type EngineManifest,
} from '../types';
import { PLATFORM_NOOP_ENGINE_ID, PLATFORM_NOOP_ENGINE_VERSION } from '../engine-manifest';

/**
 * Platform no-op stub engine (WP-1.4).
 * Minimal lifecycle: validate envelope → completed.
 * Not a Brain engine. No HITL, evidence, providers, or orchestration.
 */
export class PlatformNoopEngine {
  readonly manifest: EngineManifest = {
    engineId: PLATFORM_NOOP_ENGINE_ID,
    engineVersion: PLATFORM_NOOP_ENGINE_VERSION,
    platformStub: true,
    enabled: true,
  };

  invoke(envelope: EngineInvocationEnvelope): EngineInvocationResult {
    validateEnvelope(envelope);
    if (envelope.engineId !== PLATFORM_NOOP_ENGINE_ID) {
      throw new AiRuntimeError(
        `PlatformNoopEngine cannot run engineId=${envelope.engineId}`,
        'ENGINE_MISMATCH',
      );
    }
    return {
      status: 'completed',
      engineId: PLATFORM_NOOP_ENGINE_ID,
      engineVersion: PLATFORM_NOOP_ENGINE_VERSION,
      reasoningRunId: envelope.reasoningRunId,
      correlationId: envelope.correlationId,
      message: 'platform-noop completed',
    };
  }
}

function validateEnvelope(envelope: EngineInvocationEnvelope): void {
  if (!envelope?.reasoningRunId?.trim()) {
    throw new AiRuntimeError('reasoningRunId is required', 'ENVELOPE_INVALID');
  }
  if (!envelope.correlationId?.trim()) {
    throw new AiRuntimeError('correlationId is required', 'ENVELOPE_INVALID');
  }
  if (!envelope.engineId?.trim()) {
    throw new AiRuntimeError('engineId is required', 'ENVELOPE_INVALID');
  }
}
