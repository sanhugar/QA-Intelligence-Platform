# WP-3.2_FINAL_PRE_IMPLEMENTATION_PLAN.md
## Final Pre-Implementation Plan — Classification & Designation

**Work Package:** WP-3.2 — Classification & Designation  
**Role:** ATI Platform Chief Architect  
**Date:** 2026-07-26  
**Status:** **Final** — authoritative implementation baseline (pending Implementation Authorization)  
**Implementation:** **Not authorized**

**Phase:** Phase 3 — Knowledge Intake (Business Intelligence capability)  
**Package:** **`@ati/classification`** (`packages/classification`)  
**Platform baseline:** Stable Development Baseline **v3.1**

**Governance predecessors**

| Stage | Artifact / result |
|-------|-------------------|
| Pre-Implementation Plan | [WP-3.2_PRE_IMPLEMENTATION_PLAN.md](./WP-3.2_PRE_IMPLEMENTATION_PLAN.md) — READY FOR ARCHITECTURE REVIEW |
| Architecture Review | [WP-3.2_ARCHITECTURE_REVIEW.md](./WP-3.2_ARCHITECTURE_REVIEW.md) — **APPROVED WITH OBSERVATIONS** |

**Identity lock (binding):** WP-3.2 = Classification & Designation · WP-3.1 = Intake Entry · WP-3.3 = Feature Version & Lineage.

This document **supersedes** the draft Pre-Implementation Plan for implementation purposes. Architecture Review locks are absorbed below. **No unauthorized scope expansion. No architecture redesign.**

---

## Executive Summary

WP-3.2 delivers Nest-free **`@ati/classification`**: a deterministic rule engine that accepts terminal intake information from **`@ati/intake`** (and optional structural references from **`@ati/requirement-engine`** when present) and produces **canonical classification metadata** for downstream packages.

Outputs are **metadata only** on three orthogonal axes:

1. **Category classification** (functional / non_functional / … / unknown)  
2. **Processing designation** (feature / enhancement / … / unknown)  
3. **Knowledge role** (`knowledge_role`: `ars_candidate` | `supporting` | `unknown`)

The package **performs no orchestration**, no Intake state ownership, no ARS product capability, no generation gating, no HITL, no AI/ML, no persistence, and no parser logic. `knowledge_role=ars_candidate` **does not** grant Approved Requirements Source authority (ADR 0011).

**Final Verdict:** **APPROVED FOR IMPLEMENTATION AUTHORIZATION**

---

## Objectives

### Business

1. Classify requirement category deterministically with fail-safe `unknown`.  
2. Assign processing designation metadata for downstream routing.  
3. Emit `knowledge_role` metadata per Architecture Review Option A.  
4. Provide a versioned canonical result schema for WP-3.3+ and future engines.

### Technical

1. Ship Nest-free `@ati/classification` with public API via `index.ts` only.  
2. Implement rule registry, deterministic execution, confidence, provenance, unknown handling.  
3. Integrate thinly with `@ati/intake` terminal records; optional engine result reference.  
4. Prove behaviour with unit/rule/integration tests; record Deferred Capability Register.

---

## Approved Scope

| Area | Binding detail |
|------|----------------|
| **Package** | `packages/classification` → **`@ati/classification`**; Nest/React/Prisma-free; `index.ts` only (**D1**) |
| **Classification** | Deterministic category keys in § Taxonomies (**D2**) |
| **Designation** | Processing designation metadata only — no business workflow (**D3**) |
| **Knowledge role** | `knowledge_role` ∈ {`ars_candidate`,`supporting`,`unknown`} — metadata only (**D4**) |
| **Rule engine** | Registry + deterministic evaluation + confidence + rule ids + unknown handling; **no ML/AI** (**D5**) |
| **Output model** | Canonical `ClassificationResult` with schema version (**D6**) |
| **Input allow-list** | Metadata fields only — no document content inspection (**D7**) |
| **Host integration** | Thin api/worker harness; **no** Domain HTTP product APIs by default (**D8**) |
| **Tests + docs** | Unit/rule/contract/host tests; Implementation Report; Deferred Capability Register |

### Taxonomies (v1 — additive-extensible)

**Category (`classification`)**

