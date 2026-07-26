import { AppError, ErrorCodes } from '@ati/errors';
import { DEFAULT_PLATFORM_VERSION, DefaultPorts, EnvKeys } from '@ati/shared-constants';
import type { HostKind } from '@ati/shared-types';
import { trimToEmpty } from '@ati/shared-utils';
import { hostBootConfigSchema, type HostBootConfig } from '@ati/shared-validation';
import { parseFeatureFlags } from './parse-feature-flags';
import { parsePositivePort } from './parse-port';

export type { HostBootConfig };

export interface LoadHostBootConfigOptions {
  host: HostKind;
  env?: NodeJS.ProcessEnv;
}

/** Pure host boot config loader used by Spine ConfigurationService wrappers. */
export function loadHostBootConfig(options: LoadHostBootConfigOptions): HostBootConfig {
  const env = options.env ?? process.env;
  const host = options.host;
  const portKey = host === 'api' ? EnvKeys.API_PORT : EnvKeys.WORKER_PORT;
  const defaultPort = host === 'api' ? DefaultPorts.api : DefaultPorts.worker;
  const port = parsePositivePort(env[portKey], portKey, defaultPort);

  const nodeEnv = trimToEmpty(env[EnvKeys.NODE_ENV] ?? env.NODE_ENV ?? 'development');
  if (!nodeEnv) {
    throw new AppError('ATI_NODE_ENV is required', ErrorCodes.CONFIG_INVALID);
  }

  const logLevel = trimToEmpty(env[EnvKeys.LOG_LEVEL] ?? 'info');
  if (!logLevel) {
    throw new AppError('ATI_LOG_LEVEL is required', ErrorCodes.CONFIG_INVALID);
  }

  const platformVersion =
    trimToEmpty(env[EnvKeys.PLATFORM_VERSION] ?? DEFAULT_PLATFORM_VERSION) ||
    DEFAULT_PLATFORM_VERSION;

  const candidate = {
    host,
    platformVersion,
    nodeEnv,
    logLevel,
    port,
    featureFlags: parseFeatureFlags(env[EnvKeys.FEATURE_FLAGS]),
  };

  const parsed = hostBootConfigSchema.safeParse(candidate);
  if (!parsed.success) {
    throw new AppError('Host boot configuration invalid', ErrorCodes.CONFIG_INVALID, {
      issues: parsed.error.issues,
    });
  }
  return parsed.data;
}
