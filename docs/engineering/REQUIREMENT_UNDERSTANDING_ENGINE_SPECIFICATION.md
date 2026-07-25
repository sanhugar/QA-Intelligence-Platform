# Requirement Understanding Engine Specification

**Document ID:** ATI-ENG-AI-ENGINE-UNDERSTANDING-001  
**Status:** Approved engineering specification (no implementation code)  
**Product:** AI QA Intelligence Platform (ATI v2)  
**Audience:** Principal AI Engineer, Principal QA Architect, Enterprise Requirements Engineer, Senior Software Architect, Implementation Engineer  
**Phase:** Engineering Specification — first business AI engine (Brain Stage 1)  
**Last updated:** 2026-07-25

---

## 0. Purpose and Scope

This document is the **canonical engineering specification** for the **Requirement Understanding Engine**.

It defines how ATI transforms one or more **Approved Requirements Sources (ARS)** — designated by Knowledge Intake — into a structured, evidence-based, explainable **Requirement Understanding Package** that is the foundation for all downstream reasoning.

### This document is

- An engineering specification for a single AI engine  
- Consuming of approved architecture and prior engineering specifications  

### This document is not

- Architecture redesign or an ADR  
- Code, APIs, prompts, UI, or database schemas  
- Scenario, test case, automation, test plan, or release plan generation  

### Guiding principles (normative)

| Principle | Engineering meaning |
|-----------|---------------------|
| Understand before reasoning downstream | No Scenario/Test Case engines until understanding (and Validation gate) allow |
| Never invent requirements | Unsupported assumptions must not become requirements |
| Preserve uncertainty | Unknown remains unknown |
| Separate facts from assumptions | Explicit vs inferred vs assumption vs ambiguity |
| Preserve traceability | Every claim maps to evidence or to an explicit gap |
| Evidence-driven | LLM parametric recall is not evidence |
| Provider-independent | AI Port / Integration AI contracts only |
| Deterministic structure where possible | Stable logical facets; non-deterministic model text confined behind contracts |
| Escalate ambiguity when required | Clarification / HITL rather than silent fill |
| Remain explainable | Why / evidence / uncertainty / confidence for significant understanding decisions |

---

## 1. Engine Purpose

### 1.1 Responsibilities

- Consume Document Bundles for **Intake-designated** Approved Requirements Source(s) and optional supporting inputs  
- Extract and structure product understanding into a **Requirement Understanding Package**  
- Map claims to evidence on the ARS (and label non-ARS support distinctly)  
- Capture Ambiguities, Assumptions, Risks, and Open Questions honestly  
- Emit confidence and Explanation facets for significant understanding decisions  
- Support delta understanding against a prior Requirement Object when provided  

### 1.2 Scope

- Brain **Stage 1 — Requirement Understanding** only  
- Draft structured understanding subordinate to the versioned ARS  
- Understanding-time consistency checks that feed Validation (not a substitute for the Requirement Validation Engine)  

### 1.3 Non-responsibilities

This engine **must not**:

- Designate ARS vs supporting (Orchestration / Intake owns designation)  
- Own Knowledge Intake entry  
- Generate Scenarios, Test Cases, Automation, Test Plans, or Release Plans  
- Build the Requirement Knowledge Graph (downstream engine)  
- Perform Validation gate `pass` / `fail` (Requirement Validation Engine)  
- Publish/seal Domain Approvals  
- Override ARS with supporting knowledge  

### 1.4 Position in the ATI reasoning pipeline

```
Knowledge Intake + ARS designation (Orchestration — ADR 0011)
        ↓
Document Engine (prepare bundles)
        ↓
★ Requirement Understanding Engine  ← this specification
        ↓
Requirement Validation Engine
        ↓
Requirement Knowledge Graph Engine
        ↓
Scenario → Test Case → QA Review → Coverage → Final Package
```

Architecture source: [AI Reasoning Architecture](../architecture/AI_REASONING_ARCHITECTURE.md) Stage 1 / §2.3; catalog entry in [AI Engine Specification Framework](./AI_ENGINE_SPECIFICATION_FRAMEWORK.md) §2.3.

**Logical output mapping:** The **Requirement Understanding Package** is the engineering name for Stage 1 outputs. Its core structured body is the architectural **draft Requirement Object**, plus Evidence Map, Understanding Notes, Ambiguity/Assumption registers, confidence, and provenance.

---

## 2. Supported Inputs

### 2.1 Approved Requirements Source types (when designated)

The engine supports ARS content types including, but not limited to:

