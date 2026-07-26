# Apps

Deployable runtimes for the platform.

| App | Role | Status |
|-----|------|--------|
| `web` | React SPA — presentation only | WP-1.1 runnable shell |
| `api` | NestJS HTTP API — modular monolith host | WP-1.1 + WP-1.2 registration complete |
| `worker` | Background host (future jobs) | WP-1.1 + WP-1.2 registration complete (no processors) |

Hosts are independently runnable; no runtime coupling between apps in WP-1.1/WP-1.2.

See [Getting Started](../docs/development/GETTING_STARTED.md) and [WP-1.2 Closeout](../docs/implementation/WP-1.2_CLOSEOUT_REPORT.md).
