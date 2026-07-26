import { ConfigurationService } from './configuration.service';
import { SharedServiceError } from '../types';

describe('ConfigurationService', () => {
  it('loads valid worker host configuration', () => {
    const service = new ConfigurationService({
      host: 'worker',
      env: {
        ATI_WORKER_PORT: '3001',
        ATI_NODE_ENV: 'test',
        ATI_LOG_LEVEL: 'info',
        ATI_FEATURE_FLAGS: 'alpha=true,beta=false',
      },
    });
    const config = service.initialize();
    expect(config.port).toBe(3001);
    expect(config.featureFlags).toEqual({ alpha: true, beta: false });
  });

  it('fails on invalid port', () => {
    const service = new ConfigurationService({
      host: 'worker',
      env: { ATI_WORKER_PORT: '0', ATI_NODE_ENV: 'test', ATI_LOG_LEVEL: 'info' },
    });
    expect(() => service.initialize()).toThrow(SharedServiceError);
  });
});
