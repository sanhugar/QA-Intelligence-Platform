# Requirement Knowledge Graph Engine Specification

**Document ID:** ATI-ENG-AI-ENGINE-RKG-001  
**Status:** Approved engineering specification (no implementation code)  
**Product:** AI QA Intelligence Platform (ATI v2)  
**Audience:** Principal AI Engineer, Enterprise Knowledge Architect, Graph Modeling Architect, Principal QA Architect, Enterprise Software Architect, Implementation Engineer  
**Phase:** Engineering Specification — Brain Stage 3 (Requirement Knowledge Graph)  
**Last updated:** 2026-07-25

---

## 0. Purpose and Scope

This document is the **canonical engineering specification** for the **Requirement Knowledge Graph Engine**.

Its purpose is to construct a logical **Requirement Knowledge Graph (RKG)** that represents the validated understanding of the Approved Requirements Source (ARS), together with **approved augmenting knowledge**, as the **canonical reasoning model** for downstream AI engines for a specific analysis run.

### This document is

- An engineering specification for a single AI engine  
- Consuming of approved architecture and prior engineering specifications  

### This document is not

- Architecture redesign or an ADR  
- Code, APIs, prompts, UI, or database schemas  
- The Enterprise Knowledge Base (EKB)  
- Scenario, test case, automation, or release generation  

### Guiding principles (normative)

| Principle | Engineering meaning |
|-----------|---------------------|
| Build from validated understanding only | Gate ≠ `fail` required for primary construction path |
| ARS primacy | Requirement-fact nodes/edges subordinate to ARS evidence |
| Preserve evidence lineage | Every node/relationship cites evidence or explicit unknown |
| Explicit and evidence-supported relationships only | No unsupported invention |
| Never invent unsupported nodes or relationships | Gaps remain Ambiguity/Finding nodes — not fabricated edges |
| Separate requirement facts from augmenting knowledge | Knowledge nodes labeled non-authoritative |
| Deterministic where possible | Stable node/edge identity within a run given same inputs |
| Provider-independent | AI Port only where needed; graph shape is contract-driven |
| Explainable | Why each material relationship exists |

### RKG nature (normative)

The RKG is a **transient reasoning artifact** for a specific `reasoningRunId` / analysis run. It is **not** the Enterprise Knowledge Base and **must not** persist as enterprise knowledge by this engine.

---

## 1. Engine Purpose

### 1.1 Responsibilities

- Consume validated Understanding Package + Validation Report (+ optional Knowledge Resolution Package)  
- Create a run-scoped reasoning context  
- Identify entities and evidence-supported relationships as graph nodes/edges  
- Link evidence (ARS, Clarifications, augmenting knowledge)  
- Validate graph integrity  
- Produce an RKG with confidence and unresolved/unknown markers  
- Expose a queryable structure for Scenario, Coverage, Review, and later Impact engines  

### 1.2 Scope

- Brain **Stage 3 — Requirement Knowledge Graph**  
- Logical graph modeling only (no physical DB schema)  
- Requirement-fact subgraph + clearly separated supporting-knowledge attachments  

### 1.3 Non-responsibilities

This engine **must not**:

- Generate Scenarios or Test Cases  
- Modify or override requirements / ARS  
- Invent relationships or nodes without evidence (or explicit unknown marking)  
- Persist enterprise knowledge into the EKB  
- Designate ARS vs supporting  
- Replace Validation or Understanding engines  
- Treat supporting knowledge as requirement-fact nodes  

### 1.4 Position in the ATI reasoning pipeline

```
Requirement Understanding Engine
        ↓
Requirement Validation Engine  (gate ≠ fail)
        ↓
Knowledge Resolution Engine  (optional augmenting package)
        ↓
★ Requirement Knowledge Graph Engine  ← this specification
        ↓  RKG (run-scoped)
Scenario Reasoning → Test Case Reasoning → QA Review → Coverage → …
```

Architecture source: [AI Reasoning Architecture](../architecture/AI_REASONING_ARCHITECTURE.md) Stage 3; catalog entry in [AI Engine Specification Framework](./AI_ENGINE_SPECIFICATION_FRAMEWORK.md) §2.6.

Hard sequencing (inherited): RKG for downstream use requires Validation gate ≠ `fail`. Scenario Reasoning consumes RKG + validated understanding.

---

## 2. Inputs

Conceptual inputs only — no schemas.

