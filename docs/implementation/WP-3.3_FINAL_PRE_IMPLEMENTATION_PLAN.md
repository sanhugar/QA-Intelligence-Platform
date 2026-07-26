# WP-3.3_FINAL_PRE_IMPLEMENTATION_PLAN.md
## Final Pre-Implementation Plan — Feature Version & Lineage

**Work Package:** WP-3.3 — Feature Version & Lineage  
**Role:** ATI Platform Chief Architect  
**Date:** 2026-07-26  
**Status:** **Final** — authoritative implementation baseline (pending Implementation Authorization)  
**Implementation:** **Not authorized**

**Phase:** Phase 3 — Knowledge Intake (Feature Version / lineage primitives)  
**Package:** **`@ati/feature-version`** (`packages/feature-version`)  
**Platform baseline:** Stable Development Baseline **v3.2**

**Governance predecessors**

| Stage | Artifact / result |
|-------|-------------------|
| Pre-Implementation Plan | [WP-3.3_PRE_IMPLEMENTATION_PLAN.md](./WP-3.3_PRE_IMPLEMENTATION_PLAN.md) — READY FOR ARCHITECTURE REVIEW WITH OPEN DECISIONS |
| Architecture Review | [WP-3.3_ARCHITECTURE_REVIEW.md](./WP-3.3_ARCHITECTURE_REVIEW.md) — **APPROVED WITH OBSERVATIONS** |

**Identity lock (binding):** WP-3.2 = Classification & Designation · WP-3.1 = Intake Entry · WP-3.3 = Feature Version & Lineage.

This document **supersedes** the draft Pre-Implementation Plan for implementation purposes. Architecture Review locks (**OD-1–OD-8**) are absorbed as **D1–D8** below. **No unauthorized scope expansion. No architecture redesign.**

---

## Executive Summary

WP-3.3 delivers Nest-free **`@ati/feature-version`**: deterministic Feature Version & Lineage **primitives** that consume terminal **`@ati/intake`** records, optional **`@ati/requirement-engine`** structural summaries, and authoritative **`ClassificationResult` v1.0** from **`@ati/classification`**, then emit canonical **`FeatureVersionResult` schema v1.0**.

The package establishes stable `featureId`, `versionIdentifier`, and `lineageIdentifier` with emit-only predecessor/successor links for downstream engines. It performs **no** Domain Feature Version product lifecycle, no Intake/classification ownership, no ARS authority, no persistence, no AI/ML, no parsers, no gating/HITL, and no generation or release planning.

**Final Verdict:** **APPROVED FOR IMPLEMENTATION AUTHORIZATION**

**Binding contract:** Decisions **D1–D8** below are the binding implementation contract for WP-3.3.

---

## Final Scope

| Area | Binding detail |
|------|----------------|
| **Package** | `packages/feature-version` → **`@ati/feature-version`**; Nest/React/Prisma-free; `index.ts` only (**D1**) |
| **Scope depth** | Feature Version & Lineage **primitives only** — not Domain FV product (**D2**) |
| **Identity** | Deterministic pure derivation from allow-listed metadata only (**D3**) |
| **Classification** | Consume `ClassificationResult` only; never recreate axes (**D4**) |
| **Status** | `draft` \| `active` \| `superseded` \| `unknown` (**D5**) |
| **Lineage** | Emit-only links; no persistence; no historical rewrite (**D6**) |
| **Hosts** | Thin api/worker harness; no Domain HTTP (**D7**) |
| **featureName** | Optional; never from payload body (**D8**) |
| **Tests + docs** | Unit/derivation/contract/host tests; Implementation Report; Deferred Capability Register |

### Sync API (binding)

```
resolveFeatureVersion(input) → FeatureVersionResult
```

Alternate facade names (`derive`, `createReady`) are acceptable if they preserve this contract semantics.

### Derive behaviour (binding)

```
terminal IntakeRecord + ClassificationResult (+ optional engine summary)
  → validate allow-listed FeatureVersionInput
  → derive featureId / versionIdentifier / lineageIdentifier (deterministic)
  → optionally resolve emit-only predecessor/parent from allow-listed hints / process-local registry
  → assemble FeatureVersionResult (schemaVersion 1.0)
```

---

## Locked Design Decisions (D1–D8)

