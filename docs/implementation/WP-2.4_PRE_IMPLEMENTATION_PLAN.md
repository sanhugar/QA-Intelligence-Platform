# WP-2.4_PRE_IMPLEMENTATION_PLAN.md
## Pre-Implementation Plan — Tenancy / Workspace Context Baseline

**Work Package:** WP-2.4 — Tenancy / Workspace Context Baseline  
**Role:** ATI Platform Principal Enterprise Architect  
**Date:** 2026-07-26  
**Status:** Draft — awaiting Architecture Review  
**Implementation:** **Not authorized**

**Current platform baseline:** Stable Development Baseline **v2.3** (WP-2.1–WP-2.3 complete)  
**Next gate after approval of this plan:** Architecture Review (not implementation)

---

## Next Work Package Determination

| Question | Answer |
|----------|--------|
| **1. What is next?** | **WP-2.4 — Tenancy / Workspace Context Baseline** |
| **2. Why is it next?** | Canonical WBS Phase 2 Shared Infrastructure order: packages (2.1) → identity (2.2) → observability (2.3) → **tenancy/workspace context (2.4)**. Completes Milestone **M2** context-propagation slice and unblocks Phase 3 Knowledge Intake without inventing tenant isolation ad hoc. Deferred registers from WP-1.x–WP-2.3 consistently point tenancy/workspace context here. |
| **3. Dependencies already satisfied?** | Platform Spine (WP-1.3/1.4); Foundation packages (WP-2.1); AuthN/AuthZ foundation (WP-2.2); Observability correlation hooks (WP-2.3 — soft/coexistence for labels). WBS hard deps: **WP-2.1, WP-2.2**. |
| **4. New capabilities?** | Tenant/workspace scope in execution context; propagation to api → worker/AI run envelopes; baseline isolation tests (no cross-tenant bleed). |
| **5. Modules affected?** | Likely new context package; shared types/constants; api/worker Application-boundary middleware; AI Runtime context fields (host-local); optional obs label allow-list extension — **not** Domain modules, **not** DB migrations. |
| **6. Key risks?** | Premature persistence/multi-tenant schema without tenancy ADR; coupling AuthZ redesign into context; treating context as Source of Truth; cross-tenant bleed if propagation incomplete. |

---

## Objectives

### Business objectives

1. Establish a clear **Organization (tenant) / Workspace** execution scope for platform hosts.  
2. Prevent **cross-tenant context bleed** in baseline interactive and async paths.  
3. Enable later Intake / Domain features to consume a stable context contract without reinventing isolation.  
4. Align with Security & Domain architectures (Organization hard boundary; Workspace collaboration scope).

### Technical objectives

1. Deliver a framework-independent **tenancy/workspace context** facade (types + resolution helpers), Nest-free.  
2. Bind context on `apps/api` from approved inbound signals (headers/claims/config — decisions in Architecture Review).  
3. Propagate context into worker/AI run envelopes via **trusted** job/context harness (same honesty as WP-2.3: harness OK if job bus absent).  
4. Fail closed or mint explicit “unset/single-tenant scaffold” policy per Decision Resolution — **no silent cross-tenant merge**.  
5. Prove isolation with automated tests; document deferred items (membership AuthZ depth, DB tenancy columns, UI).

---

## Scope

### In Scope

| Area | Detail |
|------|--------|
| Context model | Opaque/stable `tenantId` / `workspaceId` (or Organization/Workspace identifiers) in execution context |
| Package(s) | New Foundation-style package (e.g. `@ati/context` / tenancy-context) — name locked in Architecture Review; public API via `index.ts` only |
| Host wiring | Nest middleware/guards on `apps/api`; worker trusted envelope / harness on `apps/worker` |
| AI Runtime | Carry context fields on existing host-local run envelopes where already structured (no Brain engines) |
| Auth coexistence | Map **safe** claim/header signals into context without changing WP-2.2 AuthZ semantics (deny-by-default, exact public routes) |
| Observability coexistence | Optional allow-listed tenant/workspace labels on metrics/logs (no secrets) |
| Config | `ATI_*` env keys for default/single-tenant scaffold and header names |
| Tests + docs | Package + host tests; Implementation Report; Deferred Capability Register |

### Out of Scope

| Item | Rationale |
|------|-----------|
| First database / Prisma migrations with `tenant_id` | Requires **specialized tenancy ADR** before migrations (Foundation / Blueprint gate) |
| Domain Administration module (org/workspace CRUD, membership UI) | Later Domain / Access WPs |
| Full tenant membership AuthZ / Domain RBAC | WP-2.2 deferred; not this baseline |
| Cookie/BFF, web OIDC tenancy UX | Later |
| Multi-tenant data isolation in Postgres/Redis | Persistence milestone |
| OPA/PDP, ABAC engine | Deferred |
| Job-bus product correlation | Separate; harness only if needed |
| Redesign of Spine, Auth, or Observability cores | Closed WPs |
| `apps/web` product workspaces | Later Application UX |
| Knowledge Intake / Phase 3 features | WP-3.x |

---

## Dependencies

| Dependency | Status | Nature |
|------------|--------|--------|
| WP-2.1 Shared Packages | Satisfied | Types, constants, config, errors patterns |
| WP-2.2 Auth Foundation | Satisfied | Principal identity; claims available for optional mapping |
| WP-2.3 Observability | Soft / recommended | Correlation + label allow-list extension |
| Platform Spine WP-1.3/1.4 | Satisfied | Host lifecycle; AI Runtime envelope hooks |
| Domain / Security architectures | Consumed | Organization/Workspace meaning — **not** redefining Domain |
| Specialized **tenancy ADR** | **Not satisfied for migrations** | Required before first multi-tenant persistence; **not** a blocker for in-memory/context-only baseline if Decision Resolution confirms |

