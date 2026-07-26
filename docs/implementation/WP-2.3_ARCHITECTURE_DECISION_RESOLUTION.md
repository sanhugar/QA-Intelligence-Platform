# WP-2.3_ARCHITECTURE_DECISION_RESOLUTION.md
## Architecture Decision Resolution — Observability Baseline

**Work Package:** WP-2.3 — Observability Baseline  
**Role:** ATI Platform Principal Architect  
**Date:** 2026-07-26  
**Input verdict:** Architecture Review — **APPROVED WITH OBSERVATIONS**  
**Implementation:** **Not authorized**

---

## Executive Summary

All Architecture Review observations for WP-2.3 are resolved. Open decisions **D-Obs-1…D-Obs-7** and mandatory implementation locks (single logging path, READY degrade, middleware order, worker correlation trust, no new public telemetry routes, harness-only cross-host DoD) are **Accepted** with concrete constraints.

Direction remains: introduce **`@ati/observability`**, keep **`@ati/logger`** focused on logging helpers/bindings, place **OTel SDK in host adapters**, use **Pino** on api/worker runtime paths, wire **`x-correlation-id`**, **never block READY** on exporter failure, include **coarse auth outcome metrics**, and treat correlation as **diagnostic-only**.

**No new ADR is required** for WP-2.3: decisions refine Application Architecture’s existing Observability package role and Foundation’s Pino/OTel/`x-correlation-id` baseline without changing modular-monolith boundaries, AuthN/AuthZ semantics, or Spine ownership.

**Final Verdict:** **APPROVED FOR FINAL PRE-IMPLEMENTATION PLAN**

---

## Observation Resolution Matrix

| ID | Observation | Class | Decision | Disposition |
|----|-------------|-------|----------|-------------|
| D-Obs-1 | `@ati/observability` vs expand `@ati/logger` only | Mandatory | Introduce `@ati/observability`; narrow logger | **Accepted** |
| D-Obs-2 | Pino required vs console-optional peer | Mandatory (elevated from Recommended) | Pino required on api/worker runtime; console/no-op for tests only | **Accepted** |
| D-Obs-3 | OTel SDK in package vs hosts | Mandatory | SDK in host adapters only; package = ports/types/helpers | **Accepted** |
| D-Obs-4 | Exporter failure vs READY | Mandatory | Never block READY; degrade to no-op | **Accepted** |
| D-Obs-5 | Auth outcome metrics in WP-2.3 | Recommended → Accepted in-scope | Include coarse allow/deny/error counters | **Accepted** |
| D-Obs-6 | Correlation header name | Mandatory (elevated) | `x-correlation-id` via `@ati/shared-constants` | **Accepted** |
| D-Obs-7 | Worker correlation trust | Mandatory | Accept from trusted job envelope / harness only; else mint; no untrusted client override on worker | **Accepted** |
| L1 | Single logging path | Mandatory | Spine logger consumes facade; one write path per event | **Accepted** |
| L2 | READY degradation | Mandatory | Same as D-Obs-4 | **Accepted** |
| L3 | Middleware ordering | Mandatory | Correlation early; WP-2.2 auth unchanged | **Accepted** |
| L4 | No new public telemetry HTTP routes | Mandatory | None in WP-2.3 | **Accepted** |
| L5 | Criterion #2 = harness contract | Mandatory | No BullMQ/Redis bus claim | **Accepted** |
| C3 | Foundation logger table vs App Arch Observability | Mandatory | Resolved by D-Obs-1 (both preserved) | **Accepted** |
| C4 | Cross-host without job bus | Mandatory | Harness DoD; bus deferred | **Accepted** / bus **Deferred** |
| C5 | WP-2.2 coupling | Mandatory | Soft coexistence only; no Auth redesign | **Accepted** |
| C6 | Value-shaped secret redact | Recommended | Extend redact + tests in WP-2.3 | **Accepted** |
| C8 | Admin telemetry surfaces | Mandatory | Forbidden in WP-2.3 | **Accepted** |
| R-Echo | Echo `x-correlation-id` on API responses | Recommended | Echo response header | **Accepted** |
| R-Labels | Metric/trace attribute allow-list | Recommended | Allow-list; forbid tokens/bodies | **Accepted** |
| F1 | Full queue bus correlation | Future | Defer to job infrastructure WP | **Deferred** |
| F2 | AI/workflow/connector semantic spans | Future | Later WPs | **Deferred** |
| F3 | SIEM / prod fail-closed telemetry / web SPA OTel | Future | Later | **Deferred** |
| F4 | Tenancy-dimensioned metrics | Future | WP-2.4+ | **Deferred** |
| F5 | Dedicated observability ADR | Future | Not required now | **Deferred** / **Rejected** as prerequisite |

