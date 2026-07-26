# WP-2.3_INDEPENDENT_ARCHITECTURE_REVIEW.md
## Independent Architecture Review — Observability Baseline

**Work Package:** WP-2.3 — Observability Baseline  
**Role:** Independent Principal Software Architect  
**Date:** 2026-07-26  
**Independence:** Reviewer was not the planning architect, decision author, implementer, or Self Review author for this assessment.  
**Evidence basis:** Final Plan · Decision Resolution · Authorization · Implementation Report · Deferred Register · Self Review · repository source & tests

---

## Executive Summary

Independent review finds WP-2.3 **conforms** to the approved Observability Baseline architecture. Authorized WBS **T2–T9** are present in the repository. Package boundaries match Decision Resolution (`@ati/observability` for correlation/metrics/trace ports; `@ati/logger` for logging/redact/Pino binding; OTel soft-integration confined to hosts). AuthN/AuthZ control flow and Spine boot ownership are unchanged. No unauthorized packages, ADRs, or telemetry HTTP routes were introduced.

Functional design for correlation (`x-correlation-id`), single-path structured logging, allow-listed metrics (including coarse auth outcomes), in-memory tracing, READY-independent OTel init, middleware order, and worker trusted-envelope/mint behaviour aligns with the Final Plan. Reported test/build results are adequate for baseline acceptance (in-memory/no-op exporters permitted).

Findings are **Low** (and one **Medium** recommended cardinality hygiene). None require mandatory remediation before closeout. Self Review observations are corroborated.

**Final Verdict:** **APPROVED WITH OBSERVATIONS**

---

## Scope Assessment

| Check | Result |
|-------|--------|
| T2 `@ati/observability` | Present — Nest-free package, `index.ts` public API |
| T3 Constants / env keys | Present — `HttpHeaders.CORRELATION_ID`, `ATI_OBS_*` / `ATI_OTEL_*` |
| T4 Logger single path + redact | Present — `createStructuredLogger`, value-shaped JWT/bearer redact |
| T5 API host wiring | Present — correlation middleware + module before auth |
| T6 Worker host + harness | Present — mint HTTP; `runTrustedJobHarness` |
| T7 READY degrade + host OTel | Present — `tryInitOtel` swallows errors; readiness independent |
| T8 Auth metrics | Present — allow/deny/error counters on api/worker auth middleware |
| T9 Docs + tests | Present — Implementation Report, Deferred Register, suites reported green |
| Unauthorized implementation | **None** observed |
| Scope expansion (SIEM, `/metrics`, Domain spans, job bus, web OTel) | **None** — deferred register consistent |

---

## Architecture Assessment

| Decision / rule | Evidence | Result |
|-----------------|----------|--------|
| D-Obs-1 package split | `@ati/observability` vs `@ati/logger` responsibilities | Pass |
| D-Obs-2 Pino / single path | LoggerService → `createStructuredLogger`; test sink JSON | Pass |
| D-Obs-3 OTel in hosts only | No OTel SDK in package; host `require('@opentelemetry/api')` | Pass (thin; see Finding IR-1) |
| D-Obs-4 READY degrade | OTel init does not call `platformReadiness.setReady(false)` | Pass |
| D-Obs-5 coarse auth metrics | Side-effect only; AuthZ rules unchanged | Pass |
| D-Obs-6 `x-correlation-id` | Shared constant; API accept/echo | Pass |
| D-Obs-7 worker trust | HTTP mint; envelope requires `trusted: true` | Pass |
| L3 middleware order | `ObservabilityModule` before `AuthModule` | Pass |
| L4 no telemetry HTTP routes | No `@Controller` under observability | Pass |
| L5 harness ≠ bus | Explicit harness API; deferred job bus | Pass |
| No Spine redesign | Bootstrap sequence intact; logger delegates only | Pass |
| Dependency rules | Package Nest-free; hosts may depend on Pino/OTel API | Pass |

**Architectural drift:** None that violates the frozen baseline. OTel export depth is thinner than a full SDK pipeline but within acceptance (“in-memory/no-op OK”) and explicitly deferred for hardening.

---

## Package Assessment

| Component | Responsibility check |
|-----------|----------------------|
| **`@ati/observability`** | Appropriate — correlation, ports, in-memory exporters, config, trusted envelope; no Nest/AuthZ |
| **`@ati/logger`** | Appropriate — level, redact, structured/Pino binding; does not own metrics/traces |
| **Shared constants** | Appropriate — header + env keys only |
| **API host** | Appropriate — Nest middleware/runtime adapters |
| **Worker host** | Appropriate — mint policy + harness |
| **Spine integration** | Appropriate — `LoggerService` consumes structured logger; no orchestration extraction |

