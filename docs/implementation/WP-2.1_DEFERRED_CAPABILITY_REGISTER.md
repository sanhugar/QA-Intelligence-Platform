# WP-2.1 Deferred Capability Register

**Work Package:** WP-2.1 — Shared Packages Baseline  
**Last updated:** 2026-07-26

Capabilities intentionally excluded from WP-2.1:

| Capability | Deferred to |
|------------|-------------|
| Identity / OIDC AuthN/AuthZ packages or helpers | WP-2.2 |
| Observability stack (metrics/traces / OTel bindings) | WP-2.3 |
| Tenancy / workspace / user context packages | WP-2.4 |
| AI Contracts package | Later |
| Integration Contracts package | Later |
| Shared Domain Contracts (Domain meaning) | Later / Domain stewardship |
| Event Contracts beyond thin shared helpers | Later |
| Security utility packages | WP-2.2+ |
| `@ati/spine` / `@ati/runtime` / `@ati/bootstrap` | Never (explicitly forbidden) |
| Moving Spine orchestration into packages | Out of scope (D1) |
| `apps/web` package consumption migration | Later |
| Application-specific validation schemas | Later feature WPs |
| Behavioural / API changes | Forbidden in WP-2.1 |
| Redis / BullMQ / Database | Later |

WP-2.1 delivers only the seven Foundation packages (`@ati/shared-types`, `@ati/shared-constants`, `@ati/shared-utils`, `@ati/shared-validation`, `@ati/config`, `@ati/logger`, `@ati/errors`) and host refactoring of `apps/api` + `apps/worker` to consume pure helpers extracted from duplicated Spine utilities.

---

*End of WP-2.1 Deferred Capability Register.*
