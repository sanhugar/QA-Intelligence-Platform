# ADR 0012: Integration & External Systems Architecture

- **Status:** Accepted
- **Date:** 2026-07-25
- **Decision makers:** Principal Enterprise Integration Architect (design), Product governance via charter

## Context

ATI must integrate with AI providers, knowledge repositories, ALM, source control, automation platforms, identity, storage, export, and notifications — without making ATI Core depend on any vendor. Direct SDK usage in Domain/Application layers would destroy portability, block replacement, and risk corrupting business information on integration failure.

## Decision

Adopt `docs/architecture/INTEGRATION_AND_EXTERNAL_SYSTEMS_ARCHITECTURE.md` as the canonical integration architecture, defining:

1. Layered model: ATI Core → Integration Contracts → Adapter Layer → Connector Layer → External Systems  
2. Integration domains (AI, Knowledge, ALM, SCM, Automation, Identity, Storage, Export, Notifications, future)  
3. Connector lifecycle, registration, discovery, capabilities, health, configuration, versioning, retirement  
4. Logical Integration Contracts (IO, validation, errors, negotiation, compatibility) — not HTTP API designs  
5. AI provider selection/fallback/hybrid with provider-independent reasoning  
6. Knowledge source integration aligned to Intake + Approved Requirements Source authority  
7. Automation framework independence  
8. Identity/security integration principles  
9. Failure/resilience and non-corruption rules  
10. Observability and governance  
11. Open/Closed extensibility via new connectors  

**Hard bans:** no vendor logic in Core; no external system as Requirements master; integration failures must not corrupt sealed ATI business information; enterprise integrations remain optional.

## Alternatives Considered

1. **Direct vendor SDK in Core** — rejected (lock-in, untestable Domain).  
2. **Single “enterprise bus” product mandate** — rejected (cloud/vendor independence).  
3. **Per-feature ad hoc integrations** — rejected (no shared governance/health model).  
4. **Absorb integration into Reasoning Architecture only** — insufficient for ALM/SCM/automation/IdP/storage.

## Consequences

### Positive

- Replaceable providers with minimal Core impact  
- Clear stewardship and health model for connectors  
- Consistent with Knowledge Intake, Brain ports, and EIM identity rules  

### Negative / Risks

- Requires discipline to keep adapters thin and contracts stable  
- Dual-version connector support during migrations adds operational overhead  

### Follow-ups

- Implementation of ports/connectors only after coding authorization  
- Per-connector security reviews at enablement time  
- Dependency boundaries and matrix maintained in architecture doc §13 (v1.1)  
