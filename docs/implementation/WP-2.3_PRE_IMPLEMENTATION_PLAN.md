# WP-2.3_PRE_IMPLEMENTATION_PLAN.md
## Pre-Implementation Plan — Observability Baseline

**Work Package:** WP-2.3 — Observability Baseline  
**Role:** ATI Platform Principal Enterprise Architect  
**Date:** 2026-07-26  
**Status:** Draft — awaiting Architecture Review  
**Implementation:** **Not authorized**

**Prerequisite baseline:** WP-1.1–WP-2.2 complete (WP-2.2 Git Ready / Ready for Commit & Tag).  
**Next gate after approval of this plan:** Architecture Review (not implementation).

---

## Executive Summary

WP-2.3 establishes the **platform Observability Baseline** so operators can diagnose boot and runtime failures across `apps/api` and `apps/worker` without Domain features. Scope is limited to **structured correlated logging**, **request/job correlation propagation**, and **basic metrics/traces** with vendor-neutral OpenTelemetry-oriented facades — consistent with Foundation Architecture (§2.7), Application Architecture (Observability package role), and Platform Spine Engineering Specification (§12).

Today the monorepo has:

- `@ati/logger` helpers (level + redact only)
- Host-local Spine `LoggerService` / `DiagnosticsService` (console JSON; boot-scoped correlation)
- `CorrelationId` type in `@ati/shared-types`
- No HTTP/job correlation middleware, no metrics/trace pipeline, no OTel exporters

WP-2.3 closes that gap at the **Shared Infrastructure** layer. It must **not** redesign Spine ownership, AuthN/AuthZ semantics (WP-2.2), or Domain/AI/Workflow observability meaning. Product SIEM, dashboards-as-product, Decision/Evidence audit, and tenancy remain out of scope.

**Open packaging decision (for Architecture Review):** introduce `@ati/observability` (preferred by Application Architecture logical packages) versus expanding `@ati/logger` only. This plan assumes a **dedicated observability facade package** plus host adapters, without binding Nest/React into packages.

---

## Business Objectives

1. Enable reliable **operational diagnosis** of platform hosts (boot, READY, auth-gated surfaces, job shells) using correlated signals.
2. Reduce mean-time-to-diagnose for cross-host failures (API request → worker continuation) via a shared **correlation identifier**.
3. Establish a **vendor-neutral telemetry baseline** so future environments can export to Grafana, Datadog, Azure Monitor, or equivalent without redesigning apps.
4. Protect security/governance posture: observability must **not** leak secrets, tokens, or unconstrained sensitive payloads (Security & Governance Architecture §11).
5. Unblock later phases (Intake, AI Runtime, Integration) that depend on G-Obs-style correlation and failure-class visibility without inventing ad-hoc logging per module.

---

## Technical Objectives

1. Deliver a framework-independent **observability facade** (correlation context, structured log binding contracts, metrics/trace ports) consumed by `apps/api` and `apps/worker`.
2. Propagate **correlation IDs** on interactive requests and worker job executions; bind them into structured logs consistently.
3. Emit **basic host/runtime metrics** (e.g., boot outcome, request/job counters, error classes) and **minimal traces** for host request/job spans — not Domain/AI product telemetry.
4. Wire **config keys** for log level, OTel enablement/exporter endpoints, and service names via existing `@ati/config` / `@ati/shared-constants` patterns.
5. Integrate with existing Spine logging/diagnostics **without** extracting Spine orchestration into packages and **without** replacing Decision/Evidence audit.
6. Optionally surface **auth-boundary operational counters** (success/deny/error classes) deferred from WP-2.2 — metrics only; no AuthZ redesign.
7. Prove acceptance with automated tests and an Implementation Report + Deferred Capability Register.

---

## Scope

### In Scope

| Area | Detail |
|------|--------|
| Observability baseline package(s) | Framework-independent facade for correlation context, logger binding contracts, metrics and trace ports; public API via package `index.ts` only |
| `@ati/logger` evolution | Extend as needed for structured logger interface / Pino-compatible binding hooks **or** keep helpers and place bindings behind observability — decision in Architecture Review |
| Correlation | Generate or accept inbound correlation ID; propagate via approved header constant(s); attach to logs and spans for api + worker |
| Host wiring | Nest middleware/interceptors (or equivalent Application-boundary hooks) on `apps/api`; worker job/context hooks on `apps/worker` |
| Basic metrics | Host-level counters/histograms sufficient for boot/runtime diagnosis (request/job volume, failure classes, auth outcome classes if approved) |
| Basic traces | Root/request and job spans with stable attributes (service, correlationId, route/job name, outcome); vendor-neutral OTLP-oriented exporter adapter behind port |
| Config | Env keys for observability toggle, exporter endpoint, service name, sampling (minimal); schema validation at boot |
| Redaction | Reuse/extend `@ati/logger` redact; enforce no token/secret bodies in fields |
| Health relationship | Keep existing `/health/live` and `/health/ready` semantics; observability must not redefine readiness ownership |
| Spine coexistence | Host-local `LoggerService` / `DiagnosticsService` may consume facades; Spine boot/READY ownership unchanged |
| Docs | Pre-Implementation Plan (this), then post-implementation report + deferred register (implementation phase) |
| Tests | Package unit tests + host integration tests proving correlation propagation and no secret leakage in logged fields |