| Input | Role |
|-------|------|
| **Requirement Understanding Package** | Validated understanding content (immutable claims) |
| **Requirement Validation Report** | Gate disposition, findings, ambiguities — construction precondition |
| **Knowledge Resolution Package** | Optional augmenting hits — never requirement facts |
| **Approved Requirements Source** | Authority for requirement-fact evidence |
| **User clarifications** | Accepted Clarifications may authorize additional evidenced facts |
| **Execution context** | Tenant/workspace, featureVersionId, ARS identity, `reasoningRunId` |

If Validation gate is `fail`, the engine must not produce an RKG authorized for Scenario Reasoning.

---

## 3. Graph Construction Lifecycle

Conceptual stages only:

```
Receive validated inputs
      ↓
Create reasoning context (run scope, ARS identity, disposition)
      ↓
Identify entities
      ↓
Identify relationships
      ↓
Identify workflows
      ↓
Identify dependencies
      ↓
Identify business rules
      ↓
Identify validations
      ↓
Identify permissions
      ↓
Identify integrations
      ↓
Attach supporting knowledge (labeled augmenting)
      ↓
Link evidence
      ↓
Validate graph integrity
      ↓
Assess graph confidence
      ↓
Produce Requirement Knowledge Graph
```

Conforms to the standard AI engine lifecycle in the AI Engine Specification Framework.

---

## 4. Graph Components

Conceptual **node categories** (responsibilities only — not a schema):

| Node category | Responsibility |
|---------------|----------------|
| **Feature** | Feature / Feature Version scope anchor for the run |
| **Capability** | Grouping of related behaviours when evidenced |
| **Functional Requirement** | Functional claim node from validated understanding |
| **Non-functional Requirement** | NFR claim node with measurability posture |
| **Actor** | Human/system/service actor |
| **Role** | Role/permission-bearing identity when distinct from actor |
| **Workflow** | Named flow / journey |
| **Activity** | Workflow step/action |
| **Business Rule** | Business rule statement |
| **Validation Rule** | Input/API/entity validation expectation |
| **Permission** | Actor/role × action × resource (+ condition if evidenced) |
| **Constraint** | Explicit constraint |
| **Integration** | External system/API interaction |
| **Dependency** | Prerequisite/system/data/vendor dependency |
| **State** | Evidenced state |
| **Transition** | Evidenced state change |
| **Risk** | Risk signal node |
| **Assumption** | Provisional interpretation — **not** a requirement fact |
| **Ambiguity** | Explicit unknown / conflict / incompleteness |
| **Finding** | Validation (or integrity) finding attached to graph |
| **Supporting Knowledge** | Augmenting knowledge attachment — non-authoritative |
| **Evidence** | Evidence reference node/link target (ARS span, Clarification, knowledge item) |

UI/API/entity facets from Understanding may appear as typed nodes when evidenced (aligned to architectural Requirement Object facets) without inventing unstated components.

**Unknown nodes:** Where architecture requires unresolved structure, mark `unknown` rather than invent.

---

## 5. Relationship Types

Conceptual **relationship categories** (controlled vocabulary mindset — not a physical schema):

| Relationship | Typical meaning |
|--------------|-----------------|
| **owns** | Ownership/containment (e.g., Feature owns Capability/Requirement) |
| **depends on** | Dependency between requirements/systems/features |
| **triggers** | Behaviour triggers another activity/flow |
| **validates** | Validation rule applies to a target |
| **requires** | Preconditions/required actors/permissions |
| **belongs to** | Membership in workflow/capability/group |
| **transitions to** | State transition |
| **integrates with** | Integration relationship |
| **constrained by** | Constraint applies |
| **supports** | Supporting knowledge supports a facet (non-authoritative) |
| **references** | Non-owning cross-reference |
| **evidences** | Evidence underpins a node/edge |
| **affects** | Risk/finding affects a node |
| **performed by** | Activity performed by Actor/Role |
| **authorizes** | Permission authorizes action on resource |
| **conflicts with** | Explicit conflict between claims/knowledge |

Edges must be evidence-supported or explicitly marked unknown/conflict. **Do not invent edges to “make the graph pretty.”**

---

## 6. Graph Integrity

Conceptual integrity validation before the RKG is published for downstream use:

| Check | Expectation |
|-------|-------------|
| **Orphan detection** | Critical requirement-fact nodes must not be disconnected without explanation; orphans become Findings/Ambiguities |
| **Circular relationships** | Unexpected cycles flagged (dependency cycles, illegal transition cycles) |
| **Missing evidence** | Requirement-fact nodes/edges without evidence refs → integrity Finding |
| **Duplicate entities** | Same-identity duplicates collapsed or flagged — not silently forked |
| **Conflicting relationships** | Opposite/incompatible edges → conflict Finding; no silent pick |
| **Incomplete workflows** | Workflows missing required structure where Understanding claimed completeness → Finding |
| **Broken traceability** | Lost ARS/Clarification lineage → fail integrity for affected subgraph |
| **Authority separation** | Supporting Knowledge must not be linked as if it owns requirement facts |
| **Gate consistency** | No “ready” RKG if Validation gate was `fail` |

