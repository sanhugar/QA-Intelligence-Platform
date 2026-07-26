import { AppError } from '@ati/errors';
import { loadHostBootConfig, parseFeatureFlags } from './index';

describe('@ati/config', () => {
  it('loads api host boot config', () => {
    const config = loadHostBootConfig({
      host: 'api',
      env: {
        ATI_API_PORT: '3000',
        ATI_NODE_ENV: 'test',
        ATI_LOG_LEVEL: 'info',
        ATI_FEATURE_FLAGS: 'a=true,b=false',
      },
    });
    expect(config.port).toBe(3000);
    expect(config.featureFlags).toEqual({ a: true, b: false });
  });

  it('fails on invalid port', () => {
    expect(() =>
      loadHostBootConfig({
        host: 'worker',
        env: { ATI_WORKER_PORT: '0', ATI_NODE_ENV: 'test', ATI_LOG_LEVEL: 'info' },
      }),
    ).toThrow(AppError);
  });

  it('parses feature flags', () => {
    expect(parseFeatureFlags(undefined)).toEqual({});
    expect(parseFeatureFlags('x=true')).toEqual({ x: true });
  });
});
