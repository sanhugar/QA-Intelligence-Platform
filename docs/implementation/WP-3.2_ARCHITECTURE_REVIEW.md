# WP-3.2_ARCHITECTURE_REVIEW.md
## Architecture Review — Classification & Designation

**Work Package:** WP-3.2 — Classification & Designation  
**Role:** Independent ATI Platform Architecture Review Board  
**Date:** 2026-07-26  
**Input:** [WP-3.2_PRE_IMPLEMENTATION_PLAN.md](./WP-3.2_PRE_IMPLEMENTATION_PLAN.md)  
**Platform baseline:** Stable Development Baseline **v3.1** ([RELEASE_BASELINE_v3.1.md](../releases/RELEASE_BASELINE_v3.1.md))  
**Implementation:** **Not authorized**

**Independence:** Reviewer did not author the Pre-Implementation Plan.  
**Prerequisites:** WP-2.5 (`@ati/requirement-engine`) · WP-3.1 (`@ati/intake`)

---

## Executive Summary

The proposed **Classification & Designation** capability is **architecturally sound** as a Phase 3 reusable, deterministic, rule-based metadata producer consuming WP-3.1 terminal intake outcomes. It cleanly separates **category classification** and **processing designation metadata** from Intake orchestration (WP-3.1) and Requirement Engine structure/ports (WP-2.5). Scope correctly excludes AI/ML, persistence, parsers, Feature Version, generation engines, and ARS **product** behaviour.

ADR-0011 is respected: classification does **not** grant Approved Requirements Source authority by itself; role designation is orthogonal metadata. Platform Spine and Shared Infrastructure boundaries are preserved.

**ARS Boundary Decision (locked):** **Option A** — ARS may exist **only** as a **metadata designation value** (`knowledge_role`). No ARS product capability and no ARS workflow ownership in WP-3.2.

Residual items (exact rule field allow-list, confidence scale, host harness details) belong in Final Pre-Implementation Plan — they do **not** require architecture revision.

**Final Verdict:** **APPROVED WITH OBSERVATIONS**

---

## Architecture Assessment

| Dimension | Assessment |
|-----------|------------|
| Problem framing | **Sound** — first BI metadata capability after Entry; not generation |
| Layering | **Sound** — Orchestration-adjacent reusable package; not Spine redesign |
| Determinism | **Required and acceptable** — rule engine; fail-safe `unknown` |
| Scope control | **Strong** — AI/persistence/parsers/Feature Version/generation excluded |
| Reuse of WP-3.1 / WP-2.5 | **Sound** — consume terminal intake; optional structural reference only |
| Premature productization | **Managed** — harness-first; metadata-only outputs |

**Challenge — taxonomy breadth:** ADR Knowledge Intake defines a broad Knowledge Input class catalog (Requirement Knowledge, Collaboration Insight, etc.). The Pre-Implementation Plan proposes a **requirement-oriented category** catalog (functional / non_functional / …). That is **acceptable for WP-3.2 v1** if the result model remains extensible (additive category keys) and does not claim completeness of ADR §2.1. Final Plan must state v1 catalog is additive-extensible.

**Challenge — “Business Intelligence layer” wording:** Treat as capability type (deterministic metadata intelligence), not a new platform layer that bypasses ADR 0011 Orchestration ownership.

---

## Boundary Verification

| Requirement | Result | Notes |
|-------------|--------|-------|
| Deterministic classification only | **Pass** | No ML |
| Designation metadata only | **Pass** | No business processing executors |
| Does not perform Intake workflow orchestration | **Pass** | Consumes terminal `IntakeRecord`; does not own intake states |
| Does not duplicate Requirement Engine | **Pass** | No ports/model/lifecycle reimplementation |
| No AI / persistence / parser logic | **Pass** | Explicit non-goals |
| Does not invent ARS authority / generation gating | **Pass** — per ARS lock below |

---

## Classification Model Assessment

| Area | Assessment |
|------|------------|
| Classification taxonomy (category) | **Adequate for v1** — include `unknown`; keep extensible |
| Designation taxonomy (processing intent) | **Adequate** — Feature / Enhancement / Defect Fix / … / Unknown as metadata |
| Rule-based evaluation | **Sound** — configurable deterministic rules; ordered priority hooks |
| Confidence metadata | **Required** — numeric/ordinal + rule provenance |
| Unknown handling | **Sound** — fail-safe default; do not force false certainty |
| Extensibility | **Sound** — additive catalogs + versioned rule packs |
| Reuse for future WPs | **Yes** — canonical `ClassificationResult` suitable for WP-3.3+ / planners |

### Locked package preference

| Decision | Lock |
|----------|------|
| Package | **`packages/classification` → `@ati/classification`** (Nest-free) |
| Hosts | Thin api/worker harness default |
| Domain HTTP product APIs | **Not required**; default omit |

### Dual metadata axes (binding)

WP-3.2 outputs **two orthogonal metadata axes** (plus confidence/provenance):

1. **Category classification** — what kind of requirement/knowledge signal (`functional`, …, `unknown`).  
2. **Processing designation** — intended change/work type (`feature`, `enhancement`, …, `unknown`).  
3. **Knowledge role** (ARS boundary Option A) — `knowledge_role`: `ars_candidate` | `supporting` | `unknown` (**metadata only**).

Axis (3) reconciles WBS “ARS designation” language without granting product ARS authority.

---

## ARS Boundary Decision

### Inconsistency reviewed

| Source | Statement |
|--------|-----------|
| WBS WP-3.2 | Classification signals + Approved Requirements Source designation; clear `approved_requirements_source` vs supporting roles |
| Pre-Implementation Plan | ARS product ownership deferred / forbidden |
| ADR 0011 / Intake Architecture §2.2–2.3 | Classification ≠ ARS grant; role designation orthogonal to class |

