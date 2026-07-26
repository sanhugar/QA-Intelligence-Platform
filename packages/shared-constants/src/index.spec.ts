import { DefaultPorts, EnvKeys, HttpHeaders } from './index';

describe('@ati/shared-constants', () => {
  it('exposes ATI env keys', () => {
    expect(EnvKeys.API_PORT).toBe('ATI_API_PORT');
    expect(EnvKeys.AUTH_ENABLED).toBe('ATI_AUTH_ENABLED');
    expect(EnvKeys.OBS_ENABLED).toBe('ATI_OBS_ENABLED');
    expect(EnvKeys.CONTEXT_ENABLED).toBe('ATI_CONTEXT_ENABLED');
    expect(EnvKeys.CONTEXT_SUBJECT_TENANT_MAP).toBe('ATI_CONTEXT_SUBJECT_TENANT_MAP');
    expect(EnvKeys.REQUIREMENT_ENGINE_ENABLED).toBe('ATI_REQUIREMENT_ENGINE_ENABLED');
    expect(HttpHeaders.CORRELATION_ID).toBe('x-correlation-id');
    expect(HttpHeaders.TENANT_ID).toBe('x-ati-tenant-id');
    expect(HttpHeaders.WORKSPACE_ID).toBe('x-ati-workspace-id');
    expect(DefaultPorts.api).toBe(3000);
  });
});
