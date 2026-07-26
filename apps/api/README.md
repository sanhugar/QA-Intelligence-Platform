# apps/api

NestJS HTTP API host for the ATI modular monolith.

**Status:** WP-1.1–WP-2.1 (**complete** — Independent Architecture Review approved; consumes Foundation `@ati/*` packages)

## Run

```bash
pnpm --filter @ati/api dev
```

Default port: `3000` (`ATI_API_PORT`).

On startup the host runs the mandatory Platform Spine boot sequence through Platform AI Runtime Host (`platform-noop` registration only; no boot-time invoke), then listens.

## Health

- Liveness: `GET /health/live`
- Readiness: `GET /health/ready` (OK only after Platform READY; boolean only)

## WP-1.4 references

| Document | Link |
|----------|------|
| Spine delivery note | [PLATFORM_SPINE_WP-1.4.md](../../docs/engineering/PLATFORM_SPINE_WP-1.4.md) |
| Implementation report | [WP-1.4_IMPLEMENTATION_REPORT.md](../../docs/implementation/WP-1.4_IMPLEMENTATION_REPORT.md) |
| Deferred capabilities | [WP-1.4_DEFERRED_CAPABILITY_REGISTER.md](../../docs/implementation/WP-1.4_DEFERRED_CAPABILITY_REGISTER.md) |
| Implementation workflow | [IMPLEMENTATION_WORKFLOW.md](../../docs/development/IMPLEMENTATION_WORKFLOW.md) |

## Out of scope (deferred)

Brain engines, AI providers, Orchestration, Auth, DB, Redis, shared packages — see Deferred Capability Register.
