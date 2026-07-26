# Packages

Shared libraries consumed by apps. Keep packages small, pure where possible, and free of app framework lock-in.

| Package | npm name | Purpose |
|---------|----------|---------|
| `shared-types` | `@ati/shared-types` | Cross-cutting TypeScript types |
| `shared-constants` | `@ati/shared-constants` | Shared constants and enumerations |
| `shared-utils` | `@ati/shared-utils` | Pure utility functions |
| `shared-validation` | `@ati/shared-validation` | Minimal Zod primitives / config schemas |
| `config` | `@ati/config` | Configuration loading helpers |
| `logger` | `@ati/logger` | Logging helpers (level, redact) |
| `errors` | `@ati/errors` | `AppError`, codes, mapping helpers |

**Rules:** no Nest/React/Express imports; no Domain invariants; Spine orchestration stays in `apps/*/src/spine`.
