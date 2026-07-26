import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { isPublicRoute } from '@ati/auth';
import { ApiAuthRuntime } from './api-auth-runtime';
import {
  ATI_PRINCIPAL_REQUEST_KEY,
  extractBearerToken,
  getRequestPath,
  type RequestWithPrincipal,
} from './auth-request';

/**
 * Nest authentication guard — deny-by-default when auth enabled.
 * Complements middleware; also safe if used alone.
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly runtime: ApiAuthRuntime) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (!this.runtime.config.enabled) {
      return true;
    }

    const request = context.switchToHttp().getRequest<RequestWithPrincipal>();
    const path = getRequestPath(request);

    if (isPublicRoute(path, this.runtime.config.publicRoutes)) {
      return true;
    }

    if (request[ATI_PRINCIPAL_REQUEST_KEY]) {
      return true;
    }

    const token = extractBearerToken(request.headers.authorization);
    if (!token) {
      throw new UnauthorizedException({
        code: 'AUTH_UNAUTHORIZED',
        message: 'Missing bearer token',
      });
    }

    try {
      request[ATI_PRINCIPAL_REQUEST_KEY] = await this.runtime.authenticateBearerToken(token);
      return true;
    } catch {
      throw new UnauthorizedException({
        code: 'AUTH_TOKEN_INVALID',
        message: 'Authentication failed',
      });
    }
  }
}
