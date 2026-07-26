import { DefaultPorts, EnvKeys } from './index';

describe('@ati/shared-constants', () => {
  it('exposes ATI env keys', () => {
    expect(EnvKeys.API_PORT).toBe('ATI_API_PORT');
    expect(DefaultPorts.api).toBe(3000);
  });
});
