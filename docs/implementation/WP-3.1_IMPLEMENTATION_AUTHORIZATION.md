# WP-3.1_IMPLEMENTATION_AUTHORIZATION.md
## Implementation Authorization — Intake Entry Workflow

**Work Package:** WP-3.1 — Intake Entry Workflow  
**Role:** ATI Platform Architecture Governance Board  
**Date:** 2026-07-26  
**Phase:** Phase 3 — Knowledge Intake (Business Capability)  
**Package:** **`@ati/intake`**  
**Platform baseline:** Stable Development Baseline **v2.5**  
**Implementation:** Authorized subject to conditions below  

**Implementation contract (binding)**

| Artifact | Role |
|----------|------|
| [WP-3.1_FINAL_PRE_IMPLEMENTATION_PLAN.md](./WP-3.1_FINAL_PRE_IMPLEMENTATION_PLAN.md) | Authoritative implementation baseline (D1–D8, WBS T1–T8) |
| [WP-3.1_ARCHITECTURE_REVIEW.md](./WP-3.1_ARCHITECTURE_REVIEW.md) | APPROVED WITH OBSERVATIONS — O1 / `@ati/intake` locked |
| [WP-3.1_PRE_IMPLEMENTATION_PLAN.md](./WP-3.1_PRE_IMPLEMENTATION_PLAN.md) | Planning precursor |
| [WP_IDENTITY_ARCHITECTURE_DECISION.md](./WP_IDENTITY_ARCHITECTURE_DECISION.md) | Binding WP identity (WP-3.1 = Intake Entry) |
| [RELEASE_BASELINE_v2.5.md](../releases/RELEASE_BASELINE_v2.5.md) | Prerequisite Shared Infrastructure (incl. `@ati/requirement-engine`) |
| ADR 0011 | Knowledge Intake / thin orchestration architecture |

---

## Executive Summary

Governance for WP-3.1 is complete through Final Pre-Implementation Plan. Scope is **frozen** to the Intake Entry Workflow as a thin orchestration layer over `@ati/requirement-engine`. Decisions **D1–D8** are locked. WBS **T1–T8** maps 1:1 to approved objectives with no hidden work. Identity is authoritative: **WP-3.1** = Intake Entry Workflow; **WP-2.5** remains Requirement Intelligence Engine Foundation.

Alignment with ADR-0011, Platform Spine, Shared Infrastructure boundaries, Auth / Context / Observability foundations, and Release Baseline v2.5 is confirmed. No architectural redesign is authorized. Missing-parser behaviour **`accepted_pending_parser`** is mandatory.

**This document authorizes implementation of WP-3.1** strictly per the Final Pre-Implementation Plan, subject to the implementation governance conditions listed herein.

**Final Verdict:** **APPROVED WITH IMPLEMENTATION CONDITIONS**

Implementation may proceed. **Any scope change requires a new governance review.**

---

## Scope Verification

| Authorized capability | Status |
|-----------------------|--------|
| `@ati/intake` (`packages/intake`) | Authorized |
| Intake request lifecycle (sync) | Authorized |
| Validation (structure / format catalog / required metadata only) | Authorized |
| Workflow orchestration + status transitions (five-state model) | Authorized |
| Requirement Engine invocation + outcome mapping | Authorized |
| Correlation IDs + audit metadata | Authorized |
| Context propagation + Observability integration | Authorized |
| In-memory registry + idempotency (D8) | Authorized |
| Thin api/worker harness integration | Authorized |
| Unit / state / contract / integration tests for approved scope | Authorized |
| Implementation Report + Deferred Capability Register + index consistency | Authorized |

| Additional capability | Status |
|-----------------------|--------|
| Any capability not listed above | **Not authorized** |

**Scope freeze:** Confirmed. No additional capability may be introduced under this authorization.

---

## Architecture Verification

| Concern | Result |
|---------|--------|
| ADR-0011 (thin Entry; no ARS invention; no full §4.1 absorption) | Pass |
| Platform Spine (consumption only; LIVE/READY unaffected) | Pass |
| Shared Infrastructure boundaries (orchestrate, do not absorb engine) | Pass |
| `@ati/requirement-engine` reuse (dependency inversion) | Pass |
| Technology-neutral Nest-free `@ati/intake` core | Pass |
| Authentication Foundation coexistence (fail-closed when auth enabled) | Pass |
| Context Foundation propagation (no silent cross-tenant merge) | Pass |
| Observability Foundation (correlation; no document-body labels) | Pass |
| Architectural drift / redesign of closed WPs (WP-2.1–WP-2.5) | **None authorized** |

---

## Workflow Verification

| Contract element | Result |
|------------------|--------|
| Five-state synchronous lifecycle (`received`, `validated`, `accepted`, `accepted_pending_parser`, `failed`) | **Required** |
| `accepted_pending_parser` (O1) for missing production parser / fail-closed | **Required** |
| In-memory execution only (D6) | **Required** |
| Harness-first host design; Domain product HTTP omitted by default (D7) | **Required** |
| Idempotency tuple D8 | **Required** |
| Asynchronous / job-bus execution | **Not authorized** |
| Parser-specific workflow states | **Not authorized** |
| Content inspection / shadow parsing | **Not authorized** |

---

## Dependency Verification

