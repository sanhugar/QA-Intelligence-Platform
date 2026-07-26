# Getting Started

## Prerequisites

- Node.js 22+
- pnpm 9+
- Git

Docker / Postgres / Redis are **not** required for WP-1.1–WP-1.3 host bootstraps.

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

**WP-1.1 + WP-1.2 + WP-1.3 complete** (Independent Architecture Review approved for WP-1.3). WP-1.4 is not started.

### What runs today

- On boot, `api` and `worker` run the mandatory Platform Spine sequence: Configuration → Logger → Module Registration → Shared Service Registry → Diagnostics → Feature Flags → Audit Support → Event Publisher → Scheduler → Platform READY.
- Readiness (`/health/ready`) is OK only after the full sequence (boolean only; no service/module details in health responses).

### Useful environment keys

| Key | Hosts | Notes |
|-----|-------|-------|
| `ATI_API_PORT` | api | Default `3000` |
| `ATI_WORKER_PORT` | worker | Default `3001` |
| `ATI_NODE_ENV` | both | Falls back to `NODE_ENV` |
| `ATI_LOG_LEVEL` | both | `debug` \| `info` \| `warn` \| `error` |
| `ATI_PLATFORM_VERSION` | both | Default `0.0.0` |
| `ATI_FEATURE_FLAGS` | both | `key=true,other=false` |

### WP-1.3 documentation

| Document | Link |
|----------|------|
| Implementation Workflow (SOP) | [IMPLEMENTATION_WORKFLOW.md](./IMPLEMENTATION_WORKFLOW.md) |
| Implementation report | [WP-1.3_IMPLEMENTATION_REPORT.md](../implementation/WP-1.3_IMPLEMENTATION_REPORT.md) |
| Deferred capabilities | [WP-1.3_DEFERRED_CAPABILITY_REGISTER.md](../implementation/WP-1.3_DEFERRED_CAPABILITY_REGISTER.md) |
| Closeout report | [WP-1.3_CLOSEOUT_REPORT.md](../implementation/WP-1.3_CLOSEOUT_REPORT.md) |
| Spine delivery note | [PLATFORM_SPINE_WP-1.3.md](../engineering/PLATFORM_SPINE_WP-1.3.md) |
| Implementation index | [../implementation/README.md](../implementation/README.md) |
