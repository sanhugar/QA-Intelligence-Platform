# Apps

Deployable runtimes for the platform.

| App | Role | WP-1.1 status |
|-----|------|----------------|
| `web` | React SPA — presentation only | Runnable shell |
| `api` | NestJS HTTP API — modular monolith host | Runnable + liveness/readiness |
| `worker` | Background host (future jobs) | Runnable + liveness/readiness (no processors) |

Apps must not import each other’s internal source trees.  
Hosts are independently runnable; no runtime coupling in WP-1.1.
