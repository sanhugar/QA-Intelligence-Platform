# WP-2.3 Deferred Capability Register

**Work Package:** WP-2.3 — Observability Baseline  
**Last updated:** 2026-07-26

Capabilities intentionally excluded from WP-2.3:

| Capability | Deferred to |
|------------|-------------|
| BullMQ/Redis job-bus correlation continuity | Job infrastructure / later WP |
| Full OTLP SDK registration & production exporter hardening | Ops / later observability hardening |
| Prod fail-closed telemetry (READY depends on collector) | Later (explicitly rejected for WP-2.3) |
| `/metrics` scrape endpoint or admin telemetry HTTP routes | Later + ADR if needed |
| AI engine / workflow / connector semantic spans | Later AI / Orchestration / Integration WPs |
| SIEM product integration / dashboards-as-product | Ops environment |
| `apps/web` OpenTelemetry / browser RUM | Later |
| Tenancy-dimensioned metrics/labels | WP-2.4+ |
| Domain product observability meaning | Domain WPs |
| Decision / Evidence / Security audit stores | Not observability (ADR 0014) |
| Dedicated observability ADR | Only if future baseline break |

WP-2.3 delivers `@ati/observability`, logger single-path/Pino binding, host correlation middleware, in-memory metrics/traces, coarse auth outcome metrics, and degrade-safe OTel API soft-integration only.

---

*End of WP-2.3 Deferred Capability Register.*