---

## Decision Log

### D-Obs-1 — Package boundary

**Observation:** New `@ati/observability` vs expand `@ati/logger` only.  
**Decision:** **Accepted** — Introduce **`packages/observability` (`@ati/observability`)** for correlation context, metrics port, trace port, obs config types/bootstrap helpers. Keep **`@ati/logger`** for level, redact, and structured logger interface / Pino binding helpers.  
**Rationale:** Application Architecture separates Logging vs Observability; avoids logger junk drawer; aligns Independent Review lean.  
**Implementation Constraints:** Nest/React-free; public API via `src/index.ts` only; no Domain/AI semantic APIs.  
**Documentation Changes Required:** Final Plan locks package list; update packages README at implementation closeout.

---

### D-Obs-2 — Logging runtime binding

**Observation:** Pino required vs console JSON as equal peer.  
**Decision:** **Accepted** — **Pino is required** for `apps/api` and `apps/worker` **runtime** structured logging. Console/no-op sinks allowed in **unit tests** and optional early boot fallback only if Pino init fails (still emit once via single path).  
**Rationale:** Foundation stack (ADR 0002 / ARCHITECTURE.md) mandates Pino; prevents permanent console divergence (C10).  
**Implementation Constraints:** Host adapter wires Pino; `@ati/logger` must not hard-depend on Nest; Pino dependency may live in apps and/or logger package as binding implementation without exporting Nest types.  
**Documentation Changes Required:** Final Plan technical objectives state “Pino runtime binding required.”

---

### D-Obs-3 — OpenTelemetry SDK placement

**Observation:** OTel SDK in shared package vs host adapters.  
**Decision:** **Accepted** — **OTel SDK and exporters live in host adapters** (`apps/api`, `apps/worker`). `@ati/observability` exposes **ports, types, correlation helpers, and thin config schemas only** (Nest-free).  
**Rationale:** Limits ESM/Jest blast radius; keeps packages framework-light; matches WP-2.2 auth pattern (core package + host wiring).  
**Implementation Constraints:** In-memory/no-op exporters for CI; optional OTLP behind config; no synchronous export flush on request path.  
**Documentation Changes Required:** Final Plan Architecture Impact and T7 constraints updated.

---

### D-Obs-4 / L2 — Exporter failure vs READY

**Observation:** Fail-fast vs never block READY.  
**Decision:** **Accepted** — Telemetry exporter/collector failure **must not block** Spine **READY**. Degrade to no-op/log-local; boot continues. Prod fail-closed telemetry is **out of scope** (Deferred F3).  
**Rationale:** Observability must not become a hard dependency that takes the platform offline; matches plan’s degrade default and Independent Review mandatory #3.  
**Implementation Constraints:** Health `/health/live` and `/health/ready` semantics unchanged; readiness contributors must not require remote collector.  
**Documentation Changes Required:** Acceptance criterion #7 explicitly cites this decision.

---

### D-Obs-5 — Auth operational metrics

**Observation:** Include WP-2.2 deferred auth OTel metrics or re-defer.  
**Decision:** **Accepted** — Include **coarse** counters only: auth **allow / deny / error** (and equivalent worker service-principal outcomes) with **no** subject, raw claims, or token material in labels.  
**Rationale:** Closes WP-2.2 deferred item cheaply; improves ops diagnosability without AuthZ redesign.  
**Implementation Constraints:** Labels limited to outcome class, host, optional route pattern; never principal id/email; no change to deny-by-default or public-route exact match.  
**Documentation Changes Required:** Final Plan marks T8 as **in scope (required)**, not optional.

---

### D-Obs-6 — Correlation header

**Observation:** `x-correlation-id` vs branded `ATI_*` header.  
**Decision:** **Accepted** — Wire header is **`x-correlation-id`**. Constant lives in `@ati/shared-constants`.  
**Rationale:** Foundation Architecture §4.6 already specifies this header.  
**Implementation Constraints:** Accept inbound header if present and well-formed; otherwise mint new `CorrelationId`; normalize case per HTTP conventions.  
**Documentation Changes Required:** Final Plan removes branded-header alternative.

---

### D-Obs-7 / L4 — Worker correlation trust

