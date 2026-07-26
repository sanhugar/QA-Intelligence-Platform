import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';
import { isPublicRoute } from '@ati/auth';
import {
  ATI_PRINCIPAL_REQUEST_KEY,
  extractBearerToken,
  getRequestPath,
  type RequestWithPrincipal,
} from './auth-request';
import { WorkerAuthRuntime } from './worker-auth-runtime';
import { WorkerObservabilityRuntime } from '../observability/observability-runtime';

@Injectable()
export class ServiceAuthMiddleware implements NestMiddleware {
  constructor(
    private readonly runtime: WorkerAuthRuntime,
    private readonly observability: WorkerObservabilityRuntime,
  ) {}

  async use(req: Request, _res: Response, next: NextFunction): Promise<void> {
    const request = req as unknown as RequestWithPrincipal;
    const path = getRequestPath(request);

    if (!this.runtime.config.enabled) {
      next();
      return;
    }

    if (isPublicRoute(path, this.runtime.config.publicRoutes)) {
      next();
      return;
    }

    const token = extractBearerToken(request.headers.authorization);
    if (!token) {
      this.observability.recordAuthOutcome('deny', path);
      throw new UnauthorizedException({
        code: 'AUTH_UNAUTHORIZED',
        message: 'Missing bearer token',
      });
    }

    try {
      request[ATI_PRINCIPAL_REQUEST_KEY] = await this.runtime.authenticateServiceToken(token);
      this.observability.recordAuthOutcome('allow', path);
      next();
    } catch {
      this.observability.recordAuthOutcome('error', path);
      throw new UnauthorizedException({
        code: 'AUTH_TOKEN_INVALID',
        message: 'Authentication failed',
      });
    }
  }
}
