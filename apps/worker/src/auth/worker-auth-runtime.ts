import type { AtiPrincipal, AuthConfig, IdentityProviderPort } from '@ati/auth';
import {
  authenticateServicePrincipal,
  createRemoteIdentityProvider,
  createStaticIdentityProvider,
  loadAuthConfig,
} from '@ati/auth';

/**
 * Worker host auth runtime — service principal only (no user propagation).
 */
export class WorkerAuthRuntime {
  readonly config: AuthConfig;
  readonly identityProvider: IdentityProviderPort | null;

  private constructor(config: AuthConfig, identityProvider: IdentityProviderPort | null) {
    this.config = config;
    this.identityProvider = identityProvider;
  }

  static create(options?: {
    env?: NodeJS.ProcessEnv;
    identityProvider?: IdentityProviderPort;
  }): WorkerAuthRuntime {
    const env = options?.env ?? process.env;
    const config = loadAuthConfig({ env, expectedPrincipalKind: 'service' });
    if (!config.enabled) {
      return new WorkerAuthRuntime(config, null);
    }
    if (options?.identityProvider) {
      return new WorkerAuthRuntime(config, options.identityProvider);
    }
    const staticJwks = env.ATI_AUTH_JWKS_JSON?.trim();
    if (staticJwks) {
      return new WorkerAuthRuntime(config, createStaticIdentityProvider(JSON.parse(staticJwks)));
    }
    if (!config.jwksUri) {
      throw new Error('JWKS URI required when auth is enabled');
    }
    return new WorkerAuthRuntime(config, createRemoteIdentityProvider(config.jwksUri));
  }

  async authenticateServiceToken(token: string): Promise<AtiPrincipal> {
    if (!this.config.enabled || !this.identityProvider) {
      throw new Error('Authentication is not enabled');
    }
    return authenticateServicePrincipal({
      token,
      config: this.config,
      identityProvider: this.identityProvider,
    });
  }
}
