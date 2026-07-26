# `@ati/classification`

Classification & Designation (WP-3.2).

Nest-free deterministic rule engine producing canonical `ClassificationResult` metadata from terminal intake records.

## Axes

- **classification** — requirement category
- **designation** — processing intent metadata
- **knowledgeRole** — `ars_candidate` | `supporting` | `unknown` (Option A; not ARS authority)

## Non-responsibilities

- AI / ML / LLM
- Persistence
- Parsers
- Intake / workflow orchestration
- ARS product, HITL, generation gating
- Feature Version

## Public API

Import only from `@ati/classification` (`src/index.ts`).
