# AI Reasoning Architecture — ATI Brain Blueprint

**Document ID:** ATI-ARCH-REASONING-001  
**Status:** Approved architecture (design only — no implementation)  
**Product:** AI QA Intelligence Platform (ATI v2)  
**Audience:** Chief Architect, Implementation Engineer, Product Owner, QA Architects  
**Depends on:** [ARCHITECTURE.md](./ARCHITECTURE.md), [CANONICAL_TERMINOLOGY.md](./CANONICAL_TERMINOLOGY.md), [AI_DEVELOPMENT_CHARTER.md](../standards/AI_DEVELOPMENT_CHARTER.md)  
**Terminology:** ADR 0010 — Knowledge Intake entry; Approved Requirements Source authority for generation  
**Orchestration:** [KNOWLEDGE_INTAKE_AND_WORKFLOW_ORCHESTRATION_ARCHITECTURE.md](./KNOWLEDGE_INTAKE_AND_WORKFLOW_ORCHESTRATION_ARCHITECTURE.md) (ADR 0011)  
**Last updated:** 2026-07-25

---

## 0. Purpose and Scope

This document is the permanent blueprint for **how ATI thinks** before it produces QA artifacts.

It defines:

- The end-to-end **AI Reasoning Pipeline**
- Responsibilities of each **AI Engine**
- The canonical **Requirement Object**
- The **Traceability Model**
- Global **Reasoning Rules**
- The conceptual **Confidence Model**
- The **Self-Review Strategy**
- **Extensibility** for future engines

### Explicitly out of scope

- Application code
- HTTP/GraphQL APIs
- Database tables / physical schema
- Prompt text or prompt packs
- Provider-specific SDK usage
- UI pages and workflows

### Foundational statements

1. **ATI starts with Knowledge Intake**, not with an assumed single FDD. An FDD is one supported Knowledge Input.
2. **ATI must never generate test cases directly from a raw Knowledge Input** (including a raw FDD/PRD/SRS) without reasoning stages.
3. **Reasoning precedes generation** at every stage that emits artifacts.
4. For **requirement analysis, scenario generation, and test case generation**, the **Approved Requirements Source** (FDD, PRD, SRS, or equivalent) is the authoritative source of truth. Supporting Knowledge Inputs (historical docs, transcripts, cloud refs, product docs, AI-derived knowledge, etc.) augment and **must never override or invent requirements**.
5. **Engines are provider-independent**; any LLM is an interchangeable execution substrate behind ports.
6. **Unknown remains unknown**; invention of functionality is an architectural defect.

**Senior QA cognition standard:** Heuristics, question library, coverage dimensions, test design strategy, and self-evaluation are defined in [QA_INTELLIGENCE_FRAMEWORK.md](./QA_INTELLIGENCE_FRAMEWORK.md) (ADR 0007). Engines operationalize that framework; they do not replace it with ad hoc prompting.

**Decision governance standard:** Every significant engine judgment is an evidence-based, explainable, auditable Decision per [AI_DECISION_AND_EVIDENCE_FRAMEWORK.md](./AI_DECISION_AND_EVIDENCE_FRAMEWORK.md) (ADR 0008). LLM outputs without Decision Records and Evidence Traces are non-conformant.

**Operational ownership (harmonized):** Knowledge Intake, classification, Approved Requirements Source **designation**, workflow routing, pause/resume, and long-running orchestration are owned by [Knowledge Intake & Workflow Orchestration Architecture](./KNOWLEDGE_INTAKE_AND_WORKFLOW_ORCHESTRATION_ARCHITECTURE.md) (ADR 0011). This Brain document **consumes** designated Intake outputs and Document Bundles; it does **not** own Intake entry or role designation.

---

## 1. Overall AI Reasoning Pipeline

### 1.1 Pipeline overview

```
Knowledge Intake (owned by Orchestration Architecture — ADR 0011)
        │
        ▼
Designated Knowledge Inputs handed to Brain
  (Approved Requirements Source when designated by Intake:
   FDD / PRD / SRS / equivalent
   + Supporting Knowledge Inputs)
        │
        ▼
[1] Requirement Understanding
        │
        ▼
[2] Requirement Validation
        │
        ▼
[3] Requirement Knowledge Graph
        │
        ▼
[4] Scenario Reasoning
        │
        ▼
[5] Test Case Reasoning
        │
        ▼
[6] QA Review
        │
        ▼
[7] Coverage Validation
        │
        ▼
[8] Final Output (reasoned, reviewed, traceable package)
```

Supporting engines operate **across** stages (Document Engine prepares machine-usable bundles from **already intaken** Knowledge Inputs; Knowledge Engine on demand for supporting inputs; Learning Engine after validated outcomes). They do not shortcut the pipeline and do not replace Orchestration Intake ownership.

**Generation authority:** Stages 1–5 that assert product behavior require a designated **Approved Requirements Source** (designation owned by Intake/Orchestration). Supporting Knowledge Inputs may inform analysis but cannot authorize new requirements.

### 1.2 Stage catalog

Each stage produces a **Reasoning Artifact** with: content, evidence links, confidence, validation status, and lineage to prior stages.

---

### Stage 1 — Requirement Understanding

