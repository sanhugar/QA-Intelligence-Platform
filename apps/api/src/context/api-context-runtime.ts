import { Injectable } from '@nestjs/common';
import { loadContextConfig, type ContextConfig } from '@ati/context';
import { EnvKeys } from '@ati/shared-constants';

/**
 * API host context runtime — loads scaffold/claim-map config once.
 */
@Injectable()
export class ApiContextRuntime {
  readonly config: ContextConfig;
  readonly authEnabled: boolean;

  private constructor(config: ContextConfig, authEnabled: boolean) {
    this.config = config;
    this.authEnabled = authEnabled;
  }

  static create(options: { env?: NodeJS.ProcessEnv } = {}): ApiContextRuntime {
    const env = options.env ?? process.env;
    const authEnabled = parseBool(env[EnvKeys.AUTH_ENABLED], false);
    return new ApiContextRuntime(loadContextConfig({ env }), authEnabled);
  }
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
