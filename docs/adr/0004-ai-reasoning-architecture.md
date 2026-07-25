# ADR 0004: AI Reasoning Architecture (ATI Brain)

- **Status:** Accepted
- **Date:** 2026-07-25
- **Decision makers:** Chief Architect (design), Product governance via charter

## Context

ATI must behave like a QA architect: reason through understanding, validation, scenarios, and test thinking before producing outputs. Generating test cases directly from a raw Knowledge Input (including FDD/PRD/SRS) would destroy trust, invent functionality, and break enterprise traceability.

## Decision

Adopt `docs/architecture/AI_REASONING_ARCHITECTURE.md` as the permanent blueprint for the ATI Brain, including:

- Mandatory multi-stage reasoning pipeline (Understanding → Validation → Knowledge Graph → Scenario Reasoning → Test Case Reasoning → QA Review → Coverage → Final Output)
- Nine engines with explicit contracts (Document, Understanding, Validation, Knowledge, Scenario, Test Case, QA Review, Coverage, Learning)
- Canonical Requirement Object as post-analysis logical source of truth (FDD remains primary evidence source)
- End-to-end traceability through Automation/Release/Execution/Defect
- Conceptual confidence model and self-review strategy
- Provider-independent engine ports and extensible engine manifests

**Hard bans retained:** no raw-input→test-case shortcut; supporting knowledge never overrides Approved Requirements Source; unknowns remain unknown.

**Terminology note (ADR 0010):** Platform entry is **Knowledge Intake**. Pipeline stage-0 labeling is Knowledge Intake → Knowledge Inputs; generation authority remains the Approved Requirements Source (FDD/PRD/SRS/equivalent). Architectural intent unchanged.

## Alternatives Considered

1. **Single-shot generation from FDD** — fast; unacceptable invention and traceability risk.
2. **Prompt-centric “brain”** — brittle; couples product truth to vendor prompt style.
3. **Knowledge-first requirements** — conflicts with Approved Requirements Source primacy for generation.

## Consequences

### Positive

- Clear implementation boundary for future coding phases
- Interchangeable LLM providers
- Audit-ready lineage and review gates

### Negative / Risks

- Longer path to first generated artifacts
- Requires discipline not to skip gates under delivery pressure

### Follow-ups

- Implementation only after explicit Product Owner / Architect approval beyond this ADR
- Future ADRs for coverage policy defaults and tenancy before persistence
