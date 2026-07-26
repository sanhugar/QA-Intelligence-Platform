# WP-3.2 Deferred Capability Register

**Work Package:** WP-3.2 — Classification & Designation  
**Last updated:** 2026-07-26  
**Authority:** [WP-3.2_IMPLEMENTATION_AUTHORIZATION.md](./WP-3.2_IMPLEMENTATION_AUTHORIZATION.md) · [WP-3.2_FINAL_PRE_IMPLEMENTATION_PLAN.md](./WP-3.2_FINAL_PRE_IMPLEMENTATION_PLAN.md)

This register records capabilities **intentionally deferred** from WP-3.2. They must not be introduced under this work package.

---

## Deferred Capabilities

| Capability | Reason for Deferral | Expected Future Work Package |
|------------|---------------------|------------------------------|
| ARS **product** capability / authority grant | Forbidden (C4 / D4); `knowledge_role=ars_candidate` is metadata only | Later ARS / Knowledge authority WP |
| Generation **gating** enforcement | Forbidden (C4); classification does not gate engines | Later orchestration / gating WP |
| HITL product | Explicitly prohibited | Later HITL WP |
| AI / LLM / embeddings / ML classification | Deterministic rules only (D5) | Later advisory AI WP (non-authoritative) |
| Persistence / Prisma / database | In-memory evaluate only | After Tenancy ADR + data WPs |
| Parser logic / content inspection | Forbidden (D7); allow-listed metadata only | Format/parser WPs |
| Feature Version / lineage product | Phase 3 | **WP-3.3** |
| Scenario generation | Test Design engines | Later |
| Coverage generation | Coverage engines | Later |
| Blueprint generation | Blueprint engines | Later |
| Test case generation | Test Design engines | Later |
| Domain HTTP product classification APIs | Harness-first (D8 / C5) | Later Application APIs |
| Workflow / intake orchestration | WP-3.1 owns Entry; classification is sync evaluate only | Do not absorb into WP-3.2 |
| Emitting `approved_requirements_source` as granted ARS | Forbidden naming; use `ars_candidate` only | Never under WP-3.2 |
| Configurable external rule packs / remote registry | Default in-package pack only | Later config WP if authorized |
| Asynchronous / job-bus classification | Sync API only | Job infrastructure WP |
| Spike designation key | Additive taxonomy later; not required in v1 | Additive schema evolution |

---

## Notes

- `knowledgeRole: ars_candidate` **does not** grant Approved Requirements Source authority (ADR-0011).  
- Deferred items do **not** block WP-3.2 Classification & Designation completion.  
- Do not implement deferred items without new governance authorization.

---

*End of WP-3.2 Deferred Capability Register.*
