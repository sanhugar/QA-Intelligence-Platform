# ADR 0002: Technology Stack Foundation

- **Status:** Accepted
- **Date:** 2026-07-25
- **Decision makers:** Platform Architecture

## Context

We need a stack that supports Clean Architecture, DDD, AI-provider independence, cloud independence, strong TypeScript contracts across UI/API, and future Microsoft ecosystem integrations (e.g., SharePoint) without locking the core domain to a vendor.

## Decision

Adopt the foundation stack documented in `docs/architecture/ARCHITECTURE.md` §2:

- Frontend: React + TypeScript + Vite + TanStack Query/Router + Zustand
- Backend: NestJS + TypeScript modular monolith + separate worker
- Data: PostgreSQL + Prisma migrations + Redis + S3-compatible storage + OpenSearch (when search lands)
- Auth: OIDC (Microsoft Entra ID primary)
- AI: Provider ports/adapters (official SDKs behind gateway)
- Delivery: pnpm + Turborepo, Docker, Kubernetes-ready, GitHub Actions

## Alternatives Considered

1. **Next.js full-stack** — stronger SSR story; unnecessary complexity for auth-gated internal SPA.
2. **.NET 8 backend** — excellent Entra/SharePoint affinity; weaker shared-type monorepo with React; can host future adapters if needed.
3. **Python-first API** — strong ML ecosystem; poorer FE/BE contract sharing for platform spine.
4. **Polyglot microservices on day one** — premature distribution cost before ubiquitous language stabilizes.

## Consequences

### Positive

- One primary language for contracts and faster cross-stack changes.
- Clear path to cloud/AI provider substitution.
- Nest modules map to bounded contexts.

### Negative / Risks

- TypeScript AI ecosystem is strong but not identical to Python ML tooling.
- Modular monolith requires import/boundary discipline.

### Follow-ups

- ADR for tenancy model before first database migration.
- ADR for prompt asset versioning when AI generation begins.
