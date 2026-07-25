# ADR 0013: Enterprise Application Architecture

- **Status:** Accepted
- **Date:** 2026-07-25
- **Decision makers:** Chief Software Architect, Principal Enterprise Architect (design), Product governance via charter

## Context

ATI has approved Foundation, Domain, Brain, Knowledge, QA Intelligence, Decision & Evidence, EIM, Terminology, Intake/Orchestration, and Integration architectures. Implementation still needs a canonical map of how those concerns are packaged into logical applications, backend/frontend modules, workers, shared packages, communication patterns, and deployable units — without redefining business or cognitive meaning, and without inventing APIs, schemas, UI, or prompts.

## Decision

Adopt `docs/architecture/APPLICATION_ARCHITECTURE.md` as the canonical **Enterprise Application Architecture**, defining:

1. Application landscape (Web, Backend, Worker Host, logical AI Processing, Knowledge Sync, Reporting, future CLI/API consumers)  
2. Backend module architecture aligned to Domain bounded contexts plus Intake, Orchestration, and Integration Facade modules  
3. Frontend workspace architecture and presentation boundaries  
4. Shared package roles for cross-application contracts  
5. Worker vs interactive responsibility split  
6. Conceptual communication (direct, request/response, events, background, workflow coordination) — not APIs  
7. Layer packaging responsibilities  
8. Conceptual deployment units and extraction path  
9. Cross-cutting capability stewardship  
10. Extensibility and application governance  
11. Architectural Dependencies & Boundaries (consume/not redefine prior architectures)  

**Hard bans:** no redefinition of Domain/Brain/Knowledge/QA/Decision/EIM/Orchestration/Integration meaning; no code/APIs/schemas/prompts in this gate; external systems only via Integration Architecture; workers must not fork Domain rules.

## Alternatives Considered

1. **Treat Foundation monorepo layout as sufficient** — rejected (does not map product modules/workspaces/workers to approved architectures).  
2. **Microservice-per-bounded-context first** — rejected (conflicts with ADR 0003 modular monolith; premature extraction).  
3. **UI-driven module design** — rejected (violates Clean Architecture and Domain independence).  
4. **Absorb application packaging into Integration or Orchestration docs** — rejected (different concern: software organization vs externals vs workflow meaning).

## Consequences

### Positive

- Clear home for apps/modules/workers without changing approved Core meaning  
- Aligns Domain contexts to backend modules and frontend workspaces  
- Preserves extraction path for future decomposition  
- Gives Platform Spine and later gates a stable packaging target  

### Negative / Risks

- Risk of modules drifting into redefine Domain if ownership discipline weakens  
- Logical applications may be confused with mandatory separate processes — mitigated by explicit “initially hosted in api/worker” guidance  

### Follow-ups

- Platform Spine implementation must map bootstraps to this landscape  
- Update BACKEND.md / FRONTEND.md deep-dives to point here for landscape ownership  
- Module extraction only via future ADR when metrics/ownership demand it  