---

## Observability Review

| Capability | Alignment |
|------------|-----------|
| Correlation | Aligns — API validate/mint + echo; worker mint; diagnostic-only (not used in AuthZ) |
| Logging | Aligns — single write path; redaction extended |
| Metrics | Aligns — host counters + auth outcomes; allow-list filter |
| Tracing | Aligns — request/job spans via in-memory port |
| READY degradation | Aligns |
| Middleware ordering | Aligns |
| Worker trusted envelope | Aligns — spoofed client header ignored on worker HTTP |

---

## Security Assessment

| Check | Result |
|-------|--------|
| Sensitive key redact | Pass |
| Bearer/JWT-shaped value redact | Pass (tests present) |
| Metric label allow-list / forbid subject/token keys | Pass |
| Auth metrics without identity | Pass (outcome/host/route only) |
| Correlation as authorization | Pass — not consulted by auth middleware/guards |
| AuthN/AuthZ behaviour | Pass — still `isPublicRoute` exact match; deny-by-default; metrics are additive only |
| Exporters receiving Authorization | Pass for in-memory path; full OTLP deferred |

No Critical/High security defects identified for this baseline.

---

## Performance Assessment

| Area | Assessment |
|------|------------|
| Logging | Structured JSON/Pino on request path — acceptable for baseline |
| Metrics | Counter increments — low cost; **route label cardinality** risk if raw paths include high-variance segments (Finding IR-2) |
| Tracing | One span per request/job + `finish` listener — acceptable; open-handle risk in tests (Finding IR-3) |
| OTel soft init | Negligible when disabled; fail-open when enabled |

No performance architecture defect requiring rework.

---

## Testing Assessment

| Evidence | Assessment |
|----------|------------|
| Package unit tests (observability/logger/constants) | Adequate for ports, redact, trust rules |
| Host integration specs | Cover correlation echo/mint, auth deny metrics, harness, READY independence |
| Auth/Spine/health regression suites | Reported still green (api 54 / worker 54) |
| Build | Reported pass for touched packages/apps |
| Gaps | No full Nest e2e middleware-chain HTTP test; OTel export not exercised end-to-end (acceptable given deferred OTLP) |

Verification is **adequate** for WP-2.3 acceptance criteria as written.

---

## Documentation Assessment

| Artifact | Match to implementation |
|----------|-------------------------|
| Implementation Report | Accurate on WBS, decisions, test counts, deferred pointer |
| Deferred Capability Register | Consistent with code and Final Plan out-of-scope |
| Self Review | Observations corroborated (IR aligns with SR-1…SR-4) |
| Status indexes | Not yet “WP-2.3 complete” — closeout responsibility |

---

## Findings

| ID | Severity | Finding | Class |
|----|----------|---------|-------|
| **IR-1** | Low | Host OTel “integration” is a soft `require('@opentelemetry/api')` without NodeSDK/OTLP exporter registration | **Recommended improvement** / already **Deferred** as full OTLP hardening — **not** mandatory rework |
| **IR-2** | Medium | Auth/request metrics may label `route` with raw request paths → cardinality risk under path parameters | **Recommended improvement** — prefer normalized route patterns in a follow-up; not a baseline blocker |
| **IR-3** | Low | Jest force-exit / possible open handles (`res.on('finish')` / Pino) | **Recommended improvement** — test hygiene |
| **IR-4** | Low | Spine `LoggerService.withCorrelation` not wired into Nest request logging pipeline end-to-end | **Recommended improvement** — correlation already on middleware/spans/metrics |
| **IR-5** | Low | Roadmap/README indexes not updated for WP-2.3 complete | **Future / Closeout** |

**Mandatory remediation:** None.

---

## Recommendations

### Mandatory remediation
- None.

### Recommended improvement
1. Normalize metric `route` labels (templates / allow-listed patterns) to control cardinality (**IR-2**).  
2. Complete OTLP SDK registration behind config when operations require export (**IR-1**, deferred register).  
3. Fix Jest open-handle teardown for correlation span `finish` listeners (**IR-3**).  
4. Optionally bind request correlation into Spine logger child for all Application-boundary logs (**IR-4**).

### Future enhancement
1. Job-bus correlation continuity; AI/workflow/connector spans; web OTel; tenancy labels; `/metrics` endpoint (only with ADR if exposing new surface); prod fail-closed telemetry mode.

---

## Final Verdict

**APPROVED WITH OBSERVATIONS**

---

## Planning Status

**WP-2.3 Independent Architecture Review Complete**

**Ready for Repository Closeout**
