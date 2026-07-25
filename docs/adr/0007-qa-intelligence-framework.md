# ADR 0007: QA Intelligence Framework

- **Status:** Accepted
- **Date:** 2026-07-25
- **Decision makers:** Principal AI & QA Architect (design), Product governance via charter

## Context

ATI engines must reason like a Senior QA Engineer—not leap from a raw Knowledge Input to generated test cases via unstructured model calls. Without a shared QA Intelligence Framework, heuristic quality, coverage expectations, scenario classification, and self-review standards would diverge across engines and product types, and inventing functionality would become likely.

## Decision

Adopt `docs/architecture/QA_INTELLIGENCE_FRAMEWORK.md` as the permanent QA reasoning standard for ATI, defining:

1. **QA Thinking Model** — Understand → Analyze → Question → Validate → Expand → Review → Measure Coverage → Generate → Self Review → Finalize  
2. **Reasoning heuristic packs** — understanding, functional, boundary, negative, permission, workflow, integration, data, state, security, performance, accessibility, automation, regression, conditional cloud  
3. **QA Question Library** — conceptual questions (not prompts) that drive Ambiguity detection  
4. **Coverage dimensions** — functional through reliability/compliance  
5. **Test design strategy** — principles for Scenario/Case cardinality, non-generation, and merge  
6. **Scenario classification model**  
7. **Test Case quality framework**  
8. **AI self-evaluation checklist**  
9. **QA Intelligence maturity levels L1–L7**  
10. **Extensibility** via versioned heuristic packs and product-type profiles  

**Hard bans:** no raw Knowledge Input→tests shortcut; heuristics cannot invent requirements; unknowns remain unknown; Self Review cannot replace human Approval.

**Terminology note (ADR 0010):** Analysis targets the Approved Requirements Source after Knowledge Intake; supporting inputs never override. Architectural intent unchanged.

## Alternatives Considered

1. **Prompt-only QA behavior** — non-reusable, provider-locked, hard to audit.  
2. **Static generic test checklists only** — weak feature-specific reasoning and traceability.  
3. **Per-product ad hoc QA styles** — not enterprise scalable.  
4. **Collapse into Brain pipeline doc only** — pipeline defines orchestration; this framework defines Senior QA cognition and design policy.

## Consequences

### Positive

- Shared explainable standard for all engines  
- Domain/product extensibility without core redesign  
- Clear alignment to Domain + Reasoning + Knowledge architectures  

### Negative / Risks

- Requires pack stewardship to avoid heuristic sprawl  
- Must enforce applicability rules to prevent noise  

### Follow-ups

- Pack manifests implemented only after coding authorization  
- Future ADRs for regulated-industry compliance packs when needed  