| Aspect | Definition |
|--------|------------|
| **Purpose** | Transform the **Approved Requirements Source** (and only supporting context as labeled) into a structured, evidence-backed understanding of what the feature is and is not. |
| **Inputs** | Knowledge Intake bundle; versioned Approved Requirements Source (FDD/PRD/SRS/equivalent); optional supporting Knowledge Inputs; glossary; prior Requirement Object versions (for delta understanding). |
| **Outputs** | Draft **Requirement Object** (canonical logical model); evidence map (section/span → claim); explicit Ambiguities and Assumptions lists; understanding confidence. |
| **Responsibilities** | Extract functional/non-functional intent from the Approved Requirements Source; identify actors, workflows, rules, permissions, validations, UI, APIs, data entities; separate explicit statements from inferred candidates (inferences must be marked); never promote supporting inputs to requirements. |
| **Validation** | Every claim tagged `explicit` or `inferred`; every `explicit` claim has evidence pointers into the Approved Requirements Source; no silent invention; schema conformance of Requirement Object. |
| **Confidence** | Aggregated from claim-level confidence, evidence density, ambiguity count/severity, and structural completeness of the Approved Requirements Source. |
| **Failure handling** | If Approved Requirements Source unreadable/incomplete → halt with `DOCUMENT_INSUFFICIENT` / `REQUIREMENTS_SOURCE_INSUFFICIENT`; if critical sections missing → emit partial Requirement Object with `blocked` status and clarifications — do not proceed to Scenario Reasoning. |

---

### Stage 2 — Requirement Validation

| Aspect | Definition |
|--------|------------|
| **Purpose** | Challenge the understanding for consistency, completeness, and testability before any scenario thinking. |
| **Inputs** | Draft Requirement Object; Approved Requirements Source evidence map; optional supporting Knowledge hits. |
| **Outputs** | Validated Requirement Object; validation findings (defects, gaps, contradictions); clarification questions; validation confidence; gate decision (`pass` / `pass_with_warnings` / `fail`). |
| **Responsibilities** | Detect contradictions; detect untestable requirements; detect missing actors/permissions/error paths where workflows imply them; flag NFR measurability gaps; never “fix” the Approved Requirements Source by inventing missing product behavior. |
| **Validation** | Findings must cite evidence or the absence of evidence; severity taxonomy applied; gate policy enforced. |
| **Confidence** | Derived from finding severity profile and residual ambiguity after validation. |
| **Failure handling** | `fail` gate → stop before Knowledge Graph finalization for downstream use; return findings to human/product loop. Warnings may proceed only if policy allows and ambiguities remain marked. |

---

### Stage 3 — Requirement Knowledge Graph

| Aspect | Definition |
|--------|------------|
| **Purpose** | Represent validated requirements as a graph of nodes and relations to support reasoning, coverage, and impact analysis — still FDD-anchored. |
| **Inputs** | Validated Requirement Object; evidence map. |
| **Outputs** | Requirement Knowledge Graph (RKG): nodes (requirements, rules, actors, steps, entities, APIs, UI, risks…); edges (depends_on, constrains, triggers, authenticates, validates, produces, consumes…); graph confidence; unresolved nodes marked `unknown`. |
| **Responsibilities** | Normalize identifiers; preserve trace links to Requirement Object fields and FDD evidence; expose queryable structure for later engines; never import external knowledge as authoritative nodes that contradict FDD. |
| **Validation** | No orphan critical nodes without evidence class; edge types from controlled vocabulary; graph passes integrity checks (e.g., workflow steps ordered where claimed). |
| **Confidence** | Completeness of relations among explicit requirements; proportion of `unknown` nodes; consistency with Validation stage findings. |
| **Failure handling** | Graph integrity failure → regenerate from Requirement Object or halt; never invent edges to “make the graph pretty.” |

---

### Stage 4 — Scenario Reasoning

| Aspect | Definition |
|--------|------------|
| **Purpose** | Reason about *what should be tested* as scenarios (behaviors, journeys, conditions) — not yet detailed test cases. |
| **Inputs** | Validated Requirement Object; RKG; validation findings (risks/gaps); optional knowledge (patterns only, non-authoritative). |
| **Outputs** | Scenario Set: scenarios with type (happy, negative, boundary, security, recovery, audit, integration…); preconditions; actors; linked requirement IDs; rationale; scenario confidence. |
| **Responsibilities** | Derive scenarios only from requirements/RKG; ensure multi-requirement coverage where behaviors compose; record why each scenario exists; mark areas that cannot be scenarized due to unknowns. |
| **Validation** | **Every scenario maps to ≥1 requirement**; no scenario without rationale; duplicate detection; type taxonomy compliance. |
| **Confidence** | Requirement coverage of scenario set; clarity of preconditions; residual unknowns. |
| **Failure handling** | If requirements insufficient for meaningful scenarios → return `SCENARIO_BLOCKED` with clarification needs; do not fabricate scenarios to force progress. |

---

### Stage 5 — Test Case Reasoning

| Aspect | Definition |
|--------|------------|
| **Purpose** | Reason about *how to verify* each scenario through test cases — still reasoning artifacts, not execution scripts. |
| **Inputs** | Scenario Set; Requirement Object; RKG. |
| **Outputs** | Test Case Set: cases with steps/expectations at logical level; data ideas (not invented business facts); linked scenario IDs; linked requirement IDs (via scenarios); case confidence. |
| **Responsibilities** | Expand scenarios into verifiable cases; include positive/negative/boundary where scenario demands; preserve permission, validation, and audit checks implied by requirements; never add product features absent from requirements. |
| **Validation** | **Every test case maps to exactly one primary scenario** (additional related scenarios allowed as secondary links); steps must be verifiable or marked `unverifiable_pending_clarification`; no orphan cases. |
| **Confidence** | Step verifiability; alignment to scenario intent; evidence strength of expected results. |
| **Failure handling** | Scenario too vague → emit blocked cases + questions; do not invent expected results that are not evidenced. |

---

### Stage 6 — QA Review