| Dependency | Result |
|------------|--------|
| `@ati/requirement-engine` | **Reuse required** — orchestrate only |
| Authentication Foundation (WP-2.2) | **Reuse required** |
| Context Foundation (WP-2.4) | **Reuse required** |
| Observability Foundation (WP-2.3) | **Reuse required** |
| Duplication of WP-2.5 model / ports / lifecycle | **Forbidden** |
| Prisma / new data stores / AI Runtime Brain registration | **Forbidden** |

---

## Explicit Non-Goals (must remain unimplemented)

Implementation **SHALL NOT** include:

- Markdown / FDD / PRD / User Story parsers  
- AI / LLM / embeddings / vector DB / search  
- Persistence / Prisma / database / migrations  
- Classification (WP-3.2)  
- Feature Version / lineage product (WP-3.3)  
- ARS designation  
- Scenario / coverage / blueprint / test generation  
- Async execution / job-bus product  
- Production success via engine test stub  

These **must** be recorded in **`WP-3.1_DEFERRED_CAPABILITY_REGISTER.md`** during implementation (T8). That register does not yet exist and **must be created** as an authorized deliverable.

---

## Work Breakdown Verification (T1–T8)

| Task | Maps to approved objective | Exceeds scope? |
|------|----------------------------|----------------|
| T1 Scaffold `packages/intake` (`@ati/intake`) | Yes | No |
| T2 Request/response models + validation | Yes | No |
| T3 State model + transitions + in-memory registry + idempotency | Yes | No |
| T4 Engine orchestration adapter + O1 mapping | Yes | No |
| T5 Audit + correlation + context/obs hooks | Yes | No |
| T6 Thin api/worker harness modules | Yes | No |
| T7 Unit / state / contract / integration tests | Yes | No |
| T8 Implementation Report + Deferred Capability Register + index sync | Yes | No |

**Hidden implementation work:** None identified.

**Order:** T1 → T2 → T3 → T4 → T5 → T6 → T7 → T8.

---

## Implementation Rules

Implementation **SHALL**:

1. Keep `@ati/intake` **Nest-free** (Nest wiring in `apps/*` only).  
2. Preserve **dependency inversion** (`@ati/intake` → `@ati/requirement-engine`; engine must not depend on intake).  
3. Remain a **thin orchestration** layer — no business intelligence, no content inspection (**D5**).  
4. Enforce **fail-safe** status mapping: missing production parser → **`accepted_pending_parser`**; invalid input → **`failed`** with typed reason (**D4**).  
5. **Invoke** the engine on the product path after `validated` (do not skip invoke).  
6. Process **in-memory only**; ship **zero** persistence.  
7. Emit **no** document-body metric labels or PII.  
8. Leave LIVE/READY **unblocked**.  
9. Follow Final Plan **D1–D8** exactly.  
10. Create and maintain **`WP-3.1_DEFERRED_CAPABILITY_REGISTER.md`**.  
11. Limit tests to **approved scope** (unit / state / contract / host integration).

Implementation **SHALL NOT**:

- Implement parsers, AI, LLM, embeddings, search, persistence  
- Implement classification, Feature Version, ARS, or generation engines  
- Add Domain product HTTP APIs (default omit per D7 / C5)  
- Redesign Spine, Auth, Observability, Context, or `@ati/requirement-engine`  
- Introduce asynchronous workflow execution under WP-3.1  

---

## Authorization Conditions

| # | Condition |
|---|-----------|
| **C1** | Implement **only** Final Plan scope + WBS T1–T8 and decisions **D1–D8**; no scope expansion without new governance review |
| **C2** | All new governance/delivery docs use **WP-3.1** Intake Entry identity; do not reassign RIE work to this WP |
| **C3** | Create **`docs/implementation/WP-3.1_DEFERRED_CAPABILITY_REGISTER.md`** during implementation and cite it from the Implementation Report |
| **C4** | Enforce **`accepted_pending_parser`** for missing production parsers; reject product-path `stub` format; never treat stub as production parser success |
| **C5** | Default **omit** Domain product HTTP APIs; in-process harness + host-local wiring only unless a later governance change authorizes a zero-business probe |
| **C6** | Update WBS/roadmap/indexes for WP-3.1 Intake Entry status as part of T8 — do not remap WP-3.2/WP-3.3 titles |
| **C7** | Implement against Stable Development Baseline **v2.5** substrate (Auth/Obs/Context/`@ati/requirement-engine` present); do not weaken WP-2.5 contracts |

---

## Success Criteria (authorization acceptance of completion)

Implementation is complete only if:

- Build passes for `@ati/intake` and touched hosts  
- Approved unit/state/contract/integration tests pass  
- Five-state sync lifecycle and **`accepted_pending_parser`** behaviour evidenced  
- No parsers / AI / persistence / ARS / classification / Feature Version / generation present  
- No duplication of WP-2.5 model/ports/lifecycle  
- D1–D8 and C1–C7 satisfied  
- Implementation Report + Deferred Capability Register produced  
- WP-2.2–WP-2.5 semantics unchanged  

---

## Final Verdict

**APPROVED WITH IMPLEMENTATION CONDITIONS**

Implementation of **WP-3.1 – Intake Entry Workflow** (`@ati/intake`) may proceed under conditions **C1–C7**.

**Next stage after implementation:** Self Review → Independent Architecture Review → Repository Closeout → Git Readiness (per platform workflow).

**Do not** begin coding outside the Final Plan. **Do not** implement deferred non-goals under this authorization.

---

## Authorization Status

**WP-3.1 Implementation Authorization Complete**

**Ready for Implementation** (subject to C1–C7)

---

*End of WP-3.1 Implementation Authorization.*
