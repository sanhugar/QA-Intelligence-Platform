# WP-3.3_PRE_IMPLEMENTATION_PLAN.md
## Pre-Implementation Plan — Feature Version & Lineage

**Work Package:** WP-3.3 — Feature Version & Lineage  
**Role:** ATI Platform Chief Architect  
**Date:** 2026-07-26  
**Status:** Draft — awaiting Architecture Review  
**Implementation:** **Not authorized**

**Phase:** Phase 3 — Knowledge Intake (Feature Version / lineage primitives)  
**Platform baseline:** Stable Development Baseline **v3.2** ([RELEASE_BASELINE_v3.2.md](../releases/RELEASE_BASELINE_v3.2.md))  
**Prerequisites:** WP-2.5 (`@ati/requirement-engine`) · WP-3.1 (`@ati/intake`) · WP-3.2 (`@ati/classification`)

**Identity lock:** WP-3.2 = Classification & Designation · WP-3.1 = Intake Entry · WP-3.3 = Feature Version & Lineage ([WP_IDENTITY_ARCHITECTURE_DECISION.md](./WP_IDENTITY_ARCHITECTURE_DECISION.md) · WBS).

**Next gate after approval of this plan:** Architecture Review (not implementation).

---

## Executive Summary

WP-3.3 introduces **Feature Version & Lineage primitives**: a Nest-free, deterministic platform capability that consumes terminal Intake records, optional Requirement Engine structural summaries, and canonical **`ClassificationResult`** (`@ati/classification` schema v1.0) to produce stable **feature identity**, **feature version**, and **lineage** metadata for downstream intelligence engines.

The capability establishes a **reusable version/lineage contract** so reasoning runs and future planners can correlate work to a Feature / Feature Version without inventing identity ad hoc. It does **not** perform requirement analysis, scenario generation, AI inference, ARS product authority, persistence, or workflow orchestration.

This plan aligns with Domain Architecture’s Feature / Feature Version vocabulary while deliberately scoping WP-3.3 to **primitives** (WBS: “Feature Version aggregate and lineage hooks”) — not the full Requirement Management Feature Version product lifecycle.

**Planning Verdict:** **READY FOR ARCHITECTURE REVIEW WITH OPEN DECISIONS**

---

## Objectives

### Business

1. Establish a **stable feature identity** for classified intake outcomes.  
2. Establish a **feature version** identity usable as the scope hook for future reasoning runs.  
3. Record **lineage** relationships (parent / predecessor / successor) so supersession and evolution are expressible.  
4. Provide a **versioned canonical result** model for Phase 4+ engines without redesign.

### Technical

1. Deliver a Nest-free Feature Version & Lineage package (candidate name below).  
2. Implement **deterministic** identity/version/lineage derivation from approved upstream contracts only.  
3. Integrate thinly with `@ati/intake`, `@ati/requirement-engine`, and `@ati/classification`.  
4. Keep technology-neutral, dependency-inverted, harness-first, and free of AI/persistence/orchestration.

---

## Scope

### In scope (planning)

| Area | Intent |
|------|--------|
| Feature identity model | Stable `featureId` (+ optional display name) for a coherent capability unit |
| Feature version model | Immutable-revision metadata (`versionIdentifier`, status, timestamps/context carry-through) |
| Version lineage model | `lineageIdentifier` + predecessor/successor links |
| Parent/child relationships | Optional parent feature / version linkage for hierarchical features |
| Version metadata | Classification axes carry-through, intake/source provenance references (ids only) |
| Stable identifiers | Deterministic identifier strategy (algorithm locked in Architecture Review) |
| Output schema versioning | Canonical result with `schemaVersion` (draft `1.0`) |
| Deterministic processing | No AI/ML; fail-safe unknown/incomplete lineage when signals insufficient |
| Host integration | Thin api/worker harness; no Domain HTTP product APIs by default |

### Explicitly out of scope

See § Explicit Non-Goals.

---

## Responsibilities

| Responsibility | WP-3.3 | Not WP-3.3 |
|----------------|--------|------------|
| Derive / emit Feature + Feature Version metadata | **Owns** | — |
| Emit lineage links (predecessor/successor/parent) | **Owns** | — |
| Consume `ClassificationResult` | **Owns** (consumer) | Classification production = WP-3.2 |
| Consume terminal IntakeRecord | **Owns** (adapter) | Intake lifecycle = WP-3.1 |
| Optional structural summary from Requirement | **Owns** (adapter) | Parse/normalize = WP-2.5 / later parsers |
| Persist Feature Versions | **Forbidden** | Later data / Tenancy WPs |
| Designate ARS authority | **Forbidden** | Later ARS product WP; WP-3.2 supplies `knowledgeRole` metadata only |
| Orchestrate classify → version → route workflow | **Forbidden** | Later orchestration |
| Generate scenarios / tests / blueprints | **Forbidden** | Later engines |

---

## Inputs

Consume **only** approved upstream contracts — do not bypass:

