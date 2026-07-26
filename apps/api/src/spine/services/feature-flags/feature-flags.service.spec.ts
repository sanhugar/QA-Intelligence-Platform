import { FeatureFlagsService } from './feature-flags.service';
import { SharedServiceError } from '../types';

describe('FeatureFlagsService', () => {
  it('reads flags', () => {
    const service = new FeatureFlagsService();
    service.initialize({ demo: true });
    expect(service.isEnabled('demo')).toBe(true);
    expect(service.isEnabled('missing')).toBe(false);
  });

  it('fails when not initialized', () => {
    expect(() => new FeatureFlagsService().isEnabled('x')).toThrow(SharedServiceError);
  });
});