### Out of Scope

| Item | Rationale / deferral |
|------|----------------------|
| Domain / Workflow / AI engine product observability meaning | Later Orchestration / AI WPs; Spine §12 “visibility” concepts beyond host baseline |
| Integration connector health product signals | Integration Architecture later |
| Decision / Evidence / Security audit product stores | Observability complements audit; does not replace (ADR 0014) |
| Full SIEM, APM product, Grafana/Datadog deployments, dashboards-as-product | Ops environment concern; exporters only |
| Changing AuthN/AuthZ rules, public-route policy, or roles | WP-2.2 closed |
| Tenancy / workspace context propagation | WP-2.4 |
| Cookie/BFF, web OIDC UX, `apps/web` full telemetry product | Later / optional minimal compile-only touch if required |
| Database schemas, Redis/BullMQ product metrics, persistence | Not this WP |
| OPA/PDP, Domain RBAC, Approval workflows | Deferred elsewhere |
| Redesign of Platform Spine registration / AI Runtime Host | WP-1.3 / WP-1.4 closed |
| Creating `@ati/spine`, `@ati/runtime`, Domain/AI packages | Forbidden pattern from WP-2.1/2.2 |
| New ADRs in this planning step | Architecture Review may recommend ADR only if boundaries change |

---

## Dependencies

| Dependency | Nature |
|------------|--------|
| **Platform Spine (WP-1.3 / WP-1.4)** | Host lifecycle, existing `LoggerService`, `DiagnosticsService`, AI Runtime correlation fields on types; boot must remain operable if telemetry exporter is down (degrade, do not block READY unless explicitly decided) |
| **Shared Packages (WP-2.1)** | `@ati/logger`, `@ati/config`, `@ati/errors`, `@ati/shared-types` (`CorrelationId`), `@ati/shared-constants`, `@ati/shared-utils`, `@ati/shared-validation` |
| **Authentication & Authorization (WP-2.2)** | Safe identity attributes for log/metric labels (e.g., principal kind / foundation role classes) without logging tokens; optional auth outcome metrics deferred from WP-2.2 register; must not weaken deny-by-default |
| **Foundation Architecture (ADR 0002 / ARCHITECTURE.md §2.7)** | Pino structured logs + OpenTelemetry vendor-neutral exporters |
| **Application Architecture (ADR 0013)** | Observability as platform package role for API + Worker |
| **Security & Governance (ADR 0014)** | Redaction, no covert sensitive channels, observability ≠ audit substitute |
| **Platform Spine Engineering Spec §12** | Signal taxonomy consumed at baseline depth only |
| **Implementation Roadmap / WBS** | WP-2.3 purpose, outcomes, completion criteria |
| **Existing infrastructure** | Local/dev env; no mandatory cloud sink for acceptance (in-memory/no-op exporter acceptable for tests) |
| **Repository structure** | `packages/*`, `apps/api`, `apps/worker`; Spine remains under `apps/*/src/spine` |

**Explicit non-dependencies for start:** WP-2.4 tenancy, Phase 3 Intake, Phase 4 AI providers, Integration connectors.

---

## Architecture Impact

