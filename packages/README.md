# Packages

Shared libraries consumed by apps. Keep packages small, pure where possible, and free of app framework lock-in unless the package is explicitly a framework adapter.

| Package | Purpose |
|---------|---------|
| `shared-types` | Cross-cutting TypeScript models/types |
| `shared-constants` | Shared constants and enumerations |
| `shared-utils` | Pure utility functions |
| `shared-validation` | Shared Zod/contract schemas |
| `config` | Configuration loading helpers |
| `logger` | Logging facade |
| `errors` | Error taxonomy and mapping helpers |
