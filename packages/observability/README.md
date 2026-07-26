# `@ati/observability`

Framework-independent observability facade for ATI hosts.

## Responsibilities

- Correlation ID mint/validate helpers
- Metrics and trace **ports** (in-memory implementations for tests)
- Observability config schema / loader
- Trusted job-envelope correlation helpers

## Non-responsibilities

- Nest/React wiring (lives in `apps/*`)
- OpenTelemetry SDK / OTLP exporters (host adapters only)
- Domain / AI / workflow product telemetry
- Authorization decisions (correlation is diagnostic only)

## Public API

Import only from `@ati/observability` (package `src/index.ts`).
