# WP-2.2 Deferred Capability Register

**Work Package:** WP-2.2 — Authentication & Authorization Foundation  
**Last updated:** 2026-07-26

Capabilities intentionally excluded from WP-2.2:

| Capability | Deferred to |
|------------|-------------|
| Cookie sessions / BFF / refresh-token services | Later (web auth) |
| Propagated user identity on worker jobs | Later / WP-2.4-aligned |
| Business / Domain / feature authorization | Later Application/Domain WPs |
| Domain role catalog (PO, QA Lead, …) | Domain + User & Access later |
| Tenant / workspace membership AuthZ | WP-2.4+ |
| User management UI / admin consoles | Later |
| SCIM provisioning | Later |
| ABAC engine | Later (ADR when needed) |
| Policy engine / OPA / external PDP | Later (forbidden in WP-2.2) |
| `apps/web` OIDC UX | Later |
| Observability / OTel auth metrics | WP-2.3 |
| Audit logging product enhancements | Later |
| AI providers / Approval workflows | Later |
| Formal threat-model gate completion | Follow-up per SECURITY.md |
| Enterprise SSO hardening pack | WP-8.1 |
| Database user/role schema | Later |

WP-2.2 delivers only `@ati/auth` plus Application-boundary Nest wiring on `apps/api` and service-principal auth on `apps/worker`, per approved decisions D1–D13.

---

*End of WP-2.2 Deferred Capability Register.*
