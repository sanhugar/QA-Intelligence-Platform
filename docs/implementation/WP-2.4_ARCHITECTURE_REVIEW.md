# WP-2.4_ARCHITECTURE_REVIEW.md
## Architecture Review — Tenancy / Workspace Context Baseline

**Work Package:** WP-2.4 — Tenancy / Workspace Context Baseline  
**Role:** Independent Principal Enterprise Architect (Architecture Review)  
**Date:** 2026-07-26  
**Input:** [WP-2.4_PRE_IMPLEMENTATION_PLAN.md](./WP-2.4_PRE_IMPLEMENTATION_PLAN.md)  
**Platform baseline:** v2.3  
**Implementation:** Not authorized

---

## Executive Summary

The WP-2.4 Pre-Implementation Plan is **architecturally suitable** as the Shared Infrastructure tenancy/workspace **context** slice. It correctly follows WBS order after Auth (WP-2.2) and Observability (WP-2.3), aligns with Security & Domain tenancy meaning (Organization hard boundary; Workspace collaboration scope), and explicitly excludes product tenancy administration, membership AuthZ, persistence, and UI.

Scope control is strong: context propagation, isolation verification, and lifecycle binding only. Default **no database migrations** respects the Blueprint gate that a specialized **tenancy ADR** is required before first multi-tenant persistence.

Seven open decisions remain (package name, resolution order, workspace optionality, worker trust, ADR timing, obs labels, public-route behaviour). Those must be locked in Architecture Decision Resolution before coding — not because the direction is wrong, but because leaving trust/resolution ambiguous risks spoofing or silent cross-tenant merge.

**Final Verdict:** **APPROVED WITH OBSERVATIONS**

---

## Scope Validation

| Intended scope | Plan coverage | Result |
|----------------|---------------|--------|
| Workspace/tenant context propagation | In scope — api + worker/AI envelopes | Pass |
| Tenant/workspace isolation | Completion criteria + isolation tests | Pass |
| Context lifecycle | Bind on request; propagate via trusted envelope/harness | Pass |
| Isolation verification | Automated no-bleed tests | Pass |

**Hidden product features detected?** None. Out-of-scope table correctly excludes:

- DB schema / Prisma migrations  
- Tenant management product / Administration CRUD  
- Workspace administration UI  
- Domain membership AuthZ / RBAC catalog  
- Persistent tenancy storage  

**Observation:** Naming uses both “tenantId” and Domain “Organization” — Final Plan should map identifiers to Domain language without implementing Domain modules.

---

## Architectural Assessment

| Concern | Assessment |
|---------|------------|
| **Platform Spine** | Pass — consumption only; AI Runtime envelope fields host-local; no Spine ownership redesign |
| **Shared Infrastructure** | Pass — completes M2 context-propagation after packages/auth/obs |
| **WP-2.2 Auth** | Pass — coexistence; must not alter deny-by-default or exact public-route match |
| **WP-2.3 Observability** | Pass — soft dependency for optional labels; correlation remains diagnostic-only |
| **Layering** | Pass — Nest-free package + Application-boundary host wiring matches WP-2.1–2.3 pattern |
| **Security Architecture §2.5** | Pass — Organization/Workspace semantics consumed, not redefined |
| **Blueprint tenancy ADR gate** | Pass — migrations deferred; context-only baseline allowed if Decision Resolution confirms |

**No architectural layering violations** identified in the plan. Context must remain a **scoping carrier**, not an AuthZ engine or Source of Truth for Domain data.

---

## Dependency Review

| Area | Impact |
|------|--------|
| **New shared package** | Justified — prefer dedicated `@ati/context` (or equivalent) over stuffing tenancy into `@ati/shared-types` alone |
| **Existing packages** | `@ati/shared-types`, `@ati/shared-constants`, optional `@ati/observability` allow-list; `@ati/auth` read-only coexistence |
| **API changes** | Middleware/module; optional context headers; health remain context-free |
| **Worker changes** | Trusted envelope + harness; no untrusted client tenant override |
| **Cross-package deps** | Context package Nest-free; hosts depend on context (+ auth/obs as today); context must **not** depend on Nest or Domain |
| **Database** | None (default) |
| **Public Auth API** | Prefer zero breaking changes |

