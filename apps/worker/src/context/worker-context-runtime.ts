import { Injectable } from '@nestjs/common';
import {
  loadContextConfig,
  resolveTrustedContext,
  type AtiExecutionContext,
  type ContextConfig,
  type TrustedContextEnvelope,
} from '@ati/context';
import { EnvKeys } from '@ati/shared-constants';

/**
 * Worker context runtime — trusted-envelope bind only (WP-2.4 D4).
 */
@Injectable()
export class WorkerContextRuntime {
  readonly config: ContextConfig;
  readonly authEnabled: boolean;

  private constructor(config: ContextConfig, authEnabled: boolean) {
    this.config = config;
    this.authEnabled = authEnabled;
  }

  static create(options: { env?: NodeJS.ProcessEnv } = {}): WorkerContextRuntime {
    const env = options.env ?? process.env;
    const authEnabled = parseBool(env[EnvKeys.AUTH_ENABLED], false);
    return new WorkerContextRuntime(loadContextConfig({ env }), authEnabled);
  }

  /**
   * Bind context from a trusted job/harness envelope.
   * Client HTTP headers must never call this with untrusted data as authority.
   */
  bindFromTrustedEnvelope(envelope: TrustedContextEnvelope): AtiExecutionContext {
    return resolveTrustedContext(envelope);
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
