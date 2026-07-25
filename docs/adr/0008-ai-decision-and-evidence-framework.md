# ADR 0008: AI Decision and Evidence Framework

- **Status:** Accepted
- **Date:** 2026-07-25
- **Decision makers:** Principal AI Platform Architect (design), Product governance via charter

## Context

ATI must not operate as a black-box LLM application. Scenarios, test cases, clarifications, coverage judgments, knowledge usage, automation suggestions, and review findings all constitute **decisions** that require evidence, explainability, human override, auditability, and reproducibility. Without a Decision & Evidence Framework, confidence scores become theater, knowledge can launder invented facts, and Approved artifacts can be silently altered.

## Decision

Adopt `docs/architecture/AI_DECISION_AND_EVIDENCE_FRAMEWORK.md` as the permanent governance architecture for every AI decision in ATI, defining:

1. Decision lifecycle: Evidence Collection → Validation → Reasoning → Decision → Confidence → Human Review (when required) → Approval → Execution → Learning  
2. Decision categories (interpretation through risk assessment) with purpose, I/O, triggers, success, failure handling  
3. Evidence model with eligibility rules and priority (Approved Requirements Source and human governance above supporting knowledge; LLM memory is not evidence)  
4. Conceptual confidence framework independent of evidence  
5. Explainability model (mandatory questions / Explanation Packets)  
6. Decision self-review and escalation rules  
7. Human-in-the-loop triggers and checkpoints  
8. Decision audit (history, evidence trace, lineage, version awareness)  
9. Governed learning from decision outcomes without silent published-knowledge mutation  
10. Extensibility via Decision Type Manifests / packs  

**Hard bans:** no decision without evidence or explicit insufficient-evidence/blocked outcome; human review overrides AI; no silent changes to Approved artifacts; confidence ≠ certainty; Approved Requirements Source ≫ supporting Knowledge Inputs ≫ general AI knowledge.

**Terminology note (ADR 0010):** Evidence collection begins from Knowledge Intake; generation authority evidence is the Approved Requirements Source. Architectural intent unchanged.

## Alternatives Considered

1. **Opaque model generations with post-hoc rationale** — not auditable or reproducible.  
2. **Confidence-only scoring without evidence objects** — confidence theater.  
3. **Prompt instructions alone** — not enterprise-governable across engines.  
4. **Rely only on Reasoning/QA Framework docs** — they define cognition/pipeline; this ADR adds decision governance as a first-class concern.

## Consequences

### Positive

- Explainable, reviewable AI across all engines  
- Clear HITL and audit contracts for compliance  
- Alignment with Domain Approval and Knowledge authority hierarchy  

### Negative / Risks

- Decision recording overhead must be managed with explanation grades  
- Requires discipline so every significant engine judgment emits a Decision Record  

### Follow-ups

- Implementation of Decision Records only after coding authorization  
- Future ADRs for security/privacy/compliance decision packs when introduced  
