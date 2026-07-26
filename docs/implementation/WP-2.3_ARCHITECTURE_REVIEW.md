# WP-2.3_ARCHITECTURE_REVIEW.md
## Independent Architecture Review — Observability Baseline

**Work Package:** WP-2.3 — Observability Baseline  
**Role:** Independent Principal Enterprise Architect  
**Date:** 2026-07-26  
**Input:** `WP-2.3_PRE_IMPLEMENTATION_PLAN.md` (Draft — awaiting Architecture Review)  
**Implementation:** Not authorized · **ADRs:** Not created by this review

---

## Executive Summary

The WP-2.3 Pre-Implementation Plan is **architecturally suitable** as a Shared Infrastructure baseline. It aligns with the Implementation WBS (logging, correlation, basic metrics/traces), Foundation Architecture (Pino + OpenTelemetry, `x-correlation-id`), Application Architecture (Observability as a platform package role distinct from Logging), Security & Governance (observability ≠ audit; no secret channels), and Platform Spine Engineering Spec §12 (consumed at host baseline depth only).

Scope control is strong: Spine ownership, WP-2.2 AuthN/AuthZ semantics, Domain/AI/Workflow product observability, SIEM/dashboards, tenancy, and web telemetry product are correctly excluded. Package purity (Nest/React-free facades; host adapters) matches WP-2.1/WP-2.2 proven patterns. Acceptance criteria are largely measurable and testable.

**Seven open decisions (D-Obs-1…D-Obs-7) are unresolved.** That is appropriate for this gate but **blocks Final Plan / implementation** until Architecture Decision Resolution. A small set of mandatory clarifications (single log write path, exporter fail policy default, middleware order vs auth, worker correlation trust model, no new public telemetry routes by default) must be locked before coding—not because the proposed architecture is wrong, but because leaving them open invites inconsistent implementation.

**Final Verdict:** **APPROVED WITH OBSERVATIONS**

---

## Architecture Strengths

1. **WBS fidelity** — Purpose, outcomes, and completion criteria match `IMPLEMENTATION_ROADMAP_AND_WBS.md` WP-2.3 and contribute to Milestone M2.
2. **Boundary discipline** — Explicit non-goals protect closed WPs (Spine, Auth) and defer Domain/Integration/AI meaning correctly.
3. **Facade + host adapter pattern** — Same successful separation as `@ati/auth` / Nest wiring; supports extensibility without framework lock-in in packages.
4. **Security posture stated up front** — Redaction reuse, deny Authorization/JWT in exporters, allow-listed attributes, auth metrics without subjects.
5. **Operational realism** — In-memory/no-op exporters for CI; optional OTLP; no mandatory cloud collector for acceptance.
6. **Open decisions are explicit** — Packaging, Pino, OTel placement, READY policy, auth metrics, header name, worker trust are listed rather than silently assumed.
7. **Acceptance criteria** — Correlation, metrics/traces ports, redaction tests, behaviour preservation, and ops diagnosability are concrete enough for verification.
8. **Audit complementarity** — Correctly refuses to substitute Decision/Evidence/security audit stores (ADR 0014).

---

## Architecture Concerns

| ID | Concern | Severity | Notes |
|----|---------|----------|-------|
| C1 | **D-Obs-1…7 unlocked** | High (process) | Direction OK; implementation unsafe until Decision Resolution |
| C2 | **Dual logging / dual sinks** | High | Spine `LoggerService` console JSON vs new pipeline — plan notes risk but does not mandate single write path |
| C3 | **Foundation package table vs App Arch** | Medium | `ARCHITECTURE.md` lists `logger` (facade + bindings); App Arch lists separate Observability package — tension must be resolved via D-Obs-1 without bloating `@ati/logger` into a junk drawer |
| C4 | **Cross-host continuity without job bus** | Medium | Criterion #2 allows harness — good — but must not claim production queue propagation as delivered |
| C5 | **WP-2.2 coupling ambiguity** | Low–Medium | WBS hard deps are WP-1.3 + WP-2.1; plan correctly treats WP-2.2 as coexistence + optional metrics — must not make Auth redesign a soft dependency |
| C6 | **Key-name-only redact today** | Medium | `@ati/logger` redact matches sensitive *keys*; bearer/JWT-shaped *values* under benign keys remain a residual leak risk |
| C7 | **Worker accepting inbound correlation** | Medium | Untrusted correlation IDs can pollute ops signals or enable log injection-style confusion if worker exposes HTTP without trust rules (D-Obs-7) |
| C8 | **Optional admin telemetry surfaces** | Low | Plan defaults to none — must stay none unless separately justified (avoid new attack surface / auth allow-list churn) |
| C9 | **OTel SDK weight & ESM** | Low–Medium | Known Jest/ESM friction (WP-2.2 jose lesson); favors host-local SDK adapters (D-Obs-3 lean) |
| C10 | **Pino deferred as optional** | Medium | Foundation ADR/stack names Pino as standard; leaving console-only as equal peer risks permanent divergence |