| Input type | Notes |
|------------|--------|
| Feature Design Documents (FDD) | Common ARS form |
| Product Requirement Documents (PRD) | Common ARS form |
| Business Requirement Documents (BRD) | When designated ARS |
| Software Requirements Specifications (SRS) | Common ARS form |
| User Stories / Epics | Only when Intake designates them as ARS (or part of a designated ARS set) |
| Meeting Transcripts | Only when designated ARS (rare; usually supporting) |
| Product Discussions / Design Notes | Only when designated ARS |
| Architecture Documents | Only when designated ARS for the Feature Version scope |
| Existing Requirement Specifications | When designated ARS |
| Approved Manual Notes | When designated ARS |
| Multiple approved sources | When Intake designates a multi-source ARS set for the same Feature Version |

Supporting Knowledge Inputs (published EKB, historical specs, cloud docs, non-designated transcripts, etc.) may be supplied as **augmenting** bundles only.

### 2.2 Required context inputs

| Input | Role |
|-------|------|
| Document Bundle(s) for designated ARS | Primary evidence source |
| `approvedRequirementsSourceId` / `Version` (and set membership if multi-source) | Identity |
| `featureVersionId` when scoped | Scope |
| Optional supporting Document Bundles / Knowledge Hits | Augment only |
| Optional prior Requirement Object | Diff / delta mode |
| Execution context | Tenant/workspace, `reasoningRunId`, policy thresholds |

### 2.3 Multiple approved sources (conceptual)

When Intake designates **more than one** ARS for a Feature Version:

1. All designated sources are authoritative **as a set** for generation authority — none is “supporting.”  
2. The engine must attribute every claim to specific source identity/version/span.  
3. **Conflicts between designated ARS members** are recorded as Ambiguities / conflicting claims — **not** silently merged.  
4. **Conflicts between ARS and supporting knowledge** → ARS wins; supporting conflict becomes a finding.  
5. If Intake failed to designate any ARS, the engine must not invent one (failure path §12).  

No parsing algorithms are defined here.

---

## 3. Understanding Lifecycle

Conceptual stages only:

```
Receive Approved Requirements Source (Document Bundles + designation)
      ↓
Verify Context (scope, identity, designation present, prior object if delta)
      ↓
Understand Intent (feature overview / business objective — evidenced)
      ↓
Identify Actors / User roles
      ↓
Identify Functional Behaviour
      ↓
Identify Non-Functional Behaviour
      ↓
Identify Workflows (primary / alternate / exception — evidenced only)
      ↓
Identify Business Rules & Validation rules
      ↓
Identify Constraints
      ↓
Identify Integrations / APIs / UI / Data considerations
      ↓
Identify Dependencies
      ↓
Identify Permissions
      ↓
Identify State Changes / transitions (evidenced only)
      ↓
Identify Risks
      ↓
Identify Missing Information
      ↓
Identify Ambiguities & Open Questions
      ↓
Normalize Understanding
      ↓
Assess Confidence + Explainability facets
      ↓
Produce Requirement Understanding Package (draft)
```

Lifecycle conforms to the standard AI engine lifecycle in the AI Engine Specification Framework (receive → validate input → resolve context → gather evidence → reason → validate output → confidence → self review → HITL when required → publish/return).

---

## 4. Requirement Understanding Package

Logical contents (responsibilities only — **not** a database schema). Core body aligns with architectural Requirement Object facets.

| Package area | Responsibility |
|--------------|----------------|
| **Identity & provenance** | Package/Requirement Object ids; schemaVersion; ARS id(s)/version(s); featureVersionId; revision; status (`draft` / `blocked` / …); engine/run/provider provenance |
| **Feature overview** | Evidenced summary; scope-in/out only if explicit else unknown |
| **Business objective** | Evidenced intent statements |
| **Functional requirements** | Discrete functional claims with claimType, evidence, status |
| **Non-functional requirements** | NFR claims with category + measurability posture |
| **Actors / user roles** | Actors and roles evidenced in ARS |
| **Workflows** | Steps, alternate/exception flows only if evidenced |
| **Preconditions / postconditions** | Only when evidenced; else ambiguity |
| **Business rules** | Rule statements + applies-to refs |
| **Validation rules** | Field/API/entity validations evidenced |
| **Constraints** | Explicit constraints (regulatory, technical, business) |
| **Dependencies** | Feature/system/data/vendor prerequisites stated |
| **Integrations** | External systems/APIs interactions evidenced |
| **Data considerations** | Entities/attributes/lifecycle cues evidenced |
| **State transitions** | Stated states/transitions only |
| **Permissions** | Actor/action/resource/condition evidenced — never invented grants |
| **UI / API / entity facets** | As in architectural Requirement Object (evidenced only) |
| **Assumptions** | Provisional interpretations — **not** requirements until accepted |
| **Risks** | Evidenced or clearly inferred risk signals (labeled) |
| **Ambiguities** | Explicit unknowns / contradictions / incompleteness |
| **Open questions** | Clarification requests for humans |
| **Evidence Map** | Claim → ARS (or clarification) spans/locations |
| **Understanding Notes** | Narrative engineering notes for reviewers (non-authoritative) |
| **Traceability references** | Links among package facets; ARS identity inheritance |
| **Confidence** | Band + drivers at claim and package level |
| **Explanation facets** | Why / evidence / uncertainty for significant decisions |

