# Requirement Validation Engine Specification

**Document ID:** ATI-ENG-AI-ENGINE-VALIDATION-001  
**Status:** Approved engineering specification (no implementation code)  
**Product:** AI QA Intelligence Platform (ATI v2)  
**Audience:** Principal AI Engineer, Principal QA Architect, Enterprise Requirements Engineer, Enterprise Software Architect, Implementation Engineer  
**Phase:** Engineering Specification — Brain Stage 2 Quality Gate  
**Last updated:** 2026-07-25

---

## 0. Purpose and Scope

This document is the **canonical engineering specification** for the **Requirement Validation Engine**.

This engine is the **Quality Gate** of the ATI reasoning pipeline. It validates the **Requirement Understanding Package** produced by the Requirement Understanding Engine and determines whether that understanding is complete enough, internally consistent, traceable, and suitable for downstream reasoning.

### This document is

- An engineering specification for a single AI engine  
- Consuming of approved architecture and prior engineering specifications  

### This document is not

- Architecture redesign or an ADR  
- Code, APIs, prompts, UI, or database schemas  
- Scenario, test case, automation, release plan, or documentation generation  

### Guiding principles (normative)

| Principle | Engineering meaning |
|-----------|---------------------|
| Validate without inventing | Gaps become findings — never invented product behaviour |
| Validate evidence, not assumptions | Assumptions are not treated as ARS-backed requirements |
| Preserve traceability | Findings and gates cite evidence or explicit absence of evidence |
| Never silently correct requirements | No rewrite/merge/fix of Understanding Package claims |
| Identify ambiguity without resolving it | Preserve and escalate; do not pick winners without human Clarification |
| Escalate when human clarification is required | HITL via Orchestration + Decision Framework |
| Deterministic where possible | Gate outcomes deterministic given package + policy + findings |
| Explainable | Every significant validation decision is explainable |
| Provider-independent | AI Port / Integration AI contracts only |

### Immutable-content rule (normative)

The engine **does not modify** the Requirement Understanding Package’s requirement claims, evidence map content, or invented “fixes.”

Architectural “Validated Requirement Object” means: the **same understanding content** is **dispositioned** for downstream use via the Validation Report (gate + findings + status binding). Lifecycle status may reflect `validated` / `blocked` as a **disposition**, not as rewritten requirements.

---

## 1. Engine Purpose

### 1.1 Responsibilities

- Receive a Requirement Understanding Package (draft) and related evidence context  
- Verify package integrity and readiness for validation  
- Validate completeness, consistency, correctness-to-evidence, traceability, relationships, workflows, rules, permissions, dependencies, constraints, and testability posture  
- Produce a **Requirement Validation Report** with gate `pass` / `pass_with_warnings` / `fail`  
- Emit Clarification Questions and HITL escalation signals when required  
- Assign validation confidence with drivers  

### 1.2 Scope

- Brain **Stage 2 — Requirement Validation** only  
- Quality gate **before** Requirement Knowledge Graph finalization for downstream use and **before** Scenario Reasoning  
- Understanding validation only — not scenario/case validation  

### 1.3 Non-responsibilities

This engine **must not**:

- Modify, rewrite, invent, or “complete” requirements in the Understanding Package  
- Designate ARS vs supporting (Intake/Orchestration)  
- Generate Scenarios, Test Cases, Automation, Release Plans, or Documentation  
- Build the Requirement Knowledge Graph  
- Approve Domain Approvals  
- Override the Approved Requirements Source  
- Skip validation or hide failed checks  

### 1.4 Position in the ATI reasoning pipeline

```
Requirement Understanding Engine
        ↓  Requirement Understanding Package (draft)
★ Requirement Validation Engine  ← this specification (Quality Gate)
        ↓  Validation Report + gate disposition
        ├── fail / blocked ambiguities → HITL / Clarification (Orchestration)
        └── pass / pass_with_warnings (policy) → RKG → Scenario → …
```

