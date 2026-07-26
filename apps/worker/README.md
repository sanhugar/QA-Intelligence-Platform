# apps/worker

NestJS Worker host for ATI background processing.

**Status:** WP-1.1 hosts + WP-1.2 Platform Registration + WP-1.3 Spine Shared Service Shell (**complete** — Independent Architecture Review approved; independent host-local copy — no shared package)

## Run

```bash
pnpm --filter @ati/worker dev
```

Default port: `3001` (`ATI_WORKER_PORT`).

On startup the host runs the same Platform Spine registration model as `api`, then `PlatformHostBootstrap` (mirrored shared service shells). No BullMQ/Redis/job processors.

## Health

- Liveness: `GET /health/live`
- Readiness: `GET /health/ready` (OK only after full bootstrap reached Platform READY; boolean readiness only)

## WP-1.2 references

| Document | Link |
|----------|------|
| Spine delivery note | [PLATFORM_SPINE_WP-1.2.md](../../docs/engineering/PLATFORM_SPINE_WP-1.2.md) |
| Registration matrix | [PLATFORM_REGISTRATION_DEPENDENCY_MATRIX.md](../../docs/engineering/PLATFORM_REGISTRATION_DEPENDENCY_MATRIX.md) |
| Implementation report | [WP-1.2_IMPLEMENTATION_REPORT.md](../../docs/implementation/WP-1.2_IMPLEMENTATION_REPORT.md) |
| Deferred capabilities | [WP-1.2_DEFERRED_CAPABILITY_REGISTER.md](../../docs/implementation/WP-1.2_DEFERRED_CAPABILITY_REGISTER.md) |
| Implementation workflow | [IMPLEMENTATION_WORKFLOW.md](../../docs/development/IMPLEMENTATION_WORKFLOW.md) |

## WP-1.3 references

| Document | Link |
|----------|------|
| Spine delivery note | [PLATFORM_SPINE_WP-1.3.md](../../docs/engineering/PLATFORM_SPINE_WP-1.3.md) |
| Implementation report | [WP-1.3_IMPLEMENTATION_REPORT.md](../../docs/implementation/WP-1.3_IMPLEMENTATION_REPORT.md) |
| Deferred capabilities | [WP-1.3_DEFERRED_CAPABILITY_REGISTER.md](../../docs/implementation/WP-1.3_DEFERRED_CAPABILITY_REGISTER.md) |

## Out of scope (deferred)

Job processors, AI runtime, shared packages, business behaviour — see Deferred Capability Register.
