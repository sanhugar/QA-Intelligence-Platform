# Getting Started

## Prerequisites

- Node.js 22+
- pnpm 9+
- Git

Docker / Postgres / Redis are **not** required for WP-1.1 host bootstraps.

## Install

```bash
pnpm install
```

## Run hosts (independently)

Each host starts without depending on the others.

```bash
# Terminal 1 — API (default port 3000)
pnpm dev:api

# Terminal 2 — Worker (default port 3001)
pnpm dev:worker

# Terminal 3 — Web (default port 5173)
pnpm dev:web
```

### Smoke checks

- API liveness: `http://localhost:3000/health/live`
- API readiness: `http://localhost:3000/health/ready`
- Worker liveness: `http://localhost:3001/health/live`
- Worker readiness: `http://localhost:3001/health/ready`
- Web: open `http://localhost:5173` — expect “Web host ready”

## Test / typecheck

```bash
pnpm test
pnpm typecheck
```

## Current phase

**WP-1.1 + WP-1.2 complete.** Next authorized Work Package is not started (WP-1.3 requires separate authorization).

### What runs today

- On boot, `api` and `worker` run Platform Spine module registration before listening.
- Readiness (`/health/ready`) is OK only after successful registration (boolean only; no module list in health responses).

### WP-1.2 documentation

| Document | Link |
|----------|------|
| Implementation Workflow (SOP) | [IMPLEMENTATION_WORKFLOW.md](./IMPLEMENTATION_WORKFLOW.md) |
| Registration dependency matrix | [PLATFORM_REGISTRATION_DEPENDENCY_MATRIX.md](../engineering/PLATFORM_REGISTRATION_DEPENDENCY_MATRIX.md) |
| Implementation report | [WP-1.2_IMPLEMENTATION_REPORT.md](../implementation/WP-1.2_IMPLEMENTATION_REPORT.md) |
| Deferred capabilities | [WP-1.2_DEFERRED_CAPABILITY_REGISTER.md](../implementation/WP-1.2_DEFERRED_CAPABILITY_REGISTER.md) |
| Closeout report | [WP-1.2_CLOSEOUT_REPORT.md](../implementation/WP-1.2_CLOSEOUT_REPORT.md) |
| Spine delivery note | [PLATFORM_SPINE_WP-1.2.md](../engineering/PLATFORM_SPINE_WP-1.2.md) |
| Implementation index | [../implementation/README.md](../implementation/README.md) |