| Aspect | Definition |
|--------|------------|
| **Purpose** | Independent reasoning pass that critiques understanding, scenarios, and test cases against QA architect standards *before* user-facing finalization. |
| **Inputs** | Requirement Object; RKG; Scenario Set; Test Case Set; prior stage confidences/findings. |
| **Outputs** | Review Report: defects, risks, improvement directives; items to add/revise/remove; review confidence; gate (`ready` / `revise` / `blocked`). |
| **Responsibilities** | Execute the Review Strategy (§7); prefer evidence; escalate contradictions to FDD; never silently rewrite requirements. |
| **Validation** | Review checklist completeness; every review finding classified and linked to artifacts. |
| **Confidence** | Breadth of checklist coverage achieved; severity of open findings. |
| **Failure handling** | `revise` → loop back to the earliest deficient stage (not always to Test Case Reasoning); `blocked` → human intervention required. |

---

### Stage 7 — Coverage Validation

| Aspect | Definition |
|--------|------------|
| **Purpose** | Quantitatively and qualitatively prove that scenarios/cases cover the requirement graph dimensions that matter for release confidence. |
| **Inputs** | RKG; Scenario Set; Test Case Set; Review Report; coverage policy (dimension weights — policy, not code here). |
| **Outputs** | Coverage Report: requirement coverage, scenario-type coverage, risk coverage, permission/validation/workflow/integration/recovery/audit gaps; coverage confidence; gate. |
| **Responsibilities** | Map requirements ↔ scenarios ↔ cases; detect uncovered nodes/edges of testing significance; distinguish “intentionally out of scope” (must be explicit) from “missed.” |
| **Validation** | Trace matrix integrity; no false “covered” without linked artifacts; unknowns cannot count as covered. |
| **Confidence** | Weighted completeness across mandatory dimensions; residual high-risk uncovered items. |
| **Failure handling** | Below policy threshold → return to Scenario and/or Test Case Reasoning with targeted gap list. |

---

### Stage 8 — Final Output

| Aspect | Definition |
|--------|------------|
| **Purpose** | Package a coherent, reviewed, traceable reasoning result for humans and downstream systems (automation prep, reporting — later phases). |
| **Inputs** | All prior artifacts that passed gates; lineage bundle; confidence rollup. |
| **Outputs** | **Final Reasoning Package**: Requirement Object (final); RKG snapshot; Scenario Set; Test Case Set; Review Report; Coverage Report; Trace Matrix; Ambiguity/Assumption registers; overall confidence; provenance (Approved Requirements Source identity/version, engine versions, model/provider ids when executed, timestamps). |
| **Responsibilities** | Ensure immutability of the released package version; surface unknowns honestly; provide navigation of lineage; never strip lineage to “simplify” output. |
| **Validation** | Package completeness checklist; all mandatory gates green or explicitly waived by Product Owner policy; provenance present. |
| **Confidence** | Roll-up per Confidence Model (§6). |
| **Failure handling** | Incomplete package → do not publish as Final; emit Draft with blockers. |

---

### 1.3 Hard sequencing rules

1. No stage may consume outputs of a later stage.
2. Scenario Reasoning **requires** Validation gate ≠ `fail`.
3. Test Case Reasoning **requires** Scenario Set with valid requirement links.
4. Final Output **requires** QA Review and Coverage Validation gates acceptable under policy.
5. Supporting Knowledge Input retrieval may assist stages 1–5 but **cannot** authorize new product behavior.

---

## 2. AI Engines

Engines are **logical reasoning components** with single responsibility. They are invoked by the pipeline orchestrator. Provider calls (if any) occur only through the platform AI Port; engines never bind to a vendor.

### 2.1 Engine map to pipeline

| Engine | Primary stages |
|--------|----------------|
| Document Engine | Pre-stage / Stage 1 intake |
| Requirement Understanding Engine | Stage 1 |
| Requirement Validation Engine | Stage 2 |
| Knowledge Engine | Cross-cutting (on demand) |
| Scenario Reasoning Engine | Stage 4 |
| Test Case Reasoning Engine | Stage 5 |
| QA Review Engine | Stage 6 |
| Coverage Engine | Stage 7 |
| Learning Engine | Post-final / continuous improvement (non-authoritative) |

---

### 2.2 Document Engine

| Field | Definition |
|-------|------------|
| **Purpose** | Make each **already intaken** Knowledge Input (including an Approved Requirements Source such as FDD/PRD/SRS) machine-usable without changing its meaning. Invoked under Orchestration; does **not** own Knowledge Intake entry or Approved Requirements Source designation. |
| **Responsibilities** | Normalize structure; extract raw spans; detect document type/quality; preserve version identity; carry forward Intake-assigned role labels (`approved_requirements_source` vs `supporting`); produce Document Bundle(s). May emit parse/quality signals that Inform Intake classification — **role designation authority remains with Orchestration**. |
| **Inputs** | Intake-registered content + source metadata (name, version, checksum, origin, input type, Intake role designation when present). |
| **Outputs** | Document Bundle: normalized text/structure, section index, quality signals, parse confidence, Intake role label (carried forward). |
| **Validation** | Checksum integrity; non-empty content; language/format supported; version metadata present; for generation paths, Approved Requirements Source designation must already be present from Intake. |
| **Dependencies** | Knowledge Intake & Workflow Orchestration (entry/designation); storage port; optional format parsers (adapters). No Knowledge Engine authority over requirements. |
| **Confidence Score** | Document parse quality + metadata completeness. |
| **Failure Recovery** | Retry parse with alternate adapter; if still failing → `DOCUMENT_INSUFFICIENT`; do not guess content; do not invent role designation. |

---

### 2.3 Requirement Understanding Engine