| Key | Label |
|-----|-------|
| `functional` | Functional |
| `non_functional` | Non-functional |
| `business` | Business |
| `technical` | Technical |
| `configuration` | Configuration |
| `unknown` | Unknown |

**Processing designation (`designation`)**

| Key | Label |
|-----|-------|
| `feature` | Feature |
| `enhancement` | Enhancement |
| `defect` | Defect |
| `technical_debt` | Technical Debt |
| `documentation` | Documentation |
| `investigation` | Investigation |
| `unknown` | Unknown |

*(Spike may be added later additively; not required in v1 contract.)*

**Knowledge role (`knowledge_role`)**

| Key | Meaning |
|-----|---------|
| `ars_candidate` | Metadata candidate only — **not** ARS authority |
| `supporting` | Supporting knowledge metadata |
| `unknown` | Insufficient signal |

---

## Out of Scope

| Item | Status |
|------|--------|
| AI / LLM / embeddings / vector search | **Forbidden** |
| Parser logic | **Forbidden** |
| Persistence / Prisma / database | **Forbidden** |
| Intake / workflow orchestration | **Forbidden** (WP-3.1 owns Entry) |
| Feature Version logic (WP-3.3) | **Forbidden** |
| Scenario / Coverage / Blueprint / Test generation | **Forbidden** |
| ARS **product** capability | **Forbidden** |
| HITL product | **Forbidden** |
| Generation **gating** enforcement | **Forbidden** |
| Requirement rewriting / normalization product | **Forbidden** |
| Emitting authority claim `approved_requirements_source` as granted ARS | **Forbidden** — use `ars_candidate` only |
| Spine / Auth / Obs / Context redesign | **Forbidden** |

---

## Architecture Alignment

| Constraint | Binding |
|------------|---------|
| ADR 0011 | Classification ≠ ARS grant; role metadata orthogonal; thin capability |
| Platform Spine | No LIVE/READY ownership change |
| Shared Infrastructure | Reuse WP-2.5/3.1; do not absorb engine/intake |
| Dependency inversion | `@ati/classification` → `@ati/intake` / `@ati/requirement-engine` types as needed; engine/intake must not depend on classification |
| Technology neutrality | Nest-free core; configurable in-memory/env rule packs |
| Reusability | Canonical result consumed by future WPs without redesign |

---

## Output Model

Canonical **`ClassificationResult`** (v1 schema — additive evolution only):

| Field | Type / rule |
|-------|-------------|
| `schemaVersion` | Literal `"1.0"` for WP-3.2 v1 |
| `classification` | Category key from catalog |
| `designation` | Processing designation key from catalog |
| `knowledgeRole` | `ars_candidate` \| `supporting` \| `unknown` |
| `classificationConfidence` | number in `[0, 1]` |
| `designationConfidence` | number in `[0, 1]` |
| `knowledgeRoleConfidence` | number in `[0, 1]` |
| `classificationRuleIds` | string[] provenance |
| `designationRuleIds` | string[] provenance |
| `knowledgeRoleRuleIds` | string[] provenance |
| `intakeId` | string (from intake) |
| `correlationId` | string |
| `tenantId` / `workspaceId` | optional carry-through |
| `evaluatedAt` | ISO-8601 timestamp |

**Unknown handling:** If no rule matches with sufficient confidence, axis value = `unknown` and confidence reflects low/zero signal (never invent certainty).

---

## Dependencies

| Dependency | Use |
|------------|-----|
| `@ati/intake` | Terminal intake record adapter input |
| `@ati/requirement-engine` | Optional structural reference when intake `accepted` — no port duplication |
| Auth / Context / Observability | Host coexistence; correlation; fail-closed surfaces |
| `@ati/shared-constants` | Env keys as needed (`ATI_CLASSIFICATION_*`) |

---

## Risks

| ID | Risk | Mitigation (in contract) |
|----|------|--------------------------|
| R1 | Rule growth / conflicts | Versioned rule packs; ordered evaluation; conflict fixture tests |
| R2 | Taxonomy evolution | Additive keys only; bump `schemaVersion` on breaking changes |
| R3 | Metadata compatibility | Freeze v1 fields (**D6**); additive optional fields later |
| R4 | Unknown over/under use | Explicit confidence thresholds in rule pack config |
| R5 | Future AI augmentation pressure | Keep deterministic baseline; AI advisory only in later WP |
| R6 | `ars_candidate` misread as ARS authority | Naming + Deferred Register + docs |