**Explicit non-dependencies for start:** WP-3.x Intake, Redis/BullMQ job bus, Domain modules, DB schema.

---

## Architecture Impact

| Dimension | Expected impact |
|-----------|-----------------|
| **New packages** | Likely `@ati/context` (or equivalent) — correlation-style facade for tenant/workspace context |
| **Existing packages** | `@ati/shared-types`, `@ati/shared-constants`, possibly `@ati/observability` allow-list, `@ati/auth` **read-only** coexistence (no public API break preferred) |
| **Apps** | `apps/api`, `apps/worker` middleware/modules; AI Runtime types if context fields added host-locally |
| **Public APIs** | New package exports; optional context headers; **no** Auth public API break; no new Domain HTTP APIs |
| **Database** | **None** in WP-2.4 unless Architecture Review mandates ADR + migrations (default: **none**) |
| **Security** | Positive isolation if fail-closed; risk if context forged — trust rules analogous to WP-2.3 worker envelope |
| **Spine** | Consumption only; no ownership redesign |

### Open decisions (for Architecture Review)

1. Package name and boundary (`@ati/context` vs expand shared-types only).  
2. Inbound resolution order: claims vs headers vs env default (single-tenant scaffold).  
3. Required vs optional workspace when tenant present.  
4. Worker trust model (trusted envelope only — recommended).  
5. Whether a **tenancy ADR** is mandatory *within* WP-2.4 or only before later persistence WPs.  
6. Observability label inclusion (`tenantId` / `workspaceId` allow-list).  
7. Public-route behaviour when context missing (health remain context-free).

---

## Risks

| Type | Risk | Mitigation |
|------|------|------------|
| Architectural | Skipping tenancy ADR then adding DB columns | Default **no migrations** in WP-2.4; ADR gate explicit |
| Architectural | Expanding into Domain membership AuthZ | Hard out-of-scope; Architecture Review gate |
| Security | Client-spoofed tenant headers | Trusted claims / signed context / worker envelope trust; never authorize from correlation alone |
| Security | Cross-tenant bleed in async path | Isolation tests; harness proves envelope field |
| Delivery | Over-building multi-tenant product | Baseline = context carry + tests only |
| Delivery | Coupling to unfinished v2.3 commit/tag | Prefer implement after v2.3 baseline commit |
| Technical | Dual context stores (Nest ALS vs custom) | Single context holder decision in Review |

---

## Deliverables

### Planning phase (this document)

| Artifact | Status |
|----------|--------|
| `WP-2.4_PRE_IMPLEMENTATION_PLAN.md` | **This document** |
| Architecture Review | Next |
| Decision Resolution + Final Plan | After Review |
| Implementation Authorization | Separate |

### Implementation phase (not started)

- Context package + host wiring + tests  
- `WP-2.4_IMPLEMENTATION_REPORT.md`  
- `WP-2.4_DEFERRED_CAPABILITY_REGISTER.md`  
- Closeout / Git readiness (later)

---

## Work Breakdown Structure

| Task | Purpose | Deliverables | Dependencies |
|------|---------|--------------|--------------|
| **T1** | Architecture decision lock | Resolve open decisions; Final Plan | Architecture Review |
| **T2** | Context package scaffold | `@ati/context` (or approved name), types, resolve/mint helpers, unit tests | T1 |
| **T3** | Shared constants / config keys | Header names, env defaults, validation | T1 |
| **T4** | API host context binding | Middleware order with auth/obs; public routes context-free | T2, T3, WP-2.2 |
| **T5** | Worker / AI envelope propagation | Trusted envelope + harness; AI Runtime context fields if approved | T2, T3 |
| **T6** | Isolation tests | No cross-tenant bleed cases; missing-context policy tests | T4, T5 |
| **T7** | Observability label hooks (optional if approved) | Allow-list tenant/workspace labels only | T4, WP-2.3 |
| **T8** | Verification & documentation | Green tests; Implementation Report; Deferred Register | T4–T7 |

**Execution order:** T1 → T2 ∥ T3 → T4 ∥ T5 → T6 → T7 (if in scope) → T8.

---

## Acceptance Criteria (draft for Final Plan)

1. Execution context can carry tenant and workspace identifiers on api and worker paths.  
2. Worker accepts context only from **trusted** envelope/harness; spoofed client context rejected/minted per policy.  
3. Automated tests demonstrate **no cross-tenant context bleed** between two simulated tenants.  
4. Health public routes remain usable without tenant context.  
5. WP-2.2 AuthZ semantics unchanged.  
6. No database migrations in WP-2.4 unless Decision Resolution + tenancy ADR explicitly authorize.  
7. Package Nest/React-free; public API via `index.ts` only.  
8. Delivery docs complete; deferred items recorded.

---

## Exit Criteria

This Pre-Implementation Plan is complete as a planning artifact.

WP-2.4 may proceed to:

- **Architecture Review**

only after this plan is **approved**.

WP-2.4 may **not** proceed to implementation until a **Final Pre-Implementation Plan** is approved and implementation is separately authorized.

---

## Planning Status

**WP-2.4 Pre-Implementation Plan Complete**

**Ready for Architecture Review** (upon plan approval)