| Source | Use |
|--------|-----|
| `@ati/intake` | Terminal `IntakeRecord` — source identity/version/checksum/format, state, correlation/tenant/workspace, metadata channel/notes (allow-listed) |
| `@ati/requirement-engine` | Optional read-only structural summary (e.g. section counts/kinds / `requirementId`) when available — **no** fragment/body text inspection |
| `@ati/classification` | Canonical `ClassificationResult` v1.0 — `classification`, `designation`, `knowledgeRole`, confidences, rule ids, `intakeId`, correlation |

**Input allow-list principle (draft):** Rule/derivation inputs must remain metadata and identifiers only — never raw payload body or requirement fragment text (extend WP-3.2 D7 discipline).

---

## Outputs

### Draft canonical model — `FeatureVersionResult`

Planning draft only (fields may be refined in Architecture Review / Final Plan):

| Field | Type / rule (draft) |
|-------|---------------------|
| `schemaVersion` | Literal `"1.0"` for WP-3.3 v1 |
| `featureId` | Stable feature identity string |
| `featureName` | Optional human label (deterministic from allow-listed metadata or unknown) |
| `versionIdentifier` | Immutable version key for this Feature Version |
| `lineageIdentifier` | Stable lineage chain id |
| `parentFeatureId` | Optional parent feature |
| `predecessorVersion` | Optional prior `versionIdentifier` (or structured ref) |
| `successorVersion` | Optional next `versionIdentifier` (usually unset at create) |
| `status` | Controlled vocabulary (draft candidates: `draft` \| `active` \| `superseded` \| `unknown`) |
| `confidence` | Deterministic `[0, 1]` for identity/version binding confidence |
| `derivationRuleIds` | string[] provenance |
| `intakeId` | Carry-through |
| `classificationResultRef` | Reference to consumed classification (e.g. intakeId + evaluatedAt / hash) — **no** re-classification |
| `correlationId` / `tenantId` / `workspaceId` | Carry-through |
| `evaluatedAt` | ISO-8601 |

**Unknown / incomplete handling (draft):** If upstream signals are insufficient, emit fail-safe status/`unknown` identity strategy (exact policy locked in Architecture Review) — never invent ARS authority or silent certainty.

---

## Candidate Package

| Candidate | Assessment |
|-----------|------------|
| **`@ati/feature-version`** (`packages/feature-version`) | **Recommended** — aligns with Domain Architecture **Feature Version** term, WBS title, and prior package naming (`@ati/intake`, `@ati/classification`) |
| `@ati/feature-lineage` | Narrower; under-emphasizes Feature Version aggregate |
| `@ati/lineage` | Too generic; risks colliding with Decision/Knowledge lineage later |
| Nest module-only (no package) | Rejected — violates Nest-free reusable package pattern used in WP-2.5/3.1/3.2 |

**Architecture alignment:** Candidate **`@ati/feature-version`** is consistent with existing monorepo conventions and Domain vocabulary. **Final package name lock is an Architecture Review decision** (Open Decision OD-1).

---

## Dependencies

| Dependency | Role |
|------------|------|
| `@ati/classification` | Required — `ClassificationResult` v1.0 |
| `@ati/intake` | Required — terminal intake adapter |
| `@ati/requirement-engine` | Optional structural summary |
| `@ati/shared-constants` | Env keys (e.g. `ATI_FEATURE_VERSION_*`) as needed |
| Auth / Context / Observability | Host coexistence; correlation; fail-closed surfaces |
| Platform Spine | No LIVE/READY ownership change |

**Dependency inversion:** `@ati/feature-version` → upstream packages; upstream packages **must not** depend on feature-version.

---

## Architecture Considerations

### 1. Package placement

- Nest-free Foundation-style package under `packages/*`.  
- Thin Nest harnesses in `apps/api` and `apps/worker` only.  
- Public API via `index.ts` only.

### 2. Platform Spine alignment

- No change to boot / LIVE / READY ownership.  
- Capability is Orchestration-**adjacent** metadata (ADR-0011 lineage hooks), not Spine.

### 3. Shared Infrastructure reuse

- Reuse WP-2.5 / 3.1 / 3.2 contracts; do not reimplement intake lifecycle, engine ports, or classification rules.

### 4. Dependency boundaries

- Consume classification as authoritative category/designation/`knowledgeRole` metadata.  
- Do not call into future Domain Feature Version product services (none exist yet).

### 5. Version model extensibility

- Additive taxonomy/status keys only; bump `schemaVersion` on breaking changes.  
- Align conceptually with Domain Feature Version lifecycle without implementing full Requirement Management product.

### 6. Output contract stability

- Freeze `FeatureVersionResult` v1 fields in Final Plan.  
- Downstream engines (Understanding, Scenario, Coverage) must consume via schemaVersion.

### 7. Integration with future planning engines

- Provide stable `featureId` + `versionIdentifier` + `lineageIdentifier` hooks for reasoning run correlation (WBS completion intent).  
- Do **not** implement release planning or generation gating.

### Domain Architecture note

