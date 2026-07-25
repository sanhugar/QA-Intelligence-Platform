# Knowledge Resolution Engine Specification

**Document ID:** ATI-ENG-AI-ENGINE-KNOWLEDGE-001  
**Status:** Approved engineering specification (no implementation code)  
**Product:** AI QA Intelligence Platform (ATI v2)  
**Audience:** Principal AI Engineer, Enterprise Knowledge Architect, Principal QA Architect, Enterprise Software Architect, Implementation Engineer  
**Phase:** Engineering Specification — supporting knowledge resolution (Brain Knowledge Engine)  
**Last updated:** 2026-07-25

---

## 0. Purpose and Scope

This document is the **canonical engineering specification** for the **Knowledge Resolution Engine** (architectural name: **Knowledge Engine**).

Its purpose is to **determine, retrieve, validate, and organize only the enterprise knowledge required** to support downstream reasoning after requirements are understood and validated — while preserving **Approved Requirements Source (ARS) primacy**.

### This document is

- An engineering specification for a single AI engine  
- Consuming of Knowledge Architecture and prior engineering specifications  

### This document is not

- Architecture redesign or an ADR  
- Code, APIs, prompts, UI, or database schemas  
- Requirements authorship, scenario/case/automation/release generation  

### Guiding principles (normative)

| Principle | Engineering meaning |
|-----------|---------------------|
| Retrieve intentionally, not exhaustively | Need-driven intents and scoped domains only |
| Minimize unnecessary retrieval | Prefer ARS-only when need assessment says “none” |
| ARS primacy | Knowledge supplements; never replaces or overrides ARS |
| Preserve evidence traceability | Every hit carries provenance, version, authority class |
| Explainable | Why retrieved, relevance, applicability, limitations |
| Provider-independent | Search/knowledge ports + Integration connectors — no vendor core |
| Graceful degradation | Repository outage → ARS-only continue with lowered confidence |
| Never infer missing requirements from knowledge | Gaps remain gaps; knowledge is not a Requirements factory |

---

## 1. Engine Purpose

### 1.1 Responsibilities

- Assess whether additional supporting knowledge is needed given Validation + Understanding context  
- Determine retrieval intents, domains, and scope  
- Retrieve candidate Knowledge Items / Knowledge Inputs via EKB ports  
- Validate eligibility (published, ACL, authority class, non-conflict with ARS)  
- Surface conflicts, obsolescence, duplicates, and low-confidence hits  
- Produce a **Knowledge Resolution Package** labeled entirely as **augmenting**  
- Support on-demand retrieval for other engines without changing ownership rules  

### 1.2 Scope

- Reasoning-side facade over the Enterprise Knowledge Base ([Knowledge Architecture](../architecture/KNOWLEDGE_ARCHITECTURE.md) ADR 0005)  
- Supporting enrichment for post-Validation downstream reasoning (primary sequencing)  
- Optional on-demand calls from Understanding / Validation / Review when Orchestration requests supporting context  

### 1.3 Non-responsibilities

This engine **must not**:

- Modify, rewrite, or invent requirements  
- Designate ARS vs supporting (Intake/Orchestration)  
- Override ARS with knowledge hits  
- Generate Scenarios, Test Cases, Automation, or Release Plans  
- Auto-publish Learning Candidates into product-fact knowledge  
- Perform exhaustive “retrieve everything” searches as default  
- Act as LLM long-term memory  

### 1.4 Position in the ATI reasoning pipeline

Primary enrichment sequencing (engineering):

```
Requirement Understanding Engine
        ↓
Requirement Validation Engine  (gate ≠ fail)
        ↓
★ Knowledge Resolution Engine  ← this specification
        ↓  Knowledge Resolution Package (augmenting only)
Requirement Knowledge Graph / Scenario / Test Case / Review / Coverage
```

Cross-cutting (architecture): may be invoked on demand by Understanding, Validation, Scenario, or Review under Orchestration — always with ARS-win conflict rules.

