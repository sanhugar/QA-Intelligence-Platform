import { EnvKeys } from '@ati/shared-constants';
import { contextConfigSchema, type ContextConfig } from './context-config-schema';

export interface LoadContextConfigOptions {
  env?: NodeJS.ProcessEnv;
}

function parseBool(raw: string | undefined, defaultValue: boolean): boolean {
  if (raw === undefined || raw.trim() === '') {
    return defaultValue;
  }
  const v = raw.trim().toLowerCase();
  if (v === 'true' || v === '1' || v === 'yes') {
    return true;
  }
  if (v === 'false' || v === '0' || v === 'no') {
    return false;
  }
  return defaultValue;
}

/**
 * Parse subject tenant map:
 * `sub1=tenant-a,sub2=tenant-b:workspace-1`
 * (subject = left of first `=`; optional workspace after tenant via `:`)
 */
export function parseSubjectTenantMap(
  raw: string | undefined,
): ContextConfig['subjectTenantMap'] {
  const out: ContextConfig['subjectTenantMap'] = {};
  if (!raw || raw.trim() === '') {
    return out;
  }
  for (const part of raw.split(',')) {
    const trimmed = part.trim();
    if (!trimmed) {
      continue;
    }
    const eq = trimmed.indexOf('=');
    if (eq <= 0) {
      continue;
    }
    const subject = trimmed.slice(0, eq).trim();
    const rhs = trimmed.slice(eq + 1).trim();
    if (!subject || !rhs) {
      continue;
    }
    const colon = rhs.indexOf(':');
    if (colon < 0) {
      out[subject] = { tenantId: rhs };
      continue;
    }
    const tenantId = rhs.slice(0, colon).trim();
    const workspaceId = rhs.slice(colon + 1).trim();
    if (!tenantId) {
      continue;
    }
    out[subject] = workspaceId
      ? { tenantId, workspaceId }
      : { tenantId };
  }
  return out;
}

export function loadContextConfig(options: LoadContextConfigOptions = {}): ContextConfig {
  const env = options.env ?? process.env;
  const defaultTenantId = env[EnvKeys.CONTEXT_DEFAULT_TENANT_ID]?.trim() || undefined;
  const defaultWorkspaceId = env[EnvKeys.CONTEXT_DEFAULT_WORKSPACE_ID]?.trim() || undefined;

  return contextConfigSchema.parse({
    enabled: parseBool(env[EnvKeys.CONTEXT_ENABLED], true),
    enforceOnProtected: parseBool(env[EnvKeys.CONTEXT_ENFORCE_ON_PROTECTED], true),
    defaultTenantId,
    defaultWorkspaceId,
    subjectTenantMap: parseSubjectTenantMap(env[EnvKeys.CONTEXT_SUBJECT_TENANT_MAP]),
  });
}
