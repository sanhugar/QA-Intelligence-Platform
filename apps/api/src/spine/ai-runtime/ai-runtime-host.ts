import type { ExtensionCatalog } from '../registration/extension-catalog';
import {
  createPlatformNoopManifest,
  PLATFORM_NOOP_ENGINE_ID,
  validateEngineManifest,
} from './engine-manifest';
import { PlatformNoopEngine } from './engines/platform-noop.engine';
import {
  AiRuntimeError,
  type EngineInvocationEnvelope,
  type EngineInvocationResult,
  type EngineManifest,
} from './types';

/**
 * Platform AI Runtime Host shell (WP-1.4).
 * Registers manifests and supports test-harness invocation only.
 * No boot-time invoke. No REST. No providers. No Orchestration.
 */
export class AiRuntimeHost {
  private initialized = false;
  private extensions?: ExtensionCatalog;
  private readonly manifests = new Map<string, EngineManifest>();
  private readonly noop = new PlatformNoopEngine();

  initialize(extensions: ExtensionCatalog): void {
    if (!extensions) {
      throw new AiRuntimeError('Extension catalog is required', 'AI_RUNTIME_INVALID');
    }
    this.extensions = extensions;
    this.initialized = true;
  }

  isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Registers the platform-noop stub and records it in the ai-engine catalog.
   * Does not invoke the engine.
   */
  registerPlatformNoop(): EngineManifest {
    this.ensureInitialized();
    const manifest = createPlatformNoopManifest();
    this.registerManifest(manifest);
    return manifest;
  }

  registerManifest(manifest: EngineManifest): void {
    this.ensureInitialized();
    validateEngineManifest(manifest);
    if (this.manifests.has(manifest.engineId)) {
      throw new AiRuntimeError(
        `Duplicate engineId: ${manifest.engineId}`,
        'MANIFEST_DUPLICATE',
      );
    }
    this.extensions!.register({
      extensionId: manifest.engineId,
      kind: 'ai-engine',
      version: manifest.engineVersion,
      enabled: manifest.enabled,
    });
    this.manifests.set(manifest.engineId, { ...manifest });
  }

  listManifests(): readonly EngineManifest[] {
    this.ensureInitialized();
    return [...this.manifests.values()];
  }

  getManifest(engineId: string): EngineManifest | undefined {
    this.ensureInitialized();
    return this.manifests.get(engineId);
  }

  /**
   * Test-harness invocation only (D5). Not called during boot.
   */
  invoke(envelope: EngineInvocationEnvelope): EngineInvocationResult {
    this.ensureInitialized();
    validateInvocationEnvelope(envelope);

    const manifest = this.manifests.get(envelope.engineId);
    if (!manifest) {
      throw new AiRuntimeError(`Unknown engineId: ${envelope.engineId}`, 'ENGINE_UNKNOWN');
    }
    if (!manifest.enabled) {
      throw new AiRuntimeError(`Engine disabled: ${envelope.engineId}`, 'ENGINE_DISABLED');
    }

    if (envelope.engineId === PLATFORM_NOOP_ENGINE_ID) {
      return this.noop.invoke(envelope);
    }

    throw new AiRuntimeError(
      `No executable host binding for engineId: ${envelope.engineId}`,
      'ENGINE_NOT_EXECUTABLE',
    );
  }

  private ensureInitialized(): void {
    if (!this.initialized || !this.extensions) {
      throw new AiRuntimeError('AI Runtime Host not initialized', 'AI_RUNTIME_NOT_INITIALIZED');
    }
  }
}

function validateInvocationEnvelope(envelope: EngineInvocationEnvelope): void {
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
