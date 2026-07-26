# WP-3.2 Implementation Report — Classification & Designation

**Work Package:** WP-3.2 — Classification & Designation  
**Date:** 2026-07-26  
**Role:** ATI Platform Senior Software Architect / Lead Engineer  
**Authority:** [WP-3.2_IMPLEMENTATION_AUTHORIZATION.md](./WP-3.2_IMPLEMENTATION_AUTHORIZATION.md) · [WP-3.2_FINAL_PRE_IMPLEMENTATION_PLAN.md](./WP-3.2_FINAL_PRE_IMPLEMENTATION_PLAN.md)

**Authorization:** APPROVED WITH IMPLEMENTATION CONDITIONS (C1–C7)

---

## Executive Summary

WP-3.2 delivers Nest-free **`@ati/classification`**: a deterministic rule engine that consumes terminal intake metadata (and optional structural summaries from **`@ati/requirement-engine`**) and produces canonical **`ClassificationResult`** schema **v1.0** on three orthogonal axes — category classification, processing designation, and `knowledgeRole` (Option A).

The package performs **no** orchestration, persistence, AI/ML, parser logic, ARS product behaviour, HITL, generation gating, or Feature Version. Thin api/worker harnesses expose in-process evaluate APIs only (no Domain HTTP).

**Final Assessment:** **IMPLEMENTATION COMPLETE WITH DEFERRED ITEMS**

---

## Package Structure

```
packages/classification/
  package.json          (@ati/classification)
  README.md
  src/
    index.ts            public API only
    types.ts            taxonomies, schema version, errors
    model.ts            ClassificationInput / ClassificationResult (Zod)
    rules.ts            rule registry + default pack + evaluateAxis
    adapter.ts          IntakeRecord / Requirement → allow-listed input
    config.ts           ATI_CLASSIFICATION_ENABLED
    service.ts          ClassificationService facade
    classification.spec.ts
```

Hosts:

- `apps/api/src/classification/` — harness + Nest module (no HTTP controller)
- `apps/worker/src/classification/` — harness + Nest module (no HTTP controller)

Shared constants: `EnvKeys.CLASSIFICATION_ENABLED` = `ATI_CLASSIFICATION_ENABLED`.

---

## Classification Taxonomy

| Key | Label |
|-----|-------|
| `functional` | Functional |
| `non_functional` | Non-functional |
| `business` | Business |
| `technical` | Technical |
| `configuration` | Configuration |
| `unknown` | Unknown (fail-safe) |

---

## Designation Taxonomy

| Key | Label |
|-----|-------|
| `feature` | Feature |
| `enhancement` | Enhancement |
| `defect` | Defect |
| `technical_debt` | Technical Debt |
| `documentation` | Documentation |
| `investigation` | Investigation |
| `unknown` | Unknown (fail-safe) |

---

## Rule Engine

- **Registry:** versioned default pack `ati-default-classification-v1` (`1.0.0`).
- **Evaluation:** first match wins by ascending `priority` then stable `id` sort; per axis.
- **Unknown:** no match → axis value `unknown`, confidence `0`, empty rule id list.
- **Determinism:** identical allow-listed input → identical result (fixed `evaluatedAt` in tests).
- **Allow-list (D7):** rules see only metadata fields — never raw payload / fragment text.
- **No probabilistic / AI behaviour.**

`knowledgeRole` Option A keys: `ars_candidate` | `supporting` | `unknown`.

---

## Output Schema

Canonical **`ClassificationResult`** (`schemaVersion: "1.0"`):

| Field | Notes |
|-------|-------|
| `classification` / `designation` / `knowledgeRole` | Taxonomy keys |
| `*Confidence` | `[0, 1]` per axis |
| `*RuleIds` | Provenance string arrays |
| `intakeId` / `correlationId` | Required carry-through |
| `tenantId` / `workspaceId` | Optional |
| `evaluatedAt` | ISO-8601 |

---

## Integration

| Dependency | Use |
|------------|-----|
| `@ati/intake` | `toClassificationInput(IntakeRecord)` — terminal record adapter |
| `@ati/requirement-engine` | `toEngineSummary(Requirement)` — section counts/kinds only |
| Hosts | `ClassificationHarness.classify` / `classifyIntakeRecord` |

Does **not** own intake lifecycle or orchestrate workflow.

---

## Tests

| Suite | Result |
|-------|--------|
| Build (`shared-constants`, `classification`, `api`, `worker`) | Pass |
| `@ati/classification` unit / rule / adapter | 13 passed |
| `@ati/api` classification harness | Pass (1) |
| `@ati/worker` classification harness | Pass (1) |
| Schema v1.0 + Option A rejection of ARS grant key | Pass |
| Determinism + unknown handling | Pass |
| Payload body isolation (D7) | Pass |

---

## Deferred Capabilities

See [WP-3.2_DEFERRED_CAPABILITY_REGISTER.md](./WP-3.2_DEFERRED_CAPABILITY_REGISTER.md).

Includes: ARS product, HITL, gating, AI, persistence, Feature Version, parsers, generation engines, Domain HTTP APIs.

---

## Architecture Compliance

| Check | Result |
|-------|--------|
| D1–D8 Final Plan | Pass |
| C1–C7 Authorization | Pass |
| ADR-0011 — metadata only; not ARS grant | Pass |
| Nest-free `@ati/classification` | Pass |
| No AI / persistence / parsers / orchestration | Pass |
| Harness-first (no Domain HTTP) | Pass |
| Baseline v3.1 substrate preserved | Pass |

---

## WBS Completion

| Task | Status |
|------|--------|
| T1 Package scaffold | Complete |
| T2 Models + taxonomies + schema v1.0 | Complete |
| T3 Rule engine | Complete |
| T4 Default rule pack | Complete |
| T5 Intake / engine adapters | Complete |
| T6 API / worker harnesses | Complete |
| T7 Tests | Complete |
| T8 Report + Deferred Register + indexes | Complete |

---

## Final Assessment

WP-3.2 Classification & Designation is **implemented** within authorized scope. Self Review, Independent Architecture Review, Repository Closeout, and Release Baseline are **out of scope** for this delivery step and remain subsequent governance stages.

---

*End of WP-3.2 Implementation Report.*
