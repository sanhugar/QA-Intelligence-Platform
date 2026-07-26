# Apps

Deployable runtimes for the platform.

| App | Role | Status |
|-----|------|--------|
| `web` | React SPA — presentation only | WP-1.1 runnable shell |
| `api` | NestJS HTTP API — modular monolith host | WP-1.1–WP-1.4 complete |
| `worker` | Background host (AI Runtime execution-primary) | WP-1.1–WP-1.4 complete (no job processors) |

Hosts are independently runnable; no runtime coupling between apps in WP-1.1–WP-1.4. Shared Spine code remains host-local until WP-2.1.

See [Getting Started](../docs/development/GETTING_STARTED.md) and [WP-1.4 Closeout](../docs/implementation/WP-1.4_CLOSEOUT_REPORT.md).
