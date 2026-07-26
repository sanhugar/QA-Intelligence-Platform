# WP-2.4_FINAL_PRE_IMPLEMENTATION_PLAN.md
## Final Pre-Implementation Plan — Tenancy / Workspace Context Baseline

**Work Package:** WP-2.4 — Tenancy / Workspace Context Baseline  
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

**Architecture authority for this WP:** [WP-2.4_ARCHITECTURE_DECISION_RESOLUTION.md](./WP-2.4_ARCHITECTURE_DECISION_RESOLUTION.md)  
**Platform baseline:** Stable Development Baseline v2.3 (WP-2.1–WP-2.3)

---

## Executive Summary

WP-2.4 delivers the **Tenancy / Workspace Context Baseline**: Nest-free **`@ati/context`**, API binding from **claims / host-validated map** (or auth-disabled env scaffold), worker propagation via **trusted envelopes only**, isolation tests proving **no cross-tenant context bleed**, optional allow-listed non-PII obs labels, and **zero persistence/migrations**.

Context is a **scope carrier only** — not AuthZ, not Domain SoT, not admin product. LIVE/READY remain context-free. Middleware order is fixed: **correlation → auth → context**.

This document **supersedes** the draft Pre-Implementation Plan for implementation purposes. Scope is unchanged aside from locking D1–D7. **No unauthorized scope expansion.**

**Final Verdict:** **APPROVED FOR IMPLEMENTATION AUTHORIZATION**

---

## Final Scope

### In Scope

| Area | Binding detail |
|------|----------------|
| `@ati/context` package | Types, resolve/validate helpers, trusted-envelope helpers, scaffold config schema; Nest/React/Domain-free; public API via `index.ts` only (**D1**) |
| Context model | Opaque `tenantId` (Organization); optional `workspaceId`; reject workspace-without-tenant (**D3**) |
| API binding | Claims / host-validated map; auth-disabled env scaffold; **never** raw client headers as authoritative (**D2**) |
| Worker propagation | Trusted envelope / harness only; never trust client context (**D4**) |
| Context lifecycle | Bind per request/job; no silent cross-tenant merge |
| Isolation verification | Automated no-bleed tests between two simulated tenants |
| Observability (optional in-scope) | Allow-listed opaque `tenantId`/`workspaceId` labels only; no PII (**D6**) |
| Public routes | Health LIVE/READY and WP-2.2 public routes remain context-free (**D7**) |
| Host wiring | Nest middleware/modules on `apps/api` and `apps/worker` only |
| AI Runtime | Carry context fields on existing host-local envelopes if present (no Brain engines) |
| Tests + docs | Package + host tests; Implementation Report; Deferred Capability Register |

### Out of Scope (confirmed)

| Item | Status |
|------|--------|
| Database schema changes / Prisma migrations | **Forbidden (D5)** |
| Persistent tenancy storage | **Forbidden (D5)** |
| Tenant / workspace administration product or UI | Out |
| Membership management / Domain RBAC catalog | Out |
| Authorization redesign (WP-2.2 closed) | Out |
| Domain product features / Intake (WP-3.x) | Out |
| Job-bus product (harness OK) | Out |
| Spine / `@ati/auth` public API redesign | Out |
| `apps/web` product workspaces | Out |

---

## Locked Decisions (D1–D7) — Mandatory Rules

| ID | Lock |
|----|------|
| **D1** | Package **`@ati/context`**; Nest-free; `index.ts` only |
| **D2** | Authoritative: claims/host-validated map or auth-disabled scaffold; **raw headers never authoritative** |
| **D3** | Tenant mandatory on enforced protected paths; workspace optional; reject workspace-only |
| **D4** | Worker: trusted envelope/harness only |
| **D5** | **No migrations / no tenancy persistence**; Tenancy ADR required before any future persistence WP |
| **D6** | Obs: opaque ids only if emitted; no PII; correlation ≠ AuthZ |
| **D7** | LIVE/READY/public health paths context-free; READY not blocked by context |

Full text: [WP-2.4_ARCHITECTURE_DECISION_RESOLUTION.md](./WP-2.4_ARCHITECTURE_DECISION_RESOLUTION.md).

---

## Architecture Baseline

### Package responsibilities

| Package | Role |
|---------|------|
| `@ati/context` | Context types, resolution helpers, trusted envelope helpers, scaffold config |
| `@ati/shared-types` | Opaque ID aliases if needed |
| `@ati/shared-constants` | Header name constants (non-authoritative), `ATI_CONTEXT_*` env keys |
| `@ati/auth` | Unchanged public API; claims available for host mapping |
| `@ati/observability` | Optional allow-list extension for tenant/workspace labels |

### Middleware order (binding)

**API:** correlation → authentication → context → handlers.  
**Worker:** correlation mint → service-principal auth → trusted context bind → handlers.

### Identifier vocabulary

- `tenantId` ≡ Organization boundary  
- `workspaceId` ≡ Workspace collaboration scope  

Do not implement Domain Administration.

---

## Implementation Constraints

1. No database migrations / Prisma schema changes.  
2. No persistence of tenancy data.  
3. No Nest/React/Domain imports inside `@ati/context`.  
4. Context is transport-agnostic in the package; HTTP wiring in hosts only.  
5. Context is **not** an authorization engine.  
6. Context is **not** a Source of Truth.  
7. Middleware ordering follows the approved architecture (above).  
8. Trusted worker envelopes only.  
9. Public health endpoints remain context-free.  
10. No architectural redesign of Spine, Auth, or Observability cores.  
11. No new admin/telemetry HTTP routes required for this WP.  
12. No silent cross-tenant merge.  
13. Prefer implement after v2.3 baseline is committed/tagged when practical.

---

## Work Breakdown Structure

