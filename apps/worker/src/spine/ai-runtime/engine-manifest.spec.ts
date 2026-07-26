import {
  createPlatformNoopManifest,
  PLATFORM_NOOP_ENGINE_ID,
  validateEngineManifest,
} from './engine-manifest';
import { AiRuntimeError } from './types';

describe('engine-manifest', () => {
  it('creates platform-noop stub manifest', () => {
    const manifest = createPlatformNoopManifest();
    expect(manifest).toEqual({
      engineId: PLATFORM_NOOP_ENGINE_ID,
      engineVersion: '0.0.0',
      platformStub: true,
      enabled: true,
    });
    expect(() => validateEngineManifest(manifest)).not.toThrow();
  });

  it('rejects missing engineId', () => {
    expect(() =>
      validateEngineManifest({
        engineId: '',
        engineVersion: '0.0.0',
        platformStub: true,
        enabled: true,
      }),
    ).toThrow(AiRuntimeError);
  });

  it('rejects platform-noop without platformStub', () => {
    expect(() =>
      validateEngineManifest({
        engineId: PLATFORM_NOOP_ENGINE_ID,
        engineVersion: '0.0.0',
        platformStub: false,
        enabled: true,
      }),
    ).toThrow(AiRuntimeError);
  });
});
