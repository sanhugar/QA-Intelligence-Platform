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
  type TrustedContextEnvelope,
} from '@ati/context';
import { isPublicRoute } from '@ati/auth';
import { HttpHeaders } from '@ati/shared-constants';
import { WorkerAuthRuntime } from '../auth/worker-auth-runtime';
import { getRequestPath } from '../auth/auth-request';
import { WorkerContextRuntime } from './worker-context-runtime';
import {
  ATI_EXECUTION_CONTEXT_KEY,
  getHeaderValue,
  type RequestWithExecutionContext,
} from './context-request';

/**
 * Worker context middleware (WP-2.4).
 * Order: correlation mint → service auth → trusted context bind.
 * Client tenant/workspace headers are never authoritative.
 * Trusted envelope may be supplied on request body for harness/HTTP probes only.
 */
@Injectable()
export class WorkerContextMiddleware implements NestMiddleware {
  constructor(
    private readonly contextRuntime: WorkerContextRuntime,
    private readonly authRuntime: WorkerAuthRuntime,
  ) {}

  use(req: Request, _res: Response, next: NextFunction): void {
    const request = req as unknown as RequestWithExecutionContext;
    const path = getRequestPath(request);

    delete request[ATI_EXECUTION_CONTEXT_KEY];

    if (!this.contextRuntime.config.enabled) {
      next();
      return;
    }

    if (isPublicRoute(path, this.authRuntime.config.publicRoutes)) {
      next();
      return;
    }

    // Explicitly ignore client headers as authority (D2/D4).
    void getHeaderValue(request.headers, HttpHeaders.TENANT_ID);
    void getHeaderValue(request.headers, HttpHeaders.WORKSPACE_ID);

    try {
      const body = request.body;
      if (isTrustedEnvelopeCandidate(body)) {
        request[ATI_EXECUTION_CONTEXT_KEY] =
          this.contextRuntime.bindFromTrustedEnvelope(body);
        next();
        return;
      }

      // Auth-disabled scaffold only — never from client headers.
      if (!this.authRuntime.config.enabled) {
        const scaffold = resolveApiContext({
          config: this.contextRuntime.config,
          authEnabled: false,
          untrustedHeaderTenantId: getHeaderValue(request.headers, HttpHeaders.TENANT_ID),
          untrustedHeaderWorkspaceId: getHeaderValue(
            request.headers,
            HttpHeaders.WORKSPACE_ID,
          ),
        });
        if (scaffold) {
          request[ATI_EXECUTION_CONTEXT_KEY] = scaffold;
        }
        next();
        return;
      }

      const enforce = this.contextRuntime.config.enforceOnProtected;
      requireContextOrThrow(null, enforce);
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

function isTrustedEnvelopeCandidate(body: unknown): body is TrustedContextEnvelope {
  return (
    typeof body === 'object' &&
    body !== null &&
    'trusted' in body &&
    (body as TrustedContextEnvelope).trusted === true
  );
}
