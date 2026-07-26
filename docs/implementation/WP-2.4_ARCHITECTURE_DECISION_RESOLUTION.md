# WP-2.4_ARCHITECTURE_DECISION_RESOLUTION.md
## Architecture Decision Resolution — Tenancy / Workspace Context Baseline

**Work Package:** WP-2.4 — Tenancy / Workspace Context Baseline  
**Role:** ATI Platform Principal Enterprise Architect  
**Date:** 2026-07-26  
**Input verdict:** Architecture Review — **APPROVED WITH OBSERVATIONS**  
**Implementation:** **Not authorized**

---

## Executive Summary

All Architecture Review observations for WP-2.4 are resolved. Open decisions **D1–D7** and global implementation locks are **Accepted** and form the architectural contract for the Final Pre-Implementation Plan.

Direction remains: introduce Nest-free **`@ati/context`** as a scoping carrier for Organization (tenant) / Workspace identifiers; resolve context from **authenticated claims / host-validated mapping** (not raw client headers); propagate to workers only via **trusted envelopes**; ship **zero persistence/migrations**; keep health LIVE/READY **context-free**; optionally emit allow-listed non-PII context labels in observability.

**No new ADR** is created by this document. A dedicated **Tenancy ADR remains mandatory before any tenancy persistence / migration work package**.

**Final Verdict:** **APPROVED FOR FINAL PRE-IMPLEMENTATION PLAN**

---

## Decision D1 – Context Package

| Aspect | Decision |
|--------|----------|
| **Package name** | **`@ati/context`** (`packages/context`) |
| **Ownership** | Platform Shared Infrastructure (Foundation-style package) |
| **Responsibilities** | Opaque context types; resolve/validate helpers; trusted-envelope helpers; config schema for scaffold defaults — **not** AuthZ evaluation, not Domain membership, not persistence |
| **Public API** | Export only via `src/index.ts` |
| **Dependencies** | May use `@ati/shared-types`, `@ati/shared-constants`, `@ati/shared-utils`, `@ati/errors` / validation as needed; **Nest/React-free**; **no Domain packages**; **no** dependency on Nest ALS as package API |
| **Disposition** | **Accepted** |

---

## Decision D2 – Context Resolution Strategy

| Aspect | Decision |
|--------|----------|
| **Authoritative sources (API)** | (1) **Authenticated claims** mapped through a **host-validated static/config map** (claim → tenant/workspace), and/or (2) **host-internal** assignment after AuthN when auth disabled (local scaffold only) |
| **Not authoritative** | **Raw client headers** (e.g. `x-tenant-id`) are **never** authoritative for production-shaped paths |
| **Local development** | When `ATI_AUTH_ENABLED=false` (or equivalent), allow **env-configured single-tenant scaffold** (`ATI_CONTEXT_DEFAULT_TENANT_ID` / workspace optional) so hosts boot without IdP |
| **Missing context** | Policy: **explicit unset** or **scaffold default** — **never** silently merge or invent a second tenant mid-request; protected routes that require context **fail closed** if Decision Resolution policy marks context required (see D3) |
| **Disposition** | **Accepted** |

---

## Decision D3 – Workspace Semantics

| Aspect | Decision |
|--------|----------|
| **Tenant (Organization)** | **Mandatory** on authenticated non-public routes once context feature is enabled for that host path; represented as opaque `tenantId` (Organization boundary) |
| **Workspace** | **Optional** when tenant is present |
| **Allowed combinations** | `{ tenantId }` · `{ tenantId, workspaceId }` · unset only on public/health or auth-disabled scaffold paths per D2/D7 |
| **Invalid** | `{ workspaceId }` without `tenantId` — **reject** |
| **Validation** | Non-empty opaque strings; length-capped; charset-safe (same hygiene class as correlation IDs); workspace must belong to tenant only when membership AuthZ exists later — **WP-2.4 does not validate membership graphs** |
| **Disposition** | **Accepted** |

---

## Decision D4 – Worker Trust Model

| Aspect | Decision |
|--------|----------|
| **Trusted envelope** | Worker accepts tenant/workspace context **only** from an in-process **trusted job envelope** or harness API (`trusted: true` + validated fields) |
| **Propagation** | API → worker continuity is via trusted envelope field contract; harness proves contract if job bus absent |
| **Client-supplied context** | Workers **never** trust HTTP client tenant/workspace headers as authoritative |
| **Rejection / failure** | Missing/invalid trusted context → **mint unset** or **fail job** per config; default for baseline: **reject privileged worker work without trusted context when context enforcement enabled**; health remains exempt |
| **Disposition** | **Accepted** |

---

## Decision D5 – Tenancy Persistence Boundary