Downstream engines consume this package; they must not treat Assumptions as Approved Requirements.

---

## 5. Understanding Responsibilities

### 5.1 What the engine must identify

| Category | Expectation |
|----------|-------------|
| **Explicit requirements** | Stated product behavior with ARS evidence |
| **Implicit relationships supported by evidence** | Only when ARS text structurally implies the relation; labeled `inferred` with evidence of implication — never free invention |
| **Business intent** | Goals/outcomes evidenced |
| **System behaviour** | What the system does/does not do as stated |
| **User behaviour** | Actor actions/journeys evidenced |
| **Operational expectations** | Ops/admin/runtime expectations when stated |
| **Exception paths** | Errors/alternates when stated; else Ambiguity |
| **Recovery expectations** | Retry/compensate/failover when stated |
| **Configuration expectations** | Configurable behaviour when stated |
| **Administrative behaviour** | Admin/privileged flows when stated |

### 5.2 What must not become requirements

- Unsupported assumptions  
- Supporting knowledge “facts” conflicting with or absent from ARS  
- Inferences without `inferred` label and implication evidence  
- Silent resolution of contradictions  
- Completeness filler for missing workflows/permissions/validations  

---

## 6. Requirement Normalization

Conceptual normalization only (no algorithms):

| Concern | Expectation |
|---------|-------------|
| **Consistent terminology** | Map synonyms to Domain ubiquitous language / Canonical Terminology where safe; record unresolved term conflicts as Ambiguities |
| **Duplicate consolidation** | Merge duplicate statements with multi-evidence refs; do not drop conflicting variants silently |
| **Relationship identification** | Link actors↔workflows↔rules↔permissions when evidenced |
| **Requirement grouping** | Group by capability/theme for readability — grouping is not a Trace Link substitute |
| **Business capability grouping** | Optional logical clustering under feature overview |
| **Workflow grouping** | Keep primary/alternate/exception association when evidenced |

Normalization must not invent missing groups to appear “complete.”

---

## 7. Ambiguity Management

| Ambiguity class | Handling |
|-----------------|----------|
| **Missing information** | Record Ambiguity + Open Question; partial package OK with `blocked` facets |
| **Contradictions** | Record conflicting claims with dual evidence; do not pick a winner inside ARS set without human Clarification |
| **Undefined behaviour** | Ambiguity; do not invent default product behaviour |
| **Incomplete workflows** | Mark missing steps/exceptions; do not fabricate journeys |
| **Missing permissions** | Ambiguity / Validation handoff — **not** invented grants |
| **Missing validation rules** | Ambiguity / Validation handoff |
| **Unknown integrations** | Ambiguity; supporting knowledge may suggest candidates labeled non-authoritative |

The engine **preserves** ambiguity and **requests clarification** where required. Escalation to HITL follows Orchestration + Decision Framework triggers (e.g., blocking ambiguity, multi-ARS conflict).

---

## 8. Evidence Model

Consumes [AI Decision & Evidence Framework](../architecture/AI_DECISION_AND_EVIDENCE_FRAMEWORK.md).

| Source | Use in Understanding |
|--------|----------------------|
| **Approved Requirements Source** | Primary evidence for product-behavior claims |
| **Enterprise Knowledge (published)** | Clarify terms/patterns; never override ARS |
| **Approved Product Documentation** | Supporting; conflict → Finding |
| **Historical approved knowledge** | Delta/context only |
| **User clarifications** | Authoritative only when accepted Clarification/Approval exists |
| **Human approvals** | Governance disposition — not a substitute for ARS text |

**Precedence:** ARS (+ approved Clarifications) wins for product behavior. Knowledge may clarify but **must never override** the Approved Requirements Source. LLM recollection is **not** evidence.

---

## 9. Confidence Behaviour

