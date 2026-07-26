import { Injectable, NestMiddleware } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';
import { HttpHeaders } from '@ati/shared-constants';
import { resolveApiCorrelationId } from '@ati/observability';
import { ObservabilityRuntime } from './observability-runtime';
import {
  ATI_CORRELATION_REQUEST_KEY,
  type RequestWithObservability,
} from './obs-request';

/**
 * Establishes correlation context before auth (L3).
 * Echoes x-correlation-id on the response.
 */
@Injectable()
export class CorrelationMiddleware implements NestMiddleware {
  constructor(private readonly runtime: ObservabilityRuntime) {}

  use(req: Request, res: Response, next: NextFunction): void {
    const request = req as unknown as RequestWithObservability;
    const inbound =
      req.headers[HttpHeaders.CORRELATION_ID] ??
      req.headers['X-Correlation-Id'.toLowerCase()];
    const headerValue = Array.isArray(inbound) ? inbound[0] : inbound;
    const correlationId = resolveApiCorrelationId(headerValue);

    request[ATI_CORRELATION_REQUEST_KEY] = correlationId;
    res.setHeader(HttpHeaders.CORRELATION_ID, correlationId);

    const path = (req.originalUrl ?? req.url ?? req.path ?? '/').split('?')[0] || '/';
    this.runtime.recordRequest(path);
    const span = this.runtime.startRequestSpan(path, correlationId);
    res.on('finish', () => {
      span.end(res.statusCode >= 500 ? 'error' : 'ok');
    });

    next();
  }
}
