# Apps

Deployable runtimes for the platform.

| App | Role | Status |
|-----|------|--------|
| `web` | React SPA — presentation only | WP-1.1 runnable shell |
| `api` | NestJS HTTP API — modular monolith host | WP-1.1–WP-2.1 complete |
| `worker` | Background host (AI Runtime execution-primary) | WP-1.1–WP-2.1 complete (no job processors) |

Hosts are independently runnable. Spine orchestration remains host-local; pure helpers are consumed from Foundation `packages/*` (WP-2.1).

See [Getting Started](../docs/development/GETTING_STARTED.md) and [WP-2.1 Closeout](../docs/implementation/WP-2.1_CLOSEOUT_REPORT.md).
