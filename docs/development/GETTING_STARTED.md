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

**WP-1.1** — Application Host Bootstraps. See [IMPLEMENTATION_ROADMAP_AND_WBS.md](../implementation/IMPLEMENTATION_ROADMAP_AND_WBS.md) and [WP-1.1_DEFERRED_CAPABILITY_REGISTER.md](../implementation/WP-1.1_DEFERRED_CAPABILITY_REGISTER.md).
