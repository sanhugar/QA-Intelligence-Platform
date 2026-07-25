# ADR 0009: Enterprise Data Architecture (Information Model)

- **Status:** Accepted
- **Date:** 2026-07-25
- **Decision makers:** Enterprise Information Architect (design), Product governance via charter

## Context

ATI manages business masters (Features, Requirements, Scenarios, Cases), documents, knowledge, AI artifacts, decisions/evidence, releases, automation, executions, defects, and reports. Without a technology-independent Enterprise Information Model (EIM), future schemas and APIs will invent incompatible structures, break traceability, and conflate storage with meaning. AI artifacts and knowledge must be modeled as governed information that supports—never owns—Requirements.

## Decision

Adopt `docs/architecture/ENTERPRISE_DATA_ARCHITECTURE.md` as the canonical **Enterprise Information Model (EIM)** for ATI, defining:

1. Enterprise information domains and stewardship  
2. Major information objects (purpose, ownership, lifecycle, relationships, traceability expectations) without database fields  
3. Identity, logical keys, versioning, lineage, superseding, limited branching, historical preservation, archival  
4. Conceptual relationship model (business chain + lateral release/knowledge support)  
5. AI Artifact architecture (packages, reviews, assessments, recommendations)  
6. Document architecture across formats and SharePoint-as-source  
7. Traceability architecture (forward/backward, Trace Links, matrices, staleness)  
8. Information governance (ownership, approval, audit, retention, classification, quality, integrity)  
9. Conceptual search & discoverability  
10. Extensibility via Information Object / Domain manifests  

**Hard bans in this ADR:** no SQL/Prisma/schemas; no database product selection; Knowledge/AI artifacts do not own Requirements; published snapshots are immutable; Feature Version + Approved Requirements Source anchor behavioral information.

**Terminology note (ADR 0010):** Information entry is Knowledge Intake; Documents include Approved Requirements Sources and supporting Knowledge Inputs. Architectural intent unchanged.

## Alternatives Considered

1. **Schema-first / database-first modeling** — locks storage choices early; drifts from Domain language.  
2. **Reuse Domain Architecture alone** — Domain defines business meaning; EIM adds enterprise information, document/AI artifact, identity/version, and discoverability concerns.  
3. **Treat AI outputs as ephemeral logs** — fails audit, reproducibility, and Approval governance.  
4. **SharePoint as information master** — couples ATI semantics to external drafts/ACLs.

## Consequences

### Positive

- Clear contract for later persistence and API design  
- Unified versioning/lineage/trace rules across AI and business information  
- Governance-ready for enterprise compliance  

### Negative / Risks

- Mapping effort when implementation starts  
- Requires discipline to update EIM via ADR when information meaning changes  

### Follow-ups

- Persistence technology ADR only after implementation authorization  
- Physical schema must demonstrate EIM mapping and invariant preservation  