| Field | Definition |
|-------|------------|
| **Purpose** | Build the draft Requirement Object from the evidenced **Approved Requirements Source**. |
| **Responsibilities** | Claim extraction; classification into Requirement Object facets; evidence mapping; ambiguity/assumption capture; inference labeling; keep supporting Knowledge Inputs labeled non-authoritative. |
| **Inputs** | Document Bundle for Approved Requirements Source; optional supporting bundles; optional prior Requirement Object (diff mode). |
| **Outputs** | Draft Requirement Object; Evidence Map; Understanding Notes. |
| **Validation** | Schema validity; evidence for explicit claims on the Approved Requirements Source; inference flags; no untagged inventions. |
| **Dependencies** | Document Engine bundles from Intake-orchestrated handoff; AI Reasoning Port; optional Knowledge Engine (read-only, supporting only). |
| **Confidence Score** | Claim-level scores rolled up (§6). |
| **Failure Recovery** | Partial object + blockers; re-run on clarified Approved Requirements Source; never fill gaps with invented features. |

---

### 2.4 Requirement Validation Engine

| Field | Definition |
|-------|------------|
| **Purpose** | Assure the Requirement Object is consistent, complete enough to test, and honest about unknowns. |
| **Responsibilities** | Contradiction detection; testability assessment; completeness heuristics against declared workflows; produce findings and gate. |
| **Inputs** | Draft Requirement Object; Evidence Map; Document Bundle. |
| **Outputs** | Validated Requirement Object; Validation Findings; Clarification Questions; gate. |
| **Validation** | Finding quality (cited); severity assigned; gate deterministic given policy. |
| **Dependencies** | Understanding Engine; optional Knowledge Engine for “common QA completeness patterns” — not product facts. |
| **Confidence Score** | Inverse to open critical findings + ambiguity burden. |
| **Failure Recovery** | Fail closed on critical contradictions; request human clarification; allow warning-path only per policy. |

---

### 2.5 Knowledge Engine

| Field | Definition |
|-------|------------|
| **Purpose** | Retrieve **supporting** Knowledge Inputs / EKB items to improve reasoning quality without overriding the Approved Requirements Source. |
| **Responsibilities** | Query knowledge repositories; rank relevance; label all results as `augmenting`; detect conflicts with the Approved Requirements Source and surface them as findings (Approved Requirements Source wins). |
| **Inputs** | Query context from a calling engine; access policies; repository indexes. |
| **Outputs** | Knowledge Hits (content, source, timestamp, relevance, conflict flags). |
| **Validation** | Source attribution mandatory; conflict with Approved Requirements Source must not silently win; PII/policy filters applied. |
| **Dependencies** | Search/knowledge ports; never writes authoritative requirements. |
| **Confidence Score** | Relevance × source trust × freshness × non-conflict with Approved Requirements Source. |
| **Failure Recovery** | On knowledge outage → continue **Approved Requirements Source–only** with lowered confidence and `knowledge_unavailable`. |

**Hard rule:** Supporting knowledge never becomes a Requirement Object fact unless the Approved Requirements Source (or Product Owner Clarification) authorizes it.

**System of record:** Durable knowledge domains, hierarchy, lifecycle, retrieval policy, and SharePoint strategy are defined in [KNOWLEDGE_ARCHITECTURE.md](./KNOWLEDGE_ARCHITECTURE.md) (ADR 0005). This engine is the reasoning-side facade over that Enterprise Knowledge Base — not an LLM memory store. See also [CANONICAL_TERMINOLOGY.md](./CANONICAL_TERMINOLOGY.md).

---

### 2.6 Scenario Reasoning Engine

| Field | Definition |
|-------|------------|
| **Purpose** | Derive a minimal-sufficient set of test scenarios from validated requirements and the RKG. |
| **Responsibilities** | Scenario derivation; taxonomy tagging; requirement linkage; rationale; deduplication; unknown-aware blocking. |
| **Inputs** | Validated Requirement Object; RKG; Validation Findings; optional Knowledge Hits (patterns). |
| **Outputs** | Scenario Set with lineage. |
| **Validation** | ≥1 requirement link per scenario; rationale present; taxonomy valid; duplicates collapsed. |
| **Dependencies** | Validation + RKG builders; AI Reasoning Port. |
| **Confidence Score** | Coverage of high-priority requirement nodes + clarity of scenario intent. |
| **Failure Recovery** | Emit gap-oriented clarification pack; do not invent journeys. |

---

### 2.7 Test Case Reasoning Engine

| Field | Definition |
|-------|------------|
| **Purpose** | Derive logical test cases that verify scenarios. |
| **Responsibilities** | Case expansion; expected result grounding; data parameterization ideas; secondary links; mark unverifiable steps. |
| **Inputs** | Scenario Set; Requirement Object; RKG. |
| **Outputs** | Test Case Set with lineage to scenarios (and transitively requirements). |
| **Validation** | Primary scenario link mandatory; expected results evidenced or marked unknown; no feature invention. |
| **Dependencies** | Scenario Reasoning Engine; AI Reasoning Port. |
| **Confidence Score** | Verifiability of steps/expectations × scenario alignment. |
| **Failure Recovery** | Block cases needing clarification; request scenario refinement rather than inventing oracles. |

---

### 2.8 QA Review Engine

| Field | Definition |
|-------|------------|
| **Purpose** | Adversarial/self-critical QA architecture review of the reasoning chain. |
| **Responsibilities** | Execute §7 checklist; produce actionable findings; recommend earliest stage to rewind; gate readiness. |
| **Inputs** | Full intermediate package (requirements → cases). |
| **Outputs** | Review Report; revise directives; gate. |
| **Validation** | Checklist coverage recorded; findings linked to artifact IDs. |
| **Dependencies** | All upstream engines’ outputs; Coverage Engine may be consulted but Review remains distinct. |
| **Confidence Score** | Checklist completion × residual severity. |
| **Failure Recovery** | Force revise/blocked gates; never auto-publish. |