Integrity failure → regenerate from Understanding/Validation inputs or halt; never invent edges to pass checks.

---

## 7. Evidence Lineage

Every material **node** and **relationship** maintains lineage:

| Lineage aspect | Expectation |
|----------------|-------------|
| **Requirement evidence** | ARS identity/version + span/location refs for requirement-fact elements |
| **Knowledge evidence** | Knowledge item id/version + domain + authority class for supporting nodes/edges |
| **Human clarification** | Accepted Clarification identity when it authorizes a fact |
| **Confidence** | Per-node/edge confidence band + drivers; unknowns penalize |
| **Provenance** | Created by this engine/run; input package revisions |

Supporting knowledge lineage must remain distinguishable from ARS lineage at all times.

---

## 8. Knowledge Separation

| Kind | Graph treatment |
|------|-----------------|
| **Requirement facts** | Nodes/edges evidenced by ARS or accepted Clarification; authoritative for downstream requirement-linked reasoning |
| **Supporting knowledge** | `Supporting Knowledge` nodes / `supports` edges only; labeled augmenting; never become requirement facts |
| **Assumptions** | Assumption nodes — provisional; not requirement facts |
| **Findings** | Finding nodes from Validation/integrity — critique signals |
| **Ambiguities** | Ambiguity nodes — preserve uncertainty |

**Hard rule:** Knowledge must never become requirements. Conflict with ARS → `conflicts with` / Finding; ARS wins.

---

## 9. Confidence Behaviour

| Concern | Expectation |
|---------|-------------|
| **Propagation** | Graph confidence reflects completeness of relations among explicit requirements, proportion of `unknown` nodes, and consistency with Validation findings |
| **Inheritance** | Downstream consumers cannot treat high graph confidence as Approval |
| **Uncertainty** | Unknown/Ambiguity nodes lower local and rollup confidence |
| **Knowledge reliance** | Heavy dependence on supporting knowledge for structure lowers confidence for requirement-fact claims |
| **Blocking** | Critical integrity conflicts collapse High/Very High bands |

Confidence must **never replace Approval**. Confidence ≠ certainty.

---

## 10. Explainability

Every material graph relationship (and significant node creation decision) must explain:

| Facet | Content |
|-------|---------|
| **Why it exists** | Derivation rationale from validated understanding |
| **Supporting evidence** | ARS / Clarification / knowledge refs |
| **Confidence** | Band + drivers |
| **Applicability** | Requirement-fact vs augmenting |
| **Source lineage** | Input package + evidence identities |

Unexplained edges are non-conformant.

---

## 11. Failure Handling

| Failure | Conceptual handling |
|---------|---------------------|
| **Missing entities** | Ambiguity/Finding nodes; do not invent entities |
| **Broken relationships** | Integrity Finding; omit illegal edge; do not fabricate repair edges |
| **Conflicting evidence** | Conflict edges/Findings; ARS wins for requirement facts |
| **Missing evidence** | Reject requirement-fact promotion; mark unknown/Finding |
| **Invalid graphs** | Do not publish as ready; return integrity report; halt downstream |
| **Partial graphs** | Allowed with explicit unknown/Ambiguity markers and lowered confidence — not fake completeness |
| **Validation gate fail** | Refuse authorized RKG for Scenario path |
| **Provider/processing failure** | Normalized failure; retry only transient; never invent graph to succeed |

---

## 12. Downstream Consumers

| Consumer | How it uses the RKG |
|----------|---------------------|
| **Scenario Reasoning Engine** | Primary structural model for scenario derivation; scenarios still require requirement links |
| **Test Case Reasoning Engine** | Indirect via scenarios; may consult structure for verifiability cues |
| **Coverage Analysis Engine** | Trace matrix / dimension coverage over requirement-fact subgraph |
| **QA Review Engine** | Critique consistency/completeness against graph |
| **Impact Analysis Engine** | Structural impact traversal (later) |
| **Release Planning Engine** | Readiness structure signals (later; Release remains lateral) |
| **Workflow Orchestrator** | Integrity/confidence gates; rewind signals |

Consumers must not reinterpret Supporting Knowledge nodes as ARS.

