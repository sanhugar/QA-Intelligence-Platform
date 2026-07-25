# ADR 0010: Knowledge Intake Terminology Consistency

- **Status:** Accepted
- **Date:** 2026-07-25
- **Decision makers:** Enterprise / AI Platform Architecture (terminology refactor)

## Context

Approved architecture documents correctly established that, for requirement analysis, scenario generation, and test case generation, the approved requirements specification is authoritative and other knowledge only supports. Some wording, however, implied that the **platform always starts with an FDD**, which understates ATI as a multi-source Enterprise AI QA Knowledge Platform and conflicts with Knowledge Architecture’s multi-domain intake reality.

## Decision

Adopt terminology clarified in `docs/architecture/CANONICAL_TERMINOLOGY.md`:

1. **Knowledge Intake** is the canonical platform entry point.  
2. **Knowledge Input** is any governed source accepted at intake (FDD, PRD, SRS, transcripts, cloud refs, product docs, etc.).  
3. **FDD** is one supported Knowledge Input type — not the sole assumed entry.  
4. **Approved Requirements Source** (FDD, PRD, SRS, or equivalent) remains the **authoritative source of truth** for Requirements → Scenarios → Test Cases generation.  
5. Supporting Knowledge Inputs never override or invent requirements.  

**Non-goals of this ADR:** No redesign of engines, pipelines stages (beyond entry labeling), domain invariants, decision governance, or EIM object responsibilities. No implementation.

## Alternatives Considered

1. **Leave FDD-as-entry wording** — misrepresents product scope.  
2. **Remove FDD/spec primacy for generation** — rejected; would break charter and QA integrity.  
3. **Rename all architecture documents** — unnecessary; terminology alignment suffices.

## Consequences

### Positive

- Consistent multi-source platform story  
- Preserved generation authority rules  
- ADRs 0001–0009 remain valid with clarified reading  

### Negative / Risks

- Readers must apply “Approved Requirements Source” where older shorthand said only “FDD” in generation contexts  

### Follow-ups

- Gate 5.5 may extend Knowledge Intake detail; must not reverse these terms  
