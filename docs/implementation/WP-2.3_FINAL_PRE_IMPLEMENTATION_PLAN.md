# WP-2.3_FINAL_PRE_IMPLEMENTATION_PLAN.md
## Final Pre-Implementation Plan — Observability Baseline

**Work Package:** WP-2.3 — Observability Baseline  
**Role:** ATI Platform Principal Enterprise Architect  
**Date:** 2026-07-26  
**Status:** **Final** — authoritative implementation baseline (pending Implementation Authorization)  
**Implementation:** **Not authorized**

**Governance predecessors**

| Stage | Result |
|-------|--------|
| Pre-Implementation Plan | Complete |
| Architecture Review | APPROVED WITH OBSERVATIONS |
| Architecture Decision Resolution | APPROVED FOR FINAL PRE-IMPLEMENTATION PLAN |

**Architecture authority for this WP:** [WP-2.3_ARCHITECTURE_DECISION_RESOLUTION.md](./WP-2.3_ARCHITECTURE_DECISION_RESOLUTION.md)  
**Prerequisite baseline:** WP-1.1–WP-2.2 (WP-2.2 Ready for Commit & Tag; implementation of WP-2.3 should follow WP-2.2 commit/tag)

---

## Executive Summary

WP-2.3 delivers the platform **Observability Baseline**: structured **Pino** logging with **single write path**, **`x-correlation-id`** propagation (API accept + response echo; worker trusted-envelope/mint), **basic metrics and traces** via OpenTelemetry **ports** with **SDK/exporters in api/worker hosts**, and **coarse auth allow/deny/error metrics** — without Domain/AI/Workflow product observability, SIEM, tenancy, or AuthN/AuthZ redesign.

**Package topology (locked):** new **`@ati/observability`**; **`@ati/logger`** remains logging helpers/bindings only. Telemetry exporter failure **must not block READY**. No new telemetry HTTP routes. Cross-host continuity is proven via **host-local job context harness** (not BullMQ/Redis bus).

This document **supersedes** the draft Pre-Implementation Plan for implementation purposes. Scope is unchanged aside from locking decisions that were already in-plan as open options (auth metrics elevated from optional → required; packaging/Pino/OTel/READY/header/trust locked). **No unauthorized scope expansion.**

**Final Verdict:** **APPROVED FOR IMPLEMENTATION AUTHORIZATION**

---

## Final Scope

### In Scope

| Area | Binding detail |
|------|----------------|
| `@ati/observability` | Correlation context, metrics port, trace port, obs config types/helpers; Nest/React-free; public API via `src/index.ts` only |
| `@ati/logger` evolution | Level, redact (incl. value-shaped secrets), structured logger interface / Pino binding helpers — **not** OTel metrics/traces ownership |
| Correlation | Header `x-correlation-id` (constant in `@ati/shared-constants`); API accept if well-formed else mint; API **echo** on response; worker accept from **trusted job envelope / harness** only else mint; diagnostic-only (never authorizes) |
| Logging | **Pino required** on api/worker **runtime**; **single write path** — Spine `LoggerService` delegates to facade; no duplicate console+Pino for same event |
| Metrics | Host request/job counters, error counters; **coarse auth allow/deny/error** counters; allow-listed labels only |
| Traces | Minimal request span (api) and job/boot span (worker or harness); attribute allow-list |
| OTel | **SDK + exporters in host adapters only**; in-memory/no-op for CI; optional OTLP via config; async export; no sync flush on request path |
| Config | `ATI_*` keys for obs enablement, OTLP endpoint, service name, sample ratio; schema validation at boot |
| Host wiring | `apps/api` middleware/interceptors; `apps/worker` job/boot hooks; Nest stays in apps |
| READY / health | Existing `/health/live`, `/health/ready` unchanged; exporter failure **degrades**, does **not** block READY |
| Security | Redact keys + bearer/JWT-shaped values; exporters never receive Authorization/raw tokens |
| Tests + docs | Package/host tests; Implementation Report; Deferred Capability Register; closeout index updates |

