# WP-1.1 Deferred Capability Register

**Work Package:** WP-1.1 — Application Host Bootstraps  
**Status:** Complete for deferred inventory  
**Last updated:** 2026-07-25

Capabilities intentionally **excluded** from WP-1.1 (not missing by accident). Target ownership follows the Implementation Roadmap & WBS.

| Capability | Deferred to | Notes |
|------------|-------------|-------|
| Platform registration & module shell | WP-1.2 | Module/workflow/engine/connector registration |
| Spine shared service shell | WP-1.3 | Config facade, diagnostics, events, scheduling, feature flags, audit support |
| AI runtime host shell | WP-1.4 | Engine manifest discovery/execution host |
| Shared packages baseline (`packages/*`) | WP-2.1 | shared-types, config, logger, errors, validation |
| Identity & Access (OIDC) baseline | WP-2.2 | AuthN/AuthZ |
| Observability baseline (metrics/traces stack) | WP-2.3 | Beyond host process logs |
| Tenancy / workspace context baseline | WP-2.4 | Context propagation |
| Knowledge Intake | Phase 3 | Entry, classification, ARS designation |
| AI Reasoning Port / provider adapters | Phase 4 | Provider-agnostic AI runtime |
| AI Brain engines | Phase 5 | Understanding → QA Readiness |
| Knowledge Repository / EKB | Phase 6 | Augmenting knowledge at scale |
| Business / Domain modules | Later WPs | Bounded contexts |
| Bounded Context packaging | Later WPs | Application Architecture modules |
| Workflow runtime meaning | Orchestration / later Spine WPs | Pause/resume/HITL |
| External connectors | Phase 8 | SharePoint, ALM, etc. |
| Authentication / Authorization | WP-2.2+ | Not in host bootstrap |
| Database / Prisma | Later (not WP-1.1) | No persistence required to boot |
| Redis | Later | Not required for empty worker boot |
| BullMQ / job processors | Later | Worker has no consumers in WP-1.1 |
| Event bus | WP-1.3+ | Platform events |
| Shared platform services | WP-1.3 | As listed in Spine eng spec |
| Docker Compose local stack | Later Phase 1/2 ops | Optional for WP-1.1 host smoke |
| Lint ESLint pipelines | Later engineering hygiene | Placeholder lint scripts only |
| Golden dataset / AI benchmarks | AI engine WPs | N/A for empty hosts |

---

*End of WP-1.1 Deferred Capability Register.*