### T1 — Repository / decision lock

| Field | Content |
|-------|---------|
| **Objective** | Confirm Final Plan + Decision Resolution as sole architecture authority |
| **Deliverables** | This Final Plan (done); no code |
| **Dependencies** | Decision Resolution |
| **Acceptance** | D1–D7 treated as closed; no reopening without change control |

### T2 — `@ati/context` package

| Field | Content |
|-------|---------|
| **Objective** | Scaffold Nest-free context package |
| **Deliverables** | `packages/context` with types, resolve/validate, trusted-envelope helpers, unit tests, README, `index.ts` exports |
| **Dependencies** | T1 |
| **Acceptance** | Builds; Nest-free; public API via index only; unit tests for D3 validation rules |

### T3 — Shared types, constants & config

| Field | Content |
|-------|---------|
| **Objective** | Env keys and non-authoritative header name constants; scaffold defaults |
| **Deliverables** | Updates to `@ati/shared-constants` / types / config validation as needed |
| **Dependencies** | T1; may parallel early T2 |
| **Acceptance** | `ATI_CONTEXT_*` keys documented; scaffold works when auth disabled |

### T4 — API context middleware

| Field | Content |
|-------|---------|
| **Objective** | Bind context after auth using claims/host map or scaffold |
| **Deliverables** | `apps/api` context module/middleware; integration with AppModule order |
| **Dependencies** | T2, T3, WP-2.2 auth |
| **Acceptance** | Protected paths get tenant when enforced; raw headers ignored as authority; public health unaffected |

### T5 — Worker trusted-envelope propagation

| Field | Content |
|-------|---------|
| **Objective** | Propagate context only via trusted envelope/harness; optional AI Runtime envelope fields |
| **Deliverables** | Worker module/harness; spoof-rejection tests |
| **Dependencies** | T2, T3 |
| **Acceptance** | Client tenant headers not authoritative; trusted envelope accepted |

### T6 — Context resolution policy

| Field | Content |
|-------|---------|
| **Objective** | Implement missing-context / invalid-combination behaviour per D2/D3 |
| **Deliverables** | Fail-closed or scaffold paths; reject workspace-without-tenant |
| **Dependencies** | T4, T5 |
| **Acceptance** | Policy tests green; no silent merge |

### T7 — Observability integration (optional ship)

| Field | Content |
|-------|---------|
| **Objective** | Allow-list opaque tenant/workspace labels if included |
| **Deliverables** | Obs allow-list update + tests **or** explicit deferral in Deferred Register |
| **Dependencies** | T4, WP-2.3 |
| **Acceptance** | No PII in labels; correlation unchanged |

### T8 — Isolation & verification tests

| Field | Content |
|-------|---------|
| **Objective** | Prove no cross-tenant context bleed |
| **Deliverables** | Dual-tenant isolation tests; missing-context tests; health context-free tests |
| **Dependencies** | T4–T6 |
| **Acceptance** | Isolation suite passes |

### T9 — Documentation & final validation

| Field | Content |
|-------|---------|
| **Objective** | Close delivery documentation and verify build/tests |
| **Deliverables** | `WP-2.4_IMPLEMENTATION_REPORT.md`, `WP-2.4_DEFERRED_CAPABILITY_REGISTER.md`; green targeted tests |
| **Dependencies** | T2–T8 |
| **Acceptance** | Report matches code; no scope expansion; AuthZ semantics unchanged |

**Execution order:** T1 → T2 ∥ T3 → T4 ∥ T5 → T6 → T7 (or defer) → T8 → T9.

---

## Risks

| Risk | Mitigation |
|------|------------|
| Spoofed client headers | D2/D4 locks; tests |
| Async context bleed | Explicit bind; isolation tests (T8) |
| Scope creep to membership AuthZ | Out-of-scope list; Self Review gate |
| Accidental migrations | D5 hard lock; PR review |
| Scaffold mistaken for prod multi-tenant | Document auth-disabled-only scaffold |
| Interleaved auth/context ordering bugs | Fixed middleware order + integration tests |

---

## Deliverables (implementation phase)

| Artifact | Notes |
|----------|-------|
| `packages/context` (`@ati/context`) | Required |
| API context middleware/module | Required |
| Worker trusted envelope/harness | Required |
| Shared constants/config updates | Required |
| Package + host tests | Required |
| Optional obs label allow-list | Ship or defer |
| `WP-2.4_IMPLEMENTATION_REPORT.md` | Required |
| `WP-2.4_DEFERRED_CAPABILITY_REGISTER.md` | Required |
| Getting Started / index updates | At closeout |

---

## Success Criteria

1. Build passes for `@ati/context` and touched hosts.  
2. Targeted unit and integration tests pass.  
3. Context isolation verified — **no cross-tenant leakage** in tests.  
4. Raw client headers are not authoritative.  
5. Workers accept trusted envelopes only.  
6. LIVE/READY remain context-free; READY not blocked by context.  
7. WP-2.2 AuthZ semantics unchanged.  
8. **Zero** DB migrations / tenancy persistence.  
9. `@ati/context` Nest/Domain-free; public API via `index.ts`.  
10. No architectural violations or scope expansion.  
11. Implementation Report and Deferred Register complete.

---

## Exit Criteria

This Final Pre-Implementation Plan is the **authoritative implementation baseline** for WP-2.4.

WP-2.4 may proceed to:

**Implementation Authorization**

**only if** this Final Pre-Implementation Plan is **approved**.

Until Implementation Authorization is explicitly granted: do **not** implement code for WP-2.4.

---

## Final Verdict

**APPROVED FOR IMPLEMENTATION AUTHORIZATION**

---

## Planning Status

**WP-2.4 Final Pre-Implementation Plan Complete**

**Ready for Implementation Authorization**
