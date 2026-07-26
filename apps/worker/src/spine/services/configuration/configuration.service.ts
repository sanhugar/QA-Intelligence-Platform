import { SharedServiceError, type HostConfiguration } from '../types';

export interface ConfigurationServiceOptions {
  host: 'api' | 'worker';
  env?: NodeJS.ProcessEnv;
}

/**
 * Bootstrap-critical configuration shell.
 * Fail-fast on invalid required config. No Domain behaviour.
 */
export class ConfigurationService {
  private config: HostConfiguration | null = null;

  constructor(private readonly options: ConfigurationServiceOptions) {}

  initialize(): HostConfiguration {
    const env = this.options.env ?? process.env;
    const host = this.options.host;
    const portKey = host === 'api' ? 'ATI_API_PORT' : 'ATI_WORKER_PORT';
    const defaultPort = host === 'api' ? '3000' : '3001';
    const port = Number(env[portKey] ?? defaultPort);

    if (!Number.isFinite(port) || port <= 0) {
      throw new SharedServiceError(`Invalid ${portKey}`, 'CONFIG_INVALID');
    }

    const nodeEnv = (env.ATI_NODE_ENV ?? env.NODE_ENV ?? 'development').trim();
    if (!nodeEnv) {
      throw new SharedServiceError('ATI_NODE_ENV is required', 'CONFIG_INVALID');
    }

    const logLevel = (env.ATI_LOG_LEVEL ?? 'info').trim();
    if (!logLevel) {
      throw new SharedServiceError('ATI_LOG_LEVEL is required', 'CONFIG_INVALID');
    }

    const featureFlags = parseFeatureFlags(env.ATI_FEATURE_FLAGS);

    this.config = {
      host,
      platformVersion: (env.ATI_PLATFORM_VERSION ?? '0.0.0').trim() || '0.0.0',
      nodeEnv,
      logLevel,
      port,
      featureFlags,
    };
    return this.config;
  }

  getConfig(): HostConfiguration {
    if (!this.config) {
      throw new SharedServiceError('Configuration not initialized', 'CONFIG_NOT_INITIALIZED');
    }
    return this.config;
  }
}

function parseFeatureFlags(raw: string | undefined): Record<string, boolean> {
  if (!raw || raw.trim() === '') {
    return {};
  }
  const flags: Record<string, boolean> = {};
  for (const part of raw.split(',')) {
    const token = part.trim();
    if (!token) {
      continue;
    }
    const [key, value] = token.split('=');
    if (!key?.trim()) {
      throw new SharedServiceError(`Invalid ATI_FEATURE_FLAGS entry: ${token}`, 'CONFIG_INVALID');
    }
    if (value === undefined || value === 'true') {
      flags[key.trim()] = true;
    } else if (value === 'false') {
      flags[key.trim()] = false;
    } else {
      throw new SharedServiceError(`Invalid ATI_FEATURE_FLAGS value for ${key}`, 'CONFIG_INVALID');
    }
  }
  return flags;
}