---

### 2.9 Coverage Engine

| Field | Definition |
|-------|------------|
| **Purpose** | Measure and explain coverage of requirements and critical QA dimensions. |
| **Responsibilities** | Build/verify trace matrix; compute dimension coverage; list actionable gaps; gate against policy thresholds. |
| **Inputs** | RKG; Scenario Set; Test Case Set; Review Report; Coverage Policy. |
| **Outputs** | Coverage Report; Trace Matrix; gap list; gate. |
| **Validation** | Matrix consistency with declared links; unknowns ≠ covered. |
| **Dependencies** | Traceability Model (§4); policy configuration port. |
| **Confidence Score** | Weighted dimension completeness. |
| **Failure Recovery** | Return structured gaps to Scenario/Test Case engines; escalate systemic FDD gaps to Validation. |

---

### 2.10 Learning Engine

| Field | Definition |
|-------|------------|
| **Purpose** | Improve future reasoning quality from **validated** human feedback and outcomes — without rewriting historical Approved Requirements Source truth. |
| **Responsibilities** | Capture feedback signals (accepted/rejected scenarios, corrected links, recurring gaps); propose pattern updates for Knowledge/Review heuristics; never auto-mutate past Final packages. |
| **Inputs** | Final packages; human review decisions; defect/execution outcomes (when available later); policy constraints. |
| **Outputs** | Learning Candidates (proposed heuristic/pattern updates); audit log of learning proposals. |
| **Validation** | Human (or governed) approval before promoting learning into Knowledge/Review policies; no silent product-fact learning that overrides the Approved Requirements Source. |
| **Dependencies** | Audit/event ports; Knowledge Engine (write path for approved patterns only). |
| **Confidence Score** | Statistical support × approval state × non-conflict with Approved Requirements Source primacy. |
| **Failure Recovery** | Discard unsafe proposals; quarantine conflicting learnings; continue operating on baseline rules. |

---

### 2.11 Cross-engine contracts

Every engine input/output must include:

- `artifactId`, `artifactType`, `schemaVersion`
- `approvedRequirementsSourceId`, `approvedRequirementsSourceVersion` (identity of the designated Approved Requirements Source Document — FDD/PRD/SRS/equivalent; not FDD-only)
- `featureVersionId` (when scoped to a Feature Version)
- `parentArtifactIds[]` (lineage)
- `confidence` (per §6 shape)
- `validationStatus`
- `provenance` (engineId, engineVersion, reasoningRunId; provider/model ids when an LLM was used)
- `unknowns[]` / `assumptions[]` as applicable

---

## 3. Canonical Requirement Object (Logical Model)

The **Requirement Object** is the structured source of truth **after analysis**, subordinate only to the versioned **Approved Requirements Source** that evidenced it. It is a logical model — not a database schema.

### 3.1 Root

```
RequirementObject
├── identity
│   ├── requirementObjectId
│   ├── schemaVersion
│   ├── approvedRequirementsSourceId
│   ├── approvedRequirementsSourceVersion
│   ├── featureVersionId
│   ├── revision
│   └── status                    # draft | validated | blocked | superseded
├── featureMetadata
├── functionalRequirements[]
├── nonFunctionalRequirements[]
├── businessRules[]
├── actors[]
├── workflows[]
├── permissions[]
├── validations[]
├── dependencies[]
├── uiComponents[]
├── apis[]
├── databaseEntities[]
├── risks[]
├── assumptions[]
├── ambiguities[]
├── evidenceMapping[]
├── confidence
└── provenance
```

### 3.2 Feature Metadata

Logical fields (illustrative, not physical columns):

- `featureName`, `featureCode` (if present in FDD)
- `summary` (evidenced)
- `scopeIn[]`, `scopeOut[]` (explicit only; otherwise `unknown`)
- `stakeholders[]` (if stated)
- `priority` / `releaseHints` (only if in FDD)
- `relatedFeatures[]` (stated dependencies/links)

### 3.3 Functional Requirements

Each item:

- `id` (stable within object revision)
- `statement`
- `priority` (if stated)
- `acceptanceHints[]` (only if evidenced)
- `linkedActorIds[]`, `linkedWorkflowIds[]`
- `evidenceRefs[]`
- `claimType` (`explicit` | `inferred`)
- `confidence`
- `status` (`clear` | `ambiguous` | `conflicting` | `untestable`)

### 3.4 Non-Functional Requirements

Each item:

- `id`, `category` (performance, security, reliability, usability, compliance, observability, …)
- `statement`
- `measurability` (`measurable` | `partial` | `not_measurable` | `unknown`)
- `evidenceRefs[]`, `claimType`, `confidence`, `status`

### 3.5 Business Rules

- `id`, `ruleStatement`, `appliesTo[]` (requirement/workflow/entity refs)
- `evidenceRefs[]`, `claimType`, `confidence`

### 3.6 Actors

- `id`, `name`, `type` (human, system, service, role)
- `responsibilities[]` (evidenced)
- `evidenceRefs[]`, `confidence`

### 3.7 Workflows

- `id`, `name`, `actorIds[]`
- `steps[]` (`stepId`, `action`, `order`, `evidenceRefs`)
- `alternateFlows[]`, `exceptionFlows[]` (only if evidenced; else ambiguity)
- `confidence`

### 3.8 Permissions

- `id`, `actorId` / `role`
- `action`, `resource`
- `condition` (if any)
- `evidenceRefs[]`, `confidence`
- Missing permissions implied by workflows → recorded under `ambiguities` or Validation findings — **not invented grants**.

### 3.9 Validations

