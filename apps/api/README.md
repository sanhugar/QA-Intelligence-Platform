# apps/api

NestJS HTTP API host for the ATI modular monolith.

**Work package:** WP-1.1 — Application Host Bootstraps  
**Status:** Empty-but-runnable host (liveness/readiness only)

## Run

```bash
# from repository root
pnpm --filter @ati/api dev
```

Default port: `3000` (`ATI_API_PORT`).

## Health (host-local NestJS routes)

- Liveness: `GET /health/live`
- Readiness: `GET /health/ready`

These paths are NestJS host conventions for this process — not a cross-platform architectural API contract.

## Out of scope (WP-1.1)

Business modules, domain, auth, database, Redis, AI engines, workflows, connectors.