No hidden Domain/SIEM scope expansion detected. No redesign of WP-2.2 auth boundaries proposed.

---

## Risk Assessment

### Risks acknowledged in the plan (adequate)

ESM/Jest friction; dual logging; trace overhead; Domain semantics creep; logs-as-truth; secret leakage; SIEM scope creep; collector availability; WP-2.2 commit/tag sequencing; auth metric enumeration.

### Additional architectural risks (this review)

| Risk | Mitigation |
|------|------------|
| **Correlation ID as security boundary confusion** | Correlation is diagnostic only — never authorize/deny based on correlation ID; document in Final Plan |
| **Metric label cardinality explosion** (route templates, raw URLs, subjects) | Allow-list labels; prefer route patterns / error codes over raw paths and identity |
| **Middleware ordering regressions** vs WP-2.2 public-route exact match | Correlation middleware early; auth middleware/guards unchanged; integration tests cover health allow-list + correlated protected route |
| **Exporter backpressure affecting latency** | Async export; timeouts; never synchronous flush on request path for baseline |
| **Incomplete WP-2.2 baseline on `develop` until commit/tag** | Implementation authorization should follow WP-2.2 commit/tag (plan already notes) |

---

## Package Review

| Question | Assessment |
|----------|------------|
| Is a new package justified? | **Yes (preferred).** Application Architecture separates **Logging** vs **Observability**. Current `@ati/logger` is helpers only (level + redact)—not a full facade. Metrics/trace ports and correlation context belong in **`@ati/observability`**, not stuffed into logger. |
| Is `@ati/observability` the correct boundary? | **Yes**, for correlation context, metrics port, trace port, obs config types/bootstrap helpers. Keep Nest-free; public API via `index.ts` only. |
| Are existing responsibilities preserved? | **Yes if constrained:** `@ati/logger` remains log-level/redact (+ optional structured logger *interface* / Pino binding helpers). `@ati/auth` untouched in public API. Spine orchestration stays host-local. Do **not** create `@ati/spine` / `@ati/runtime`. |
| Anti-pattern to reject | Expanding `@ati/logger` alone to own OTel metrics/traces/correlation **and** logging — recreates a shared junk drawer and fights App Arch. |

**Independent lean (for Decision Resolution, not an ADR):** **D-Obs-1 = introduce `@ati/observability`**; evolve `@ati/logger` narrowly; OTel SDK adapters in hosts (D-Obs-3).

---

## Dependency Review

| Dependency | Necessary? | Coupling assessment |
|------------|------------|---------------------|
| Platform Spine (Logger/Diagnostics/boot) | Yes | Consume/delegate; do not extract orchestration |
| WP-2.1 shared packages | Yes | Constants, types, config, errors, logger helpers |
| WP-2.2 `@ati/auth` | Soft / coexistence | Required for safe attribute policy and optional counters only; **no AuthZ logic in observability** |
| Logging framework (Pino) | Yes (Foundation) | Binding via adapter; package remains framework-light |
| Metrics/tracing (OTel) | Yes (Foundation) | Behind ports; vendor-neutral exporter |
| External collectors | No for acceptance | Correctly optional |
| Job bus / Redis / DB | No | Harness acceptable; avoid false dependency |

**Unnecessary coupling to avoid:** Observability importing Nest; Auth importing OTel; Domain error taxonomies inside metrics; tying READY to remote collector health (unless Decision Resolution explicitly overrides for prod-only—see Recommendations).

---

## Observability Design

| Concern | Review |
|---------|--------|
| Correlated logging | Sound; must bind one correlation ID into structured fields consistently on api + worker |
| Metrics | Host counters/error classes appropriate; keep cardinality low |
| Tracing | Minimal request/job spans appropriate; defer AI/workflow/connector spans |
| Context propagation | Header + job envelope / harness is the right baseline; full bus later |
| API integration | Application-boundary middleware/interceptors correct; Spine unchanged |
| Worker integration | Job/boot context hooks correct; trust model for inbound IDs must be locked |
| Future expansion | Ports + host adapters support later Domain/AI instrumentation without redesign **if** package API stays primitive |

Design supports expansion without unnecessary complexity **provided** D-Obs decisions lock a thin baseline (not a mini-APM product).

---

## Security Review

| Check | Result |
|-------|--------|
| No sensitive data in logs (intent) | Pass (stated) |
| Redaction strategy | Partial — key-based redact exists; strengthen for value-shaped secrets (**Recommended**) |
| Trace correlation vs security | Pass if correlation never authorizes and attributes are allow-listed |
| Auth boundaries unchanged | Pass (explicit non-goal); preserve WP-2.2 exact public-route match and deny-by-default |
| Exporters | Must strip Authorization / raw tokens (**Mandatory** in Final Plan tests) |
| New HTTP surfaces | Default none (**Mandatory**); avoids allow-list churn |

Correlation IDs are not secrets but can appear in client-visible responses if echoed—Final Plan should state whether API **returns** `x-correlation-id` (ops-friendly) without embedding identity.

