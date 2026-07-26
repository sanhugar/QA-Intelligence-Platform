import { AiRuntimeError, type EngineManifest } from './types';

export const PLATFORM_NOOP_ENGINE_ID = 'platform-noop';
export const PLATFORM_NOOP_ENGINE_VERSION = '0.0.0';

export function createPlatformNoopManifest(): EngineManifest {
  return {
    engineId: PLATFORM_NOOP_ENGINE_ID,
    engineVersion: PLATFORM_NOOP_ENGINE_VERSION,
    platformStub: true,
    enabled: true,
  };
}

export function validateEngineManifest(manifest: EngineManifest): void {
  if (!manifest?.engineId?.trim()) {
    throw new AiRuntimeError('engineId is required', 'MANIFEST_INVALID');
  }
  if (!manifest.engineVersion?.trim()) {
    throw new AiRuntimeError('engineVersion is required', 'MANIFEST_INVALID');
  }
  if (typeof manifest.platformStub !== 'boolean') {
    throw new AiRuntimeError('platformStub must be a boolean', 'MANIFEST_INVALID');
  }
  if (typeof manifest.enabled !== 'boolean') {
    throw new AiRuntimeError('enabled must be a boolean', 'MANIFEST_INVALID');
  }
  if (manifest.engineId === PLATFORM_NOOP_ENGINE_ID && !manifest.platformStub) {
    throw new AiRuntimeError(
      'platform-noop must set platformStub: true',
      'MANIFEST_INVALID',
    );
  }
}