| Dimension | Expected impact |
|-----------|-----------------|
| **New packages** | Likely **`@ati/observability`** (correlation context, metrics/trace ports, bootstrap helpers). Confirm vs logger-only expansion in Architecture Review. |
| **Existing packages modified** | `@ati/logger` (structured logger contract and/or Pino binding helpers); `@ati/shared-constants` (header + env keys); `@ati/shared-types` if correlation/context types need extension; `@ati/config` / validation schemas for obs config; possibly `@ati/errors` for stable telemetry/config error codes |
| **Apps modified** | `apps/api`, `apps/worker` — middleware/interceptors/modules, package deps, jest config if ESM/OTel requires; Spine logger may delegate to facade |
| **Public APIs affected** | New package public exports via `index.ts`; **no** intentional breaking change to WP-2.2 `@ati/auth` public API; HTTP health routes unchanged; optional new **non-sensitive** diagnostics/telemetry admin surfaces only if Architecture Review approves (default: none required) |
| **Internal APIs affected** | Host logger/diagnostics initialization; request context holders; worker job context |
| **Database impact** | **None** |
| **Configuration impact** | New `ATI_*` env keys (e.g., obs enabled, OTLP endpoint, service name, sample ratio); documented in Getting Started at implementation closeout |
| **Security impact** | Positive if redaction enforced; risk if correlation/auth fields over-share — mitigate via allow-listed attributes and existing redact helpers; exporters must not receive Authorization headers |
| **Spine impact** | Consumption only; **no** ownership redesign; registration/boot semantics preserved |
| **Web impact** | Default **out of scope**; touch only if workspace compile forces it |

### Open decisions for Architecture Review (not decided here as ADRs)

1. **D-Obs-1:** New `@ati/observability` vs expand `@ati/logger` only.  
2. **D-Obs-2:** Pino as required runtime binding vs console JSON retained with optional Pino adapter.  
3. **D-Obs-3:** OTel SDK lives in host adapters only vs thin shared init helper in package (package must remain Nest-free).  
4. **D-Obs-4:** Exporter failure policy — never block READY vs fail-fast when obs “required” in prod.  
5. **D-Obs-5:** Include WP-2.2 auth outcome metrics in WP-2.3 or defer again.  
6. **D-Obs-6:** Correlation header name (`x-correlation-id` per Foundation notes vs `ATI_*` branded header).  
7. **D-Obs-7:** Whether worker accepts correlation only from trusted upstream vs always minting new IDs.

---

## Risks

| Type | Risk | Mitigation |
|------|------|------------|
| **Technical** | OTel / Pino ESM and Jest friction | Host-local adapters; proven `transformIgnorePatterns` pattern from WP-2.2; no-op exporters in unit tests |
| **Technical** | Dual logging (Spine console + new pipeline) causing duplicate/noisy logs | Single write path decision in Architecture Review; Spine logger becomes facade consumer |
| **Technical** | Performance overhead of tracing on hot paths | Default low/no sampling in test; configurable sample ratio; baseline spans only |
| **Architectural** | Observability package absorbs Domain/AI semantics | Hard out-of-scope list; Architecture Review gate; package API limited to host/job primitives |
| **Architectural** | Treating logs/metrics as Sources of Truth | Explicit non-goal; Spine constraint retained |
| **Architectural** | Secret leakage via fields/exporters | Mandatory redact; deny-list Authorization/raw JWT; tests asserting redaction |
| **Delivery** | Scope creep into dashboards/SIEM/product APM | Acceptance criteria limited to correlated logs + basic metrics/traces + diagnose boot/runtime |
| **Delivery** | Blocking on external collector availability | No-op/console exporter path for local/CI acceptance |
| **Delivery** | Coupling to unfinished WP-2.2 commit/tag | Plan assumes WP-2.2 baseline; implementation authorization should follow commit/tag of WP-2.2 |
| **Security** | Auth metrics revealing enumeration patterns | Coarse counters only; no token subjects in metric labels by default |

---

## Acceptance Criteria

Measurable completion criteria for WP-2.3:

1. **Correlated logs:** A single API request produces structured log lines containing the same `correlationId` across Application-boundary handling; worker job execution logs include a correlation id propagated or minted per approved decision.  
2. **Cross-host continuity (baseline):** Documented and tested mechanism to continue correlation from api-triggered work into worker when a job envelope exists; if full job bus is not yet present, a **host-local job context harness** proves the contract.  
3. **Failure class visibility:** Boot failure and runtime error paths emit stable error codes/classes (via `@ati/errors` / AuthError codes where applicable) into logs and/or metrics without stack-trace-as-UX.  
4. **Basic metrics:** At least host request or job counters and error counters are recordable through the metrics port (asserted in tests with an in-memory exporter).  
5. **Basic traces:** At least one request span (api) and one job/boot span (worker or shared harness) exportable through the trace port (in-memory/no-op acceptable in CI).  
6. **Security:** Automated tests prove Authorization headers / JWT material are redacted from log fields; no secrets in diagnostics snapshots.  
7. **Behaviour preservation:** Existing health allow-list and WP-2.2 auth semantics unchanged; Spine READY semantics unchanged unless Architecture Review explicitly approves exporter fail policy.  
8. **Package purity:** Observability/logger packages remain Nest/React-free; public API via `index.ts` only.  
9. **Ops diagnosability:** Using only baseline signals, an operator can determine host identity, correlation id, and failure class for a simulated boot/runtime failure (documented in Implementation Report).  
10. **Delivery artifacts:** Implementation Report, Deferred Capability Register, tests green for touched packages/apps, status indexes updated at closeout (implementation phase).  
11. **Non-goals held:** No Domain modules, no tenancy, no SIEM product, no Decision/Evidence store, no `apps/web` observability product.

