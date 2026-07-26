import { AiRuntimeHost } from '../ai-runtime/ai-runtime-host';
import { platformReadiness } from '../registration/platform-readiness';
import { PlatformHostBootstrap } from './platform-host-bootstrap';
import { SharedServiceError } from './types';

describe('PlatformHostBootstrap', () => {
  beforeEach(() => {
    platformReadiness.setReady(false);
  });

  it('reaches Platform READY after AI Runtime Host registration', async () => {
    const bootstrap = new PlatformHostBootstrap();
    const result = await bootstrap.start({
      host: 'worker',
      env: {
        ATI_WORKER_PORT: '3001',
        ATI_NODE_ENV: 'test',
        ATI_LOG_LEVEL: 'error',
        ATI_PLATFORM_VERSION: '0.0.0',
        ATI_FEATURE_FLAGS: 'wp13=true',
      },
    });

    expect(platformReadiness.isReady()).toBe(true);
    expect(result.port).toBe(3001);
    expect(result.registry.isSealed()).toBe(true);
    expect(result.aiRuntimeHost.isInitialized()).toBe(true);
    expect(result.aiRuntimeHost.getManifest('platform-noop')?.platformStub).toBe(true);
    expect(result.aiRuntimeHost.listManifests()).toHaveLength(1);
  });

  it('does not invoke engines during boot', async () => {
    const bootstrap = new PlatformHostBootstrap();
    const invokeSpy = jest.spyOn(AiRuntimeHost.prototype, 'invoke');
    await bootstrap.start({
      host: 'worker',
      env: {
        ATI_WORKER_PORT: '3001',
        ATI_NODE_ENV: 'test',
        ATI_LOG_LEVEL: 'error',
      },
    });
    expect(invokeSpy).not.toHaveBeenCalled();
    invokeSpy.mockRestore();
  });

  it('supports test-harness invocation after boot', async () => {
    const bootstrap = new PlatformHostBootstrap();
    const result = await bootstrap.start({
      host: 'worker',
      env: {
        ATI_WORKER_PORT: '3001',
        ATI_NODE_ENV: 'test',
        ATI_LOG_LEVEL: 'error',
      },
    });
    const invocation = result.aiRuntimeHost.invoke({
      reasoningRunId: 'run-boot-test',
      correlationId: 'corr-boot-test',
      engineId: 'platform-noop',
    });
    expect(invocation.status).toBe('completed');
  });

  it('fails closed when configuration is invalid', async () => {
    const bootstrap = new PlatformHostBootstrap();
    await expect(
      bootstrap.start({
        host: 'worker',
        env: {
          ATI_WORKER_PORT: '-1',
          ATI_NODE_ENV: 'test',
          ATI_LOG_LEVEL: 'info',
        },
      }),
    ).rejects.toBeInstanceOf(SharedServiceError);
    expect(platformReadiness.isReady()).toBe(false);
  });
});

