# WP-2.3 Implementation Report — Observability Baseline

**Work Package:** WP-2.3  
**Status:** Complete — Independent Architecture Review APPROVED WITH OBSERVATIONS — closed  
**Date:** 2026-07-26  
**Role:** ATI Platform Senior Software Engineer (Architecture Consumer)

**Authority:** [WP-2.3_IMPLEMENTATION_AUTHORIZATION.md](./WP-2.3_IMPLEMENTATION_AUTHORIZATION.md) · [WP-2.3_FINAL_PRE_IMPLEMENTATION_PLAN.md](./WP-2.3_FINAL_PRE_IMPLEMENTATION_PLAN.md) · [WP-2.3_ARCHITECTURE_DECISION_RESOLUTION.md](./WP-2.3_ARCHITECTURE_DECISION_RESOLUTION.md)

---

## 1. Executive Summary

WP-2.3 delivers the Observability Baseline per locked decisions D-Obs-1…7:

- New Nest-free **`@ati/observability`** (correlation, metrics/trace ports, config, trusted job envelope helpers)
- **`@ati/logger`** evolved for value-shaped redact + **single structured write path** (Pino preferred at runtime; JSON sink for tests)
- **`x-correlation-id`** on API (accept/mint + response echo); worker HTTP **always mints**; trusted job harness for envelope propagation
- Host OTel API soft-integration with **READY degrade** (exporter failure does not block READY)
- **Coarse auth allow/deny/error metrics** on api/worker (T8 mandatory)
- No AuthN/AuthZ behaviour changes; no Spine redesign; no new telemetry HTTP routes; no new ADRs

---

## 2. WBS Completion

| Task | Status |
|------|--------|
| T1 Architecture decision lock | Complete (prior governance) |
| T2 `@ati/observability` scaffold | Complete |
| T3 Shared constants / types / config keys | Complete |
| T4 Logging binding + single path + redact | Complete |
| T5 API host wiring | Complete |
| T6 Worker host wiring + harness | Complete |
| T7 Exporters + READY degrade | Complete |
| T8 Auth operational metrics | Complete (mandatory) |
| T9 Verification & documentation | Complete |

---

## 3. Architecture Compliance

| Decision | Result |
|----------|--------|
| D-Obs-1 `@ati/observability` | Pass |
| D-Obs-2 Pino runtime / single path | Pass |
| D-Obs-3 OTel SDK/API in hosts only | Pass |
| D-Obs-4 READY never blocked by exporter | Pass |
| D-Obs-5 Coarse auth metrics | Pass |
| D-Obs-6 `x-correlation-id` | Pass |
| D-Obs-7 Worker trusted-envelope / mint | Pass |
| L3 Correlation before auth | Pass (`ObservabilityModule` before `AuthModule`) |
| L4 No new telemetry HTTP routes | Pass |
| L5 Harness ≠ job bus | Pass |

---

## 4. Public / Internal Surfaces

### Package public API (`@ati/observability`)

Correlation helpers, `InMemoryMetrics` / `InMemoryTracer`, ports, `loadObservabilityConfig`, `resolveTrustedJobCorrelation`, attribute allow-list — via `src/index.ts` only.

### Host wiring

- `apps/api/src/observability/*` — runtime, correlation middleware, module
- `apps/worker/src/observability/*` — runtime, minting middleware, trusted job harness
- Auth middleware emits outcome metrics only (no identity labels)

### Unchanged

- `@ati/auth` public API
- Health `/health/live`, `/health/ready`
- Spine boot ownership

---

## 5. Configuration

| Env key | Purpose |
|---------|---------|
| `ATI_OBS_ENABLED` | Observability feature toggle (default true) |
| `ATI_OTEL_ENABLED` | Soft OTel activation (default false) |
| `ATI_OTEL_EXPORTER_OTLP_ENDPOINT` | Optional OTLP endpoint |
| `ATI_OTEL_SERVICE_NAME` | Service name override |
| `ATI_OTEL_TRACES_SAMPLER_ARG` | Sample ratio 0–1 |

Header: `x-correlation-id` (`HttpHeaders.CORRELATION_ID`).

---

## 6. Test Results

Run on **26-Jul-2026** (`npx pnpm@9.15.0`):

| Scope | Suites | Tests | Result |
|-------|--------|-------|--------|
| `@ati/observability` | 1 | 5 | Pass |
| `@ati/logger` | 1 | 4 | Pass |
| `@ati/shared-constants` | 1 | 1 | Pass |
| `@ati/api` | 18 | 54 | Pass |
| `@ati/worker` | 18 | 54 | Pass |

Build: `@ati/shared-constants`, `@ati/logger`, `@ati/observability`, `@ati/api`, `@ati/worker` — Pass.

---

## 7. Ops Diagnosability (criterion 15)

For a simulated auth deny on API: logs/metrics carry `host`, `route` pattern, `outcome=deny`, and request `correlationId` from middleware — without token/subject material. Worker trusted harness binds `correlationId` into job span attributes for failure-class diagnosis.

---

## 8. Files Changed (summary)

- **New:** `packages/observability/**`
- **Updated:** `packages/logger/**`, `packages/shared-constants/**`, `packages/README.md`
- **New host:** `apps/api/src/observability/**`, `apps/worker/src/observability/**`
- **Updated host:** `apps/*/src/app.module.ts`, `apps/*/src/auth/*middleware*`, `apps/*/src/spine/services/logging/logger.service.ts`, `apps/*/package.json`, `apps/*/jest.config.cjs`
- **Lockfile:** `pnpm-lock.yaml`
- **Docs:** this report + deferred register

---

## 9. Deferred Items

See [WP-2.3_DEFERRED_CAPABILITY_REGISTER.md](./WP-2.3_DEFERRED_CAPABILITY_REGISTER.md).

---

## 10. Next Step

**Closed.** Repository Closeout complete. Do not begin WP-2.4 without separate authorization.

---

*End of WP-2.3 Implementation Report.*