### Out of Scope (unchanged / reinforced)

| Item | Notes |
|------|-------|
| Domain / Workflow / AI engine product observability | Deferred |
| Integration connector health product signals | Deferred |
| Decision / Evidence / Security audit product stores | Observability ≠ audit |
| SIEM, APM product, dashboards-as-product, `/metrics` scrape endpoint | Deferred |
| Prod fail-closed telemetry (READY depends on collector) | Deferred |
| AuthN/AuthZ rule changes, public-route policy, roles | WP-2.2 closed |
| Tenancy / workspace context | WP-2.4 |
| `apps/web` observability product | Deferred |
| BullMQ/Redis job-bus correlation continuity | Deferred (harness only) |
| Database / Redis product metrics | Out |
| `@ati/spine` / `@ati/runtime` / Domain packages | Forbidden |
| New ADRs for this WP | Not required (Decision Resolution) |

**Scope validation:** No expansion beyond draft plan + accepted Decision Resolution items already anticipated (D-Obs-5 auth metrics now required; package/`x-correlation-id`/Pino/OTel/READY/trust locks).

---

## Architecture Baseline

### Packages & responsibilities

| Package | Responsibility |
|---------|----------------|
| `@ati/observability` | Correlation context API; metrics/trace **ports**; obs config types/helpers; bootstrap helpers without Nest/OTel SDK |
| `@ati/logger` | Log level, redact (key + value-shaped), structured logger contract / Pino binding helpers |
| `@ati/shared-constants` | `x-correlation-id` header constant; `ATI_*` obs env key names |
| `@ati/shared-types` | `CorrelationId` (and context types if needed) |
| `@ati/config` / `@ati/shared-validation` | Obs config load/schema as needed |
| `@ati/errors` | Stable codes for obs/config failures if required |
| `@ati/auth` | **Unchanged public API**; hosts may emit coarse outcome metrics only |

### Dependency boundaries

| From → To | Allowed? |
|-----------|----------|
| `@ati/observability` → Nest/React/Express | **No** |
| `@ati/observability` → OTel SDK | **No** (ports only) |
| Hosts → `@ati/observability`, `@ati/logger`, OTel SDK, Pino | **Yes** |
| Observability → AuthZ control flow | **No** |
| Spine orchestration extraction to packages | **No** |

**Hard WP deps (WBS):** WP-1.3, WP-2.1.  
**Soft / coexistence:** WP-2.2 (auth metrics + preserve semantics).

### Public API expectations

- `@ati/observability` and `@ati/logger` export only via package `index.ts`.
- No intentional breaking change to `@ati/auth` public API.
- HTTP: existing health routes only; **no new** telemetry/diagnostics routes.
- API may read/write `x-correlation-id` header (request + response).

### Internal API expectations

- Host correlation middleware/hooks; request/job context holders.
- Spine `LoggerService` / `DiagnosticsService` consume facades; diagnostics remain in-process.
- Job context harness proves envelope field propagation contract.

### Security boundaries

- Correlation is **diagnostic only** — never authorize/deny.
- Allow-listed metric/trace attributes; forbid tokens, bodies, emails, raw secret query URLs.
- Redact Authorization and JWT-shaped values before log/export.
- WP-2.2 deny-by-default and **exact** public-route match preserved.

### Performance expectations

- Configurable sampling (default low/off in tests).
- Baseline spans only; async export; no sync flush on hot path.
- Controlled label cardinality.
- Telemetry init must not materially delay READY under degrade policy.

### Middleware / hook order (binding)

**API:** (1) Establish correlation context → (2) existing auth middleware/guards unchanged → (3) handlers. Echo `x-correlation-id` on response.  
**Worker:** Set correlation from trusted envelope/harness or mint → service-principal auth unchanged → handlers.

---

## Accepted Decisions

