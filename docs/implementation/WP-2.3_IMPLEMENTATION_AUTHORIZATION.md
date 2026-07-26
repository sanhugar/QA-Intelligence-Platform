# WP-2.3_IMPLEMENTATION_AUTHORIZATION.md
## Implementation Authorization — Observability Baseline

**Work Package:** WP-2.3 — Observability Baseline  
**Role:** ATI Platform Chief Architect and Release Authority  
**Date:** 2026-07-26  
**Implementation contract:** This document  

**Governing baseline**

| Artifact | Role |
|----------|------|
| [WP-2.3_FINAL_PRE_IMPLEMENTATION_PLAN.md](./WP-2.3_FINAL_PRE_IMPLEMENTATION_PLAN.md) | Authoritative implementation baseline |
| [WP-2.3_ARCHITECTURE_DECISION_RESOLUTION.md](./WP-2.3_ARCHITECTURE_DECISION_RESOLUTION.md) | Binding decisions D-Obs-1…7 and locks |
| [WP-2.3_ARCHITECTURE_REVIEW.md](./WP-2.3_ARCHITECTURE_REVIEW.md) | APPROVED WITH OBSERVATIONS (resolved) |

---

## Executive Summary

Governance for WP-2.3 planning is complete. The Final Pre-Implementation Plan is approved. All mandatory Architecture Review observations are resolved. Scope is **frozen**. Architecture baseline is **approved**. No unresolved blockers remain for starting implementation.

**This document authorizes implementation of WP-2.3** strictly within the Authorized Scope and Constraints below. It does **not** perform implementation and does **not** authorize scope expansion, AuthN/AuthZ changes, Spine redesign, or new ADRs.

**Prerequisite preference:** Begin coding after WP-2.2 commit/tag on the integration branch when practical; do not reopen WP-2.2 AuthZ semantics.

**Final Verdict:** **IMPLEMENTATION AUTHORIZED**

---

## Authorized Scope

Implementation is authorized **ONLY** for the following:

### Package

- Create and integrate **`@ati/observability`** (`packages/observability`).
- Evolve **`@ati/logger`** only for level, redact (incl. value-shaped secrets), structured logger interface / Pino binding helpers.
- Update `@ati/shared-constants`, `@ati/shared-types`, `@ati/config` / `@ati/shared-validation`, and `@ati/errors` only as required by the Final Plan.

### Logging

- **Pino** runtime structured logging on `apps/api` and `apps/worker`.
- **Single logging pipeline** — Spine `LoggerService` delegates; no duplicate console + Pino for the same event.
- Apply approved **redaction** (sensitive keys + bearer/JWT-shaped values).

### Metrics

- Host request/job and error counters via metrics port.
- **Coarse authentication metrics** (allow / deny / error) on api and worker — **mandatory (T8)**; allow-listed labels only; no subjects/tokens/claims.

### Tracing

- OpenTelemetry **SDK and exporters in API and Worker hosts only**.
- `@ati/observability` exposes ports/types/helpers only (Nest-free; no OTel SDK in package).
- Minimal request / job-or-boot spans; attribute allow-list; async export; in-memory/no-op for CI; optional OTLP via config.

### Correlation

- Propagate **`x-correlation-id`** (constant in `@ati/shared-constants`).
- API: accept well-formed inbound header or mint; **echo** on response.
- Worker: accept correlation only from **trusted job envelope / harness**; otherwise **mint**; correlation is diagnostic-only (never authorizes).
- Prove propagation via **host-local harness** (no BullMQ/Redis bus claim).

### Health

- **READY degradation:** exporter/collector failure must **not** block READY.
- Preserve existing **LIVE** and **READY** endpoint behaviour and WP-2.2 public-route exact match.

### Middleware

- Approved order: **correlation first**, then existing **auth** middleware/guards unchanged; then handlers.

### Work Breakdown (authorized)

