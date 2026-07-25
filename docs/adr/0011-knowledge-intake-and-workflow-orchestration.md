# ADR 0011: Knowledge Intake & Workflow Orchestration Architecture

- **Status:** Accepted
- **Date:** 2026-07-25
- **Decision makers:** Principal AI Platform Architect (design), Product governance via charter

## Context

ATI is an Enterprise AI QA Knowledge Platform. Entry must not be modeled as “FDD upload.” The platform needs a universal **Knowledge Intake**, classification, structured object creation, workflow catalog, orchestration patterns, execution modes, HITL pause/resume, failure/recovery, long-running checkpoints, and observability — while preserving Approved Requirements Source authority for Requirements → Scenarios → Test Cases (ADR 0010 terminology).

ADR **0010** already recorded Knowledge Intake terminology. This ADR adopts the **operational orchestration architecture**.

## Decision

Adopt `docs/architecture/KNOWLEDGE_INTAKE_AND_WORKFLOW_ORCHESTRATION_ARCHITECTURE.md` as the canonical orchestration architecture, defining:

1. Universal Knowledge Intake (multi-source; FDD is one input type)  
2. Classification before reasoning/routing  
3. Structured knowledge object creation (logical)  
4. Major business workflows with engines, HITL, completion criteria  
5. Orchestration patterns (sequential, parallel, branch, fan-out/in, nested, composition)  
6. Structured IO between workflows/engines (not raw prompts)  
7. Execution Modes as composed graphs  
8. HITL pause/resume  
9. Failure/recovery and long-running checkpointing  
10. Workflow observability and governance  
11. Extensibility via manifests  

**Note on numbering:** User-facing Gate 5.5 requested “ADR-0010” for this topic; repository already uses ADR 0010 for terminology. This orchestration decision is therefore **ADR 0011**, dependent on ADR 0010.

## Alternatives Considered

1. **FDD-upload primary pipeline** — rejected by ADR 0010 and product principle.  
2. **Prompt-chained “workflows”** — not enterprise-auditable; couples steps to vendors.  
3. **Embed orchestration only inside Reasoning Architecture** — insufficient for sync, release, reporting, long-running ops.  
4. **Reuse ADR 0010 number** — would collide; numbering kept linear.

## Consequences

### Positive

- Clear operational architecture for intake → route → run → pause → resume → complete  
- Consistent with Brain, Knowledge, Domain, Decision, and EIM  
- Extensible input types and workflows without redesign  

### Negative / Risks

- Orchestrator must stay thin (not absorb domain rules)  
- HITL and long-running ops require disciplined checkpoint design at implementation time  

### Follow-ups

- Gate implementations only after coding authorization  
- Future ADRs for connector-specific sync policies as needed  