Domain Architecture places full Feature Version ownership under **Requirement Management** with lifecycle Draft → … → Superseded. WP-3.3 delivers **primitives / hooks** suitable for later Domain packaging — Architecture Review must prevent WP-3.3 from silently becoming the full Domain Feature Version product.

---

## Explicit Non-Goals

| Item | Status |
|------|--------|
| AI / LLM / embeddings / ML | **Forbidden** |
| Requirement extraction / rewriting | **Forbidden** |
| Classification / designation production | **Forbidden** (consume WP-3.2 only) |
| Workflow / Intake orchestration | **Forbidden** |
| Persistence / Prisma / database | **Forbidden** |
| Parser logic / content body inspection | **Forbidden** |
| HITL product | **Forbidden** |
| Generation gating | **Forbidden** |
| ARS product capability / granted ARS authority | **Forbidden** |
| Scenario / coverage / blueprint / test generation | **Forbidden** |
| Release planning | **Forbidden** |
| Full Domain Feature Version product lifecycle UI/services | **Forbidden** (primitives only) |
| Spine / Auth / Obs / Context redesign | **Forbidden** |

---

## Open Decisions

Architectural decisions that **must** be resolved before implementation (Architecture Review / Final Plan):

| ID | Decision | Why it blocks implementation |
|----|----------|------------------------------|
| **OD-1** | Lock package name: recommend **`@ati/feature-version`** | Public package identity and host wiring |
| **OD-2** | Scope depth: **primitives only** vs partial Domain Feature Version lifecycle | Prevents product absorption / scope explosion |
| **OD-3** | Deterministic identity algorithm: how `featureId` / `versionIdentifier` / `lineageIdentifier` are derived from allow-listed inputs | Core contract; must be reproducible |
| **OD-4** | Relationship to `knowledgeRole=ars_candidate`: whether Feature Version emission is gated, annotated, or independent | ADR-0011 ARS boundary |
| **OD-5** | Status vocabulary for v1 (`draft`/`active`/`superseded`/`unknown` vs Domain full lifecycle) | Output schema freeze |
| **OD-6** | Lineage mutation model without persistence (in-memory graph vs emit-only links with no rewrite) | Runtime semantics and harness tests |
| **OD-7** | Host surface: harness-first only (recommended) vs any Domain HTTP | Matches WP-3.1/3.2 C5/D8 pattern |
| **OD-8** | Whether `featureName` is required, optional, or always `unknown` when not determinable | Output contract |

Non-architectural implementation details (exact rule tables, env defaults) may remain for Final Plan / Authorization after OD-1–OD-8 lock.

---

## Risks

| ID | Risk | Mitigation (planning) |
|----|------|------------------------|
| R1 | WP-3.3 grows into full Requirement Management Feature Version product | Architecture Review lock OD-2 — primitives only |
| R2 | Non-deterministic IDs break reproducibility | OD-3 — pure functions over allow-listed inputs; tests |
| R3 | Confusion with ARS authority | OD-4 + Deferred Register; never emit granted ARS |
| R4 | Schema churn for Phase 4 engines | Freeze v1 fields; additive evolution only |
| R5 | Lineage without persistence misread as durable store | Explicit in-memory / emit-only semantics (OD-6) |
| R6 | Content inspection creep via naming heuristics | Allow-list discipline; no payload/fragment text |
| R7 | Duplicate identity models across future Domain modules | Treat WP-3.3 result as foundation contract for later Domain packaging |

---

## Implementation Readiness

| Check | Result |
|-------|--------|
| Prerequisites (Baseline v3.2 / WP-2.5 / 3.1 / 3.2) | **Present** |
| Problem statement / objectives clear | **Yes** |
| Candidate package proposed | **Yes** (`@ati/feature-version`) |
| Inputs / outputs drafted | **Yes** |
| Non-goals explicit | **Yes** |
| Open architectural decisions listed | **Yes** (OD-1–OD-8) |
| Implementation authorized | **No** |
| Ready for Architecture Review | **Yes** — with open decisions |

**Suggested WBS sketch (post-Authorization only — not authorized here):** T1 scaffold → T2 models/schema → T3 deterministic derivation → T4 adapters → T5 harnesses → T6 tests → T7 Report + Deferred Register + indexes.

---

## Final Verdict

**READY FOR ARCHITECTURE REVIEW WITH OPEN DECISIONS**

WP-3.3 may proceed to **Architecture Review**. Open Decisions **OD-1–OD-8** must be resolved before Implementation Authorization / coding. This document does **not** authorize implementation and does **not** redesign Platform Spine, Shared Infrastructure, or prior WP contracts.

---

## Document Status

| Field | Value |
|-------|--------|
| Pre-Implementation Plan complete | Yes |
| Verdict | READY FOR ARCHITECTURE REVIEW WITH OPEN DECISIONS |
| Next stage | Architecture Review (not produced here) |
| Code / implementation | None |

---

*End of WP-3.3 Pre-Implementation Plan — Feature Version & Lineage.*
