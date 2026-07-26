# WP-2.4 Deferred Capability Register

**Work Package:** WP-2.4 — Tenancy / Workspace Context Baseline  
**Last updated:** 2026-07-26  
**Authority:** [WP-2.4_IMPLEMENTATION_AUTHORIZATION.md](./WP-2.4_IMPLEMENTATION_AUTHORIZATION.md) · [WP-2.4_FINAL_PRE_IMPLEMENTATION_PLAN.md](./WP-2.4_FINAL_PRE_IMPLEMENTATION_PLAN.md) · [WP-2.4_ARCHITECTURE_DECISION_RESOLUTION.md](./WP-2.4_ARCHITECTURE_DECISION_RESOLUTION.md)

This register is the **authoritative record of intentionally deferred scope** for WP-2.4. These capabilities are **not authorized** in WP-2.4 and must not be introduced under this work package.

WP-2.4 delivers only in-memory / request-scoped **tenant/workspace context propagation** (`@ati/context` + host wiring + isolation tests), with **zero persistence**.

---

## Deferred Capabilities

| Capability | Reason for Deferral | Expected Future Work Package |
|------------|---------------------|------------------------------|
| Multi-tenant database persistence | Requires specialized **Tenancy ADR** before persistence; D5 forbids storage in WP-2.4 | Persistence / Data milestone after Tenancy ADR |
| Prisma / schema migrations (`tenant_id`, etc.) | Blueprint gate: tenancy ADR before first multi-tenant migration; D5 hard lock | First persistence WP after Tenancy ADR |
| Tenant administration APIs | Domain/Administration product — out of Shared Infrastructure context baseline | Administration / Access modules (Blueprint order ~4) |
| Workspace administration UI | Frontend product workspace — not context baseline | Later Application / UX WPs |
| Organization membership management | Domain membership AuthZ — not context carrier | User & Access / Domain Administration later |
| RBAC / authorization enhancements (Domain roles, membership checks) | WP-2.2 closed foundation-only; context ≠ AuthZ engine | Later Application/Domain AuthZ WPs |
| Cross-workspace access policies | Policy product beyond opaque workspace id carry | Later Security / Access policy WPs |
| Domain tenancy model implementation (Administration aggregates, events) | Domain Architecture ownership — consumed meaning only in WP-2.4 | Domain Administration module WPs |
| Tenant-scoped connector credentials / enablement | Integration Architecture | Integration enablement packs |
| ABAC / OPA / external PDP | Explicitly deferred from WP-2.2; not context baseline | Later (ADR when needed) |
| Job-bus / BullMQ tenant context continuity | No job bus in baseline; harness only in WP-2.4 | Job infrastructure WP |
| Tenancy-dimensioned product dashboards / SIEM | Ops product | Later observability hardening / ops |
| `apps/web` tenant/workspace switcher UX | Web product | Later frontend WPs |
| Cookie/BFF session tenancy | Web auth path | Later web auth |
| Propagated human user identity on worker jobs (beyond context ids) | Related WP-2.2 deferral; distinct from tenant/workspace scope ids | Later / Access-aligned WP |
| Dedicated Tenancy ADR document | Not required to *start* context-only WP-2.4; **mandatory before persistence** | Before any tenancy persistence WP |

---

## Notes

- Deferred items listed here **do not block** WP-2.4 implementation of authorized context propagation.  
- Introducing any capability from this register under WP-2.4 without a new governance review is a **scope violation**.  
- Optional observability labels for opaque `tenantId`/`workspaceId` were **shipped** in WP-2.4 (allow-list extension) and remain non-PII only.

---

*End of WP-2.4 Deferred Capability Register.*
