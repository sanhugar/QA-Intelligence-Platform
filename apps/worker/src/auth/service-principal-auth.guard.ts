import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { isPublicRoute } from '@ati/auth';
import {
  ATI_PRINCIPAL_REQUEST_KEY,
  extractBearerToken,
  getRequestPath,
  type RequestWithPrincipal,
} from './auth-request';
import { WorkerAuthRuntime } from './worker-auth-runtime';

@Injectable()
export class ServicePrincipalAuthGuard implements CanActivate {
  constructor(private readonly runtime: WorkerAuthRuntime) {}

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
      request[ATI_PRINCIPAL_REQUEST_KEY] = await this.runtime.authenticateServiceToken(token);
      return true;
    } catch {
      throw new UnauthorizedException({
        code: 'AUTH_TOKEN_INVALID',
        message: 'Authentication failed',
      });
    }
  }
}
