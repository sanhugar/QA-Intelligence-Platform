# apps/api

NestJS HTTP API host for the ATI modular monolith.

**Status:** WP-1.1 hosts + WP-1.2 Platform Registration + WP-1.3 Spine Shared Service Shell (**complete** — Independent Architecture Review approved)

## Run

```bash
pnpm --filter @ati/api dev
```

Default port: `3000` (`ATI_API_PORT`).

On startup the host runs Platform Spine registration (empty Application Module shells), then `PlatformHostBootstrap` (shared service shells) before listening.

## Health

- Liveness: `GET /health/live`
- Readiness: `GET /health/ready` (OK only after full bootstrap reached Platform READY; no registration details in response)

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

Business modules, AI/workflow runtimes, auth, DB, Redis, shared packages — see Deferred Capability Register.
