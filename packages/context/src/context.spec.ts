import {
  assertNoCrossTenantBleed,
  ContextError,
  ContextErrorCodes,
  loadContextConfig,
  parseSubjectTenantMap,
  resolveApiContext,
  resolveTrustedContext,
  validateExecutionContext,
} from './index';

describe('@ati/context', () => {
  it('rejects workspace without tenant', () => {
    expect(() => validateExecutionContext({ workspaceId: 'ws-1' })).toThrow(ContextError);
    try {
      validateExecutionContext({ workspaceId: 'ws-1' });
    } catch (e) {
      expect((e as ContextError).code).toBe(ContextErrorCodes.WORKSPACE_WITHOUT_TENANT);
    }
  });

  it('ignores untrusted client headers for API resolution', () => {
    const config = loadContextConfig({
      env: {
        ATI_CONTEXT_ENABLED: 'true',
        ATI_CONTEXT_SUBJECT_TENANT_MAP: 'user-1=tenant-a',
      },
    });
    const ctx = resolveApiContext({
      config,
      authEnabled: true,
      principal: { subject: 'user-1' },
      untrustedHeaderTenantId: 'spoofed-tenant',
      untrustedHeaderWorkspaceId: 'spoofed-ws',
    });
    expect(ctx).toEqual({ tenantId: 'tenant-a' });
  });

  it('uses auth-disabled scaffold defaults', () => {
    const config = loadContextConfig({
      env: {
        ATI_CONTEXT_ENABLED: 'true',
        ATI_CONTEXT_DEFAULT_TENANT_ID: 'local-tenant',
        ATI_CONTEXT_DEFAULT_WORKSPACE_ID: 'local-ws',
      },
    });
    expect(
      resolveApiContext({
        config,
        authEnabled: false,
        untrustedHeaderTenantId: 'header-spoof',
      }),
    ).toEqual({ tenantId: 'local-tenant', workspaceId: 'local-ws' });
  });

  it('parses subject tenant map', () => {
    expect(parseSubjectTenantMap('a=t1,b=t2:w2')).toEqual({
      a: { tenantId: 't1' },
      b: { tenantId: 't2', workspaceId: 'w2' },
    });
  });

  it('requires trusted worker envelope', () => {
    expect(() =>
      resolveTrustedContext({
        trusted: false,
        executionContext: { tenantId: 't1' },
      }),
    ).toThrow(/trusted/i);
    expect(
      resolveTrustedContext({
        trusted: true,
        executionContext: { tenantId: 't1', workspaceId: 'w1' },
      }),
    ).toEqual({ tenantId: 't1', workspaceId: 'w1' });
  });

  it('detects cross-tenant bleed', () => {
    expect(() =>
      assertNoCrossTenantBleed({ tenantId: 't1' }, { tenantId: 't2' }),
    ).toThrow(/bleed/i);
    expect(() =>
      assertNoCrossTenantBleed({ tenantId: 't1' }, { tenantId: 't1', workspaceId: 'w1' }),
    ).not.toThrow();
  });
});