---

## Boundary Validation

| Forbidden in WP-2.4 | Plan status |
|---------------------|-------------|
| Database schema changes | Out of scope (default none) — **Pass** |
| Tenant management product features | Out of scope — **Pass** |
| Workspace administration UI | Out of scope — **Pass** |
| Domain membership functionality | Out of scope — **Pass** |
| Persistent tenancy storage | Out of scope — **Pass** |

If implementation attempts any of the above without a new authorization + ADR path, treat as **scope violation**.

---

## Risk Assessment

| Risk | Severity | Mitigation |
|------|----------|------------|
| Context leakage / ALS bleed across async | High | Single explicit context holder; clear enter/exit; isolation tests; no global mutable singleton without request scope |
| Cross-tenant isolation failure | High | Fail-closed or explicit scaffold policy; never silent merge; dual-tenant tests |
| Async/worker spoofed tenant | High | **Trusted envelope only** on worker (lean); reject client headers as authoritative |
| Middleware order errors | Medium | Recommended order: **correlation → auth → context** (claims available); health skip context |
| Context treated as AuthZ | Medium | Document: context scopes; AuthZ remains WP-2.2 evaluator; membership checks deferred |
| Premature DB tenancy | Medium | Lock **no migrations** in Final Plan; ADR before persistence WPs |
| Header-only trust on API | Medium | Prefer claims/mapped evidence over raw spoofable headers |
| Over-building multi-tenant product | Low | Keep WBS T2–T8 thin; T7 optional |

---

## Decisions (Architecture Review leans — for Decision Resolution)

These are **review recommendations**, not ADRs:

| ID | Lean |
|----|------|
| D1 Package | Introduce **`@ati/context`** (Nest-free); keep shared-types for opaque ID aliases only |
| D2 Resolution | Prefer **authenticated claims / host-validated map** over raw client headers; env default for single-tenant scaffold when auth disabled |
| D3 Workspace | Workspace **optional** when tenant present unless Decision Resolution requires both |
| D4 Worker trust | **Trusted envelope / harness only**; mint or reject if absent per fail policy |
| D5 Tenancy ADR | **Not required to start WP-2.4 context-only**; **mandatory before any tenancy persistence migration**; WP-2.4 ships **zero migrations** |
| D6 Obs labels | Allow-list `tenantId`/`workspaceId` (or org/workspace keys) if included; no PII |
| D7 Public routes | Health **context-free**; missing context must not break LIVE/READY |

---

## Observations

1. Open decisions D1–D7 must be closed before Implementation Authorization.  
2. Middleware ordering relative to WP-2.2 auth and WP-2.3 correlation must be explicit in Final Plan.  
3. Identifier vocabulary (tenant vs Organization) should be normalized in Final Plan without Domain package creation.  
4. WP-2.3 soft dependency is appropriate; do not block WP-2.4 if obs labels deferred.  
5. Acceptance criteria draft is adequate; add explicit “context ≠ AuthZ decision” criterion in Final Plan.

---

## Required Changes

**Mandatory design changes before implementation:** None that redesign the WP.

**Mandatory process locks (Decision Resolution / Final Plan):**

1. Resolve D1–D7.  
2. Hard-lock **no DB migrations** in WP-2.4.  
3. Specify middleware order and worker trust model.  
4. State context is not an authorization engine.

**Recommended improvements:** Isolation tests covering missing context, spoofed worker headers, and two-tenant non-bleed; document single-tenant scaffold behaviour for local DX.

---

## Implementation Readiness

| Question | Answer |
|----------|--------|
| Ready for implementation coding now? | **No** — requires Architecture Decision Resolution + Final Pre-Implementation Plan + Implementation Authorization |
| Ready to proceed to Decision Resolution? | **Yes** |
| Design direction sound? | **Yes** |

---

## Final Verdict

**APPROVED WITH OBSERVATIONS**

---

## Planning Status

**WP-2.4 Architecture Review Complete**

**Ready for Architecture Decision Resolution**
