# WP-3.3_IMPLEMENTATION_AUTHORIZATION.md
## Implementation Authorization — Feature Version & Lineage

**Work Package:** WP-3.3 — Feature Version & Lineage  
**Role:** ATI Platform Architecture Board  
**Date:** 2026-07-26  
**Phase:** Phase 3 — Knowledge Intake (Feature Version / lineage primitives)  
**Package:** **`@ati/feature-version`**  
**Platform baseline:** Stable Development Baseline **v3.2**  
**Implementation:** Authorized subject to conditions below  

**Implementation contract (binding)**

| Artifact | Role |
|----------|------|
| [WP-3.3_FINAL_PRE_IMPLEMENTATION_PLAN.md](./WP-3.3_FINAL_PRE_IMPLEMENTATION_PLAN.md) | Authoritative implementation baseline (D1–D8, WBS T1–T8) |
| [WP-3.3_ARCHITECTURE_REVIEW.md](./WP-3.3_ARCHITECTURE_REVIEW.md) — APPROVED WITH OBSERVATIONS | Locked OD-1–OD-8 absorbed as D1–D8 |
| [WP-3.3_PRE_IMPLEMENTATION_PLAN.md](./WP-3.3_PRE_IMPLEMENTATION_PLAN.md) | Planning precursor |
| [RELEASE_BASELINE_v3.2.md](../releases/RELEASE_BASELINE_v3.2.md) | Prerequisite (WP-3.2 Classification & Designation) |
| ADR 0011 | Thin Orchestration-adjacent capability; Feature Version ≠ ARS authority |

---

## Executive Summary

Governance for WP-3.3 is complete through Final Pre-Implementation Plan. Scope is **frozen** to Nest-free **`@ati/feature-version`** Feature Version & Lineage **primitives**: deterministic identity/version/lineage derivation from allow-listed Intake + ClassificationResult (+ optional engine summary), emitting canonical **`FeatureVersionResult` schema v1.0**.

Decisions **D1–D8** are frozen. WBS **T1–T8** maps 1:1 to the approved contract with **no** hidden work and **no** remaining open architectural decisions. Alignment with ADR-0011, Platform Spine, Shared Infrastructure, and Release Baseline v3.2 is confirmed. No architectural redesign is authorized.

**This document authorizes implementation of WP-3.3** strictly within **D1–D8** and **T1–T8**, subject to the governance conditions herein.

**Final Verdict:** **APPROVED FOR IMPLEMENTATION**

Implementation may proceed. **Any scope change requires a new governance review.**

---

## Authorized Scope

| Authorized capability | Status |
|-----------------------|--------|
| `@ati/feature-version` (`packages/feature-version`) | Authorized |
| Deterministic feature / version / lineage identity derivation (**D3**) | Authorized |
| Primitives-only Feature Version & Lineage metadata (**D2**) | Authorized |
| Consume `ClassificationResult` v1.0 (no recreate) (**D4**) | Authorized |
| Status vocabulary `draft` \| `active` \| `superseded` \| `unknown` (**D5**) | Authorized |
| Emit-only lineage (+ optional process-local registry for tests) (**D6**) | Authorized |
| `FeatureVersionResult` schema **v1.0** | Authorized |
| Optional `featureName` from allow-listed metadata only (**D8**) | Authorized |
| Thin api/worker harness-first wiring (**D7**) | Authorized |
| Implementation Report + Deferred Capability Register + index sync (**T8**) | Authorized |

| Additional capability | Status |
|-----------------------|--------|
| Any capability not listed above | **Not authorized** |

**Scope freeze:** Confirmed.  
**Open architectural decisions remaining:** **None**.

---

## Binding Implementation Contract

Implementation **SHALL** follow [WP-3.3_FINAL_PRE_IMPLEMENTATION_PLAN.md](./WP-3.3_FINAL_PRE_IMPLEMENTATION_PLAN.md).

### Frozen decisions D1–D8

| ID | Frozen lock |
|----|-------------|
| **D1** | Package **`@ati/feature-version`** — Nest-free reusable package |
| **D2** | **Primitives only** — not Domain Feature Version product |
| **D3** | Deterministic pure identity derivation; no payload inspection; no randomness; no UUID-derived identities |
| **D4** | Consume `ClassificationResult` only; never recreate classification / designation / knowledgeRole; knowledgeRole metadata only |
| **D5** | Status vocabulary: `draft`, `active`, `superseded`, `unknown` |
| **D6** | Emit-only lineage; no persistence; no historical rewrite |
| **D7** | Harness-first; thin API + Worker harnesses; no Domain HTTP product APIs |
| **D8** | `featureName` optional; allow-listed metadata only; never from payload body |

