# Packages

Shared libraries consumed by apps. Keep packages small, pure where possible, and free of app framework lock-in.

| Package | npm name | Purpose |
|---------|----------|---------|
| `shared-types` | `@ati/shared-types` | Cross-cutting TypeScript types |
| `shared-constants` | `@ati/shared-constants` | Shared constants and enumerations |
| `shared-utils` | `@ati/shared-utils` | Pure utility functions |
| `shared-validation` | `@ati/shared-validation` | Minimal Zod primitives / config schemas |
| `config` | `@ati/config` | Configuration loading helpers |
| `logger` | `@ati/logger` | Logging helpers (level, redact, structured/Pino binding) |
| `errors` | `@ati/errors` | `AppError`, codes, mapping helpers |
| `auth` | `@ati/auth` | AuthN/AuthZ foundation (JWT, claims, evaluator) |
| `observability` | `@ati/observability` | Correlation, metrics/trace ports (Nest-free) |
| `context` | `@ati/context` | Tenant/workspace execution context (Nest-free) |
| `requirement-engine` | `@ati/requirement-engine` | Requirement Intelligence Engine Foundation (Nest-free) |

**Rules:** no Nest/React/Express imports; no Domain invariants; Spine orchestration stays in `apps/*/src/spine`. Nest auth/observability/context/requirement-engine host wiring stay in `apps/*`.
