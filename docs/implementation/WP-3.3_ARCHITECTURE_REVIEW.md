# WP-3.3_ARCHITECTURE_REVIEW.md
## Architecture Review — Feature Version & Lineage

**Work Package:** WP-3.3 — Feature Version & Lineage  
**Role:** ATI Platform Architecture Review Board  
**Date:** 2026-07-26  
**Input:** [WP-3.3_PRE_IMPLEMENTATION_PLAN.md](./WP-3.3_PRE_IMPLEMENTATION_PLAN.md)  
**Platform baseline:** Stable Development Baseline **v3.2** ([RELEASE_BASELINE_v3.2.md](../releases/RELEASE_BASELINE_v3.2.md))  
**Implementation:** **Not authorized**

**Independence:** Reviewer did not author the Pre-Implementation Plan.  
**Prerequisites:** WP-2.5 (`@ati/requirement-engine`) · WP-3.1 (`@ati/intake`) · WP-3.2 (`@ati/classification`)

---

## Executive Summary

The proposed **Feature Version & Lineage** capability is **architecturally sound** as Phase 3 **primitives**: a Nest-free, deterministic metadata producer that consumes terminal Intake outcomes, optional Requirement Engine structural summaries, and authoritative **`ClassificationResult` v1.0**, then emits a stable **`FeatureVersionResult`** for downstream engines.

Platform layering is preserved: WP-3.3 does **not** become the Domain Requirement Management Feature Version product, does **not** own Intake/classification/ARS/gating workflows, and does **not** introduce persistence, AI, or parsers. ADR-0011 is respected — Feature Version emission is independent of ARS authority; `knowledgeRole` remains metadata consumed from WP-3.2 only.

All Pre-Implementation Plan open decisions **OD-1–OD-8** are **resolved and locked** below for the Final Pre-Implementation Plan to absorb as the implementation contract.

**Final Verdict:** **APPROVED WITH OBSERVATIONS**

---

## Package Assessment

| Candidate | Result |
|-----------|--------|
| **`@ati/feature-version`** (`packages/feature-version`) | **Approved** — permanent package identity |
| `@ati/feature-lineage` | Rejected — under-emphasizes Feature Version aggregate |
| `@ati/lineage` | Rejected — too generic; future Decision/Knowledge lineage collision risk |
| Nest module-only | Rejected — breaks Nest-free reusable package pattern |

**OD-1 lock:** Package **`packages/feature-version` → `@ati/feature-version`**; Nest-free; public API via `index.ts` only; thin api/worker harnesses.

---

## Scope Assessment

| Option | Evaluation |
|--------|------------|
| **Primitives only** (Feature identity + Feature Version + lineage hooks) | **Selected** |
| Expand toward Domain Feature Version product lifecycle / RM ownership | **Rejected** — violates layering; Domain Architecture places full Feature Version under Requirement Management |

**OD-2 lock:** WP-3.3 remains **Feature Version & Lineage primitives only**. Full Domain Feature Version product lifecycle (UI, durable aggregate services, Draft→Under Analysis→… product workflows) is **deferred**.

WBS language (“aggregate and lineage hooks for reasoning runs”) is satisfied by a canonical in-memory **`FeatureVersionResult`** contract — not by implementing Domain product services.

---

## Identity & Lineage Assessment

### Output contract (locked for Final Plan freeze)

Canonical **`FeatureVersionResult`** with `schemaVersion: "1.0"` remains the approved draft shape from the Pre-Implementation Plan, with the following architectural locks:

| Field | Architectural rule |
|-------|--------------------|
| `featureId` | Required; deterministic; immutable once emitted for a given allow-listed input tuple |
| `versionIdentifier` | Required; deterministic; immutable revision key |
| `lineageIdentifier` | Required; deterministic chain id shared across related versions |
| `parentFeatureId` | Optional; omit when unknown |
| `predecessorVersion` | Optional; emit-only link (no rewrite of prior results) |
| `successorVersion` | Optional; normally unset at creation; emit-only |
| `status` | Controlled v1 vocabulary per OD-5 |
| `schemaVersion` | Literal `"1.0"`; additive evolution only |
| `derivationRuleIds` | Required provenance array |
| `featureName` | Optional per OD-8 |
| `confidence` | Deterministic `[0, 1]` |
| Classification carry-through / ref | Consume WP-3.2; never recompute classification |