Architecture source: [AI Reasoning Architecture](../architecture/AI_REASONING_ARCHITECTURE.md) Stage 2 / §2.4; catalog entry in [AI Engine Specification Framework](./AI_ENGINE_SPECIFICATION_FRAMEWORK.md) §2.4; upstream package defined in [Requirement Understanding Engine Specification](./REQUIREMENT_UNDERSTANDING_ENGINE_SPECIFICATION.md).

Hard sequencing (inherited): Scenario Reasoning **requires** Validation gate ≠ `fail`.

---

## 2. Inputs

Conceptual inputs only — no formats.

| Input | Role |
|-------|------|
| **Requirement Understanding Package** | Primary subject of validation (immutable claims) |
| **Approved Requirements Source** (Document Bundles / identity) | Authority for evidence checks |
| **Evidence Map / Evidence Package** | Claim↔ARS (and Clarification) refs from Understanding |
| **Knowledge references** (optional) | Supporting method/pattern hints; never ARS replacement |
| **User clarifications** | Authoritative only when accepted Clarification/Approval exists |
| **Previous validation results** | Re-validation / delta runs; historical findings context |
| **Understanding self-review findings** | Optional handoff from Understanding Engine |
| **Execution context** | Tenant/workspace, `reasoningRunId`, policy thresholds, featureVersionId, ARS identity |

---

## 3. Validation Lifecycle

Conceptual stages only:

```
Receive Understanding Package
      ↓
Verify Package Integrity
      ↓
Validate Completeness
      ↓
Validate Consistency
      ↓
Validate Traceability
      ↓
Validate Business Rules
      ↓
Validate Relationships
      ↓
Validate Constraints
      ↓
Validate Dependencies
      ↓
Validate Permissions
      ↓
Validate Workflows
      ↓
Validate State Transitions
      ↓
Validate Testability / NFR measurability posture
      ↓
Identify Gaps
      ↓
Identify Conflicts
      ↓
Identify Ambiguities
      ↓
Assign Validation Confidence
      ↓
Determine Gate (pass / pass_with_warnings / fail)
      ↓
Produce Requirement Validation Report
```

Conforms to the standard AI engine lifecycle (AI Engine Specification Framework): receive → validate input → resolve context → gather evidence → reason (critique) → validate output → confidence → self review → HITL when required → publish/return report.

---

## 4. Validation Dimensions

Responsibilities only — no algorithms.

| Dimension | Responsibility |
|-----------|----------------|
| **Completeness** | Detect missing facets implied by stated behaviour (actors, workflows, permissions, validations, exception paths) — as gaps, not inventions |
| **Consistency** | Detect contradictions among package claims and vs ARS |
| **Correctness (to evidence)** | Explicit claims must be ARS-backed; inferences must remain labeled; assumptions must not be treated as requirements |
| **Traceability** | Evidence Map coverage for explicit claims; broken/missing refs are findings |
| **Requirement relationships** | Linked actor/workflow/rule refs coherent; orphans flagged |
| **Workflow integrity** | Stated workflows have coherent steps; missing alternate/exception when implied → gap |
| **Business rule integrity** | Rules have applies-to targets; conflicts flagged |
| **Validation rule integrity** | Stated validations coherent with fields/APIs/entities |
| **Actor consistency** | Actors referenced by workflows/permissions exist; unused critical actors noted if behaviour implies them |
| **Permission consistency** | Permissions evidenced; implied authz gaps recorded — **never invent grants** |
| **Integration consistency** | Stated integrations coherent; unknown integrations remain Ambiguities |
| **Dependency consistency** | Dependencies evidenced; circular/conflicting dependency statements flagged |
| **Constraint consistency** | Constraints do not silently contradict functional claims |
| **State transition consistency** | Stated transitions coherent; incomplete state models → gap |
| **Error handling expectations** | Missing error/exception expectations where flows imply them → gap |
| **Operational expectations** | Missing ops/admin expectations where ARS implies them → gap |
| **Testability posture** | Untestable / non-measurable NFRs flagged for Clarification |

