# WP-3.1 Deferred Capability Register

**Work Package:** WP-3.1 — Intake Entry Workflow  
**Last updated:** 2026-07-26  
**Authority:** [WP-3.1_IMPLEMENTATION_AUTHORIZATION.md](./WP-3.1_IMPLEMENTATION_AUTHORIZATION.md) · [WP-3.1_FINAL_PRE_IMPLEMENTATION_PLAN.md](./WP-3.1_FINAL_PRE_IMPLEMENTATION_PLAN.md)

This register records capabilities **intentionally deferred** from WP-3.1. They must not be introduced under this work package.

---

## Deferred Capabilities

| Capability | Reason for Deferral | Expected Future Work Package |
|------------|---------------------|------------------------------|
| Markdown parser implementation | Ports only via WP-2.5; Intake validates format membership only | Later format/parser WP |
| FDD parser implementation | Same | Later format/parser WP |
| PRD parser implementation | Same | Later format/parser WP |
| User Story parser implementation | Same | Later format/parser WP |
| Content inspection / shadow parsing | Forbidden (D5) | Never under Entry; parsers only |
| Classification | Orchestration-owned | **WP-3.2** |
| ARS designation | Orchestration-owned | **WP-3.2** |
| Feature Version / lineage product | Phase 3 | **WP-3.3** |
| LLM / AI extraction | Brain Stage | Later Requirement Understanding WP |
| Embeddings / vector DB / search / indexing | Knowledge / retrieval | Later Knowledge WPs |
| Scenario generation | Test Design engines | Later |
| Coverage generation | Coverage engines | Later |
| Blueprint generation | Blueprint engines | Later |
| Test case generation | Test Design engines | Later |
| Persistence / Prisma / database | In-memory only (D6) | After Tenancy ADR + data WPs |
| Asynchronous / job-bus execution | Sync-only in WP-3.1 | Job infrastructure WP |
| Domain HTTP product intake APIs | Harness-first (D7 / C5) | Later Application APIs |
| Full ADR §4.1 classify → designate → route | Entry slice only | WP-3.2+ |

---

## Notes

- Terminal status **`accepted_pending_parser`** is the authorized outcome when no production parse port is registered — it is **not** a deferred capability; it is delivered behaviour.  
- Engine test stub format (`stub`) remains forbidden on product intake paths.  
- Deferred items do **not** block WP-3.1 Entry completion.

---

*End of WP-3.1 Deferred Capability Register.*