---

## Success Criteria

Planning is complete when (this document):

1. Scope is frozen (D1–D8).  
2. Classification boundaries are explicit.  
3. Designation boundaries are explicit.  
4. `knowledge_role` contract is locked (Option A).  
5. Output schema is defined.  
6. Integration points are finalized.

Implementation is complete later when Authorization success criteria are met.

---

## Implementation Contract

### Locked decisions (D1–D8)

| ID | Lock |
|----|------|
| **D1** | Package **`@ati/classification`** at `packages/classification`; public API via `index.ts` only |
| **D2** | Category keys exactly: `functional`, `non_functional`, `business`, `technical`, `configuration`, `unknown` (additive later) |
| **D3** | Designation keys exactly: `feature`, `enhancement`, `defect`, `technical_debt`, `documentation`, `investigation`, `unknown` (additive later); metadata only — **no** workflow execution |
| **D4** | `knowledgeRole` ∈ {`ars_candidate`,`supporting`,`unknown`}; ARS product + gating + HITL **deferred**; never emit granted ARS authority |
| **D5** | Deterministic rule registry/execution only; confidence + rule ids; no ML/AI |
| **D6** | Emit `ClassificationResult` with `schemaVersion: "1.0"` and fields listed in § Output Model |
| **D7** | Rule inputs allow-listed to intake/engine **metadata** only (e.g. `declaredFormat`, intake `state`, source identity/version/checksum presence, designation hints in metadata, optional requirement section **counts/kinds** if intake `accepted` — **never** raw payload body text inspection) |
| **D8** | Host integration = thin harness on api and/or worker; **omit** Domain product HTTP by default; sync evaluate API on package (`classify(input) → ClassificationResult`); **no** intake state machine ownership |

### Rule engine behaviour (binding)

```
terminal IntakeRecord (+ optional engine summary)
  → validate classify request (structure)
  → load rule pack (in-memory / env / bundled config)
  → evaluate classification rules → category + confidence + ruleIds
  → evaluate designation rules → designation + confidence + ruleIds
  → evaluate knowledge_role rules → knowledgeRole + confidence + ruleIds
  → assemble ClassificationResult (schemaVersion 1.0)
```

Default when no match: axis = `unknown`.

### Integration matrix

| Concern | WP-3.2 behaviour |
|---------|------------------|
| Intake | Adapter from terminal records; does not mutate intake lifecycle |
| Requirement engine | Optional read-only summary; no parse/normalize reimplementation |
| Auth / Context / Obs | Propagate correlation/tenant/workspace; allow-listed labels only |
| Persistence | None |
| Orchestration | None |

### Work breakdown (implementation phase)

| ID | Item |
|----|------|
| T1 | Scaffold `packages/classification` |
| T2 | Taxonomies + `ClassificationResult` models + Zod |
| T3 | Rule registry + deterministic executor |
| T4 | Default rule pack + unknown/confidence behaviour |
| T5 | Intake adapter (+ optional engine summary) |
| T6 | Thin api/worker harness |
| T7 | Unit / rule / contract / integration tests |
| T8 | Implementation Report + Deferred Capability Register + index sync |

---

## Final Readiness Assessment

| Check | Result |
|-------|--------|
| Architecture Review observations absorbed | **Yes** (package, Option A, axes, harness-first, allow-list) |
| Scope frozen / output schema locked | **Yes** |
| `knowledge_role` contract locked | **Yes** |
| Blocking open architecture items | **None** |
| Implementation authorized | **No** — requires Implementation Authorization |

---

## Final Verdict

**APPROVED FOR IMPLEMENTATION AUTHORIZATION**

WP-3.2 may proceed to **Implementation Authorization**. This document is the binding implementation contract until Authorization adds conditions. **No code** is authorized by this plan alone.

---

## Document Status

| Field | Value |
|-------|--------|
| Final Plan complete | Yes |
| Verdict | APPROVED FOR IMPLEMENTATION AUTHORIZATION |
| Next stage | Implementation Authorization (not produced here) |
| Code / implementation | None |

---

*End of WP-3.2 Final Pre-Implementation Plan — Classification & Designation.*