| ID | Lock |
|----|------|
| **D1** | Package **`@ati/feature-version`** at `packages/feature-version`; Nest-free reusable package; public API via `index.ts` only |
| **D2** | Scope = Feature Version & Lineage **primitives only**; **do not** implement Domain Feature Version product lifecycle / RM services / UI |
| **D3** | Identity derivation = deterministic, pure functions over allow-listed metadata only; **no** payload inspection; **no** randomness; **no** UUID-derived identities; `evaluatedAt` is metadata only (not an identity input) |
| **D4** | Consume **`ClassificationResult`** only; never recreate `classification`, `designation`, or `knowledgeRole`; `knowledgeRole` remains metadata only (annotate/carry-through; never ARS grant or gating) |
| **D5** | Status vocabulary frozen: `draft`, `active`, `superseded`, `unknown` (additive later only) |
| **D6** | Lineage = **emit-only**; **no** persistence; **no** historical rewrite; optional process-local registry only for deterministic testing / predecessor lookup — not a product SoT |
| **D7** | Harness-first: thin API harness + thin Worker harness; **omit** Domain HTTP product APIs by default; no intake/classification state ownership |
| **D8** | `featureName` is **optional**; never derive from payload body; only allow-listed metadata may contribute; if undeterminable, **omit** the field |

### Identity derivation algorithm (D3 — binding family)

Canonicalization: UTF-8, trim, lowercase where applicable for tokens; join with a stable delimiter; digest with a fixed algorithm (e.g. SHA-256 hex prefix) — exact digest utility may reuse `@ati/shared-utils` if present, otherwise package-local pure helper.

| Identifier | Allow-listed inputs |
|------------|---------------------|
| `featureId` | `tenantId` (opt) + `workspaceId` (opt) + `sourceIdentity` + optional designation / feature-hint tokens from allow-listed metadata (not body) |
| `versionIdentifier` | `featureId` + `sourceVersion` + `checksum` (+ `intakeId` when needed for disambiguation) |
| `lineageIdentifier` | `featureId` (one lineage chain per feature identity in v1) |

**Fail-safe:** Missing required source identity signals → `status = unknown`, still emit deterministic placeholder identifiers with explicit `derivationRuleIds`, confidence low/zero — never invent certainty or ARS authority.

### Allow-listed derivation inputs (D3 / D4 / D8)

| Allowed | Forbidden |
|---------|-----------|
| Intake source identity / version / checksum / declaredFormat | Raw `payload` body |
| Intake state, correlation, tenant, workspace | Requirement fragment text |
| ClassificationResult axes + confidences + rule ids + intakeId / evaluatedAt (as ref) | Re-running classification rules |
| Optional section counts/kinds / requirementId | Content inspection / parsers |
| Metadata channel / notes tokens for optional name/hints | UUID / random / clock in identity keys |

---

## Output Contract

### Canonical `FeatureVersionResult` — schemaVersion `"1.0"`

| Field | Required | Rule |
|-------|----------|------|
| `schemaVersion` | **Yes** | Literal `"1.0"` |
| `featureId` | **Yes** | Deterministic stable feature identity |
| `versionIdentifier` | **Yes** | Deterministic immutable version key |
| `lineageIdentifier` | **Yes** | Deterministic lineage chain id |
| `status` | **Yes** | `draft` \| `active` \| `superseded` \| `unknown` |
| `confidence` | **Yes** | number in `[0, 1]` |
| `derivationRuleIds` | **Yes** | string[] provenance (non-empty when rules applied; may be empty only if explicitly documented fail-path — prefer always include fail-safe rule id) |
| `intakeId` | **Yes** | Carry-through from intake |
| `correlationId` | **Yes** | Carry-through |
| `evaluatedAt` | **Yes** | ISO-8601 (not used in identity hash) |
| `featureName` | Optional | Allow-listed metadata only; omit if undeterminable (**D8**) |
| `parentFeatureId` | Optional | Omit when unknown |
| `predecessorVersion` | Optional | Emit-only prior `versionIdentifier` |
| `successorVersion` | Optional | Emit-only; normally unset at creation |
| `tenantId` / `workspaceId` | Optional | Carry-through |
| `classificationResultRef` | Optional* | Reference to consumed classification (e.g. `intakeId` + `evaluatedAt`); *recommended for provenance — Final Authorization may require it; treat as **required for product path** if ClassificationResult is present |
| `knowledgeRole` | Optional | Carry-through annotation from ClassificationResult only (**D4**) — metadata only |

\*Implementation **SHALL** include `classificationResultRef` whenever a `ClassificationResult` is supplied on the product path.

### Additive evolution rules

