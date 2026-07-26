import { loadHostBootConfig, type HostBootConfig } from '@ati/config';
import type { HostKind } from '@ati/shared-types';
import { SharedServiceError, type HostConfiguration } from '../types';

export interface ConfigurationServiceOptions {
  host: HostKind;
  env?: NodeJS.ProcessEnv;
}

/**
 * Bootstrap-critical configuration shell.
 * Fail-fast on invalid required config. No Domain behaviour.
 * Pure parsing lives in @ati/config.
 */
export class ConfigurationService {
  private config: HostConfiguration | null = null;

  constructor(private readonly options: ConfigurationServiceOptions) {}

  initialize(): HostConfiguration {
    try {
      this.config = loadHostBootConfig({
        host: this.options.host,
        env: this.options.env,
      });
      return this.config;
    } catch (error) {
      if (error instanceof SharedServiceError) {
        throw error;
      }
      if (error instanceof Error && 'code' in error) {
        throw new SharedServiceError(error.message, String((error as { code: string }).code));
      }
      throw new SharedServiceError(
        error instanceof Error ? error.message : String(error),
        'CONFIG_INVALID',
      );
    }
  }

  getConfig(): HostConfiguration {
    if (!this.config) {
      throw new SharedServiceError('Configuration not initialized', 'CONFIG_NOT_INITIALIZED');
    }
    return this.config;
  }
}

export type { HostBootConfig };