- `id`, `target` (field/api/entity/step)
- `rule`, `errorBehavior` (if stated)
- `evidenceRefs[]`, `confidence`

### 3.10 Dependencies

- `id`, `dependencyType` (feature, system, data, vendor, prerequisite)
- `description`, `criticality` (if stated)
- `evidenceRefs[]`, `confidence`

### 3.11 UI Components

- `id`, `name`, `purpose`
- `behaviors[]`, `states[]` (evidenced only)
- `evidenceRefs[]`, `confidence`

### 3.12 APIs

- `id`, `name`/`operation`
- `purpose`, `inputs[]`, `outputs[]`, `errors[]` (as evidenced)
- `authn/authz notes` (as evidenced)
- `evidenceRefs[]`, `confidence`

### 3.13 Database Entities

- Logical entities/attributes/relationships **as described by the FDD** (conceptual — not physical DDL).
- `id`, `name`, `attributes[]`, `relationships[]`
- `evidenceRefs[]`, `confidence`

### 3.14 Risks

- `id`, `description`, `relatedIds[]`
- `source` (`fdd_stated` | `validation_detected`)
- `severity`, `confidence`

### 3.15 Assumptions

- `id`, `statement`, `whyNeeded`
- `impactIfWrong`, `status` (`open` | `accepted_by_human` | `rejected`)
- AI may propose assumptions but **must not treat them as facts**.

### 3.16 Ambiguities

- `id`, `description`, `locationRefs[]`
- `blocking` (`true` | `false`)
- `questionsForProductOwner[]`
- Blocking ambiguities prevent Scenario/Test progression per gate policy.

### 3.17 Evidence Mapping

- `claimRef` → `fddLocation` (section path, anchor, span hash, quote excerpt policy-compliant)
- `claimType`, `engineId`
- Enables audit: every important statement can be shown in the FDD.

### 3.18 Confidence (object-level)

See §6. Requirement Object carries:

- `overall`
- `byFacet` (functional, nfr, workflows, permissions, …)
- `drivers[]` (what raised/lowered score conceptually)

### 3.19 Authority rule

If Requirement Object and Approved Requirements Source appear to disagree, **Approved Requirements Source wins**; the object is defective and must be corrected. Supporting Knowledge Inputs never win.

---

## 4. Traceability Model

### 4.1 End-to-end verification chain (reasoning artifacts)

Aligned with [Domain Architecture](./DOMAIN_ARCHITECTURE.md) §4 and [Enterprise Data Architecture](./ENTERPRISE_DATA_ARCHITECTURE.md): the **primary verification chain** used by Brain reasoning does **not** place Release as a mandatory pipeline step.

```
Requirement
    ↓
Scenario
    ↓
Test Case
    ↓
Automation Asset
    ↓
Execution
    ↓
Defect
```

**Release** and **Report** attach **laterally** (Domain/EIM): e.g., Product → Release → (Feature Versions, Test Suites, Executions, Reports). Release is a business capability that may scope or package verification — not a required stage of every reasoning pipeline.

Every object in the primary verification chain carries:

- Stable `id`
- `approvedRequirementsSourceId` + `approvedRequirementsSourceVersion`
- `featureVersionId` (when applicable)
- `links[]` to immediate parents (and optionally materialized ancestors)
- `provenance`
- `confidence` (where applicable)
- `lifecycleStatus`

### 4.2 Link types (controlled vocabulary)

| From → To | Link meaning | Cardinality rule |
|-----------|--------------|------------------|
| Requirement → Scenario | requirement is verified by scenario | Scenario **must** have ≥1 Requirement |
| Scenario → Test Case | scenario is verified by test case | Test Case **must** have ≥1 Scenario (primary required) |
| Test Case → Automation Asset | case implemented by automation asset | Optional until Automation phase |
| Automation Asset → Execution | automation (or case) exercised in an execution | Optional until Execution phase |
| Execution → Defect | execution produced defect | Optional; defects may also link back to Requirement/Scenario/Case |
| Release ↔ Feature Version / Suite / Execution / Automation Asset | **lateral** scope/package links (Domain/EIM) | Not a mandatory reasoning-pipeline step |

### 4.3 Trace objects (logical)

**TraceLink**

- `linkId`, `fromType`, `fromId`, `toType`, `toId`
- `linkRelation` (e.g., `verified_by`, `implements`, `executed_in`, `found_in`)
- `createdByEngine` / `createdByUser`
- `evidence` (why linked)
- `confidence`

**TraceMatrix**

- Projection used by Coverage Engine and Final Output
- Rows: Requirements (and optionally RKG nodes)
- Columns: Scenarios / Test Cases / (later) Automation / Execution
- Cells: link presence + confidence + gap markers

### 4.4 Integrity invariants

1. No Scenario without Requirement link.
2. No Test Case without Scenario link.
3. Deleting/superseding a Requirement revision invalidates downstream artifacts pending re-reason (they become `stale` against the new Approved Requirements Source version).
4. External knowledge IDs may appear as `supportingEvidence` only — never as parent requirement substitutes.
5. Defects should preferably close the loop to Case/Scenario/Requirement for learning and coverage of risk.

### 4.5 Future stages without redesign

Automation, Release, Execution, and Defect objects are **first-class citizens of the model now**, even if engines for them appear in later product phases. The Reasoning Architecture reserves their link slots so the brain does not need structural rewrites later.

---

## 5. AI Reasoning Rules (Global)

These rules bind every engine and stage.

### 5.1 Truth and invention

1. **Never invent functionality** not evidenced by the Approved Requirements Source (or explicitly accepted human Clarification).
2. **Prefer explicit evidence** over inference.
3. **Inferences must be labeled** and may not silently become requirements.
4. **Unknown information must remain unknown** — represented as Ambiguities/Unknowns, never filled with plausible fiction.
5. **When uncertain, ask or block** — do not guess product behavior.