Architecture sources: [AI Reasoning Architecture](../architecture/AI_REASONING_ARCHITECTURE.md) §2.5; [AI Engine Specification Framework](./AI_ENGINE_SPECIFICATION_FRAMEWORK.md) §2.5; Knowledge Architecture hierarchy & retrieval strategy.

---

## 2. Inputs

Conceptual inputs only — no formats.

| Input | Role |
|-------|------|
| **Requirement Validation Report** | Gate disposition, gaps, ambiguities, findings that may trigger knowledge need |
| **Requirement Understanding Package** | Structured understanding context for intents/scope (immutable claims) |
| **Approved Requirements Source** | Primacy reference for conflict detection |
| **Enterprise Knowledge Base** | Published Knowledge Items/domains via knowledge ports |
| **User clarifications** | Accepted Clarifications may refine intent/scope |
| **Knowledge governance policies** | ACL, classification, authority-class eligibility, residency |
| **Retrieval request (on-demand)** | Calling engine’s query context when not in post-Validation enrichment mode |
| **Execution context** | Tenant/workspace, featureVersionId, `reasoningRunId`, connector health |

---

## 3. Knowledge Resolution Lifecycle

Conceptual stages only:

```
Receive Validation Report (+ Understanding Package / ARS identity)
      ↓
Determine Knowledge Need
      ↓
Identify Knowledge Domains
      ↓
Determine Retrieval Intent
      ↓
Determine Retrieval Scope
      ↓
Retrieve Candidate Knowledge
      ↓
Validate Retrieved Knowledge
      ↓
Resolve Conflicts (surface; ARS wins)
      ↓
Assign Evidence / provenance
      ↓
Assess Confidence
      ↓
Produce Knowledge Resolution Package
```

If need assessment concludes **no additional knowledge required**, produce an empty/minimal package with explicit rationale (`knowledge_not_required`) and continue ARS-centered downstream path.

Conforms to the standard AI engine lifecycle in the AI Engine Specification Framework.

---

## 4. Knowledge Need Assessment

The engine determines **whether** and **what kind** of additional knowledge is required.

| Need driver | Responsibility |
|-------------|----------------|
| **Product-specific context** | Cross-feature product constraints, terminology baseline |
| **Cloud platform behavior** | Environment/platform limits relevant to stated NFRs/integrations |
| **Historical implementation patterns** | Prior ARS versions / packages for delta/impact context only |
| **Integration behavior** | Dependency/system interaction patterns when ARS names integrations |
| **Security guidance** | Org security patterns when ARS implies authz/security behaviour |
| **Enterprise standards** | Method/standards checklists (not product facts) |
| **Regulatory expectations** | Compliance dimensions when ARS/compliance scope implies them |
| **Validation gaps** | Completeness findings that ask for method patterns — not invented requirements |
| **Ambiguity clarification aids** | Glossary/product docs that may reduce term confusion without inventing behaviour |

**Rules**

- Need must be **intentional** and tied to package/Validation signals or explicit caller intent  
- No need → no retrieval  
- Need for product behaviour **absent from ARS** → do **not** retrieve to invent; escalate Ambiguity instead  

---

## 5. Retrieval Intent

Conceptual intents (no algorithms):

| Intent | Typical use |
|--------|-------------|
| **Clarification** | Resolve term/scope wording (non-authoritative) |
| **Terminology** | Glossary / ubiquitous language alignment |
| **Product behavior** | Approved product/feature knowledge — only if non-conflicting and never as ARS substitute |
| **Cloud reference** | Platform/cloud operational facts |
| **Historical implementation** | Prior ARS/feature context for delta |
| **Standards** | Org QA/engineering standards |
| **Architecture reference** | Approved architecture knowledge |
| **Integration context** | Integration & dependency knowledge |
| **Testing guidance** | Testing/automation method patterns |
| **Compliance reference** | Regulatory/compliance knowledge |
| **Defect / risk patterns** | Curated defect/risk signals (risk only) |
| **User documentation** | Wording aid — lowest trust for product facts |