| Band (conceptual) | Typical meaning for understanding |
|-------------------|-----------------------------------|
| **High / Very High** | Dense explicit ARS evidence; low ambiguity; limited inference |
| **Medium / Partial** | Material gaps or inferences; usable with warnings |
| **Low / Very Low** | Sparse ARS, major contradictions, or unreadable source |
| **Conflicting evidence** | Collapse band; surface conflicts |
| **Missing evidence** | UnknownPenalty; do not invent |

Rules:

- Claim-level confidence rolls up; package cannot ignore blocking ambiguities  
- Knowledge outage → continue ARS-only with lowered confidence  
- **Confidence must not replace human Approval**  
- Confidence ≠ certainty  

---

## 10. Validation Responsibilities

This engine validates **understanding quality**, not scenarios/cases.

| Check | Expectation |
|-------|-------------|
| **Requirement completeness (local)** | Surface obvious missing facets implied by stated workflows — as Ambiguities, not invented requirements |
| **Consistency (local)** | Detect intra-package contradictions among extracted claims |
| **Logical conflicts** | Flag; leave resolution to Validation Engine / HITL |
| **Traceability** | Explicit claims have ARS evidence refs |
| **Unsupported assumptions** | Assumptions not promoted to functional requirements |
| **Duplicate requirements** | Consolidated or flagged |
| **Missing actors / workflows / business rules** | Recorded as gaps when behaviour implies them |

**Boundary:** Formal Validation gate (`pass` / `pass_with_warnings` / `fail`) and testability assessment belong to the **Requirement Validation Engine**. Understanding may emit self-review findings that Validation consumes.

---

## 11. Explainability

Every significant understanding decision must explain:

| Facet | Content |
|-------|---------|
| **What was understood** | Claim / facet summary |
| **Why it was understood** | Reasoning rationale |
| **Supporting evidence** | ARS (or Clarification) refs |
| **Remaining uncertainty** | Ambiguities / open questions |
| **Confidence** | Band + drivers |
| **Required clarification** | Questions for humans when blocked |

Opaque “model said so” is non-conformant. Aligns with Decision & Evidence Explanation Packets.

---

## 12. Failure Handling

| Failure | Conceptual handling |
|---------|---------------------|
| **Missing ARS designation** | Refuse understanding for generation path; return `REQUIREMENTS_SOURCE_MISSING` / equivalent; escalate to Intake |
| **Conflicting designated sources** | Produce package with conflict Ambiguities; block silent merge; HITL Clarification |
| **Unsupported / unreadable documents** | `DOCUMENT_INSUFFICIENT` / `REQUIREMENTS_SOURCE_INSUFFICIENT`; no content guessing |
| **Poor quality inputs** | Lower confidence; partial package + blockers; Clarification questions |
| **Missing context** (Feature Version / identity) | Fail input validation; do not invent scope |
| **Low confidence** | Emit drivers; Orchestrator applies threshold → HITL or warning path |
| **Incomplete information** | Partial draft + Ambiguities; status reflects blocked facets; **do not proceed to invent** for Scenario engines |

Graceful handling means **honest partial results**, not fabricated completeness.

---

## 13. Quality Standards

The Requirement Understanding Package must be:

| Standard | Meaning |
|----------|---------|
| **Accurate** | Claims match ARS evidence or are labeled inferred/assumption |
| **Complete** | Completeness relative to ARS content + explicit gap register — not imaginary completeness |
| **Explainable** | §11 satisfied |
| **Traceable** | Evidence Map + identity fields |
| **Normalized** | §6 applied without invention |
| **Consistent** | Conflicts recorded, not hidden |
| **Readable** | Domain terminology; reviewable by humans |
| **Provider-independent** | Same contracts across providers |
| **Ready for downstream reasoning** | Consumable by Validation and later engines without reinterpretation of ARS |

---

## 14. Downstream Consumers

| Consumer | How it uses the package |
|----------|-------------------------|
| **Requirement Validation Engine** | Challenges draft understanding; gate before RKG/Scenarios |
| **Knowledge Resolution Engine** | May use package context for supporting retrieval intents (read-only) |
| **Requirement Knowledge Graph Engine** | Builds RKG from **validated** understanding (post-Validation) |
| **Scenario Reasoning Engine** | Derives scenarios from validated requirements/RKG — never from raw ARS alone |
| **Test Case Reasoning Engine** | Indirect via scenarios |
| **QA Review Engine** | Critiques understanding among other artifacts |
| **Coverage Analysis Engine** | Uses validated/graph-linked requirements for coverage |
| **Workflow Orchestrator** | Routes blockers/HITL; holds package in reasoning run state |
| **AI Review / HITL workspaces** | Human clarification and disposition |

This engine does not call Scenario/Test Case engines.

