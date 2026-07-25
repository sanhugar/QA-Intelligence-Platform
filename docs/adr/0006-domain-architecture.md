# ADR 0006: Domain Architecture (Canonical Business Model)

- **Status:** Accepted
- **Date:** 2026-07-25
- **Decision makers:** Chief Architect (design), Product governance via charter

## Context

ATI requires a single ubiquitous language and Domain-Driven business model so database, API, UI, AI, reporting, and automation layers do not invent conflicting concepts. Without a canonical domain model, traceability (Requirement → Scenario → Test Case → Automation → Execution → Defect) erodes and Knowledge can be mistaken for Requirements.

## Decision

Adopt `docs/architecture/DOMAIN_ARCHITECTURE.md` as the **canonical business model** of ATI, defining:

1. Ubiquitous language (Organization through AI Review, Reasoning Package, etc.)
2. Bounded contexts (Administration, Requirement Management, Test Design, Knowledge Management, Release, Automation, Execution, Reporting, AI Assurance)
3. Major domain objects with purpose, lifecycle, ownership, relationships, and rules (no physical fields)
4. Relationship/ownership model with FDD-anchored Feature Versions
5. Lifecycle transition rules for core artifacts
6. Cross-domain invariants (traceability, authority, approval, tenancy, knowledge)
7. Domain events for integration without tight coupling
8. Extensibility and governance expectations

**Hard bans retained:** Knowledge never owns Requirements; AI Review cannot auto-overwrite Approved artifacts; Scenario requires Requirements; Test Case requires Scenario; Approved Requirements Source remains primary authority for Requirements/Scenarios/Test Cases.

**Terminology note (ADR 0010):** Ubiquitous language includes Knowledge Intake, Knowledge Input, and Approved Requirements Source; FDD is a common Approved Requirements Source type, not the sole platform entry. Architectural intent unchanged.

## Alternatives Considered

1. **ALM-ticket-centric model** — collapses Requirements into external tickets; weak Approved Requirements Source primacy.
2. **Document-only model** — insufficient for traceable QA artifacts and releases.
3. **AI-artifact-only model** — skips durable business ownership and human Approval semantics.
4. **Let each technical layer define its own terms** — guarantees semantic drift.

## Consequences

### Positive

- Shared language for all future implementations
- Clear context ownership and anti-corruption boundaries
- Explicit invariants for architecture validation of code later

### Negative / Risks

- Requires discipline to update this document (via ADR) when business meaning changes
- Mapping external tools needs anti-corruption layers

### Follow-ups

- Implementation mapping of contexts to modules only after explicit approval
- Future ADRs for tenancy depth and defect-system integration mapping
