# WP-3.2_IMPLEMENTATION_AUTHORIZATION.md
## Implementation Authorization — Classification & Designation

**Work Package:** WP-3.2 — Classification & Designation  
**Role:** ATI Platform Architecture Governance Board  
**Date:** 2026-07-26  
**Phase:** Phase 3 — Knowledge Intake (Business Intelligence capability)  
**Package:** **`@ati/classification`**  
**Platform baseline:** Stable Development Baseline **v3.1**  
**Implementation:** Authorized subject to conditions below  

**Implementation contract (binding)**

| Artifact | Role |
|----------|------|
| [WP-3.2_FINAL_PRE_IMPLEMENTATION_PLAN.md](./WP-3.2_FINAL_PRE_IMPLEMENTATION_PLAN.md) | Authoritative implementation baseline (D1–D8, WBS T1–T8) |
| [WP-3.2_ARCHITECTURE_REVIEW.md](./WP-3.2_ARCHITECTURE_REVIEW.md) | APPROVED WITH OBSERVATIONS — Option A ARS metadata; `@ati/classification` |
| [WP-3.2_PRE_IMPLEMENTATION_PLAN.md](./WP-3.2_PRE_IMPLEMENTATION_PLAN.md) | Planning precursor |
| [RELEASE_BASELINE_v3.1.md](../releases/RELEASE_BASELINE_v3.1.md) | Prerequisite (WP-3.1 Intake Entry) |
| ADR 0011 | Classification ≠ ARS authority; thin Orchestration-adjacent capability |

---

## Executive Summary

Governance for WP-3.2 is complete through Final Pre-Implementation Plan. Scope is **frozen** to deterministic Classification & Designation metadata production via Nest-free **`@ati/classification`**. Decisions **D1–D8** are locked. WBS **T1–T8** maps 1:1 to approved objectives with no hidden work.

Architecture Review **Option A** is binding: `knowledge_role` metadata (`ars_candidate` | `supporting` | `unknown`) only — ARS product capability, HITL, and generation gating remain deferred. Alignment with ADR-0011, Platform Spine, Shared Infrastructure, and Release Baseline v3.1 is confirmed. No architectural redesign is authorized.

**This document authorizes implementation of WP-3.2** strictly per the Final Pre-Implementation Plan, subject to the implementation governance conditions listed herein.

**Final Verdict:** **APPROVED WITH IMPLEMENTATION CONDITIONS**

Implementation may proceed. **Any scope change requires a new governance review.**

---

## Scope Verification

| Authorized capability | Status |
|-----------------------|--------|
| `@ati/classification` (`packages/classification`) | Authorized |
| Classification taxonomy (v1 keys per Final Plan D2) | Authorized |
| Designation taxonomy (v1 keys per Final Plan D3) | Authorized |
| `knowledge_role` metadata (D4 Option A) | Authorized |
| Deterministic rule engine (registry, execution, unknown handling) | Authorized |
| `ClassificationResult` schema **v1.0** + confidence + rule ids | Authorized |
| Metadata allow-list inputs (D7) — no content body inspection | Authorized |
| Thin api/worker harness-first testing | Authorized |
| Implementation Report + Deferred Capability Register + index sync | Authorized |

| Additional capability | Status |
|-----------------------|--------|
| Any capability not listed above | **Not authorized** |

**Scope freeze:** Confirmed.

---

## Architecture Verification

| Concern | Result |
|---------|--------|
| ADR-0011 (classification ≠ ARS grant; thin capability) | Pass |
| Platform Spine (LIVE/READY unchanged) | Pass |
| Shared Infrastructure boundaries (no engine/intake absorption) | Pass |
| Technology-neutral Nest-free package | Pass |
| No architectural drift from Final Plan / Architecture Review | Pass |
| ARS product / workflow ownership | **Deferred** (not authorized) |

---

## Rule Engine Verification

| Contract element | Result |
|------------------|--------|
| Deterministic execution only | **Required** |
| Configurable rule packs (in-memory/env/bundled) | **Required** |
| Rule registry | **Required** |
| Unknown handling (fail-safe) | **Required** |
| Confidence + rule identifier provenance | **Required** |
| Stable `ClassificationResult` schemaVersion `"1.0"` | **Required** |
| Probabilistic / ML / AI behaviour | **Not authorized** |

---

## Dependency Verification

| Dependency | Result |
|------------|--------|
| `@ati/intake` | **Reuse required** — terminal intake adapter |
| `@ati/requirement-engine` | **Optional read-only summary** when intake `accepted` — no duplication |
| Authentication / Context / Observability Foundations | **Reuse at hosts** |
| Duplication of intake lifecycle or engine ports/model | **Forbidden** |
| Prisma / AI / vector / search stacks | **Forbidden** |

