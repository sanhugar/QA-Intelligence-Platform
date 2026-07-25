# ADR 0003: Monorepo + Modular Monolith

- **Status:** Accepted
- **Date:** 2026-07-25
- **Decision makers:** Platform Architecture

## Context

The platform will grow many capabilities (analysis, generation, knowledge, review, integrations). Premature microservice extraction creates operational burden before domain boundaries are proven. A scattered multi-repo layout slows shared contract evolution.

## Decision

Use a **pnpm + Turborepo monorepo** with:

- Deployable apps: `web`, `api`, `worker`
- Shared packages for types, validation, config, logger, errors
- **Modular monolith** backend initially; extract services only when a module’s scale, isolation, or ownership demands it

## Alternatives Considered

1. **Multi-repo** — clear ownership; painful cross-cutting contract changes.
2. **Microservices first** — independent deploy; high complexity for early traceability transactions.
3. **Single app folder without packages** — simple start; fails as shared contracts and apps multiply.

## Consequences

### Positive

- Atomic PRs across API/UI contracts.
- Consistent tooling and CI.
- Extraction path preserved via module ports/events.

### Negative / Risks

- Requires CI discipline and package graph hygiene.
- Risk of accidental tight coupling without lint boundaries.

### Follow-ups

- Add dependency-cruiser/eslint boundaries when apps are initialized.
- Define module ownership matrix in docs when first product modules land.
