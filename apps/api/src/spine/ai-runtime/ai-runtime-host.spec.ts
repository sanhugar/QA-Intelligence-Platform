import { ExtensionCatalog } from '../registration/extension-catalog';
import { AiRuntimeHost } from './ai-runtime-host';
import { AiRuntimeError } from './types';

describe('AiRuntimeHost', () => {
  it('registers platform-noop into the ai-engine catalog without invoking', () => {
    const catalog = new ExtensionCatalog();
    const host = new AiRuntimeHost();
    host.initialize(catalog);
    const manifest = host.registerPlatformNoop();

    expect(manifest.engineId).toBe('platform-noop');
    expect(manifest.platformStub).toBe(true);
    expect(catalog.count('ai-engine')).toBe(1);
    expect(catalog.list('ai-engine')[0]?.extensionId).toBe('platform-noop');
  });

  it('invokes stub via test harness envelope', () => {
    const host = new AiRuntimeHost();
    host.initialize(new ExtensionCatalog());
    host.registerPlatformNoop();

    const result = host.invoke({
      reasoningRunId: 'run-1',
      correlationId: 'corr-1',
      engineId: 'platform-noop',
    });
    expect(result.status).toBe('completed');
  });

  it('fails closed for unknown engine', () => {
    const host = new AiRuntimeHost();
    host.initialize(new ExtensionCatalog());
    host.registerPlatformNoop();
    expect(() =>
      host.invoke({
        reasoningRunId: 'run-1',
        correlationId: 'corr-1',
        engineId: 'brain-requirement-understanding',
      }),
    ).toThrow(AiRuntimeError);
  });

  it('rejects duplicate registration', () => {
    const host = new AiRuntimeHost();
    host.initialize(new ExtensionCatalog());
    host.registerPlatformNoop();
    expect(() => host.registerPlatformNoop()).toThrow(AiRuntimeError);
  });

  it('rejects incomplete envelope', () => {
    const host = new AiRuntimeHost();
    host.initialize(new ExtensionCatalog());
    host.registerPlatformNoop();
    expect(() =>
      host.invoke({
        reasoningRunId: 'run-1',
        correlationId: '',
        engineId: 'platform-noop',
      }),
    ).toThrow(AiRuntimeError);
  });
});
