# apps/api

NestJS HTTP API host for the ATI modular monolith.

**Status:** WP-1.1 hosts + WP-1.2 Platform Registration (**complete**)

## Run

```bash
pnpm --filter @ati/api dev
```

Default port: `3000` (`ATI_API_PORT`).

On startup the host runs Platform Spine registration (empty Application Module shells) before listening.

## Health

- Liveness: `GET /health/live`
- Readiness: `GET /health/ready` (OK only when registration reached READY; no registration details in response)

## WP-1.2 references

| Document | Link |
|----------|------|
| Spine delivery note | [PLATFORM_SPINE_WP-1.2.md](../../docs/engineering/PLATFORM_SPINE_WP-1.2.md) |
| Registration matrix | [PLATFORM_REGISTRATION_DEPENDENCY_MATRIX.md](../../docs/engineering/PLATFORM_REGISTRATION_DEPENDENCY_MATRIX.md) |
| Implementation report | [WP-1.2_IMPLEMENTATION_REPORT.md](../../docs/implementation/WP-1.2_IMPLEMENTATION_REPORT.md) |
| Deferred capabilities | [WP-1.2_DEFERRED_CAPABILITY_REGISTER.md](../../docs/implementation/WP-1.2_DEFERRED_CAPABILITY_REGISTER.md) |
| Implementation workflow | [IMPLEMENTATION_WORKFLOW.md](../../docs/development/IMPLEMENTATION_WORKFLOW.md) |

## Out of scope (deferred)

Business modules, AI/workflow runtimes, auth, DB, Redis, shared packages — see Deferred Capability Register.
