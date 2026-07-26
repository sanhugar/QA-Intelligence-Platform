# WP-2.5 Deferred Capability Register

**Work Package:** WP-2.5 — Requirement Intelligence Engine Foundation  
**Last updated:** 2026-07-26  
**Authority:** [WP-2.5_IMPLEMENTATION_AUTHORIZATION.md](./WP-2.5_IMPLEMENTATION_AUTHORIZATION.md) · [WP-2.5_FINAL_PRE_IMPLEMENTATION_PLAN.md](./WP-2.5_FINAL_PRE_IMPLEMENTATION_PLAN.md)

This register records capabilities **intentionally deferred** from WP-2.5. They must not be introduced under this work package.

---

## Deferred Capabilities

| Capability | Reason for Deferral | Expected Future Work Package |
|------------|---------------------|------------------------------|
| Markdown parser implementation | Ports only in WP-2.5 (D4) | Later format/parser WP |
| FDD parser implementation | Ports only | Later format/parser WP |
| PRD parser implementation | Ports only | Later format/parser WP |
| User Story parser implementation | Ports only | Later format/parser WP |
| Document Intake Workflow | ADR 0011 / Phase 3 | **WP-3.1 Intake Entry Workflow** |
| ARS designation / classification | Orchestration-owned | WP-3.2 |
| LLM / AI extraction | Brain Stage 1 | Requirement Understanding Engine WP |
| Embeddings / vector DB / search / indexing | Knowledge / retrieval | Later Knowledge WPs |
| Scenario generation | Test Design / Scenario engines | Later |
| Coverage generation | Coverage engines | Later |
| Blueprint generation | Blueprint engines | Later |
| Test case generation | Test Design engines | Later |
| Persistence / Prisma / database | No storage in foundation | After Tenancy ADR + data WPs |
| Domain Approvals / HITL | Decision & Evidence | Later |
| AI Runtime envelope expansion / Brain registration | WP-1.4 field lock (D7) | Explicit future WP/ADR |
| HTTP Domain / product requirement APIs | D6 omit probe | Later Application APIs |
| Job-bus requirement continuity | No job bus | Job infrastructure WP |

---

## Notes

- Test-only **`stub`** parse port is authorized for pipeline verification — it is **not** a production format parser.  
- Deferred items do **not** block WP-2.5 foundation completion.

---

*End of WP-2.5 Deferred Capability Register.*