### 5.2 Knowledge usage

6. **Use supporting Knowledge Inputs only when necessary** (patterns, glossary, prior approved heuristics, contextual history).
7. **Supporting knowledge augments; Approved Requirements Source overrides.**
8. Conflicts between supporting knowledge and the Approved Requirements Source become Validation/Review findings, not silent merges.

### 5.3 Traceability

9. **Every scenario must map to one or more requirements.**
10. **Every test case must map to a scenario.**
11. **Every important claim should be evidence-mapped** where feasible.
12. Downstream artifacts inherit Approved Requirements Source identity/version (and Feature Version identity when scoped).

### 5.4 Pipeline discipline

13. **Never jump from Knowledge Intake / raw Approved Requirements Source to test cases.**
14. Do not skip Validation before Scenario Reasoning.
15. Do not publish Final Output without Review + Coverage gates (unless Product Owner waiver is an explicit input artifact).
16. Prefer rewind to the **earliest** broken stage.
17. Platform entry is **Knowledge Intake**; generation authority remains the **Approved Requirements Source**.

### 5.5 Provider independence

18. Engines define **reasoning contracts**, not vendor prompts.
19. Model/provider is provenance metadata, not architecture.
20. Switching providers must not change artifact schemas or trace rules.

### 5.6 Professional QA posture

20. Optimize for **defect discovery power** and **honest coverage**, not for impressive volume of cases.
21. Prefer fewer well-traced scenarios/cases over many unlinked ones.
22. Negative, boundary, permission, recovery, integration, and audit dimensions are first-class concerns when requirements imply them — and explicit gaps when they do not.

---

## 6. Confidence Model (Conceptual)

### 6.1 Purpose

Confidence communicates **how much the platform trusts a reasoning artifact** for decision-making. It is not a marketing score and not a substitute for human judgment.

### 6.2 Score shape

Each artifact carries a confidence object conceptually containing:

- `score` — ordinal or normalized conceptual level (e.g., bands: `very_low`, `low`, `medium`, `high`, `very_high`) plus optional numeric for ordering
- `band` — human-readable band
- `drivers[]` — factors that raised or lowered confidence
- `unknownPenalty` — effect of unresolved ambiguities
- `evidenceStrength` — quality/density of FDD evidence
- `consistency` — agreement across related artifacts
- `reviewPressure` — open review findings impacting trust
- `method` — which confidence profile produced it (versioned)

No mathematical formula is prescribed here; implementations must realize this conceptual model transparently and version the method.

### 6.3 Factor categories (conceptual inputs)

| Factor | Meaning |
|--------|---------|
| Evidence strength | Explicit quotes/locations vs weak paraphrase |
| Claim type mix | High share of inferences lowers score |
| Ambiguity burden | Blocking unknowns heavily penalize |
| Internal consistency | Contradictions collapse confidence |
| Graph completeness | Missing relations among stated parts |
| Trace completeness | Missing required links |
| Review findings | Open high-severity findings reduce score |
| Knowledge reliance | Heavy dependence on non-FDD knowledge reduces score unless merely stylistic |
| Provider agreement (optional) | Multi-model consensus may raise confidence; disagreement lowers — never invents truth |

### 6.4 Aggregation principles

1. Parent package confidence cannot exceed the confidence of its **blocking** constituents.
2. A single critical contradiction can force overall band to `low` / `very_low` regardless of volume of good claims.
3. Coverage confidence is separate from understanding confidence but both appear in Final Output.
4. Confidence never converts unknowns into knowns.

### 6.5 Use of confidence in gates

Gates may combine validation status + confidence bands + policy thresholds. Example conceptual policy: Scenario Reasoning may start only if Validation gate ≠ fail and Requirement Object confidence ≥ configured minimum **or** Product Owner accepts a waiver artifact.

---

## 7. Review Strategy

The QA Review Engine critiques the chain before Final Output. Review is **reasoning about quality**, not cosmetic rewriting.

### 7.1 Mandatory review dimensions

| Check | Intent |
|-------|--------|
| **Coverage** | Are requirement nodes of testing significance addressed by scenarios/cases? |
| **Duplicates** | Are scenarios/cases redundant without added defect-discovery value? |
| **Missing validations** | Do workflows/APIs/UI implying validation lack validation-oriented scenarios/cases? |
| **Missing permissions** | Are authz boundaries untested where actors/actions exist? |
| **Missing workflows** | Are stated primary/alternate/exception flows omitted? |
| **Missing boundary cases** | Are limits/edges ignored where data/rules imply them? |
| **Missing negative cases** | Are failure paths absent where errors/rules exist? |
| **Missing integrations** | Are dependency/API interactions unaddressed? |
| **Missing recovery** | Are retry/compensating/failover behaviors unaddressed when requirements imply reliability? |
| **Missing audit** | Are audit/logging/compliance observables untested when stated? |
| **Requirement traceability** | Does every scenario/case satisfy link invariants? |

### 7.2 Review operating principles

1. Every finding cites artifact IDs and, where relevant, FDD evidence or explicit absence.
2. Findings classify severity (`blocker`, `major`, `minor`, `info`).
3. Review proposes **rewind target stage**, not only local edits.
4. Review must not invent product requirements to “complete” the checklist; it records **gaps**.
5. Human Product Owner decisions can accept residual risk; acceptance becomes an input artifact affecting gates — AI does not silently accept.

### 7.3 Relationship to Coverage Engine

- **Review** = qualitative QA architect judgment dimensions + consistency/trace critique.
- **Coverage** = structured matrix and threshold measurement.
- Both are required; neither replaces the other.