**Observation:** Mint-always vs accept inbound; untrusted client risk.  
**Decision:** **Accepted (Modified trust model)** —  
- **Worker job/boot context:** Accept correlation ID only from a **trusted job envelope** or **test/harness setter** API used in-process.  
- If absent/invalid → **mint** new ID.  
- **Do not** accept arbitrary untrusted HTTP client correlation as authoritative on worker privileged surfaces without an explicit trusted-envelope path.  
- **API:** May accept client `x-correlation-id` for interactive requests (ops continuity) after validation (non-empty, length-capped, charset-safe).  
**Rationale:** Prevents log-signal pollution / confusion on worker; preserves API ops DX.  
**Implementation Constraints:** Correlation never authorizes or denies; document “diagnostic only.”  
**Documentation Changes Required:** Final Plan worker section states trust boundary; add acceptance note.

---

### L1 — Single logging path

**Observation:** Dual Spine console + new pipeline risk (C2).  
**Decision:** **Accepted** — **One write path per log event.** Host-local Spine `LoggerService` **delegates** to the approved structured logger binding (Pino via `@ati/logger` / observability correlation binding). No duplicate console JSON + Pino lines for the same event in runtime.  
**Rationale:** Mandatory Independent Review lock; reduces noise and cost.  
**Implementation Constraints:** Integration test or code review proof of single sink; unit tests may use injectable sink.  
**Documentation Changes Required:** Add explicit acceptance criterion for single write path.

---

### L3 — Middleware / hook ordering

**Observation:** Correlation vs WP-2.2 auth order.  
**Decision:** **Accepted** — On `apps/api`: establish **correlation context first** (or equivalently before business handlers), then existing **auth middleware/guards** unchanged. Public-route **exact match** and deny-by-default preserved. Worker: set correlation in trusted job/boot hook before service-principal auth evaluation where applicable, without changing AuthZ rules.  
**Rationale:** Prevents auth regressions; ensures logs from auth path carry correlation.  
**Implementation Constraints:** Integration tests: health allow-list still public; protected route still requires auth; both paths log same correlation id when applicable.  
**Documentation Changes Required:** Final Plan T5/T6 include ordering diagram or bullet sequence.

---

### L4 — No new public telemetry HTTP routes

**Observation:** Optional diagnostics/telemetry admin surfaces (C8).  
**Decision:** **Accepted** — **No new** public or authenticated telemetry/diagnostics **HTTP routes** in WP-2.3. Existing health endpoints unchanged. Spine `DiagnosticsService` remains in-process.  
**Rationale:** Avoids auth allow-list churn and new attack surface.  
**Implementation Constraints:** Do not add `/metrics` scrape endpoint unless future WP + ADR.  
**Documentation Changes Required:** Out-of-scope table reinforced.

---

### L5 / C4 — Cross-host continuity DoD

**Observation:** Harness vs claiming job-bus continuity.  
**Decision:** **Accepted** — WP-2.3 delivers a **proven propagation contract** via **host-local job context harness** (and documented envelope field). **BullMQ/Redis bus propagation is Deferred (F1).**  
**Rationale:** No job bus in baseline yet; honesty in acceptance.  
**Implementation Constraints:** Implementation Report must not claim production queue correlation.  
**Documentation Changes Required:** Rewrite acceptance criterion #2 accordingly.

---

### C5 — WP-2.2 dependency class

**Observation:** Hard vs soft coupling to Auth.  
**Decision:** **Accepted** — Hard deps remain **WP-1.3 + WP-2.1** (WBS). WP-2.2 is **coexistence + auth metrics (D-Obs-5)** only. **No** AuthN/AuthZ semantic changes.  
**Rationale:** Preserves closed WP-2.2; avoids unnecessary coupling.  
**Implementation Constraints:** Observability must not import AuthZ evaluators for control flow.  
**Documentation Changes Required:** Final Plan Dependencies table labels WP-2.2 as soft/coexistence.

---

### C6 — Redaction strengthening

**Observation:** Key-name-only redact residual risk.  
**Decision:** **Accepted** — Extend `@ati/logger` redact (or shared helper) to catch **bearer/JWT-shaped values** under benign keys; add automated tests.  
**Rationale:** Recommended security hardening; low cost.  
**Implementation Constraints:** Redact Authorization headers and JWT-like strings before log/export; exporters never receive raw tokens.  
**Documentation Changes Required:** Acceptance criterion #6 cites value-shaped cases.

---

### R-Echo — Response correlation header

**Observation:** Echo `x-correlation-id` on API responses.  
**Decision:** **Accepted** — API sets response header `x-correlation-id` to the request correlation ID.  
**Rationale:** Ops DX; Foundation-friendly; no identity embedded.  
**Implementation Constraints:** Header only; no principal fields.  
**Documentation Changes Required:** In-scope API wiring note.

---

### R-Labels — Attribute allow-list

