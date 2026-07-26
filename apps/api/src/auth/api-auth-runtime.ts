import type { AtiPrincipal, AuthConfig, IdentityProviderPort } from '@ati/auth';
import {
  authenticateAccessToken,
  createRemoteIdentityProvider,
  createStaticIdentityProvider,
  loadAuthConfig,
} from '@ati/auth';

/**
 * Host-local auth runtime (not Spine). Configurable for tests via static JWKS JSON.
 */
export class ApiAuthRuntime {
  readonly config: AuthConfig;
  readonly identityProvider: IdentityProviderPort | null;

  private constructor(config: AuthConfig, identityProvider: IdentityProviderPort | null) {
    this.config = config;
    this.identityProvider = identityProvider;
  }

  static create(options?: {
    env?: NodeJS.ProcessEnv;
    identityProvider?: IdentityProviderPort;
  }): ApiAuthRuntime {
    const env = options?.env ?? process.env;
    const config = loadAuthConfig({ env, expectedPrincipalKind: 'human' });
    if (!config.enabled) {
      return new ApiAuthRuntime(config, null);
    }
    if (options?.identityProvider) {
      return new ApiAuthRuntime(config, options.identityProvider);
    }
    const staticJwks = env.ATI_AUTH_JWKS_JSON?.trim();
    if (staticJwks) {
      return new ApiAuthRuntime(config, createStaticIdentityProvider(JSON.parse(staticJwks)));
    }
    if (!config.jwksUri) {
      throw new Error('JWKS URI required when auth is enabled');
    }
    return new ApiAuthRuntime(config, createRemoteIdentityProvider(config.jwksUri));
  }

  async authenticateBearerToken(token: string): Promise<AtiPrincipal> {
    if (!this.config.enabled || !this.identityProvider) {
      throw new Error('Authentication is not enabled');
    }
    return authenticateAccessToken({
      token,
      config: this.config,
      identityProvider: this.identityProvider,
    });
  }
}