---

## 15. Engineering Constraints

Developers **must never** allow this engine to:

1. Generate scenarios  
2. Generate test cases  
3. Generate automation, test plans, or release plans  
4. Invent requirements  
5. Resolve ambiguity without evidence or human Clarification  
6. Override the Approved Requirements Source with knowledge or model priors  
7. Bypass traceability / Evidence Map for explicit claims  
8. Merge conflicting ARS evidence silently  
9. Designate ARS vs supporting roles  
10. Bind to a single AI provider SDK in engine core  
11. Use `fddId`-only identity — use Approved Requirements Source identity  
12. Treat Assumptions as approved product facts  

---

## 16. Architecture Dependencies

| Dependency | Inherited |
|------------|-----------|
| [AI Reasoning Architecture](../architecture/AI_REASONING_ARCHITECTURE.md) (ADR 0004) | Stage 1 meaning, Requirement Object logical facets, invent/unknown rules |
| [Knowledge Architecture](../architecture/KNOWLEDGE_ARCHITECTURE.md) (ADR 0005) | Supporting knowledge authority limits |
| [QA Intelligence Framework](../architecture/QA_INTELLIGENCE_FRAMEWORK.md) (ADR 0007) | Completeness heuristics as questions/gaps — not invented requirements |
| [AI Decision & Evidence Framework](../architecture/AI_DECISION_AND_EVIDENCE_FRAMEWORK.md) (ADR 0008) | Evidence precedence, confidence, explainability, HITL |
| [Enterprise Data Architecture](../architecture/ENTERPRISE_DATA_ARCHITECTURE.md) (ADR 0009) | Document/ARS identity & version mindset |
| [Knowledge Intake & Workflow Orchestration](../architecture/KNOWLEDGE_INTAKE_AND_WORKFLOW_ORCHESTRATION_ARCHITECTURE.md) (ADR 0011) | Intake entry, ARS designation, HITL pause/resume |
| [Canonical Terminology](../architecture/CANONICAL_TERMINOLOGY.md) (ADR 0010) | Intake / ARS / Knowledge Input terms |
| [Domain Architecture](../architecture/DOMAIN_ARCHITECTURE.md) (ADR 0006) | Ubiquitous language for package facets |
| [AI Engine Specification Framework](./AI_ENGINE_SPECIFICATION_FRAMEWORK.md) | Standard lifecycle, contracts, catalog entry |
| [Platform Spine Engineering Specification](./PLATFORM_SPINE_ENGINEERING_SPECIFICATION.md) | AI runtime host, registration, context propagation, observability |

This specification **does not redefine** any of the above.

---

## 17. Readiness Checklist

| # | Check | Status |
|---|-------|--------|
| 1 | Supported inputs & multi-ARS treatment defined (§2) | ☐ |
| 2 | Understanding lifecycle defined (§3) | ☐ |
| 3 | Responsibilities & non-responsibilities defined (§1, §5) | ☐ |
| 4 | Requirement Understanding Package defined (§4) | ☐ |
| 5 | Normalization expectations defined (§6) | ☐ |
| 6 | Ambiguity management defined (§7) | ☐ |
| 7 | Evidence model defined (§8) | ☐ |
| 8 | Confidence behaviour defined (§9) | ☐ |
| 9 | Validation (understanding-only) defined (§10) | ☐ |
| 10 | Explainability defined (§11) | ☐ |
| 11 | Failure handling defined (§12) | ☐ |
| 12 | Quality standards defined (§13) | ☐ |
| 13 | Downstream consumers / contracts defined (§14) | ☐ |
| 14 | Engineering constraints defined (§15) | ☐ |
| 15 | Architecture dependencies traced (§16) | ☐ |
| 16 | Confirmed: engine does **not** generate scenarios/cases/automation | ☐ |

**Specification completeness:** Items 1–16 are defined by this document. Implementation coding still requires Product/Architect authorization and Platform Spine readiness per prior specs.

---

## 18. Document Control

| Field | Value |
|-------|-------|
| **Version** | 1.0 |
| **Status** | Approved engineering specification (no code) |
| **Owner** | Principal AI Engineer / Principal QA Architect / Enterprise Requirements Engineer |
| **Dependencies** | ADRs 0004–0011, 0013–0015; AI Engine Spec; Platform Spine Spec |
| **Related ADRs** | Consumes primarily 0004, 0007, 0008, 0010, 0011 — **creates no new ADR** |
| **Last updated** | 2026-07-25 |

### Change History

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-07-25 | Initial Requirement Understanding Engine Specification |

---

*End of Requirement Understanding Engine Specification.*
