# Backend Architecture (Deep Dive Index)

Canonical decisions live in [ARCHITECTURE.md](./ARCHITECTURE.md) §4.  
Logical application/module/worker landscape: [APPLICATION_ARCHITECTURE.md](./APPLICATION_ARCHITECTURE.md) (ADR 0013).

## Layer checklist

| Layer | Contains | Must not contain |
|-------|----------|------------------|
| Domain | Entities, VOs, domain events, repo interfaces | Nest/Prisma/AI SDKs |
| Application | Use cases, ports, policies, DTO mapping | HTTP details, SQL |
| Infrastructure | Adapters for DB, queue, AI, storage, search | Business rules |
| API | Controllers, guards, transport validation | Domain invariants |

## Worker relationship

`apps/worker` executes application use cases asynchronously. It is not a second domain.

## Expansion point

Bounded contexts are added under Nest modules with the same layering. Extract to a separate deployable only with an ADR.