---

## Explicit Non-Goals (must remain unimplemented)

Implementation **SHALL NOT** include:

- AI / LLM / embeddings / vector search  
- Persistence / Prisma / database  
- Parser logic  
- Workflow / Intake orchestration  
- Feature Version (WP-3.3)  
- HITL product  
- Generation gating enforcement  
- ARS product capability / granted ARS authority  
- Scenario / coverage / blueprint / test generation  

These **must** be recorded in **`WP-3.2_DEFERRED_CAPABILITY_REGISTER.md`** during implementation (T8).

---

## Work Breakdown Verification (T1–T8)

| Task | Maps to approved objective | Exceeds scope? |
|------|----------------------------|----------------|
| T1 Scaffold `packages/classification` | Yes | No |
| T2 Taxonomies + `ClassificationResult` + Zod | Yes | No |
| T3 Rule registry + deterministic executor | Yes | No |
| T4 Default rule pack + unknown/confidence | Yes | No |
| T5 Intake adapter (+ optional engine summary) | Yes | No |
| T6 Thin api/worker harness | Yes | No |
| T7 Unit / rule / contract / integration tests | Yes | No |
| T8 Implementation Report + Deferred Register + index sync | Yes | No |

**Hidden implementation work:** None identified.  
**Order:** T1 → T2 → T3 → T4 → T5 → T6 → T7 → T8.

---

## Implementation Rules

Implementation **SHALL**:

1. Keep `@ati/classification` **Nest-free** (Nest wiring in `apps/*` only).  
2. Preserve **dependency inversion** and **thin reusable package** boundaries.  
3. Perform **deterministic evaluation** only; emit **metadata-only** outputs.  
4. Emit `schemaVersion: "1.0"` on every `ClassificationResult`.  
5. Use **`ars_candidate`** — never claim granted ARS authority.  
6. Restrict rule inputs to the Final Plan **allow-list** (D7).  
7. Own **no** business workflow / intake state machine.  
8. Default **omit** Domain product HTTP APIs (harness-first).  
9. Follow Final Plan **D1–D8** exactly.  
10. Create and maintain **`WP-3.2_DEFERRED_CAPABILITY_REGISTER.md`**.

---

## Authorization Conditions

| # | Condition |
|---|-----------|
| **C1** | Implement **only** Final Plan scope + WBS T1–T8 and decisions **D1–D8**; no scope expansion without new governance review |
| **C2** | All new governance/delivery docs use **WP-3.2** Classification & Designation identity |
| **C3** | Create **`docs/implementation/WP-3.2_DEFERRED_CAPABILITY_REGISTER.md`** during implementation and cite it from the Implementation Report (must include ARS product, HITL, gating, AI, persistence, Feature Version, parsers, generation) |
| **C4** | Enforce ARS **Option A**: `knowledge_role` metadata only; forbid ARS product behaviour and generation gating |
| **C5** | Default **omit** Domain product HTTP APIs; harness-first host wiring only |
| **C6** | Update WBS/roadmap/indexes for WP-3.2 as part of T8; do not remap WP-3.3 |
| **C7** | Implement against Stable Development Baseline **v3.1** substrate (`@ati/intake`, `@ati/requirement-engine`, Auth/Obs/Context present); do not weaken WP-3.1/WP-2.5 contracts |

---

## Success Criteria (authorization acceptance of completion)

Implementation is complete only if:

- Build passes for `@ati/classification` and touched hosts  
- Approved unit/rule/contract/integration tests pass  
- `ClassificationResult` schema v1.0 evidenced  
- Deterministic rules + unknown handling evidenced  
- No AI / persistence / parsers / workflow / HITL / gating / ARS product / Feature Version / generation present  
- D1–D8 and C1–C7 satisfied  
- Implementation Report + Deferred Capability Register produced  

---

## Final Verdict

**APPROVED WITH IMPLEMENTATION CONDITIONS**

Implementation of **WP-3.2 – Classification & Designation** (`@ati/classification`) may proceed under conditions **C1–C7**.

**Next stage after implementation:** Self Review → Independent Architecture Review → Repository Closeout → Git Readiness (per platform workflow).

**Do not** begin coding outside the Final Plan. **Do not** implement deferred non-goals under this authorization.

---

## Authorization Status

**WP-3.2 Implementation Authorization Complete**

**Ready for Implementation** (subject to C1–C7)

---

*End of WP-3.2 Implementation Authorization.*