---

## 5. Validation Report

Conceptual contents of the **Requirement Validation Report** (no schemas):

| Area | Responsibility |
|------|----------------|
| **Identity & provenance** | Report id; links to Understanding Package revision; ARS identity; `reasoningRunId`; engine/provider provenance |
| **Validation summary** | Overall outcome narrative for humans |
| **Gate decision** | `pass` / `pass_with_warnings` / `fail` |
| **Readiness recommendation** | Suitable / suitable-with-warnings / not suitable for RKG & Scenario Reasoning |
| **Passed checks** | Dimension/category checks that passed |
| **Failed checks** | Checks that failed with severity |
| **Warnings** | Non-blocking issues (policy-dependent) |
| **Blocking issues** | Issues that force `fail` or HITL |
| **Ambiguities** | Preserved/escalated ambiguities (not resolved) |
| **Missing information** | Gap register |
| **Conflicts** | Contradictions within package or vs ARS / multi-ARS |
| **Unsupported assumptions** | Assumptions incorrectly treated as requirements (if detected) |
| **Clarification requests** | Human questions |
| **Confidence** | Validation confidence band + drivers |
| **Explanation facets** | Why gate/findings (see §12) |
| **Disposition binding** | Declares Understanding Package revision as `validated` / `blocked` **without rewriting claims** |

---

## 6. Validation Categories

| Category | When it applies |
|----------|-----------------|
| **Structural validation** | Package integrity: required facets present, identity fields, schemaVersion mindset, provenance present |
| **Logical validation** | Internal contradictions, impossible combinations, broken relationship graphs |
| **Business validation** | Business rules/constraints/objectives coherent with stated functional behaviour (evidence-relative) |
| **Requirement validation** | Explicit vs inferred vs assumption discipline; no invention; ARS primacy |
| **Traceability validation** | Evidence Map completeness for explicit claims; ARS refs resolvable |
| **Relationship validation** | Actor↔workflow↔permission↔rule linkage integrity |
| **Completeness validation** | Implied-but-missing facets relative to stated workflows/behaviour |
| **Testability validation** | Whether claims are verifiable enough for later scenario/case reasoning |

Categories organize findings; they do not authorize content mutation.

---

## 7. Ambiguity Handling

| Rule | Expectation |
|------|-------------|
| **Preserve** | Ambiguities remain Ambiguities in the report |
| **Explain** | Each ambiguity states what is unclear and why it matters |
| **Never resolve unsupported ambiguity** | No silent default product behaviour |
| **Escalate to HITL** | Blocking ambiguity, multi-ARS conflict, critical contradiction, policy threshold breach → Orchestration pause |
| **Do not clear gaps by invention** | Missing permissions/workflows/rules stay as findings |

---

## 8. Evidence Validation

Consumes [AI Decision & Evidence Framework](../architecture/AI_DECISION_AND_EVIDENCE_FRAMEWORK.md).

| Source | Validation use |
|--------|----------------|
| **Approved Requirements Source** | Authority for product-behavior correctness-to-evidence |
| **Enterprise Knowledge** | May support method/completeness heuristics; **never replaces ARS** |
| **Historical knowledge** | Context only; not live authority |
| **User clarification** | Counts when accepted Clarification/Approval exists |
| **Human approval** | Governance disposition — does not invent ARS text |

Checks include: evidence present for explicit claims; evidence class appropriate; supporting knowledge conflict flags; absence-of-evidence correctly used for gap findings. LLM recollection is not evidence.

---

## 9. Confidence Behaviour

| Band (conceptual) | Typical meaning |
|-------------------|-----------------|
| **High / Very High** | Few/no open critical findings; strong evidence alignment |
| **Medium** | Material warnings; residual ambiguity within policy |
| **Low / Very Low** | Critical findings, major contradictions, or sparse evidence |
| **Validation blocked** | Integrity failure or gate `fail` / awaiting human |

Rules:

