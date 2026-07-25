# Database Design Principles

**Status:** Principles + EIM alignment — no physical tables.

## Canonical information model

→ [ENTERPRISE_DATA_ARCHITECTURE.md](../architecture/ENTERPRISE_DATA_ARCHITECTURE.md) (ADR 0009)

Persistence (when later authorized) must **map to the EIM**, not invent a parallel model.

## Principles

1. Knowledge Intake + Approved Requirements Source + Feature Version is the root of behavioral traceability.
2. Prefer relational integrity for lineage; flexible payloads only where EIM allows.
3. Use outbox for reliable domain/integration events.
4. Design for idempotent job processing.
5. Decide tenancy via ADR before migration 0001.
6. Published/Approved snapshots are immutable (supersede, don’t edit).
7. Knowledge/AI artifacts support; they never own Requirements.
8. Migrations are reviewable SQL under `database/migrations` — only after implementation approval.
9. No database product choice is made in the EIM; choose storage in a future ADR.