---

## Work Breakdown Structure

### Task T1 — Architecture decision lock (post–Architecture Review)

- **Purpose:** Resolve open decisions D-Obs-1…D-Obs-7 into an approved Final Pre-Implementation Plan.  
- **Deliverables:** Decision record (in Final Plan); ADR only if Review requires boundary change.  
- **Dependencies:** Approval of this Pre-Implementation Plan; Architecture Review.

### Task T2 — Package scaffold (`@ati/observability` and/or `@ati/logger` extension)

- **Purpose:** Create framework-independent facade: correlation context, metrics port, trace port, config schema types.  
- **Deliverables:** Package(s) with `package.json`, `tsconfig`, `src/index.ts`, unit tests, README.  
- **Dependencies:** T1.

### Task T3 — Shared constants / types / config keys

- **Purpose:** Standardize correlation header and `ATI_*` observability env keys; config load helpers.  
- **Deliverables:** Updates to `@ati/shared-constants`, `@ati/shared-types` (if needed), `@ati/config` / validation.  
- **Dependencies:** T1; may parallel early T2.

### Task T4 — Logging binding

- **Purpose:** Provide structured logger binding (Pino or approved adapter) consuming correlation context and redact.  
- **Deliverables:** Logger factory/bindings; Spine `LoggerService` delegation or thin wrapper; tests.  
- **Dependencies:** T2, T3.

### Task T5 — API host correlation + telemetry wiring

- **Purpose:** Propagate correlation on HTTP requests; attach logs/metrics/traces at Application boundary.  
- **Deliverables:** Middleware/interceptor/module in `apps/api`; integration tests for correlation + redaction.  
- **Dependencies:** T2–T4; WP-2.2 auth middleware coexistence (order/policy preserved).

### Task T6 — Worker host correlation + telemetry wiring

- **Purpose:** Job/boot correlation context; metrics/traces for worker runtime shell.  
- **Deliverables:** Worker module/hooks; integration tests; job context harness if queue not present.  
- **Dependencies:** T2–T4.

### Task T7 — Basic metrics & traces exporters

- **Purpose:** In-memory/no-op + optional OTLP exporter adapters behind ports; config-gated enablement.  
- **Deliverables:** Adapter implementations; boot wiring; failure-policy per T1; tests.  
- **Dependencies:** T2, T3, T5/T6.

### Task T8 — Optional auth operational metrics

- **Purpose:** If D-Obs-5 approved, emit coarse auth allow/deny/error counters without identity leakage.  
- **Deliverables:** Metric hooks at api/worker auth boundaries; tests.  
- **Dependencies:** T5/T6, T7; WP-2.2 auth surfaces.

### Task T9 — Verification & documentation

- **Purpose:** Prove acceptance criteria; record deferrals; prepare closeout path.  
- **Deliverables:** Full targeted test run; `WP-2.3_IMPLEMENTATION_REPORT.md`; `WP-2.3_DEFERRED_CAPABILITY_REGISTER.md`; Getting Started / index updates at closeout.  
- **Dependencies:** T4–T8.

---

## Deliverables (planning phase)

| Artifact | Status |
|----------|--------|
| `docs/implementation/WP-2.3_PRE_IMPLEMENTATION_PLAN.md` | **This document** |
| Architecture Review of this plan | **Next** |
| Final Pre-Implementation Plan / decision resolution | After Review |
| Implementation authorization | Only after Final Plan approval |

Implementation-phase deliverables (not started): code, tests, Implementation Report, Deferred Register, Closeout, Git readiness.

---

## Exit Criteria

This Pre-Implementation Plan is **complete as a planning artifact**.

WP-2.3 may proceed to:

- **Architecture Review**

**only after** this Pre-Implementation Plan is **approved**.

WP-2.3 may **not** proceed to implementation, ADR creation (unless Architecture Review mandates), repository status promotion, or coding until a **Final Pre-Implementation Plan** is approved and implementation is separately authorized.

---

## Planning Status

**WP-2.3 Pre-Implementation Plan Complete**

**Ready for Architecture Review** (upon plan approval)