### Options

| Option | Meaning | Evaluation |
|--------|---------|------------|
| **A** | ARS as **metadata designation value only** | **Selected** — satisfies WBS role clarity + ADR “classification ≠ authority” + plan non-goal against ARS product |
| **B** | ARS designation deferred entirely | Rejected — leaves WBS completion criteria unmet without a replacement WP; forces immediate WBS rewrite |
| **C** | Alternative (e.g., ARS product + HITL in WP-3.2) | Rejected — expands scope into Decision/HITL/generation gating; violates plan non-goals |

### Locked decision

**Option A is the architectural standard for WP-3.2.**

| Concern | Standard |
|---------|----------|
| **Metadata classification / designation** | **In scope** — category, processing designation, and `knowledge_role` including `ars_candidate` / `supporting` / `unknown` |
| **Product capability** | **Deferred** — ARS authority for generation, ARS admin UX, ARS SoT claims, automated promotion to Approved Requirements Source |
| **Workflow ownership** | **Deferred / not WP-3.2** — Intake lifecycle remains WP-3.1; generation-path gating / HITL pause-resume remain later Orchestration/Decision WPs |

**Binding rules:**

1. Emitting `knowledge_role=ars_candidate` **does not** make the intake an Approved Requirements Source.  
2. WP-3.2 **must not** enforce “generation cannot proceed without ARS” (that is product/workflow gating — later).  
3. WP-3.2 **must not** provide HITL designation UI/product (hooks/confidence only).  
4. Downstream WPs **may** read `knowledge_role` metadata; they must not treat WP-3.2 output as ARS SoT.  
5. Final Plan / Authorization must list ARS **product** and **gating workflow** in the Deferred Capability Register.

---

## Dependency Assessment

| Dependency | Assessment |
|------------|------------|
| `@ati/intake` | **Required** — terminal intake consumption |
| `@ati/requirement-engine` | **Optional reference only** when intake `accepted`; no duplication |
| Auth / Context / Observability | **Reuse at hosts** — thin coexistence |
| Prisma / AI / vector / search | **Must not introduce** |
| New unnecessary platform deps | **None justified** beyond `@ati/classification` |

---

## Future Extensibility (without scope expansion)

| Future consumer | Readiness |
|-----------------|-----------|
| WP-3.3 Feature Version & Lineage | **Ready** — consume classification/designation/`knowledge_role` metadata |
| Coverage / Scenario / Blueprint planners | **Ready** as metadata consumers — not implemented now |
| Future AI augmentation | **Compatible** if AI remains advisory later WP; deterministic baseline retained |
| Broader ADR Knowledge class taxonomy | **Additive** category keys later — do not rewrite v1 axes |

---

## Risk Assessment

| ID | Risk | Mitigation |
|----|------|------------|
| AR-R1 | Rule ambiguity / conflicts | Ordered rule packs; first-match or explicit priority; tests for conflict fixtures |
| AR-R2 | Over-classification away from `unknown` | Confidence thresholds; mandate `unknown` path |
| AR-R3 | Metadata schema churn | Freeze v1 `ClassificationResult` fields; additive evolution only |
| AR-R4 | Taxonomy growth without governance | Catalog version field; Architecture Review for breaking renames |
| AR-R5 | Operators confuse `ars_candidate` with ARS authority | Docs + Deferred Register + naming (`ars_candidate` not `approved_requirements_source`) |
| AR-R6 | Content inspection creep into rules | Allow-listed metadata fields only in Final Plan |

---

## Recommendations

| Priority | Recommendation |
|----------|----------------|
| **Mandatory before implementation** | Carry **ARS Option A** + dual/triple metadata axes into Final Plan / Authorization |
| **Mandatory before implementation** | Package **`@ati/classification`**; Deferred Register must list ARS product + gating workflow + AI + persistence |
| **Recommended** | Final Plan lock rule input allow-list, confidence scale, and harness-only host surface |
| **Recommended** | Use `ars_candidate` naming — avoid emitting literal `approved_requirements_source` as if authority were granted |
| **Do not** | Implement HITL, generation gating, parsers, or Feature Version under WP-3.2 |
| **Do not** | Authorize implementation from this review alone |

---

## Final Verdict

**APPROVED WITH OBSERVATIONS**

WP-3.2 may proceed to **Final Pre-Implementation Plan**.

### ARS architectural decision (explicit)

| Aspect | Decision |
|--------|----------|
| **Metadata designation** | **In scope** — `knowledge_role` including ARS-related **candidate** metadata only |
| **Product capability** | **Deferred** |
| **Workflow ownership** | **Deferred** (not WP-3.2; Intake remains WP-3.1; gating/HITL later) |

### Other locks

| Lock | Value |
|------|--------|
| Package | `@ati/classification` |
| Nature | Deterministic rules; metadata-only outputs |
| Non-goals | AI, persistence, parsers, Feature Version, generation, ARS product/gating |

### Observations (non-blocking)

1. v1 category catalog is requirement-oriented; keep additive for ADR Knowledge classes.  
2. Exact rule field allow-list / confidence scale → Final Plan.  
3. Operator education: `ars_candidate` ≠ Approved Requirements Source authority.

**Implementation is not authorized by this document.**

---

## Review Status

| Field | Value |
|-------|--------|
| Architecture Review complete | Yes |
| Final Verdict | APPROVED WITH OBSERVATIONS |
| ARS standard | Metadata designation only; product & workflow deferred |
| Next stage | Final Pre-Implementation Plan (not produced here) |
| Code / implementation | None |

---

*End of WP-3.2 Architecture Review — Classification & Designation.*
