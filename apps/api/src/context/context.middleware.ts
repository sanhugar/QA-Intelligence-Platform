import {
  ForbiddenException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';
import {
  ContextError,
  resolveApiContext,
  requireContextOrThrow,
} from '@ati/context';
import { isPublicRoute } from '@ati/auth';
import { HttpHeaders } from '@ati/shared-constants';
import { ApiAuthRuntime } from '../auth/api-auth-runtime';
import {
  ATI_PRINCIPAL_REQUEST_KEY,
  getRequestPath,
  type RequestWithPrincipal,
} from '../auth/auth-request';
import { ApiContextRuntime } from './api-context-runtime';
import {
  ATI_EXECUTION_CONTEXT_KEY,
  getHeaderValue,
  type RequestWithExecutionContext,
} from './context-request';

/**
 * Bind execution context after authentication (WP-2.4).
 * Order: correlation → auth → context.
 * Raw client tenant/workspace headers are never authoritative.
 */
@Injectable()
export class ContextMiddleware implements NestMiddleware {
  constructor(
    private readonly contextRuntime: ApiContextRuntime,
    private readonly authRuntime: ApiAuthRuntime,
  ) {}

  use(req: Request, _res: Response, next: NextFunction): void {
    const request = req as unknown as RequestWithPrincipal & RequestWithExecutionContext;
    const path = getRequestPath(request);

    // Always clear prior bind for this request object (isolation).
    delete request[ATI_EXECUTION_CONTEXT_KEY];

    if (!this.contextRuntime.config.enabled) {
      next();
      return;
    }

    const publicRoute = isPublicRoute(path, this.authRuntime.config.publicRoutes);
    if (publicRoute) {
      // D7 — health/public remain context-free.
      next();
      return;
    }

    try {
      const principal = request[ATI_PRINCIPAL_REQUEST_KEY];
      const resolved = resolveApiContext({
        config: this.contextRuntime.config,
        authEnabled: this.authRuntime.config.enabled,
        principal: principal ? { subject: principal.subject } : null,
        untrustedHeaderTenantId: getHeaderValue(request.headers, HttpHeaders.TENANT_ID),
        untrustedHeaderWorkspaceId: getHeaderValue(
          request.headers,
          HttpHeaders.WORKSPACE_ID,
        ),
      });

      const enforce =
        this.contextRuntime.config.enforceOnProtected &&
        this.authRuntime.config.enabled;

      const bound = requireContextOrThrow(resolved, enforce);
      if (bound) {
        request[ATI_EXECUTION_CONTEXT_KEY] = bound;
      }
      next();
    } catch (err) {
      if (err instanceof ContextError) {
        throw new ForbiddenException({
          code: err.code,
          message: err.message,
        });
      }
      throw err;
    }
  }
}
