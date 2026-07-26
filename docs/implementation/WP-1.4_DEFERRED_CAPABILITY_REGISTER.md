# WP-1.4 Deferred Capability Register

**Work Package:** WP-1.4 — Platform AI Runtime Host Shell  
**Last updated:** 2026-07-26

Capabilities intentionally excluded from WP-1.4:

| Capability | Deferred to |
|------------|-------------|
| Shared packages (`packages/*`) | WP-2.1 |
| Identity / OIDC AuthN/AuthZ | WP-2.2 |
| Observability stack (metrics/traces) | WP-2.3 |
| Tenancy / workspace / user context | WP-2.4 |
| Brain AI engines (catalog Core) | Phase 5 |
| AI Port / provider adapters / LLM binding | Later / Integration |
| ReasoningOrchestrator / Brain sequencing | Later |
| Workflow Orchestration / HITL pause-resume | Later / Orchestration |
| Workflow runtime host | Later |
| Full Framework §3 lifecycle (evidence, confidence, HITL) | Real engines later |
| Decision Records / Explanation Packets / Evidence store | Later |
| REST / HTTP engine execution API | Later |
| Boot-time engine invocation | Out of scope (test harness only) |
| Redis / BullMQ / durable job queues | Later |
| Database / Prisma / persistence | Later |
| Storage / cache / notification delivery | Later |
| Admin UI for AI runtime | Later |
| Parallel engine merge / rewind | Orchestration later |

WP-1.4 delivers: Platform AI Runtime Host shell, manifest validation/registration, `platform-noop` stub (`platformStub: true`), in-process test-harness invocation with minimal lifecycle, and boot integration before Platform READY.

---

*End of WP-1.4 Deferred Capability Register.*