### OD-3 — Identity algorithm (locked)

**Deterministic, pure derivation** over an allow-listed input tuple only:

| Identifier | Binding derivation basis (allow-listed) |
|------------|----------------------------------------|
| `featureId` | Stable hash/key over tenant/workspace (if present) + sourceIdentity (+ optional designation/feature-hint tokens from allow-listed metadata) — **never** payload body |
| `versionIdentifier` | Stable hash/key over `featureId` + sourceVersion + checksum (+ intakeId as disambiguator when required) |
| `lineageIdentifier` | Stable hash/key over `featureId` (one lineage chain per feature identity in v1) |

**Rules:**

1. Same allow-listed inputs → same identifiers (reproducible).  
2. No randomness, clocks, or UUIDs in identity derivation ( `evaluatedAt` is metadata only).  
3. Exact hashing/canonicalization details belong in Final Plan — algorithm **family** is locked here.  
4. Fail-safe: if required source identity signals are missing, emit `status=unknown` and still produce deterministic placeholder identifiers tagged via derivation rules — do **not** invent certainty.

### OD-5 — Status vocabulary (locked)

v1 status keys (additive later):

| Key | Meaning |
|-----|---------|
| `draft` | Newly derived; not yet treated as active scope |
| `active` | Current Feature Version metadata for correlation |
| `superseded` | Replaced by a newer version in lineage (when predecessor/successor links assert it) |
| `unknown` | Insufficient signal / fail-safe |

Domain full lifecycle (`Under Analysis`, `Analysed`, `Approved`, `Deprecated`, …) is **not** in WP-3.3 v1.

### OD-6 — Lineage mutation model (locked)

**Emit-only lineage links** — no durable graph store; no rewrite of previously emitted results.

| Behaviour | Lock |
|-----------|------|
| Persistence | **None** |
| In-memory registry | Optional process-local only (like WP-3.1), not a product SoT |
| Predecessor/successor | Set on the **new** result from allow-listed hints / prior version identifiers when provided as input; do not mutate historical outputs |
| Parent/child | Optional fields only; omit when unknown |

### OD-8 — `featureName` (locked)

`featureName` is **optional**. When not determinable from allow-listed metadata (e.g. channel/notes tokens / sourceIdentity label), omit or set a documented sentinel — **do not** invent marketing names from payload body. Final Plan may choose omit-vs-sentinel; Architecture locks **optional + no body inspection**.

---

## Classification Boundary Assessment

| Check | Result |
|-------|--------|
| `ClassificationResult` remains authoritative | **Pass** — required input |
| WP-3.3 never recreates classification/designation/`knowledgeRole` | **Pass** — consume only |
| `knowledgeRole` remains metadata only | **Pass** — ADR-0011 |

### OD-4 — Relationship to `knowledgeRole` (locked)

**Independent emission + annotation** (not gated):

| Concern | Standard |
|---------|----------|
| Feature Version derivation | **Runs for terminal classified intake** regardless of `knowledgeRole` |
| ARS authority | **Never granted** by WP-3.3 |
| `knowledgeRole` use | **Carry-through / annotation only** on `FeatureVersionResult` (or via classification ref) — may inform confidence, must not gate creation or imply Approved Requirements Source |
| Generation gating | **Forbidden** |

This preserves ADR-0011: classification/role metadata ≠ ARS grant; Feature Version primitives ≠ generation authority.

---

## Dependency Assessment

