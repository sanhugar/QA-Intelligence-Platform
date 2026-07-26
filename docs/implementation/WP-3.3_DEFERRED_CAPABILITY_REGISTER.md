# WP-3.3 Deferred Capability Register

**Work Package:** WP-3.3 — Feature Version & Lineage  
**Last updated:** 2026-07-26  
**Authority:** [WP-3.3_IMPLEMENTATION_AUTHORIZATION.md](./WP-3.3_IMPLEMENTATION_AUTHORIZATION.md) · [WP-3.3_FINAL_PRE_IMPLEMENTATION_PLAN.md](./WP-3.3_FINAL_PRE_IMPLEMENTATION_PLAN.md)

This register records capabilities **intentionally deferred** from WP-3.3. They must not be introduced under this work package.

---

## Deferred Capabilities

| Capability | Reason for Deferral | Expected Future Work Package |
|------------|---------------------|------------------------------|
| Domain Feature Version product lifecycle | Forbidden (D2); primitives only | Later Requirement Management / Domain packaging |
| ARS **product** capability / authority grant | Forbidden (C4 / D4); `knowledgeRole` metadata only | Later ARS / Knowledge authority WP |
| Generation **gating** enforcement | Forbidden | Later orchestration / gating WP |
| HITL product | Explicitly prohibited | Later HITL WP |
| AI / LLM / embeddings / ML | Deterministic derivation only | Later advisory AI WP |
| Persistence / Prisma / database | Emit-only / optional process-local registry | After Tenancy ADR + data WPs |
| Parser logic / content inspection | Forbidden (D3); allow-listed metadata only | Format/parser WPs |
| Scenario / coverage / blueprint / test generation | Generation engines | Later |
| Release planning | Explicitly prohibited | Later Release WPs |
| Workflow / intake / classification orchestration | WP-3.1/3.2 own those slices | Do not absorb into WP-3.3 |
| Domain HTTP product Feature Version APIs | Harness-first (D7 / C5) | Later Application APIs |
| Full Domain status lifecycle (Under Analysis, Approved, Deprecated, …) | v1 status vocabulary frozen (D5) | Additive / Domain product later |
| Asynchronous / job-bus derivation | Sync API only | Job infrastructure WP |

---

## Notes

- `knowledgeRole` carry-through **does not** grant Approved Requirements Source authority (ADR-0011).  
- Process-local registry is **not** a product source of truth (**D6**).  
- Deferred items do **not** block WP-3.3 completion.

---

*End of WP-3.3 Deferred Capability Register.*