| Task | Authorization |
|------|----------------|
| T1 | Authorized (already complete — Decision Resolution / Final Plan) |
| T2 | Authorized — `@ati/observability` scaffold |
| T3 | Authorized — constants / types / config |
| T4 | Authorized — logging binding + single path + redact |
| T5 | Authorized — API host wiring |
| T6 | Authorized — Worker host wiring |
| T7 | Authorized — exporters + READY degrade |
| T8 | Authorized — **mandatory** auth metrics |
| T9 | Authorized — verification & documentation |

---

## Constraints

Implementation **SHALL NOT**:

- Expand scope beyond the Final Pre-Implementation Plan and this Authorization.
- Introduce new packages outside the approved plan (no `@ati/spine`, `@ati/runtime`, Domain/AI/Observability-product packages beyond `@ati/observability`).
- Modify Authentication or Authorization **behaviour** (WP-2.2 closed: deny-by-default, exact public routes, roles, token rules).
- Introduce new ADRs.
- Redesign Platform Spine ownership, registration, or boot semantics.
- Change public APIs unless explicitly approved in the Final Plan (`@ati/auth` public API unchanged; no new telemetry HTTP routes).
- Claim production job-bus correlation continuity.
- Make READY depend on remote collectors.
- Add `/metrics` or other new telemetry/diagnostics HTTP endpoints.
- Put OTel SDK inside `@ati/observability`.
- Treat correlation IDs as a security boundary.
- Modify `apps/web` except absolute workspace compile necessity.
- Modify `docs/architecture/**` baseline documents.

Implementation **SHALL**:

- Follow [WP-2.3_FINAL_PRE_IMPLEMENTATION_PLAN.md](./WP-2.3_FINAL_PRE_IMPLEMENTATION_PLAN.md) and [WP-2.3_ARCHITECTURE_DECISION_RESOLUTION.md](./WP-2.3_ARCHITECTURE_DECISION_RESOLUTION.md).
- Keep packages Nest/React-free; public package APIs via `index.ts` only.
- Meet all Final Plan acceptance criteria.

---

## Success Criteria

Implementation is **complete** only if:

1. All WBS tasks **T1–T9** are complete (T8 mandatory).  
2. All Final Plan **acceptance criteria** are met and evidenced.  
3. Targeted **tests pass** for `@ati/observability`, `@ati/logger` (as touched), `@ati/shared-constants` (as touched), `@ati/api`, `@ati/worker`.  
4. **Documentation** is updated (Implementation Report, Deferred Capability Register; indexes/Getting Started at closeout per workflow).  
5. **No architectural drift** from the frozen scope and Decision Resolution.  
6. WP-2.2 auth semantics and health allow-list behaviour remain unchanged.

---

## Implementation Guardrails

| Guardrail | Rule |
|-----------|------|
| Contract docs | Final Plan + Decision Resolution + this Authorization |
| Role | Architecture Consumer — implement approved design; do not invent architecture |
| Package purity | No Nest/React in `@ati/observability` / `@ati/logger` core |
| Host adapters | Pino + OTel SDK only in `apps/api` and `apps/worker` (bindings as planned) |
| Auth metrics | Coarse counters only; no identity in labels |
| Single sink | One structured write path per log event |
| READY | Fail-open for telemetry |
| Drift control | Any proposed scope change requires re-authorization — do not self-approve |
| Delivery artifacts | `WP-2.3_IMPLEMENTATION_REPORT.md`, `WP-2.3_DEFERRED_CAPABILITY_REGISTER.md` |

---

## Exit Criteria

When implementation (T1–T9) is complete per Success Criteria, the next governance stage is:

**WP-2.3 Self Review**

Do not begin Independent Architecture Review of the implementation until Self Review is complete per Implementation Workflow.

---

## Final Verdict

**IMPLEMENTATION AUTHORIZED**

---

## Planning Status

**WP-2.3 Implementation Authorization Complete**

**Ready for Implementation**
