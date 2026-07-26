# WP-3.2_PRE_IMPLEMENTATION_PLAN.md
## Pre-Implementation Plan — Classification & Designation

**Work Package:** WP-3.2 — Classification & Designation  
**Role:** ATI Platform Chief Architect  
**Date:** 2026-07-26  
**Status:** Draft — awaiting Architecture Review  
**Implementation:** **Not authorized**

**Phase:** Phase 3 — Knowledge Intake (first business-intelligence capability after Entry)  
**Platform baseline:** Stable Development Baseline **v3.1** ([RELEASE_BASELINE_v3.1.md](../releases/RELEASE_BASELINE_v3.1.md))  
**Prerequisites:** WP-2.5 (`@ati/requirement-engine`) · WP-3.1 (`@ati/intake`)

**Identity lock:** WP-3.2 = Classification & Designation · WP-3.1 = Intake Entry · WP-3.3 = Feature Version & Lineage ([WP_IDENTITY_ARCHITECTURE_DECISION.md](./WP_IDENTITY_ARCHITECTURE_DECISION.md) · WBS).

**Next gate after approval of this plan:** Architecture Review (not implementation).

---

## Executive Summary

WP-3.2 introduces the first **deterministic, rule-based business-intelligence** capability after Intake Entry: **Classification & Designation**. It consumes completed intake outcomes from `@ati/intake` (and may carry opaque structural references from `@ati/requirement-engine` when available) and produces structured **classification** (requirement category) and **designation** (processing intent metadata) with confidence scores and rule provenance.

The capability is a **reusable Orchestration-adjacent platform package** — not AI, not persistence, not Feature Version, and not generation. Rules are configurable and fail-safe toward **`Unknown`** when ambiguous. No machine learning. No content rewriting or parser implementation.

**WBS note (open for Architecture Review):** Canonical WBS also associates WP-3.2 with **Approved Requirements Source (ARS) role designation**. This plan’s authorized drafting scope (below) treats ARS **authority invention / generation gating product** as **out of scope**, while requiring Architecture Review to lock whether a **metadata-only knowledge-role tag** (`ars_candidate` / `supporting` / `unknown`) is in WP-3.2 or deferred. This plan does **not** silently expand into ARS product ownership.

**Planning Verdict:** **READY FOR ARCHITECTURE REVIEW**

---

## Objectives

### Business

1. Determine **what kind** of requirement/intake was submitted (category classification).  
2. Assign **processing designation metadata** for downstream routing (Feature, Enhancement, Defect Fix, etc.).  
3. Expose **confidence** and rule provenance so low-confidence cases can later trigger HITL (HITL product itself deferred).  
4. Provide a **canonical classification result** model for WP-3.3+ and future intelligence engines.

### Technical

1. Deliver a Nest-free classification/designation package (name locked in Architecture Review).  
2. Implement a **deterministic rule engine** (classification + designation + optional priority hooks).  
3. Integrate thinly with `@ati/intake` outcomes and Shared Infrastructure (Auth/Context/Observability).  
4. Keep technology-neutral, dependency-inverted, and free of AI/persistence.

---

## Scope

### Classification (requirement category)

Determine category from configurable deterministic rules. Initial catalog (extensible):

| Category key | Intent |
|--------------|--------|
| `functional` | Functional Requirement |
| `non_functional` | Non-Functional Requirement |
| `business` | Business Requirement |
| `technical` | Technical Requirement |
| `configuration` | Configuration Requirement |
| `unknown` | Insufficient signal / ambiguous |

Rules must be **configurable** (in-memory / config schema — no DB). Ambiguity → `unknown` with confidence metadata (fail-safe).

### Designation (processing metadata)

Assign processing designation metadata only — **no business processing**:

| Designation key | Intent |
|-----------------|--------|
| `feature` | Feature |
| `enhancement` | Enhancement |
| `defect_fix` | Defect Fix |
| `technical_debt` | Technical Debt |
| `spike` | Spike |
| `investigation` | Investigation |
| `documentation` | Documentation |
| `unknown` | Unknown |

Designations are **metadata for downstream packages**, not workflow executors.

### Rule engine

| Capability | Intent |
|------------|--------|
| Classification rules | Deterministic matchers over allowed intake/engine metadata fields |
| Designation rules | Deterministic matchers producing designation + confidence |
| Priority evaluation hooks | Extension points for ordered rule application (no ML ranking) |
| Confidence metadata | Numeric/ordinal confidence + rule id provenance |

**Deterministic only. No machine learning.**

### Output model

Produce a structured **Classification Result** (canonical for downstream):

- Intake correlation / intake id reference  
- Category + confidence + rule ids  
- Designation + confidence + rule ids  
- Optional priority hint (hook output)  
- Timestamps / actor (when available)  
- Correlation / tenant / workspace carry-through  

### Integration (thin)

- Consume WP-3.1 terminal intake records (especially `accepted` / `accepted_pending_parser`)  
- May read opaque structural fields from engine results when present — **without** re-parsing or rewriting content  
- Host harnesses only (api/worker) unless Architecture Review authorizes otherwise  

---

## Out of Scope

| Item | Status |
|------|--------|
| AI / LLM / embeddings / vector search | **Forbidden** |
| Persistence / Prisma / database | **Forbidden** |
| Scenario / coverage / blueprint / test generation | **Forbidden** |
| Feature Version logic (WP-3.3) | **Forbidden** |
| Parser implementation | **Forbidden** |
| Requirement rewriting / normalization product | **Forbidden** (WP-2.5 `NormalizePort` remains engine-owned) |
| **ARS product ownership** (inventing ARS, generation gating enforcement, HITL ARS UX) | **Forbidden** in this drafting scope — see WBS open item |
| Intake Entry redesign / duplicating `@ati/intake` | **Forbidden** |
| Duplicating `@ati/requirement-engine` model/ports | **Forbidden** |
| Platform Spine / Auth / Obs / Context redesign | **Forbidden** |