**Observation:** Cardinality / secret labels.  
**Decision:** **Accepted** — Metrics/traces use an **allow-listed** attribute set (e.g., service, host, correlationId, route pattern, outcome/error code). Forbid Authorization, tokens, bodies, emails, raw URLs with query secrets.  
**Rationale:** Performance + security.  
**Implementation Constraints:** Document allow-list in package README / Final Plan.  
**Documentation Changes Required:** Add to Technical Objectives / constraints.

---

### F1–F5 — Deferred / rejected-as-prerequisite

| ID | Decision | Notes |
|----|----------|-------|
| F1 Job bus correlation | **Deferred** | When queue infrastructure lands |
| F2 AI/workflow/connector spans | **Deferred** | Later product WPs |
| F3 SIEM / fail-closed / web OTel | **Deferred** | Ops/product later |
| F4 Tenancy metrics | **Deferred** | WP-2.4+ |
| F5 New observability ADR now | **Rejected** as required for WP-2.3 | Existing ADRs 0002, 0013, 0014, 0015 + architectures suffice; create ADR only if a future change breaks Foundation package topology or READY policy |

---

## Required Plan Updates

The **Final Pre-Implementation Plan** must incorporate:

1. Locked decisions D-Obs-1…D-Obs-7 and locks L1–L5 as binding constraints (remove “open decision” language).  
2. T8 auth metrics = **required**.  
3. Acceptance criteria updates: single write path; D-Obs-4 READY degrade; harness-only criterion #2; value-shaped redact tests; middleware order verification; no new HTTP telemetry routes.  
4. Dependencies: WP-2.2 labeled coexistence/soft.  
5. Package creation: `@ati/observability` required; `@ati/logger` evolution scoped.  
6. Correlation: diagnostic-only; API request accept + response echo; worker trusted-envelope/mint rules.  
7. Out of scope: prod fail-closed telemetry, `/metrics` endpoint, job-bus claim, Domain/AI spans.  
8. Reference this Decision Resolution document as architecture authority for implementation.

**Do not** modify architecture baseline docs or create ADRs in the Final Plan step unless a new baseline break appears (none identified).

---

## Risk Register

### Risks accepted

| Risk | Acceptance |
|------|------------|
| Telemetry degrade when collector down | Accepted (D-Obs-4) — availability over strict telemetry |
| Client-supplied API correlation IDs | Accepted with validation/length caps — diagnostic only |
| Coarse auth counters enumeration | Accepted — no subjects; outcome classes only |
| Harness ≠ production bus continuity | Accepted — honest DoD |
| OTel/Pino ESM test friction | Accepted — host adapters + ignore patterns |

### Risks remaining (managed, not closed)

| Risk | Residual handling |
|------|-------------------|
| Label cardinality drift | Allow-list + code review |
| Value redact false negatives | Tests + iterative patterns |
| Dual-sink regression | Single-path acceptance test |
| Auth middleware order regression | Integration tests with health + protected routes |
| Scope creep to mini-APM | Out-of-scope list + closeout gate |
| WP-2.2 uncommitted baseline on branch | Implementation auth after WP-2.2 commit/tag |

---

## Final Architecture Decision

### Accepted decisions (binding)

- `@ati/observability` + narrow `@ati/logger`  
- Pino runtime binding (api/worker)  
- OTel SDK in hosts only  
- READY never blocked by exporter failure  
- Coarse auth allow/deny/error metrics in WP-2.3  
- Header `x-correlation-id` (+ response echo on API)  
- Worker trusted-envelope/mint trust model  
- Single log write path  
- Correlation-before-auth ordering; auth semantics unchanged  
- No new telemetry HTTP routes  
- Harness-proven propagation contract  
- Value-shaped redact hardening  
- Attribute allow-list  

### Deferred decisions

- Job-bus correlation, AI/workflow/connector spans, SIEM/fail-closed/web OTel, tenancy metrics, dedicated observability ADR (unless future break)

### New ADRs required?

**No.**  

**Why:** WP-2.3 implements already-accepted Foundation and Application Architecture (Pino, OpenTelemetry, `x-correlation-id`, Observability package role, audit≠observability). Decisions here are **work-package binding resolutions**, not baseline-breaking architecture changes. A new ADR would be warranted only if READY were made collector-dependent, packages absorbed Domain semantics, or modular-monolith/package topology were redefined.

### Implementation authorization

**Not granted** by this document. Proceed to **Final Pre-Implementation Plan**, then separate implementation authorization.

---

## Final Verdict

**APPROVED FOR FINAL PRE-IMPLEMENTATION PLAN**

---

## Planning Status

**WP-2.3 Architecture Decision Resolution Complete**

**Ready for Final Pre-Implementation Plan**