---

## 8. Extensibility

### 8.1 Engine plugin model

Future engines register with the Reasoning Orchestrator via a stable contract:

**Engine Manifest (logical)**

- `engineId`, `engineVersion`
- `capability` (e.g., `impact-reasoning`, `accessibility-reasoning`)
- `stageHooks` (before/after which pipeline stages)
- `inputTypes[]`, `outputTypes[]`
- `idempotency` semantics
- `providerRequirements` (none | any-llm | none-llm)
- `gateEffects` (whether it can block Final Output)

New engines **must not** require changes to existing artifact schemas except via versioned additive fields and ADRs.

### 8.2 Pipeline extension patterns

| Pattern | When to use |
|---------|-------------|
| **Insert stage** | New mandatory reasoning phase (ADR required) |
| **Parallel specialist engine** | Optional enrichment (e.g., security deep-dive) feeding Review/Coverage |
| **Post-final consumer** | Automation Prep, Reporting — consume Final Package without altering brain contracts |
| **Replace adapter** | New LLM provider — infrastructure only |

### 8.3 Schema evolution

- Artifact `schemaVersion` is mandatory.
- Additive optional fields preferred.
- Breaking changes require ADR + dual-read period conceptually.
- Learning Engine promotions cannot break schemas.

### 8.4 Provider extensibility

```
Engine
  → ReasoningPort.completeReasoning(taskContract)
      → ProviderAdapter (OpenAI | Claude | Gemini | Local | Future)
```

Task contracts speak in **domain artifacts + reasoning goals**, never in vendor message formats inside the engine layer.

### 8.5 What “without changing the architecture” means

Allowed without architecture redesign:

- New provider adapters
- New optional specialist engines with manifests
- New review checklist items (versioned)
- New coverage dimensions (policy versioned)
- New downstream consumers of Final Package

Requires architecture review / ADR:

- Reordering mandatory stages
- Allowing FDD override by knowledge
- Generating test cases directly from FDD
- Removing trace invariants
- Collapsing Review and Coverage into an opaque single step without contracts

---

## 9. Orchestration View (Logical)

```
Workflow Orchestrator (ADR 0011 — owns Intake, designation, workflow modes, HITL pause/resume)
        │ hands designated Document Bundles / structured objects to Brain
        ▼
ReasoningOrchestrator (Brain — cognitive stage sequencing only)
├── consumes designated Approved Requirements Source + supporting inputs (does not designate roles)
├── runs Document Engine preparation on intaken content (parse/normalize; no Intake ownership)
├── runs Understanding → Validation → RKG build
├── enforces Brain gates (schemas, reason-before-generate, trace invariants)
├── runs Scenario → Test Case Reasoning
├── runs QA Review → Coverage
├── publishes Final Reasoning Package (or Draft+Blockers) back to the Workflow Orchestrator
├── emits domain events (e.g., ReasoningCompleted, ReasoningBlocked)
└── records full lineage + provenance
```

**Ownership:** Knowledge Intake entry and Approved Requirements Source designation remain with [Knowledge Intake & Workflow Orchestration Architecture](./KNOWLEDGE_INTAKE_AND_WORKFLOW_ORCHESTRATION_ARCHITECTURE.md). The Brain `ReasoningOrchestrator` sequences **cognitive engines only**.

Brain stage order is deterministic; engine internals may use LLMs non-deterministically, but **outputs must still satisfy schemas, rules, and trace invariants**.

---

## 10. Architectural Risks and Mitigations

| Risk | Mitigation |
|------|------------|
| LLM invents features | Explicit claim typing; evidence mapping; Validation/Review; unknown preservation |
| Knowledge contaminates truth | Augment-only policy; conflict findings; Approved Requirements Source primacy |
| Confidence theater | Drivers required; blocking contradictions dominate rollup |
| Pipeline shortcuts under schedule pressure | Charter + gates; Final Package refused without Review/Coverage |
| Provider lock-in | Ports/adapters; vendor-free engine contracts |
| Trace drift over versions | Approved Requirements Source identity/version on all artifacts; stale detection on supersede |
| Over-production of low-value cases | Review duplicates dimension; quality over volume rule |

---

## 11. Alignment to Platform Foundation

| Foundation principle | How this blueprint upholds it |
|----------------------|-------------------------------|
| Knowledge Intake entry; Approved Requirements Source for generation | Requirement Object evidenced by approved spec; supporting knowledge cannot override |
| Reason before generate | Multi-stage pipeline; ban on raw-input→tests shortcut |
| Traceability | Primary verification chain + lateral Release/Report (Domain/EIM); invariants |
| AI provider independent | Engine/port separation |
| Modular / SOLID | One responsibility per engine |
| Extensible plugins | Engine manifests + additive schemas |
| Independently testable | Engines validated via contract tests with fakes at ReasoningPort |

---

## 12. Implementation Readiness (Not Authorization)

This document authorizes **design**. It does **not** authorize coding, APIs, tables, or prompts.

When implementation is later approved, expected order:

1. Domain types for Requirement Object, Scenario, Test Case, TraceLink (logical → code types)
2. Engine ports and orchestrator interfaces
3. Provider adapters
4. Persistence of artifacts + lineage
5. Prompt assets versioned separately under `/prompts` (still not truth)

---

## 13. Document Control

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-07-25 | Initial ATI Brain Reasoning Architecture blueprint |
| 1.1 | 2026-07-25 | ARB harmonization: Release lateral (Domain/EIM); Intake/ARS designation owned by Orchestration; `approvedRequirementsSourceId`/`Version` replaces `fddId`/`fddVersion` (no ADR decision change) |

---

*End of AI Reasoning Architecture.*