---

## Performance Review

| Area | Assessment |
|------|------------|
| Logging overhead | Structured JSON acceptable; avoid sync disk/network on hot path; single sink reduces duplicate cost |
| Metrics overhead | Counters/histograms cheap if label cardinality controlled |
| Trace overhead | Dominant risk — mitigate with sampling default (off/low in test; configurable in env) and baseline spans only |
| Scalability | Host-local exporters + async export scale with api/worker replicas; no central WP-2.3 collector required |
| Boot | Telemetry init must not materially delay READY under default degrade policy |

---

## Acceptance Criteria Review

| Criterion themes | Measurable? | Testable? | Complete? |
|------------------|-------------|-----------|-----------|
| Correlated logs | Yes | Yes | Yes |
| Cross-host / harness | Yes if harness explicitly accepted as DoD | Yes | Clarify “not production queue” |
| Failure classes | Yes | Yes | Yes |
| Metrics/traces ports | Yes | Yes (in-memory) | Yes |
| Security redact tests | Yes | Yes | Add value-shaped token case (**Recommended**) |
| Behaviour preservation | Yes | Yes | Tie to D-Obs-4 outcome |
| Package purity | Yes | Yes (import/lint or review) | Yes |
| Ops diagnosability | Semi-qualitative | Doc + simulated failure | Acceptable for baseline |
| Non-goals | Yes | Review checklist | Yes |

**Gap:** No explicit criterion for **single log write path** or **middleware order relative to auth** — add in Final Plan (**Mandatory** clarification).

---

## Recommendations

### Mandatory (must resolve before implementation)

1. **Complete Architecture Decision Resolution for D-Obs-1…D-Obs-7** and publish Final Pre-Implementation Plan.  
2. **Lock single structured log write path** (Spine `LoggerService` consumes facade; no duplicate console + Pino lines for the same event).  
3. **D-Obs-4 default for WP-2.3:** exporter/collector failure **must not block READY** (degrade/no-op); document any future prod-strict mode as out of scope or later ADR.  
4. **D-Obs-1:** Adopt **`@ati/observability`** for correlation/metrics/trace ports; keep `@ati/logger` focused on logging helpers/bindings.  
5. **D-Obs-3:** OTel **SDK in host adapters only**; package exposes ports/types/helpers only (Nest-free).  
6. **Specify middleware/hook order:** correlation context established before/around request handling without changing WP-2.2 auth semantics or public-route exact match.  
7. **D-Obs-7:** Define worker correlation trust (mint-always vs accept-from-trusted-job-envelope only; do not accept arbitrary untrusted client correlation on privileged worker surfaces without policy).  
8. **No new public telemetry/diagnostics HTTP routes** in WP-2.3 unless a separate approved decision (default: none).  
9. **Acceptance wording:** Criterion #2 delivers a **proven propagation contract** (harness allowed); do not claim BullMQ/Redis job-bus continuity.

### Recommended (improve implementation)

1. **D-Obs-2:** Require **Pino binding** for api/worker runtime path; allow console/no-op sinks in unit tests only (align Foundation stack).  
2. **D-Obs-6:** Use Foundation’s **`x-correlation-id`** as the wire header; store constant in `@ati/shared-constants`.  
3. **D-Obs-5:** Include **coarse auth allow/deny/error counters** in WP-2.3 (no subjects/JWT claims in labels) — closes WP-2.2 deferral cheaply; else explicitly re-defer.  
4. Extend redact tests for **bearer/JWT-shaped values** under non-matching keys.  
5. Allow-list metric/trace attributes; forbid raw Authorization, tokens, bodies.  
6. Echo correlation ID on API responses via response header for ops DX (optional but useful).

### Future enhancement (defer)

1. Full queue/bus correlation propagation when BullMQ/Redis jobs land.  
2. AI engine / workflow / connector semantic spans and dashboards.  
3. SIEM product integration, prod fail-closed telemetry mode, web SPA telemetry.  
4. Tenancy-dimensioned metrics (WP-2.4).  
5. Dedicated observability ADR only if Decision Resolution changes Foundation package topology beyond this baseline (optional; not required to start Decision Resolution).

---

## Architecture Decision

| Decision point | Independent position |
|----------------|----------------------|
| Proceed to Decision Resolution? | **Yes** |
| Redesign required before that? | **No** — observations are locks/clarifications, not a new architecture |
| Authorize implementation? | **No** — not this review’s role; requires Final Plan after Decision Resolution |
| Create ADRs now? | **No** — per constraints; only if Decision Resolution finds a baseline-breaking change |

The proposed architecture is **approved with observations**. Open decisions are expected inputs to **Architecture Decision Resolution**, not grounds to reject the plan’s direction.

---

## Final Verdict

**APPROVED WITH OBSERVATIONS**

---

## Planning Status

**WP-2.3 Architecture Review Complete**

**Ready for Architecture Decision Resolution**
