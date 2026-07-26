import { DiagnosticsService } from './diagnostics.service';
import { SharedServiceError } from '../types';

describe('DiagnosticsService', () => {
  it('returns a non-secret snapshot', () => {
    const service = new DiagnosticsService();
    service.initialize(
      {
        host: 'api',
        platformVersion: '0.0.0',
        nodeEnv: 'test',
        logLevel: 'info',
        port: 3000,
        featureFlags: {},
      },
      17,
    );
    expect(service.snapshot().registeredModuleCount).toBe(17);
  });

  it('fails when not initialized', () => {
    expect(() => new DiagnosticsService().snapshot()).toThrow(SharedServiceError);
  });
});
