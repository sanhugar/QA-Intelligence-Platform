import { platformReadiness } from '../registration/platform-readiness';
import { PlatformHostBootstrap } from './platform-host-bootstrap';
import { SharedServiceError } from './types';

describe('PlatformHostBootstrap', () => {
  beforeEach(() => {
    platformReadiness.setReady(false);
  });

  it('reaches Platform READY with the mandatory boot sequence', async () => {
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
    expect(result.registry.getFeatureFlags().isEnabled('wp13')).toBe(true);
    expect(result.registry.getEventPublisher().list().length).toBeGreaterThan(0);
    expect(result.registry.getAuditSupport().list().length).toBeGreaterThan(0);
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
