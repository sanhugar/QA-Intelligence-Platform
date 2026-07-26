# WP-1.3 Deferred Capability Register

**Work Package:** WP-1.3 — Spine Shared Service Shell  
**Last updated:** 2026-07-26

Capabilities intentionally excluded from WP-1.3:

| Capability | Deferred to |
|------------|-------------|
| AI runtime host / engine execution | WP-1.4 |
| Shared packages (`packages/*`) | WP-2.1 |
| Identity / OIDC AuthN/AuthZ | WP-2.2 |
| Observability stack (metrics/traces) | WP-2.3 |
| Tenancy / workspace / user context | WP-2.4 |
| Redis / BullMQ / durable queues / job processors | Later |
| Durable event bus / outbox / cross-process messaging | Later |
| Database / Prisma / persistence of audit or events | Later |
| Storage / object store | Later |
| Cache | Later |
| Notification delivery | Later |
| Workflow runtime execution | Later / Orchestration |
| AI Brain engines | Phase 5 |
| Domain services / business logic | Later WPs |
| Domain Approvals (Decision Framework) | Architecture — not Audit Support |
| Config/logger as shared libraries | WP-2.1 |
| Admin HTTP exposure of diagnostics / flags / audit | Future administration WP |
| Secret management / vault integration | Later |
| Dynamic remote feature-flag providers | Later |

WP-1.3 delivers **shells** only: in-process configuration, logging, diagnostics snapshot, flag reads, audit intents, event intents, schedule intents, and a sealed registry.

---

*End of WP-1.3 Deferred Capability Register.*
