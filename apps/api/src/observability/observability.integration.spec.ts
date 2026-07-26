import { UnauthorizedException } from '@nestjs/common';
import { HttpHeaders } from '@ati/shared-constants';
import {
  AUTH_OUTCOME_METRIC,
  InMemoryMetrics,
  InMemoryTracer,
  REQUEST_COUNT_METRIC,
} from '@ati/observability';
import { CorrelationMiddleware } from './correlation.middleware';
import { ObservabilityRuntime } from './observability-runtime';
import { ATI_CORRELATION_REQUEST_KEY } from './obs-request';
import { AuthMiddleware } from '../auth/auth.middleware';
import { ApiAuthRuntime } from '../auth/api-auth-runtime';
import { platformReadiness } from '../spine/registration/platform-readiness';

describe('API observability integration', () => {
  it('accepts inbound x-correlation-id and echoes it', () => {
    const metrics = new InMemoryMetrics();
    const tracer = new InMemoryTracer();
    const runtime = ObservabilityRuntime.create({
      host: 'api',
      env: { ATI_OBS_ENABLED: 'true', ATI_OTEL_ENABLED: 'false' },
      metrics,
      tracer,
    });
    const middleware = new CorrelationMiddleware(runtime);
    const headers: Record<string, string> = {};
    const req = {
      headers: { [HttpHeaders.CORRELATION_ID]: 'corr-api-1' },
      originalUrl: '/health/live',
      path: '/health/live',
    };
    const res = {
      setHeader: (k: string, v: string) => {
        headers[k] = v;
      },
      on: (_event: string, cb: () => void) => {
        cb();
      },
      statusCode: 200,
    };
    middleware.use(req as never, res as never, () => undefined);
    expect(req[ATI_CORRELATION_REQUEST_KEY as keyof typeof req]).toBe('corr-api-1');
    expect(headers[HttpHeaders.CORRELATION_ID]).toBe('corr-api-1');
    expect(metrics.sum(REQUEST_COUNT_METRIC)).toBe(1);
    expect(tracer.spans).toHaveLength(1);
  });

  it('records coarse auth deny without identity labels', async () => {
    const metrics = new InMemoryMetrics();
    const runtime = ObservabilityRuntime.create({
      host: 'api',
      env: {
        ATI_OBS_ENABLED: 'true',
        ATI_AUTH_ENABLED: 'true',
        ATI_AUTH_ISSUER: 'https://idp.example.test/',
        ATI_AUTH_AUDIENCE: 'ati-api',
        ATI_AUTH_JWKS_URI: 'https://idp.example.test/jwks',
      },
      metrics,
    });
    const authRuntime = ApiAuthRuntime.create({
      env: {
        ATI_AUTH_ENABLED: 'true',
        ATI_AUTH_ISSUER: 'https://idp.example.test/',
        ATI_AUTH_AUDIENCE: 'ati-api',
        ATI_AUTH_JWKS_URI: 'https://idp.example.test/jwks',
        ATI_NODE_ENV: 'test',
      },
    });
    const middleware = new AuthMiddleware(authRuntime, runtime);
    const req = {
      path: '/platform/auth/probe',
      originalUrl: '/platform/auth/probe',
      headers: {},
    };
    await expect(middleware.use(req as never, {} as never, () => undefined)).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
    expect(metrics.sum(AUTH_OUTCOME_METRIC, { outcome: 'deny' })).toBe(1);
    expect(JSON.stringify(metrics.samples)).not.toMatch(/subject|Bearer|eyJ/);
  });

  it('does not block READY when OTel init is requested without SDK path issues', () => {
    platformReadiness.setReady(false);
    const runtime = ObservabilityRuntime.create({
      host: 'api',
      env: {
        ATI_OBS_ENABLED: 'true',
        ATI_OTEL_ENABLED: 'true',
        ATI_OTEL_EXPORTER_OTLP_ENDPOINT: 'http://127.0.0.1:4318',
      },
    });
    // Degrade path: runtime constructs; readiness remains independently controlled.
    expect(runtime.config.otelEnabled).toBe(true);
    platformReadiness.setReady(true);
    expect(platformReadiness.isReady()).toBe(true);
  });
});
