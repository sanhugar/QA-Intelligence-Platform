# `@ati/intake`

Intake Entry Workflow (WP-3.1).

Nest-free thin orchestration over `@ati/requirement-engine`: request validation, synchronous five-state lifecycle, engine invoke, and in-memory audit/idempotency.

## Non-responsibilities

- Real format parsers (Markdown/FDD/PRD/User Story)
- Content inspection / AI / LLM / embeddings
- Persistence / database
- ARS designation / classification (WP-3.2)
- Feature Version product (WP-3.3)

## Public API

Import only from `@ati/intake` (`src/index.ts`).

## Missing parser

Production formats without a registered engine parse port terminate as **`accepted_pending_parser`** (O1).