- Confidence derived from finding severity profile + residual ambiguity  
- Blocking contradiction collapses High/Very High  
- **Confidence must never replace Approval**  
- Confidence ≠ certainty  

---

## 10. Human Review

Situations that typically require human review / Clarification (HITL):

| Trigger | Why |
|---------|-----|
| Contradictory requirements (in package or multi-ARS) | Cannot honestly pick a winner |
| Missing workflows / exception paths where behaviour implies them | Downstream scenarios would invent journeys |
| Missing permissions where actors/actions exist | Must not invent grants |
| Missing business rules / validations where flows imply them | Untestable or invented completeness risk |
| Undefined behaviour for critical paths | Ambiguity blocking |
| Conflicting evidence | ARS set conflict or claim vs ARS mismatch |
| Low / blocked validation confidence | Unsafe for Scenario Reasoning |
| Insufficient requirements / unreadable ARS context | Cannot validate meaningfully |
| Untestable / non-measurable critical NFRs | Need Clarification or risk acceptance |
| Attempt to treat Assumptions as requirements | Governance defect |

Human dispositions become inputs to re-validation; AI does not silently Accept.

---

## 11. Failure Handling

| Failure | Conceptual handling |
|---------|---------------------|
| **Invalid Understanding Package** | Fail structural validation; gate `fail`; do not validate further claims |
| **Missing evidence** | Findings for unbacked explicit claims; may force `fail` |
| **Contradictory evidence** | Conflict findings; no silent merge; HITL as required |
| **Unsupported content** | Report inability to validate affected facets; escalate |
| **Incomplete requirements** | Completeness findings; gate per severity/policy |
| **Processing / provider failures** | Normalized failure; retry only transient transport; never invent a passing gate |
| **Gate `fail`** | Stop before RKG-for-downstream / Scenario Reasoning; return report to human/product loop |
| **Gate `pass_with_warnings`** | Proceed only if policy allows; warnings remain visible |

Graceful handling = honest report + correct gate — not fabricated green status.

---

## 12. Explainability

Every significant validation decision must explain:

| Facet | Content |
|-------|---------|
| **What was validated** | Check / dimension / claim set |
| **Why it passed or failed** | Rationale |
| **Supporting evidence** | ARS / Clarification refs or explicit absence |
| **Remaining uncertainty** | Ambiguities / gaps |
| **Confidence** | Band + drivers |
| **Required human action** | Clarification, Accept risk, fix ARS, re-run Understanding, etc. |

Opaque model judgments are non-conformant.

---

## 13. Downstream Contract

Outputs consumed by downstream engines/runtimes (responsibilities only):

| Consumer | Contract |
|----------|----------|
| **Workflow Orchestrator** | Gate + HITL pause/resume; re-validation after Clarification |
| **Requirement Knowledge Graph Engine** | May proceed only when gate ≠ `fail` (and warnings allowed by policy); consumes **unchanged** Understanding Package content + validation disposition |
| **Scenario Reasoning Engine** | Blocked on `fail`; may start on `pass` / allowed `pass_with_warnings` |
| **Knowledge Resolution Engine** | May use validation findings as retrieval context for supporting patterns (optional) |
| **QA Review / Coverage (later)** | May consume validation findings as historical critique signals |
| **HITL / AI Review workspaces** | Clarification Questions + blocking issues |

The Validation Report is the authoritative quality-gate artifact. Downstream engines must not ignore a `fail` gate.

---

## 14. Engineering Constraints

Developers **must never** allow this engine to:

1. Modify or rewrite requirements in the Understanding Package  
2. Invent missing information to pass checks  
3. Generate scenarios, test cases, automation, release plans, or documentation  
4. Override Approved Requirements Sources  
5. Skip validation steps required by policy  
6. Hide failed validation or coerce gate to `pass`  
7. Silently merge conflicting evidence  
8. Resolve unsupported ambiguity without human Clarification  
9. Treat Assumptions as ARS-backed requirements  
10. Bind engine core to a single AI provider SDK  
11. Bypass Orchestration HITL when triggers fire  
12. Allow Scenario Reasoning after gate `fail`  