1. Additive optional fields and additive status keys are allowed without bumping major contract if consumers ignore unknowns.  
2. Renames, removals, or meaning changes to required fields require a new `schemaVersion`.  
3. Identity algorithm changes that alter emitted ids for the same inputs are **breaking** — require `schemaVersion` bump + Architecture Review.  
4. Downstream engines must key on `schemaVersion` + stable identifiers.

---

## Dependencies

| Dependency | Use | Reverse dependency |
|------------|-----|--------------------|
| `@ati/intake` | Terminal intake adapter | **Forbidden** |
| `@ati/classification` | Authoritative `ClassificationResult` v1.0 | **Forbidden** |
| `@ati/requirement-engine` | Optional structural summary only | **Forbidden** |
| `@ati/shared-constants` | Env keys (e.g. `ATI_FEATURE_VERSION_ENABLED`) | N/A |
| Auth / Context / Observability | Host coexistence | No package absorption |

**No reverse dependencies** from intake, requirement-engine, or classification onto `@ati/feature-version`.

---

## Explicit Non-Goals

| Item | Status |
|------|--------|
| AI / LLM / embeddings / ML | **Forbidden** |
| Persistence / Prisma / database | **Forbidden** |
| Workflow / Intake orchestration | **Forbidden** |
| Parser logic / content body inspection | **Forbidden** |
| HITL product | **Forbidden** |
| Generation gating | **Forbidden** |
| ARS product capability / granted ARS authority | **Forbidden** |
| Classification / designation production | **Forbidden** (consume only) |
| Scenario / coverage / blueprint / test generation | **Forbidden** |
| Release planning | **Forbidden** |
| Domain Feature Version product lifecycle | **Forbidden** (**D2**) |
| Spine / Auth / Obs / Context redesign | **Forbidden** |

---

## Implementation Work Breakdown (T1–T8)

| ID | Task | Maps to |
|----|------|---------|
| **T1** | Scaffold `packages/feature-version` (`@ati/feature-version`) | **D1** |
| **T2** | Models + Zod: allow-listed input + `FeatureVersionResult` schema v1.0 + status vocabulary | **D2**, **D5**, Output Contract |
| **T3** | Deterministic identity/lineage derivation (pure; no UUID/random; allow-list only) | **D3**, **D8** |
| **T4** | Classification + intake (+ optional engine) adapters; consume ClassificationResult; no recreate | **D4** |
| **T5** | Emit-only lineage assembly + optional process-local registry for tests | **D6** |
| **T6** | Thin api/worker harness modules (no Domain HTTP) | **D7** |
| **T7** | Unit / derivation / contract / host integration tests (determinism, allow-list, Option A boundary) | D1–D8 |
| **T8** | Implementation Report + Deferred Capability Register + index sync | Governance |

**Order:** T1 → T2 → T3 → T4 → T5 → T6 → T7 → T8.  
**Hidden work:** None authorized.

---

## Risks

| ID | Risk | Mitigation (in contract) |
|----|------|--------------------------|
| R1 | Scope creep into Domain FV product | **D2** + Deferred Register |
| R2 | Non-reproducible identities | **D3** + fixture tests |
| R3 | ARS confusion via Feature Version | **D4** + docs + Deferred Register |
| R4 | Schema churn | Freeze v1 fields; additive evolution rules |
| R5 | Process-local registry misread as SoT | **D6** documentation |
| R6 | Name/content inspection creep | **D8** + allow-list |
| R7 | Orchestration absorption | **D7**; sync derive only |

---

## Implementation Readiness

| Check | Result |
|-------|--------|
| Architecture Review OD-1–OD-8 absorbed as D1–D8 | **Yes** |
| Scope frozen / output schema locked | **Yes** |
| Classification boundary locked | **Yes** |
| Blocking open architecture items | **None** |
| Implementation authorized | **No** — requires Implementation Authorization |

---

## Final Verdict

**APPROVED FOR IMPLEMENTATION AUTHORIZATION**

WP-3.3 may proceed to **Implementation Authorization**. Decisions **D1–D8** form the **binding implementation contract** for WP-3.3. This document does **not** authorize coding by itself.

---

## Document Status

| Field | Value |
|-------|--------|
| Final Plan complete | Yes |
| Verdict | APPROVED FOR IMPLEMENTATION AUTHORIZATION |
| Binding contract | **D1–D8** |
| Next stage | Implementation Authorization (not produced here) |
| Code / implementation | None |

---

*End of WP-3.3 Final Pre-Implementation Plan — Feature Version & Lineage.*
