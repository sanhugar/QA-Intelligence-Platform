# Local Environment

## WP-1.1 host ports

| Host | Env var | Default |
|------|---------|---------|
| `apps/api` | `ATI_API_PORT` | `3000` |
| `apps/worker` | `ATI_WORKER_PORT` | `3001` |
| `apps/web` | `ATI_WEB_PORT` | `5173` |

Optional: copy [`config/.env.example`](../../config/.env.example) values into a local `.env` for the process you run (hosts also read process environment directly). Do not commit secrets.

## Independent hosts

- No runtime dependency between `web`, `api`, and `worker` in WP-1.1.
- Failure of one host must not block starting another.

## Planned later (not required for WP-1.1)

- PostgreSQL
- Redis
- MinIO (S3-compatible)
- OpenSearch
- OIDC test IdP
- Docker Compose under `infrastructure/docker/`
