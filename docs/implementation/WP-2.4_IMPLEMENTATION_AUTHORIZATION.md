# WP-2.4_IMPLEMENTATION_AUTHORIZATION.md
## Implementation Authorization — Tenancy / Workspace Context Baseline

**Work Package:** WP-2.4 — Tenancy / Workspace Context Baseline  
**Role:** ATI Platform Technical Governance Board  
**Date:** 2026-07-26  
**Implementation contract:** This document + Final Pre-Implementation Plan + Decision Resolution  

**Governing baseline**

| Artifact | Role |
|----------|------|
| [WP-2.4_FINAL_PRE_IMPLEMENTATION_PLAN.md](./WP-2.4_FINAL_PRE_IMPLEMENTATION_PLAN.md) | Authoritative implementation baseline |
| [WP-2.4_ARCHITECTURE_DECISION_RESOLUTION.md](./WP-2.4_ARCHITECTURE_DECISION_RESOLUTION.md) | Binding decisions D1–D7 and locks |
| [WP-2.4_ARCHITECTURE_REVIEW.md](./WP-2.4_ARCHITECTURE_REVIEW.md) | APPROVED WITH OBSERVATIONS (resolved) |
| [WP-2.4_PRE_IMPLEMENTATION_PLAN.md](./WP-2.4_PRE_IMPLEMENTATION_PLAN.md) | Planning precursor |

**Platform baseline:** Stable Development Baseline v2.3

---

## Executive Summary

Governance planning for WP-2.4 is complete. The Final Pre-Implementation Plan is approved. Scope is **frozen**. Decisions **D1–D7** are **locked**. WBS **T1–T9** is sufficient and ordered. Constraints, deliverables, risks, and success criteria are documented and measurable. No additional architectural decisions are required to begin coding.

**This document authorizes implementation of WP-2.4** strictly per the Final Pre-Implementation Plan and Decision Resolution. It does **not** authorize scope expansion, persistence, Domain product features, AuthZ redesign, or Spine redesign.

**Final Authorization Decision:** **APPROVED FOR IMPLEMENTATION**

Implementation may proceed **strictly** according to the Final Pre-Implementation Plan. **Any scope change requires a new governance review.**

---

## Authorization Checklist

| Check | Result |
|-------|--------|
| Scope frozen (context propagation, lifecycle, API/worker wiring, isolation only) | **Approved** |
| No scope expansion (no DB/UI/membership/AuthZ redesign) | **Approved** |
| Aligns with Platform Spine | **Approved** |
| Aligns with WP-2.2 Authentication Foundation | **Approved** |
| Aligns with WP-2.3 Observability Baseline (soft coexistence) | **Approved** |
| D1–D7 complete and implementation-ready | **Approved** |
| Constraints documented (no Nest in `@ati/context`, no migrations, etc.) | **Approved** |
| WBS T1–T9 sufficient and ordered | **Approved** |
| Risks understood; mitigations acceptable | **Approved** |
| Deliverables clearly defined | **Approved** |
| Success criteria measurable | **Approved** |
| No new architectural decisions introduced by this authorization | **Confirmed** |

---

## Approved Scope

### In scope (authorized)

- Workspace/tenant **context propagation** and **lifecycle**
- **`@ati/context`** package creation
- **API context binding** (claims/host-validated map or auth-disabled scaffold)
- **Worker trusted-envelope** propagation / harness
- **Isolation verification** tests
- Optional allow-listed non-PII observability labels
- Host-local AI Runtime envelope context fields if already structured
- Implementation Report + Deferred Capability Register

### Explicitly not authorized

- Database schema / Prisma migrations / tenancy persistence  
- Tenant or workspace administration product / UI  
- Membership management / Domain RBAC product  
- Authorization redesign  
- Domain / Intake product features  
- Redesign of Spine, `@ati/auth` public API, or Observability cores  

---

## Approved WBS

| Task | Authorization |
|------|----------------|
| T1 Repository / decision lock | Authorized (planning complete) |
| T2 `@ati/context` package | Authorized |
| T3 Shared types / constants / config | Authorized |
| T4 API context middleware | Authorized |
| T5 Worker trusted-envelope propagation | Authorized |
| T6 Context resolution policy | Authorized |
| T7 Observability integration | Authorized (ship **or** defer with Deferred Register entry) |
| T8 Isolation & verification tests | Authorized |
| T9 Documentation & final validation | Authorized |

**Order:** T1 → T2 ∥ T3 → T4 ∥ T5 → T6 → T7 (or defer) → T8 → T9.

---

## Approved Constraints

Implementation **SHALL NOT**:

- Introduce database migrations or tenancy persistence  
- Put Nest/React/Domain dependencies inside `@ati/context`  
- Treat context as an authorization engine or Source of Truth  
- Trust raw client headers or worker client-supplied context as authoritative  
- Change WP-2.2 AuthZ semantics or exact public-route matching  
- Block LIVE/READY on missing context  
- Expand into Domain admin/membership/UI  
- Redesign architecture during implementation  

---

## Approved Deliverables

| Deliverable | Required |
|-------------|----------|
| `packages/context` (`@ati/context`) | Yes |
| API context middleware/module | Yes |
| Worker trusted envelope/harness | Yes |
| Shared constants/config updates | Yes |
| Package + host isolation tests | Yes |
| Obs label allow-list update | Optional (or defer) |
| `WP-2.4_IMPLEMENTATION_REPORT.md` | Yes |
| `WP-2.4_DEFERRED_CAPABILITY_REGISTER.md` | Yes |

---

## Implementation Rules

1. **Context is not an authorization engine.**  
2. **Context is not a Source of Truth.**  
3. **Context is transport-agnostic** in `@ati/context` (Nest wiring in hosts only).  
4. **Trusted worker envelopes only.**  
5. **Public health endpoints remain context-free** (LIVE/READY).  
6. **No DB migrations or persistence** (Tenancy ADR required before any future persistence WP).  
7. **Middleware order:** correlation → authentication → context (API); correlation → service auth → trusted context (worker).  
8. **Raw client headers are never authoritative.**  
9. **No silent cross-tenant merge.**  
10. **No redesign during implementation** — follow Final Plan + Decision Resolution exactly.  
11. **`tenantId` ≡ Organization; `workspaceId` ≡ Workspace** — vocabulary only; no Domain Administration module.  
12. Public package API via **`index.ts` only**.

---

## Success Criteria (authorization acceptance of completion)

Implementation is complete only if:

- Build passes for touched packages/apps  
- Targeted tests pass  
- Context isolation verified — **no cross-tenant leakage**  
- No architectural violations  
- Scope remains unchanged  
- WP-2.2 AuthZ behaviour unchanged  
- Zero migrations / persistence  
- Delivery docs produced  

---

## Exit Criteria

When T1–T9 are complete per Success Criteria, the next governance stage is:

**WP-2.4 Self Review**

Do not begin Independent Architecture Review until Self Review is complete.

---

## Final Authorization Decision

**APPROVED FOR IMPLEMENTATION**

Implementation may proceed **strictly** according to [WP-2.4_FINAL_PRE_IMPLEMENTATION_PLAN.md](./WP-2.4_FINAL_PRE_IMPLEMENTATION_PLAN.md) and [WP-2.4_ARCHITECTURE_DECISION_RESOLUTION.md](./WP-2.4_ARCHITECTURE_DECISION_RESOLUTION.md).

**Any scope change requires a new governance review.**

---

## Planning Status

**WP-2.4 Implementation Authorization Complete**

**Ready for Implementation**