**D1–D8 form the binding implementation contract.** They **must not** be changed during implementation without new Architecture Review.

---

## Authorized Work Breakdown (T1–T8)

| Task | Authorized work | Exceeds scope? |
|------|-----------------|----------------|
| **T1** | Package scaffold `packages/feature-version` | No |
| **T2** | Models and schema (`FeatureVersionResult` v1.0 + status + Zod) | No |
| **T3** | Deterministic derivation | No |
| **T4** | Intake and Classification adapters (+ optional engine summary) | No |
| **T5** | Emit-only lineage (+ optional process-local registry for tests) | No |
| **T6** | API / Worker harnesses | No |
| **T7** | Unit, contract, and integration tests | No |
| **T8** | Documentation, reports, Deferred Register, and index synchronization | No |

**Hidden / additional implementation tasks:** **Not authorized**.  
**Order:** T1 → T2 → T3 → T4 → T5 → T6 → T7 → T8.

---

## Implementation Constraints

Implementation **SHALL** remain:

- Nest-free (Nest wiring in `apps/*` only)  
- Deterministic  
- Technology-neutral  
- Dependency-inverted (`@ati/feature-version` → intake / classification / optional requirement-engine; **no** reverse deps)  
- Harness-first  

Implementation **SHALL NOT** introduce:

- AI / LLM  
- Persistence / Prisma / database  
- Workflow orchestration  
- Parser logic / content body inspection  
- HITL  
- Gating  
- ARS authority / ARS product capability  
- Scenario / coverage / blueprint / test generation  
- Release planning  
- Domain Feature Version product lifecycle  

These non-goals **must** be recorded in **`WP-3.3_DEFERRED_CAPABILITY_REGISTER.md`** during **T8**.

---

## Success Criteria

Implementation is complete only if:

1. All **T1–T8** tasks are completed.  
2. **D1–D8** remain unchanged.  
3. Output contract matches **`FeatureVersionResult` schema v1.0**.  
4. Deterministic identity derivation is reproducible (identical allow-listed inputs → identical identifiers).  
5. All approved unit / contract / integration tests pass.  
6. Builds pass for `@ati/feature-version` and touched hosts.  
7. No architectural drift is introduced.  
8. No prohibited capabilities are present.  
9. Implementation Report + Deferred Capability Register are produced.  
10. Authorization conditions **C1–C7** are satisfied.

---

## Governance Requirements

| # | Condition |
|---|-----------|
| **C1** | Implement **only** Final Plan scope + WBS **T1–T8** and decisions **D1–D8**; no scope expansion without new governance review |
| **C2** | All new governance/delivery docs use **WP-3.3** Feature Version & Lineage identity |
| **C3** | Create **`docs/implementation/WP-3.3_DEFERRED_CAPABILITY_REGISTER.md`** during implementation and cite it from the Implementation Report (must include Domain FV product, ARS product, HITL, gating, AI, persistence, parsers, generation, release planning) |
| **C4** | Enforce **D4**: consume ClassificationResult only; `knowledgeRole` metadata only; forbid ARS authority and generation gating |
| **C5** | Default **omit** Domain product HTTP APIs; harness-first host wiring only (**D7**) |
| **C6** | Update WBS/roadmap/indexes for WP-3.3 as part of **T8**; do not invent new Phase 3 work package IDs |
| **C7** | Implement against Stable Development Baseline **v3.2** substrate (`@ati/intake`, `@ati/classification`, `@ati/requirement-engine`, Auth/Obs/Context present); do not weaken WP-3.2 / WP-3.1 / WP-2.5 contracts |

---

## Final Authorization

**APPROVED FOR IMPLEMENTATION**

Implementation of **WP-3.3 – Feature Version & Lineage** (`@ati/feature-version`) is authorized **only within the boundaries of D1–D8 and T1–T8**, subject to conditions **C1–C7**.

**Next stage after implementation:** Self Review → Independent Architecture Review → Repository Closeout → Git Readiness (per platform workflow).

**Do not** begin coding outside the Final Plan. **Do not** implement deferred non-goals under this authorization.  
**Do not** perform Roadmap Synchronization in this authorization stage (separate governance step if required by process).

---

## Authorization Status

| Field | Value |
|-------|--------|
| WP-3.3 Implementation Authorization | Complete |
| Final Verdict | **APPROVED FOR IMPLEMENTATION** |
| Binding contract | **D1–D8** · **T1–T8** · **C1–C7** |
| Ready for Implementation | **Yes** |
| Code authorized by this document alone | Yes — within D1–D8 / T1–T8 only |

---

*End of WP-3.3 Implementation Authorization.*