| ID | Decision | Implementation impact |
|----|----------|----------------------|
| **D-Obs-1** | Create `@ati/observability`; narrow `@ati/logger` | New package scaffold; do not put OTel metrics/traces in logger |
| **D-Obs-2** | Pino required on api/worker runtime | Host (and/or logger binding) depends on Pino; tests may use no-op/console sink |
| **D-Obs-3** | OTel SDK in hosts only | Apps add OTel deps/adapters; package stays ports/types |
| **D-Obs-4** | Exporter failure never blocks READY | No readiness contributor for remote collector; degrade to no-op |
| **D-Obs-5** | Coarse auth allow/deny/error metrics **required** | T8 mandatory; wire at auth boundaries without identity labels |
| **D-Obs-6** | Header `x-correlation-id` | Constant in shared-constants; API accept/mint + response echo |
| **D-Obs-7** | Worker trusted-envelope/harness or mint | No untrusted client correlation authority on worker |
| **L1** | Single log write path | Spine logger delegates; ban dual sinks for same event |
| **L3** | Correlation before auth | Middleware order + integration tests |
| **L4** | No new telemetry HTTP routes | Do not add `/metrics` or admin telemetry endpoints |
| **L5** | Harness = cross-host DoD | Document envelope; do not claim job bus |
| **C6** | Value-shaped redact | Extend `@ati/logger` redact + tests |
| **R-Labels** | Attribute allow-list | Enforce in ports/adapters |
| **R-Echo** | Response `x-correlation-id` | API middleware sets header |
| **F1–F5** | Deferred / no new ADR | Record in Deferred Capability Register at delivery |

Full rationale: [WP-2.3_ARCHITECTURE_DECISION_RESOLUTION.md](./WP-2.3_ARCHITECTURE_DECISION_RESOLUTION.md).

---

## Updated Risks

| Type | Risk | Handling |
|------|------|----------|
| Technical | OTel/Pino ESM + Jest friction | Host adapters; transformIgnorePatterns; in-memory exporters |
| Technical | Dual-sink regression | L1 acceptance test / review proof |
| Technical | Trace/label cardinality cost | Sampling + allow-list |
| Technical | Value-redact false negatives | Pattern tests; iterative tighten |
| Delivery | Scope creep to mini-APM/SIEM | Out-of-scope gate at Self/Independent Review |
| Delivery | WP-2.2 not yet committed/tagged | Prefer implement after WP-2.2 commit/tag |
| Operational | Collector down | **Accepted** — degrade, READY stays up (D-Obs-4) |
| Operational | Client-supplied API correlation | **Accepted** — validated, diagnostic only |
| Security | Auth counter enumeration | **Accepted** — coarse classes, no subjects |
| Architectural | Logs/metrics as Sources of Truth | Explicit non-goal; Spine constraint |

**Remaining accepted risks:** degrade-on-collector-down; validated client correlation on API; coarse auth counters; harness ≠ production bus.

---

## Acceptance Criteria

All criteria are complete, testable, measurable, and aligned with approved architecture:

