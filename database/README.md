# Database Module

Home for schema evolution and DBA-visible artifacts.

| Path | Purpose |
|------|---------|
| `schemas/` | Logical model notes + Prisma schema location |
| `migrations/` | Versioned migrations (none yet) |
| `seeds/` | Non-production seed scripts |
| `repositories/` | Persistence standards and review notes |

**No tables are defined in Phase 0.**

Repository *interfaces* belong in the domain layer; Prisma implementations belong in `apps/api` infrastructure.