---

## 15. Architecture Dependencies

| Dependency | Inherited responsibilities |
|------------|---------------------------|
| [AI Reasoning Architecture](../architecture/AI_REASONING_ARCHITECTURE.md) (ADR 0004) | Stage 2 purpose, gate semantics, invent ban, sequencing vs Scenario |
| [QA Intelligence Framework](../architecture/QA_INTELLIGENCE_FRAMEWORK.md) (ADR 0007) | Completeness/testability heuristics as critique questions — not invented fills |
| [AI Decision & Evidence Framework](../architecture/AI_DECISION_AND_EVIDENCE_FRAMEWORK.md) (ADR 0008) | Evidence precedence, explainability, HITL, confidence ≠ approval |
| [Knowledge Architecture](../architecture/KNOWLEDGE_ARCHITECTURE.md) (ADR 0005) | Supporting knowledge never overrides ARS |
| [Enterprise Data Architecture](../architecture/ENTERPRISE_DATA_ARCHITECTURE.md) (ADR 0009) | Identity/version disposition without silent mutation of sealed meaning |
| [Knowledge Intake & Workflow Orchestration](../architecture/KNOWLEDGE_INTAKE_AND_WORKFLOW_ORCHESTRATION_ARCHITECTURE.md) (ADR 0011) | HITL pause/resume; workflow gate enforcement |
| [AI Engine Specification Framework](./AI_ENGINE_SPECIFICATION_FRAMEWORK.md) | Lifecycle, contracts, catalog entry |
| [Platform Spine Engineering Specification](./PLATFORM_SPINE_ENGINEERING_SPECIFICATION.md) | AI runtime host, registration, observability |
| [Requirement Understanding Engine Specification](./REQUIREMENT_UNDERSTANDING_ENGINE_SPECIFICATION.md) | Understanding Package as validation subject; boundary of understanding-local vs formal gate |

This specification **does not redefine** any of the above.

---

## 16. Readiness Checklist

| # | Check | Status |
|---|-------|--------|
| 1 | Engine purpose / non-responsibilities / pipeline position defined (§1) | ☐ |
| 2 | Inputs defined (§2) | ☐ |
| 3 | Validation lifecycle defined (§3) | ☐ |
| 4 | Validation dimensions defined (§4) | ☐ |
| 5 | Validation Report defined (§5) | ☐ |
| 6 | Validation categories defined (§6) | ☐ |
| 7 | Ambiguity handling defined (§7) | ☐ |
| 8 | Evidence validation defined (§8) | ☐ |
| 9 | Confidence behaviour defined (§9) | ☐ |
| 10 | Human review triggers defined (§10) | ☐ |
| 11 | Failure handling defined (§11) | ☐ |
| 12 | Explainability defined (§12) | ☐ |
| 13 | Downstream contract defined (§13) | ☐ |
| 14 | Engineering constraints defined (§14) | ☐ |
| 15 | Immutable-content + gate disposition rule clear (§0) | ☐ |
| 16 | Confirmed: no scenario/case/automation generation | ☐ |

**Specification completeness:** Items 1–16 are defined by this document. Coding still requires Product/Architect authorization and Spine readiness.

---

## 17. Document Control

| Field | Value |
|-------|-------|
| **Version** | 1.0 |
| **Status** | Approved engineering specification (no code) |
| **Owner** | Principal AI Engineer / Principal QA Architect / Enterprise Requirements Engineer |
| **Dependencies** | ADRs 0004–0011, 0013–0015; AI Engine Spec; Platform Spine Spec; Requirement Understanding Engine Spec |
| **Related ADRs** | Consumes primarily 0004, 0007, 0008, 0011 — **creates no new ADR** |
| **Last updated** | 2026-07-25 |

### Change History

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-07-25 | Initial Requirement Validation Engine Specification |

---

*End of Requirement Validation Engine Specification.*