---

## 13. Engineering Constraints

Developers **must never** allow this engine to:

1. Invent graph nodes  
2. Invent relationships  
3. Override or rewrite requirements  
4. Persist the RKG as enterprise knowledge (EKB)  
5. Generate scenarios or test cases  
6. Hide graph inconsistencies  
7. Promote supporting knowledge to requirement-fact nodes  
8. Publish a ready RKG after Validation `fail`  
9. Bind graph meaning to a vendor graph database product as architecture  
10. Drop evidence lineage to “simplify” the graph  

---

## 14. Architecture Dependencies

| Dependency | Inherited responsibilities |
|------------|---------------------------|
| [AI Reasoning Architecture](../architecture/AI_REASONING_ARCHITECTURE.md) (ADR 0004) | Stage 3 purpose, RKG outputs, invent-edge ban, unknown nodes |
| [Knowledge Architecture](../architecture/KNOWLEDGE_ARCHITECTURE.md) (ADR 0005) | Augmenting knowledge rules; RKG ≠ EKB |
| [Domain Architecture](../architecture/DOMAIN_ARCHITECTURE.md) (ADR 0006) | Ubiquitous language for node kinds |
| [AI Decision & Evidence Framework](../architecture/AI_DECISION_AND_EVIDENCE_FRAMEWORK.md) (ADR 0008) | Evidence primacy, explainability, confidence ≠ approval |
| [Enterprise Data Architecture](../architecture/ENTERPRISE_DATA_ARCHITECTURE.md) (ADR 0009) | Identity/version mindset for evidenced artifacts |
| [Knowledge Intake & Workflow Orchestration](../architecture/KNOWLEDGE_INTAKE_AND_WORKFLOW_ORCHESTRATION_ARCHITECTURE.md) (ADR 0011) | Run sequencing, HITL on integrity blocks |
| [AI Engine Specification Framework](./AI_ENGINE_SPECIFICATION_FRAMEWORK.md) | Lifecycle, contracts, catalog |
| [Platform Spine Engineering Specification](./PLATFORM_SPINE_ENGINEERING_SPECIFICATION.md) | AI runtime host, registration, observability |
| [Requirement Understanding Engine Specification](./REQUIREMENT_UNDERSTANDING_ENGINE_SPECIFICATION.md) | Understanding Package as fact source |
| [Requirement Validation Engine Specification](./REQUIREMENT_VALIDATION_ENGINE_SPECIFICATION.md) | Gate precondition; findings as Finding nodes |
| [Knowledge Resolution Engine Specification](./KNOWLEDGE_RESOLUTION_ENGINE_SPECIFICATION.md) | Augmenting package attachment rules |

This specification **does not redefine** any of the above.

---

## 15. Readiness Checklist

| # | Check | Status |
|---|-------|--------|
| 1 | Engine purpose / pipeline position defined (§1) | ☐ |
| 2 | Inputs & Validation precondition defined (§2) | ☐ |
| 3 | Graph construction lifecycle defined (§3) | ☐ |
| 4 | Node categories defined (§4) | ☐ |
| 5 | Relationship categories defined (§5) | ☐ |
| 6 | Integrity rules defined (§6) | ☐ |
| 7 | Evidence lineage defined (§7) | ☐ |
| 8 | Knowledge separation defined (§8) | ☐ |
| 9 | Confidence behaviour defined (§9) | ☐ |
| 10 | Explainability defined (§10) | ☐ |
| 11 | Failure handling defined (§11) | ☐ |
| 12 | Downstream contracts defined (§12) | ☐ |
| 13 | Engineering constraints defined (§13) | ☐ |
| 14 | Confirmed: RKG is run-scoped, not EKB | ☐ |
| 15 | Confirmed: no scenario/case generation; no invented edges | ☐ |

**Specification completeness:** Items 1–15 are defined by this document. Coding still requires Product/Architect authorization and Spine readiness.

---

## 16. Document Control

| Field | Value |
|-------|-------|
| **Version** | 1.0 |
| **Status** | Approved engineering specification (no code) |
| **Owner** | Graph Modeling Architect / Principal AI Engineer / Enterprise Knowledge Architect |
| **Dependencies** | ADRs 0004–0006, 0008–0011, 0013–0015; prior engine eng specs |
| **Related ADRs** | Consumes primarily 0004, 0005, 0008 — **creates no new ADR** |
| **Last updated** | 2026-07-25 |

### Change History

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-07-25 | Initial Requirement Knowledge Graph Engine Specification |

---

*End of Requirement Knowledge Graph Engine Specification.*