Each retrieval records intent, domain set, and rationale in the Resolution Package.

---

## 6. Knowledge Domains

Supported domains are those in [Knowledge Architecture](../architecture/KNOWLEDGE_ARCHITECTURE.md) §1 (extensible via architecture §9). Conceptual responsibilities:

| Domain | Conceptual responsibility for resolution |
|--------|------------------------------------------|
| **Product Knowledge** | Product-wide approved context |
| **Feature Knowledge** | Feature-durable approved context beyond a single ARS revision |
| **Historical FDD / ARS Knowledge** | Prior versions for delta/impact — not live authority |
| **Cloud Knowledge** | Platform/cloud operational facts |
| **Testing Knowledge** | QA methods/patterns — not product behaviour |
| **Automation Knowledge** | Automation patterns — framework-neutral |
| **Release Knowledge** | Release/readiness contextual knowledge |
| **Defect Knowledge** | Curated defect/risk signals |
| **Organizational Standards** | Enterprise standards/policies |
| **User Documentation** | End-user docs (supporting wording) |
| **Architecture Knowledge** | Approved architecture references |
| **AI Generated Knowledge** | Candidates only — not eligible as product-fact support until governed promotion |
| **Glossary & Ubiquitous Language** | Term alignment |
| **Compliance & Regulatory Knowledge** | Compliance dimensions/guidance |
| **Integration & Dependency Knowledge** | Systems/dependency context |

Eligibility filters (inherited): published, not expired, ACL pass, not quarantined, authority class legal for the claim type being supported.

---

## 7. Knowledge Resolution Package

Conceptual output (no schemas):

| Area | Responsibility |
|------|----------------|
| **Identity & provenance** | Package id; links to Understanding Package revision + Validation Report; `reasoningRunId`; engine provenance |
| **Need assessment result** | Required / not required + rationale |
| **Retrieved knowledge** | Ordered hits (summaries/refs — not unbounded dumps) |
| **Domain sources** | Domain IDs per hit |
| **Retrieval intents** | Intent(s) that justified each hit or group |
| **Retrieval rationale** | Why this knowledge was sought |
| **Applicability** | Where downstream may use the hit (method vs contextual vs product-supporting) |
| **Evidence references** | Knowledge item id/version, source provenance, authority class |
| **Conflict flags** | Conflicts with ARS or among hits |
| **Obsolescence / duplicate notes** | Superseded or redundant hits |
| **Confidence** | Per-hit and package-level supporting confidence |
| **Usage recommendations** | Allow / caution / exclude for product-fact support |
| **Traceability** | Links back to Validation findings / Understanding facets that triggered need |
| **Availability status** | Including `knowledge_unavailable` degrade mode |
| **Explanation facets** | See §11 |

All hits are labeled **`augmenting`**. None become Requirement Object facts unless ARS or accepted Clarification authorizes them (downstream/governance — not this engine).

---

## 8. Evidence Validation

Consumes [AI Decision & Evidence Framework](../architecture/AI_DECISION_AND_EVIDENCE_FRAMEWORK.md) and Knowledge Architecture eligibility rules.

| Source class | Validation expectation |
|--------------|------------------------|
| **Published enterprise knowledge** | Eligible when authority class fits; provenance mandatory |
| **Approved historical knowledge** | Contextual only; never live ARS |
| **Cloud reference knowledge** | Attributed; conflict with ARS → Finding |
| **User-provided approved knowledge** | Only if published/approved under governance |
| **Human clarification** | Authoritative for clarification scope when accepted — still does not invent undocumented features unilaterally |

**Hard rule:** Knowledge must **never override** the Approved Requirements Source. Conflict → flag; ARS wins. Draft/proposed/AI-candidate items are not product-fact support.

---

## 9. Conflict Resolution

Conceptual handling (surface, do not silent-win):