1. **Correlated logs (API):** One request yields structured Pino log lines sharing one `correlationId` across Application-boundary handling.  
2. **Propagation contract:** Documented trusted job envelope field + **host-local harness** test proves correlation continue/mint rules; **no** BullMQ/Redis bus claim.  
3. **Worker correlation trust:** Invalid/absent envelope → mint; untrusted client override not treated as authoritative on worker.  
4. **Failure classes:** Boot/runtime failures emit stable error codes/classes into logs and/or metrics (no stack-as-UX).  
5. **Basic metrics:** Request or job counters + error counters recordable via metrics port (in-memory exporter in tests).  
6. **Auth metrics:** Coarse allow/deny/error counters emitted; labels contain no subject/token/claims.  
7. **Basic traces:** ≥1 API request span and ≥1 worker job/boot (or harness) span via trace port (in-memory/no-op OK in CI).  
8. **Security redact:** Tests prove Authorization / JWT-shaped values redacted from log fields; no secrets in diagnostics snapshots; exporters do not receive raw tokens.  
9. **Single write path:** Runtime path does not emit duplicate console JSON + Pino lines for the same event.  
10. **READY degrade:** Simulated exporter failure does **not** prevent READY; health routes unchanged.  
11. **Auth behaviour preserved:** WP-2.2 exact public-route match and deny-by-default unchanged; correlation middleware order verified by integration tests (health public; protected still auth-gated).  
12. **Package purity:** `@ati/observability` / `@ati/logger` Nest/React-free; public API via `index.ts` only.  
13. **No new telemetry HTTP routes:** Confirmed absent.  
14. **API header echo:** Response includes `x-correlation-id`.  
15. **Ops diagnosability:** Implementation Report shows operator can obtain host identity, correlation id, and failure class from a simulated failure using baseline signals only.  
16. **Delivery artifacts:** Implementation Report, Deferred Capability Register, green tests for touched packages/apps, indexes updated at closeout.  
17. **Non-goals held:** No Domain modules, tenancy, SIEM product, Decision/Evidence store, web OTel product, job-bus claim.

---

## Final WBS

Existing T1–T9 retained. No new tasks. Adjustments: **T1 complete** (Decision Resolution done); **T8 required**.

| Task | Purpose | Deliverables | Dependencies | Status / note |
|------|---------|--------------|--------------|---------------|
| **T1** | Lock architecture decisions | Decision Resolution (done); this Final Plan | Architecture Review | **Complete** — do not re-open D-Obs without change control |
| **T2** | Scaffold `@ati/observability` | Package, `index.ts`, ports/types, unit tests, README | T1 | Create package per D-Obs-1 |
| **T3** | Shared constants / types / config | `x-correlation-id`, `ATI_*` obs keys, config/validation | T1 | Parallel with early T2 |
| **T4** | Logging binding + single path | Pino binding; Spine `LoggerService` delegates; redact upgrades; tests | T2, T3 | D-Obs-2, L1, C6 |
| **T5** | API host wiring | Correlation middleware (order L3), response echo, metrics/traces hooks, integration tests | T2–T4 | Preserve WP-2.2 auth |
| **T6** | Worker host wiring | Trusted-envelope/harness correlation, metrics/traces, integration tests | T2–T4 | D-Obs-7 |
| **T7** | Exporters + READY degrade | Host OTel adapters; no-op/OTLP; fail-open READY; tests | T2, T3, T5/T6 | D-Obs-3, D-Obs-4 |
| **T8** | Auth operational metrics | Coarse allow/deny/error counters on api/worker auth paths; tests | T5, T6, T7 | **Required** (D-Obs-5) |
| **T9** | Verification & documentation | Full targeted tests; Implementation Report; Deferred Register; closeout indexes | T4–T8 | Includes criteria 15–17 |

**Execution order:** T1 (done) → T2 ∥ T3 → T4 → T5 ∥ T6 → T7 → T8 → T9.

---

## Exit Criteria

This Final Pre-Implementation Plan is the **authoritative implementation baseline** for WP-2.3.

WP-2.3 may proceed to:

**Implementation Authorization**

**only if** this Final Pre-Implementation Plan is **approved**.

Until Implementation Authorization is explicitly granted:

- Do **not** implement code  
- Do **not** create ADRs  
- Do **not** modify repository source for WP-2.3 delivery  

After authorization, implement strictly to this plan and [WP-2.3_ARCHITECTURE_DECISION_RESOLUTION.md](./WP-2.3_ARCHITECTURE_DECISION_RESOLUTION.md).

---

## Final Verdict

**APPROVED FOR IMPLEMENTATION AUTHORIZATION**

---

## Planning Status

**WP-2.3 Final Pre-Implementation Plan Complete**

**Ready for Implementation Authorization**