---

## Architecture Overview

```
WP-3.1 @ati/intake (terminal IntakeRecord)
        │
        ▼
WP-3.2 Classification & Designation package
   ├── validate classification input (metadata only)
   ├── run deterministic classification rules
   ├── run deterministic designation rules
   ├── attach confidence + provenance
   └── emit ClassificationResult (canonical)
        │
        ▼
Future: WP-3.3 Feature Version · Brain / generation engines (consume metadata)
```

| Constraint | Binding intent |
|------------|----------------|
| ADR 0011 | Thin Orchestration capability; classification ≠ ARS grant by itself (architecture doc §2.2) |
| Platform Spine | Consumption only; no LIVE/READY ownership change |
| Shared Infrastructure | Reuse WP-2.5/3.1; do not absorb parsers/AI |
| Dependency inversion | Package does not depend on Nest hosts; hosts depend on package |
| Technology neutrality | Nest-free core; configurable rules without vendor lock-in |
| Reusability | Classification remains a reusable platform capability |

### Proposed package placement (open — Architecture Review)

| Option | Sketch |
|--------|--------|
| **A (preferred)** | `packages/classification` → `@ati/classification` |
| **B** | `packages/designation` → `@ati/designation` (weaker name — classification is primary) |
| **C** | Host-local only | Discouraged — weak reuse |

### Open Architecture Review locks

1. Package npm name (`@ati/classification` preferred).  
2. Whether WP-3.2 includes **metadata-only knowledge-role tags** aligned to WBS ARS language, or WBS is amended to defer ARS role tagging.  
3. Allowed input fields for rules (metadata/format/checksum/status only vs limited structural hints when `accepted`).  
4. Host surface (harness-only default).  
5. Persistence of rule config (in-memory/env/file vs deferred store).

---

## Dependencies

| Depends on | Use |
|------------|-----|
| WP-3.1 `@ati/intake` | Terminal intake records / correlation / idempotency identity |
| WP-2.5 `@ati/requirement-engine` | Optional structural result reference when intake reached `accepted` |
| Auth / Context / Observability Foundations | Fail-closed surfaces; tenant/workspace; correlation |
| Shared packages | Constants, validation patterns |

| Provides input for | Notes |
|--------------------|-------|
| WP-3.3 Feature Version & Lineage | Classification/designation metadata on intake path |
| Future intelligence / generation engines | Category + designation for routing — not generation itself |

**No duplication** of WP-2.5 or WP-3.1 behaviour.

---

## Risks

| ID | Risk | Mitigation |
|----|------|------------|
| R1 | Rule extensibility / sprawl | Versioned rule sets; explicit catalogs; Architecture Review locks extension API |
| R2 | Classification ambiguity | Mandatory `unknown` path; confidence thresholds; future HITL (deferred) |
| R3 | Unknown classifications dominate | Seed rule packs; measure in tests; do not invent AI fill-in |
| R4 | Future AI augmentation pressure | Keep ports/hooks; forbid ML in WP-3.2; later WP may advise, not replace deterministic baseline |
| R5 | Backward compatibility of result schema | Additive evolution; freeze v1 result fields in Final Plan |
| R6 | WBS ARS vs plan non-goal conflict | Architecture Review must lock (metadata role tag vs defer) |
| R7 | Content inspection creep | Rules operate on allow-listed metadata fields only |

---

## Success Criteria

Planning (this document) is complete when:

1. Scope is clearly defined (classification + designation + deterministic rules + output model).  
2. Classification boundaries are explicit (catalog + `unknown`).  
3. Designation boundaries are explicit (metadata only; no processing).  
4. Integration points with WP-3.1 / WP-2.5 / Shared Infrastructure are identified.  
5. Architectural dependencies and constraints are documented.  
6. Non-goals are clearly defined (including AI/persistence/ARS product / Feature Version / parsers).  

Later implementation succeeds when Architecture Review / Final Plan locks are implemented without scope expansion.

---

## Initial Work Breakdown

| ID | Item |
|----|------|
| T1 | Scaffold classification package (name per Architecture Review) |
| T2 | Classification / designation / result models + Zod |
| T3 | Deterministic rule engine + configurable rule packs |
| T4 | Confidence + provenance + priority hooks |
| T5 | Adapter from `@ati/intake` terminal records |
| T6 | Thin api/worker harness |
| T7 | Unit / rule / integration tests |
| T8 | Implementation Report + Deferred Capability Register + index sync |

*(WBS refined in Final Plan after Architecture Review.)*

---

## Final Readiness Assessment

| Check | Result |
|-------|--------|
| Baseline adequate (v3.1 + WP-2.5 + WP-3.1) | **Yes** |
| Scope / non-goals unambiguous for Architecture Review | **Yes** |
| Open items appropriate for Architecture Review (not blockers to plan gate) | **Yes** |
| Implementation authorized | **No** |
| Blocking planning gaps | **None** for this gate |

---

## Final Verdict

**READY FOR ARCHITECTURE REVIEW**

This Pre-Implementation Plan is sufficient to proceed to Architecture Review. **No implementation** is authorized. **No architecture redesign** is proposed — only a Phase 3 Classification & Designation capability plan consuming existing foundations.

---

## Document Status

| Field | Value |
|-------|--------|
| Plan complete | Yes |
| Verdict | READY FOR ARCHITECTURE REVIEW |
| Next stage | Architecture Review |
| Code / implementation | None |
| Architecture Review produced | No |

---

*End of WP-3.2 Pre-Implementation Plan — Classification & Designation.*