| Dependency | Assessment |
|------------|------------|
| `@ati/intake` | **Required** — terminal record adapter |
| `@ati/classification` | **Required** — `ClassificationResult` v1.0 |
| `@ati/requirement-engine` | **Optional** — structural summary only |
| `@ati/shared-constants` / Auth / Context / Obs | **Host / shared reuse** — appropriate |
| Reverse deps (intake/engine/classification → feature-version) | **Forbidden** |
| Prisma / AI / vector / search | **Forbidden** |

**OD-7 lock:** Host integration = **harness-first only**; default **omit** Domain product HTTP APIs (same pattern as WP-3.1/3.2).

---

## Architecture Compliance

| Dimension | Result |
|-----------|--------|
| ADR-0011 | **Pass** — thin metadata capability; no ARS/orchestration ownership |
| Platform Spine | **Pass** — no LIVE/READY change |
| Shared Infrastructure | **Pass** — reuse WP-2.5/3.1/3.2; no absorption |
| Dependency inversion | **Pass** |
| Technology neutrality (Nest-free core) | **Pass** |
| No orchestration / persistence / parsers / AI | **Pass** |
| Non-goals (HITL, gating, generation, release planning, Domain FV product) | **Pass** |

**Architectural drift from Pre-Implementation Plan:** None requiring redesign — decisions refine and lock open items only.

---

## Resolved Open Decisions (OD-1 through OD-8)

| ID | Resolution (binding) |
|----|----------------------|
| **OD-1** | Package **`@ati/feature-version`** at `packages/feature-version` |
| **OD-2** | **Primitives only** — not Domain Feature Version product |
| **OD-3** | Deterministic pure derivation over allow-listed identity tuple; no random IDs; fail-safe `unknown` status when signals insufficient |
| **OD-4** | Emission **independent** of `knowledgeRole`; annotate/carry-through only; never ARS grant or gating |
| **OD-5** | Status v1 = `draft` \| `active` \| `superseded` \| `unknown` |
| **OD-6** | **Emit-only** lineage links; no persistence; no historical rewrite |
| **OD-7** | **Harness-first**; omit Domain HTTP by default |
| **OD-8** | `featureName` **optional**; no payload-body naming |

These locks are the architectural standard for the Final Pre-Implementation Plan / Implementation Authorization.

---

## Observations

### Non-blocking (carry into Final Plan)

| ID | Observation |
|----|-------------|
| AR-OBS-1 | Exact hash/canonicalization algorithm and derivation rule catalog belong in Final Plan (family locked by OD-3) |
| AR-OBS-2 | Whether optional process-local registry is included (for predecessor lookup in harness tests) is an implementation detail — must not imply durable SoT |
| AR-OBS-3 | Operator education: Feature Version primitives ≠ Approved Requirements Source; `knowledgeRole=ars_candidate` still does not grant ARS |
| AR-OBS-4 | Domain Feature Version product remains a future packaging concern — map from `FeatureVersionResult`, do not fork identity models casually |
| AR-OBS-5 | Sync API shape (`derive` / `resolveFeatureVersion(input) → FeatureVersionResult`) should mirror WP-3.2 evaluate style in Final Plan |

### Mandatory before implementation

| Item | Disposition |
|------|-------------|
| Absorb OD-1–OD-8 into Final Pre-Implementation Plan | **Required** for implementation contract |
| Deferred Capability Register at implementation (T-later) | Must list Domain FV product, ARS product, persistence, AI, gating, generation, release planning |

**Architecture changes required:** None.

---

## Final Verdict

**APPROVED WITH OBSERVATIONS**

WP-3.3 may proceed to **Final Pre-Implementation Plan**. Architectural decisions **OD-1–OD-8** are **locked**. This review does **not** authorize implementation and does **not** produce the Final Plan.

---

## Review Status

| Field | Value |
|-------|--------|
| Architecture Review complete | Yes |
| Final Verdict | APPROVED WITH OBSERVATIONS |
| Package lock | `@ati/feature-version` |
| Scope lock | Primitives only |
| Next stage | Final Pre-Implementation Plan (not produced here) |
| Code / implementation | None |

---

*End of WP-3.3 Architecture Review — Feature Version & Lineage.*