| Aspect | Decision |
|--------|----------|
| **Database migrations** | **None** in WP-2.4 |
| **Tenancy persistence** | **None** |
| **Schema changes** | **None** |
| **Future gate** | A dedicated **Tenancy ADR is mandatory** before any work package that introduces multi-tenant persistence, `tenant_id` columns, or storage isolation |
| **Disposition** | **Accepted** |

---

## Decision D6 – Observability Integration

| Aspect | Decision |
|--------|----------|
| **Allowed log/metric identifiers** | Opaque `tenantId`, optional `workspaceId` only (allow-listed keys) |
| **Forbidden** | Emails, names, tokens, raw JWTs, unrestricted claim dumps, street addresses, or other PII |
| **Correlation** | Correlation ID remains **diagnostic**; must **not** authorize or select tenant; may appear alongside context labels |
| **Privacy** | Context labels are operational identifiers, not identity proof; redact if ever mistaken for secrets |
| **Optional** | Emitting labels is **in-scope if low-cost**; may be deferred to Deferred Register without blocking context package |
| **Disposition** | **Accepted** |

---

## Decision D7 – Public Route Behavior

| Aspect | Decision |
|--------|----------|
| **LIVE (`/health/live`)** | **Context-free** — must succeed without tenant/workspace |
| **READY (`/health/ready`)** | **Context-free** — readiness remains Spine READY only; context must not block READY |
| **Other public routes** | Remain usable without mandatory tenancy context (exact public-route match from WP-2.2 preserved) |
| **Protected routes** | May require tenant per D3 when context enforcement enabled |
| **Disposition** | **Accepted** |

---

## Implementation Locks

1. **Context is not an authorization engine** — AuthZ remains WP-2.2 (`@ati/auth` + host guards); context only carries scope.  
2. **Context is not a Source of Truth** — not Domain data; not membership registry; not Requirements truth.  
3. **Context does not introduce persistence** — no DB/Redis tenancy stores in WP-2.4.  
4. **Context remains transport-agnostic** in `@ati/context` — HTTP/Nest wiring stays in hosts.  
5. **Middleware ordering is fixed:** **correlation → authentication → context** on `apps/api` (claims available for mapping); worker: correlation mint → service auth → trusted context bind.  
6. **No architectural redesign during implementation** — no Spine/`@ati/auth` public API redesign; no Domain packages.  
7. **Raw client headers are never authoritative** for tenant/workspace.  
8. **Workers never trust client-supplied context directly.**  
9. **No cross-tenant silent merge.**  
10. **Health LIVE/READY never require tenancy context.**  
11. **Package `@ati/context` remains Nest/React/Domain-free.**  
12. **No new telemetry/admin HTTP routes** required for this WP.  
13. **Identifier vocabulary:** `tenantId` ≡ Organization boundary; `workspaceId` ≡ Workspace scope — document in Final Plan; do not implement Domain Administration.

---

## Risks

| Risk | Residual handling |
|------|-------------------|
| Spoofed headers | Mitigated by D2/D4 locks |
| Async context bleed | Explicit bind/clear + isolation tests in Final Plan |
| Premature persistence | Mitigated by D5 |
| Scope creep into membership AuthZ | Out of scope + locks 1–2 |
| Local scaffold mistaken for multi-tenant prod | Env scaffold only when auth disabled; document in Getting Started at closeout |

**Accepted residual risks:** single-tenant scaffold for local DX; harness ≠ production job bus; optional obs labels may ship later if deferred.

---

## Implementation Contract

Implementation of WP-2.4 **SHALL**:

1. Create **`@ati/context`** with Nest-free public API via `index.ts`.  
2. Resolve API context from **claims/host-validated map** or **auth-disabled env scaffold** — **never** raw client headers.  
3. Use model: tenant mandatory on protected/enforced paths; workspace optional; reject workspace-without-tenant.  
4. Propagate to workers **only** via trusted envelope/harness.  
5. Ship **zero** DB migrations / tenancy persistence.  
6. Keep LIVE/READY and WP-2.2 public routes **context-free**.  
7. Apply middleware order **correlation → auth → context**.  
8. Treat context as **scope carrier only** — not AuthZ, not Domain SoT.  
9. If emitting obs labels, allow-list opaque ids only — **no PII**.  
10. Prove **no cross-tenant context bleed** with automated tests.  
11. Follow WBS from Final Plan; produce Implementation Report + Deferred Register.

Implementation **SHALL NOT** add tenant admin UI, membership AuthZ product, schema changes, or redesign closed WPs.

---

## Final Verdict

**APPROVED FOR FINAL PRE-IMPLEMENTATION PLAN**

---

## Planning Status

**WP-2.4 Architecture Decision Resolution Complete**

**Ready for Final Pre-Implementation Plan**