| Situation | Handling |
|-----------|----------|
| **Conflicting knowledge vs ARS** | ARS wins; hit marked conflict; may become Validation/Review finding input |
| **Conflicting knowledge vs knowledge** | Prefer higher authority class / fresher published / stewarded item; else flag both; no silent merge |
| **Obsolete knowledge** | Exclude from product-fact support; may keep as historical context with flag |
| **Duplicate knowledge** | Collapse to canonical published version; retain multi-ref if useful |
| **Low-confidence knowledge** | Include only with caution label or exclude per policy |
| **Missing knowledge** | Record `knowledge_gap`; degrade; do not invent |

**Escalation:** Blocking product-fact conflicts, ACL denial on critical intent, or policy-required stewardship disputes → HITL / Knowledge Steward path via Orchestration.

---

## 10. Confidence Behaviour

| Band (conceptual) | Meaning |
|-------------------|---------|
| **Strong supporting knowledge** | Published, in-scope, non-conflicting, high relevance |
| **Weak supporting knowledge** | Partial relevance, thin provenance, or heavy method-only value |
| **Conflicting knowledge** | Conflict flags present; product-fact support suppressed |
| **Missing knowledge** | Need unmet; `knowledge_gap` / unavailable |

Rules:

- Confidence is about **support quality**, not Requirements truth  
- Knowledge outage lowers confidence for knowledge-dependent decisions; ARS-only continues  
- **Confidence must never replace Approval**  
- Downstream package confidence may degrade when enrichment expected but missing  

---

## 11. Explainability

Every significant knowledge decision must explain:

| Facet | Content |
|-------|---------|
| **Why knowledge was retrieved** | Need driver / intent |
| **Why it is relevant** | Link to Understanding/Validation facet or caller context |
| **Supporting evidence** | Knowledge item identity/version/provenance |
| **Confidence** | Band + drivers |
| **Applicability** | Allowed usage class |
| **Limitations** | Authority class limits, conflict flags, obsolescence, ACL omissions |

Opaque “related docs” dumps without rationale are non-conformant.

---

## 12. Failure Handling

| Failure | Conceptual handling |
|---------|---------------------|
| **Missing knowledge** | Empty/gap package; continue ARS-only; lower confidence |
| **Retrieval failures** | Retry transient port errors; then degrade |
| **Unsupported domains** | Skip with explanation; do not invent domain content |
| **Knowledge conflicts** | Surface per §9; ARS wins |
| **Repository unavailable** | `knowledge_unavailable`; ARS-only path |
| **Low-confidence knowledge** | Caution/exclude per policy |
| **ACL denial** | Omit item; do not leak unauthorized content; audit as policy requires |

Graceful degradation never fabricates knowledge or Requirements.

---

## 13. Downstream Consumers

| Consumer | How it uses the package |
|----------|-------------------------|
| **Requirement Knowledge Graph Engine** | Optional contextual labels — must not create authoritative ARS-contradicting nodes |
| **Scenario Reasoning Engine** | Method/pattern augmentation only; scenarios still require requirement links |
| **Test Case Reasoning Engine** | Testing/automation patterns only; no invented expected results from knowledge |
| **Coverage Analysis Engine** | Standards/checklist dimensions as measurement aids |
| **QA Review Engine** | Pattern/completeness critique aids |
| **Impact Analysis Engine (later)** | Historical/integration context |
| **Workflow Orchestrator** | Degrade/HITL signals; availability status |

Consumers must treat all hits as **augmenting**.

---

## 14. Engineering Constraints

Developers **must never** allow this engine to:

1. Override or rewrite requirements  
2. Invent requirements from knowledge  
3. Retrieve all knowledge indiscriminately  
4. Generate scenarios, test cases, automation, or release plans  
5. Hide conflicting knowledge  
6. Ignore evidence lineage / provenance  
7. Promote AI-generated candidates to product-fact support  
8. Use unpublished/quarantined items for standard retrieval  
9. Bind core logic to a single search/vendor SDK  
10. Treat cache or model memory as EKB authority  

