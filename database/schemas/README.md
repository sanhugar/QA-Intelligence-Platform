# Schemas

Logical data architecture notes and the future Prisma schema root (`prisma/schema.prisma`).

Guiding invariants (when modeling begins):

- FDD identity + version is central
- Generated artifacts reference FDD lineage
- Outbox and idempotency support for reliable async work
- Tenancy decision must be ADRed before first migration
