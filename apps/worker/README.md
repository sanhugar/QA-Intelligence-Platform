# apps/worker

NestJS Worker host for ATI background processing (bootstrap only).

**Work package:** WP-1.1 — Application Host Bootstraps  
**Status:** Empty-but-runnable host (liveness/readiness only)

## Run

```bash
# from repository root
pnpm --filter @ati/worker dev
```

Default port: `3001` (`ATI_WORKER_PORT`).

The HTTP listener exists solely so this host can expose liveness/readiness independently. No BullMQ/Redis/job processors are registered in WP-1.1.

## Health (host-local NestJS routes)

- Liveness: `GET /health/live`
- Readiness: `GET /health/ready`

## Out of scope (WP-1.1)

Job processors, Redis, BullMQ, AI runtime, workflows, business modules.
