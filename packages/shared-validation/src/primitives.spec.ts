import { hostBootConfigSchema, positivePortSchema } from './index';

describe('@ati/shared-validation', () => {
  it('accepts a positive port', () => {
    expect(positivePortSchema.parse('3000')).toBe(3000);
    expect(() => positivePortSchema.parse(0)).toThrow();
  });

  it('validates host boot config shape', () => {
    const parsed = hostBootConfigSchema.parse({
      host: 'api',
      platformVersion: '0.0.0',
      nodeEnv: 'test',
      logLevel: 'info',
      port: 3000,
      featureFlags: { a: true },
    });
    expect(parsed.host).toBe('api');
  });
});
