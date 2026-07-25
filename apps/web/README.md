# apps/web

React + Vite presentation host for ATI.

**Work package:** WP-1.1 — Application Host Bootstraps  
**Status:** Empty-but-runnable shell

## Run

```bash
# from repository root
pnpm --filter @ati/web dev
```

Default port: `5173` (`ATI_WEB_PORT`).

## Notes

- Independently runnable; no runtime dependency on `api` or `worker` in WP-1.1.
- No business UI, auth, or API clients yet.
