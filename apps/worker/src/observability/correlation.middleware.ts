import { Injectable, NestMiddleware } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';
import { HttpHeaders } from '@ati/shared-constants';
import { WorkerObservabilityRuntime } from './observability-runtime';
import {
  ATI_CORRELATION_REQUEST_KEY,
  type RequestWithObservability,
} from './obs-request';

/**
 * Worker HTTP correlation: always mint (D-Obs-7).
 * Client x-correlation-id is not authoritative on worker.
 */
@Injectable()
export class WorkerCorrelationMiddleware implements NestMiddleware {
  constructor(private readonly runtime: WorkerObservabilityRuntime) {}

  use(req: Request, res: Response, next: NextFunction): void {
    const request = req as unknown as RequestWithObservability;
    const correlationId = this.runtime.mintHttpCorrelationId();
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
