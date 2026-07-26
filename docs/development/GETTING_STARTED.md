# Getting Started

## Prerequisites

- Node.js 22+
- pnpm 9+
- Git

Docker / Postgres / Redis are **not** required for WP-1.1–WP-2.3 host bootstraps (auth may use mock/static JWKS in tests; OTLP collector optional).

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

**WP-1.1–WP-2.3 complete** (WP-2.3 Independent Architecture Review APPROVED WITH OBSERVATIONS; closed). WP-2.4 is not started.

### What runs today

- On boot, `api` and `worker` run the mandatory Platform Spine sequence: Configuration → Logger → Module Registration → Shared Service Registry → Diagnostics → Feature Flags → Audit Support → Event Publisher → Scheduler → Platform AI Runtime Host → Platform READY.
- AI Runtime registers `platform-noop` only (no boot-time invoke; no REST execute API).
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
| `ATI_AUTH_ENABLED` | both | `false` preserves local DX; `true` enforces AuthN (prod default enabled) |
| `ATI_AUTH_ISSUER` / `ATI_AUTH_AUDIENCE` / `ATI_AUTH_JWKS_URI` | both | Required when auth enabled |
| `ATI_OBS_ENABLED` | both | Observability toggle (default enabled) |
| `ATI_OTEL_ENABLED` | both | Soft OTel activation (default false; READY not blocked if exporter fails) |
| `ATI_OTEL_EXPORTER_OTLP_ENDPOINT` | both | Optional OTLP endpoint |
| `ATI_OTEL_SERVICE_NAME` | both | Optional service name override |

Correlation header: `x-correlation-id` (API accept/echo; worker HTTP mints).

### WP-2.4 — Context (tenant / workspace)

| Variable | Host | Notes |
|----------|------|-------|
| `ATI_CONTEXT_ENABLED` | both | Default true |
| `ATI_CONTEXT_ENFORCE_ON_PROTECTED` | both | Require tenant on protected paths when auth enabled |
| `ATI_CONTEXT_DEFAULT_TENANT_ID` | both | Auth-disabled scaffold only |
| `ATI_CONTEXT_DEFAULT_WORKSPACE_ID` | both | Optional scaffold workspace |
| `ATI_CONTEXT_SUBJECT_TENANT_MAP` | api | `sub=tenant,sub2=tenant:workspace` host-validated map |

Non-authoritative client headers (never used as authority): `x-ati-tenant-id`, `x-ati-workspace-id`.

### WP-2.5 — Requirement engine

| Variable | Host | Notes |
|----------|------|-------|
| `ATI_REQUIREMENT_ENGINE_ENABLED` | both | Default true |
| `ATI_REQUIREMENT_ENGINE_REGISTER_STUB` | both | Register test-only `stub` parser (default false) |

### WP-2.3 documentation

| Document | Link |
|----------|------|
| Implementation Workflow (SOP) | [IMPLEMENTATION_WORKFLOW.md](./IMPLEMENTATION_WORKFLOW.md) |
| Implementation report | [WP-2.3_IMPLEMENTATION_REPORT.md](../implementation/WP-2.3_IMPLEMENTATION_REPORT.md) |
| Deferred capabilities | [WP-2.3_DEFERRED_CAPABILITY_REGISTER.md](../implementation/WP-2.3_DEFERRED_CAPABILITY_REGISTER.md) |
| Independent architecture review | [WP-2.3_INDEPENDENT_ARCHITECTURE_REVIEW.md](../implementation/WP-2.3_INDEPENDENT_ARCHITECTURE_REVIEW.md) |
| Repository closeout | [WP-2.3_REPOSITORY_CLOSEOUT.md](../implementation/WP-2.3_REPOSITORY_CLOSEOUT.md) |
| `@ati/observability` | [../../packages/observability/README.md](../../packages/observability/README.md) |
| Implementation index | [../implementation/README.md](../implementation/README.md) |