---

## 15. Architecture Dependencies

| Dependency | Inherited responsibilities |
|------------|---------------------------|
| [Knowledge Architecture](../architecture/KNOWLEDGE_ARCHITECTURE.md) (ADR 0005) | Domains, hierarchy, lifecycle, intentional retrieval, authority classes, SharePoint-as-source |
| [AI Reasoning Architecture](../architecture/AI_REASONING_ARCHITECTURE.md) (ADR 0004) | Knowledge Engine role; ARS-only degrade; augment-only hard rule |
| [AI Decision & Evidence Framework](../architecture/AI_DECISION_AND_EVIDENCE_FRAMEWORK.md) (ADR 0008) | Evidence precedence; knowledge not above ARS |
| [Enterprise Data Architecture](../architecture/ENTERPRISE_DATA_ARCHITECTURE.md) (ADR 0009) | Identity/version of knowledge/document artifacts |
| [Knowledge Intake & Workflow Orchestration](../architecture/KNOWLEDGE_INTAKE_AND_WORKFLOW_ORCHESTRATION_ARCHITECTURE.md) (ADR 0011) | When enrichment runs; HITL; degrade coordination |
| [Integration Architecture](../architecture/INTEGRATION_AND_EXTERNAL_SYSTEMS_ARCHITECTURE.md) (ADR 0012) | Knowledge source connectors behind ports |
| [AI Engine Specification Framework](./AI_ENGINE_SPECIFICATION_FRAMEWORK.md) | Lifecycle, contracts, catalog |
| [Platform Spine Engineering Specification](./PLATFORM_SPINE_ENGINEERING_SPECIFICATION.md) | AI runtime host, registration, observability |
| [Requirement Understanding Engine Specification](./REQUIREMENT_UNDERSTANDING_ENGINE_SPECIFICATION.md) | Understanding Package as context |
| [Requirement Validation Engine Specification](./REQUIREMENT_VALIDATION_ENGINE_SPECIFICATION.md) | Validation Report / gate as enrichment precondition for primary path |

This specification **does not redefine** any of the above.

---

## 16. Readiness Checklist

| # | Check | Status |
|---|-------|--------|
| 1 | Engine purpose / pipeline position defined (§1) | ☐ |
| 2 | Inputs defined (§2) | ☐ |
| 3 | Knowledge resolution lifecycle defined (§3) | ☐ |
| 4 | Knowledge need assessment defined (§4) | ☐ |
| 5 | Retrieval intent defined (§5) | ☐ |
| 6 | Knowledge domains defined (§6) | ☐ |
| 7 | Knowledge Resolution Package defined (§7) | ☐ |
| 8 | Evidence validation defined (§8) | ☐ |
| 9 | Conflict handling defined (§9) | ☐ |
| 10 | Confidence behaviour defined (§10) | ☐ |
| 11 | Explainability defined (§11) | ☐ |
| 12 | Failure / degrade handling defined (§12) | ☐ |
| 13 | Downstream contracts defined (§13) | ☐ |
| 14 | Engineering constraints defined (§14) | ☐ |
| 15 | Confirmed: ARS primacy + no requirement invention | ☐ |

**Specification completeness:** Items 1–15 are defined by this document. Coding still requires Product/Architect authorization and Spine readiness.

---

## 17. Document Control

| Field | Value |
|-------|-------|
| **Version** | 1.0 |
| **Status** | Approved engineering specification (no code) |
| **Owner** | Enterprise Knowledge Architect / Principal AI Engineer / Principal QA Architect |
| **Dependencies** | ADRs 0004–0005, 0008–0012, 0013–0015; prior engine eng specs |
| **Related ADRs** | Consumes primarily 0005, 0004, 0008 — **creates no new ADR** |
| **Last updated** | 2026-07-25 |

### Change History

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-07-25 | Initial Knowledge Resolution Engine Specification |

---

*End of Knowledge Resolution Engine Specification.*
