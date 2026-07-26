import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';
import { isPublicRoute } from '@ati/auth';
import { ApiAuthRuntime } from './api-auth-runtime';
import {
  ATI_PRINCIPAL_REQUEST_KEY,
  extractBearerToken,
  getRequestPath,
  type RequestWithPrincipal,
} from './auth-request';
import { ObservabilityRuntime } from '../observability/observability-runtime';

/**
 * Nest authentication middleware — validates Bearer JWT and binds identity context.
 * Fail-closed when auth is enabled and route is not public.
 * Emits coarse auth outcome metrics (WP-2.3 T8) without identity labels.
 */
@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly runtime: ApiAuthRuntime,
    private readonly observability: ObservabilityRuntime,
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
      request[ATI_PRINCIPAL_REQUEST_KEY] = await this.runtime.authenticateBearerToken(token);
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
