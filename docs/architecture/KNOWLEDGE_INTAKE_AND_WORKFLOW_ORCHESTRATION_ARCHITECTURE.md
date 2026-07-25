# Knowledge Intake & Workflow Orchestration Architecture

**Document ID:** ATI-ARCH-ORCH-001  
**Status:** Approved architecture (design only — no implementation)  
**Product:** AI QA Intelligence Platform (ATI v2)  
**Audience:** Principal AI Platform Architect, Chief Architect, QA Architects, Implementation Engineer  
**Depends on:** [CANONICAL_TERMINOLOGY.md](./CANONICAL_TERMINOLOGY.md), [KNOWLEDGE_ARCHITECTURE.md](./KNOWLEDGE_ARCHITECTURE.md), [AI_REASONING_ARCHITECTURE.md](./AI_REASONING_ARCHITECTURE.md), [DOMAIN_ARCHITECTURE.md](./DOMAIN_ARCHITECTURE.md), [QA_INTELLIGENCE_FRAMEWORK.md](./QA_INTELLIGENCE_FRAMEWORK.md), [AI_DECISION_AND_EVIDENCE_FRAMEWORK.md](./AI_DECISION_AND_EVIDENCE_FRAMEWORK.md), [ENTERPRISE_DATA_ARCHITECTURE.md](./ENTERPRISE_DATA_ARCHITECTURE.md)  
**ADR:** [0011 — Knowledge Intake & Workflow Orchestration](../adr/0011-knowledge-intake-and-workflow-orchestration.md)  
**Terminology:** [ADR 0010](../adr/0010-knowledge-intake-terminology.md)  
**Last updated:** 2026-07-25

---

## 0. Purpose and Scope

This document is the **canonical operational / orchestration architecture** for ATI.

It defines how ATI:

- Receives information (**Knowledge Intake**)
- Understands and classifies Knowledge Inputs
- Creates structured internal knowledge objects
- Routes work to the correct workflows
- Orchestrates AI engines and composed workflows
- Pauses, resumes, retries, recovers, and completes
- Involves humans when required
- Observes and governs long-running execution

### Critical principle

**ATI does not begin with a Feature Design Document.**  
**ATI begins with a Knowledge Intake.**

An FDD is **one** supported Knowledge Input. ATI must accept, understand, classify, and manage many knowledge types.

### Explicitly out of scope

- Code, APIs, UI, prompts  
- Database schemas  
- Implementation technology or AI provider selection  
- Redesign of Brain engines, Domain objects, or Evidence rules (this document **orchestrates** them)

### Alignment

| Concern | Owned by |
|---------|----------|
| What knowledge means / authority | Knowledge Architecture + Canonical Terminology |
| How Senior QA / Brain reasons | QA Intelligence + AI Reasoning Architecture |
| How decisions are evidenced | Decision & Evidence Framework |
| What business objects exist | Domain + EIM |
| **How work enters, routes, runs, pauses, resumes** | **This document** |
| How external systems are reached | [INTEGRATION_AND_EXTERNAL_SYSTEMS_ARCHITECTURE.md](./INTEGRATION_AND_EXTERNAL_SYSTEMS_ARCHITECTURE.md) (ADR 0012) |

---

## 1. Knowledge Intake Architecture

### 1.1 Universal entry point

**Knowledge Intake** is the sole canonical entry for external or internal content into ATI’s operational pipelines.

```
External / Enterprise Sources
        │
        ▼
┌─────────────────────────┐
│    Knowledge Intake     │  ← universal entry
└───────────┬─────────────┘
            │
            ▼
   Intake Bundle (logical)
            │
            ├── Classification
            ├── Structured Object Creation
            ├── Role Designation
            │     (Approved Requirements Source vs Supporting)
            └── Workflow Routing
```

There is **no** separate “FDD Upload” architecture. Uploading an FDD is **Knowledge Intake** of a Product Document classified as an Approved Requirements Source candidate (or confirmed Approved Requirements Source).

### 1.2 Intake Bundle (logical)

Every intake produces an **Intake Bundle** containing:

- Intake identity & timestamp  
- Source channel (manual upload, SharePoint sync, API import, connector, email ingest — conceptual channels only)  
- One or more **Knowledge Input Items** (raw references + Document Bundles)  
- Provisional metadata (product/feature hints if known)  
- Security classification / ACL projection  
- Requested **Execution Mode** (optional; else default by classification)  
- Correlation / reasoning-run identity seed  

### 1.3 Supported Knowledge Input families

#### Product Documents

- Feature Design Documents (FDD)  
- Product Requirement Documents (PRD)  
- Software Requirement Specifications (SRS)  
- Functional Specifications  
- Technical Design Documents  
- Architecture Documents  

#### Collaboration Knowledge

- Meeting transcripts  
- Customer discussions  
- Workshop notes  
- Teams/Slack conversations  
- Email threads  

#### QA Assets

- Existing Test Cases  
- Test Scenarios  
- Test Plans  
- Automation Reports  
- Regression Suites  
- Defect Reports  

#### Technical Assets

- API Specifications  
- Release Notes  
- Configuration Documents  
- Change Logs  
- User Guides  
- Internal Standards  

#### Enterprise Repositories

- SharePoint libraries/sites  
- Knowledge Base articles  
- Product Documentation portals  
- Cloud Documentation mirrors  

### 1.4 Intake processing stages (logical)

| Stage | Purpose |
|-------|---------|
| **Accept** | Register Intake Bundle; enforce tenancy/ACL |
| **Normalize** | Document Engine produces Document Bundle(s) without changing meaning |
| **Classify** | Assign knowledge class(es) (§2) |
| **Structure** | Create/update structured knowledge objects (§3) |
| **Designate roles** | Mark Approved Requirements Source vs Supporting for generation scope |
| **Validate intake** | Completeness, parse quality, classification confidence |
| **Route** | Select workflow(s) / execution mode (§4–6) |
| **Hand off** | Emit domain events; start orchestration |

### 1.5 Extensibility of input types

New Knowledge Input types register via **Input Type Manifest** (logical):

- `inputTypeId`, family, parsers allowed  
- default classification hints  
- default structured object mapping  
- whether eligible as Approved Requirements Source  
- default workflows / execution modes  

No redesign of Intake required to add types.

---

## 2. Knowledge Classification

Classification occurs **before** generation/reasoning workflows that depend on type-specific routing.

### 2.1 Classification outcomes

Each Knowledge Input Item receives one primary class and optional secondary tags:

| Class | Meaning |
|-------|---------|
| **Requirement Knowledge** | Specs describing what shall be built/tested (FDD/PRD/SRS/functional specs) |
| **Product Knowledge** | Cross-feature product capability / module context |
| **Release Knowledge** | Release notes, plans, inclusion signals |
| **Test Knowledge** | Scenarios, cases, plans, suites as assets |
| **Automation Knowledge** | Automation reports, framework notes, binder metadata |
| **Defect Knowledge** | Defect reports / curated patterns |
| **Cloud Knowledge** | Cloud/platform operational docs |
| **Operational Knowledge** | Config, change logs, runbooks |
| **Architecture Knowledge** | Architecture / TDD / system design docs |
| **Compliance Knowledge** | Standards, policy, regulatory materials |
| **Collaboration Insight** | Transcripts, workshops, chat/email threads |
| **API Knowledge** | API specifications / contracts |
| **Unknown / Mixed** | Needs human classification or multi-label split |

### 2.2 Classification principles

1. Classification is **evidence-based** (structure, metadata, source library, content signals) — not LLM “guessing” as sole authority.  
2. Low classification confidence → HITL classification checkpoint.  
3. Mixed documents may yield **multiple structured objects** or a split recommendation.  
4. Classification does **not** grant Approved Requirements Source status by itself.  
5. Supporting classes never become generation authority.

### 2.3 Role designation (orthogonal to class)

| Role | Meaning |
|------|---------|
| **Approved Requirements Source** | Designated authority for Requirements → Scenarios → Test Cases for a Feature Version |
| **Supporting Knowledge Input** | Augments only |
| **Asset Import** | Existing QA/automation/defect assets to reconcile, not regenerate blindly |
| **Sync Mirror** | Repository synchronization material pending publish rules |

An FDD classified as Requirement Knowledge may be designated Approved Requirements Source. A meeting transcript classified as Collaboration Insight is Supporting only.

---

## 3. Structured Knowledge Object Creation

Unstructured intake is transformed into **logical structured objects** (EIM/Domain aligned). No database structures here.

### 3.1 Object catalog (from intake)

| Structured Object | Typically from | Notes |
|-------------------|----------------|-------|
| **Requirement Object** | Approved Requirements Source | Brain Understanding output; generation authority path |
| **Product Knowledge Object** | Product docs / curated product knowledge | Supporting / EKB candidate |
| **Meeting Insight Object** | Transcripts, workshops, chats | Insights + action candidates; never silent requirements |
| **Release Object** | Release notes/plans | Release Information domain |
| **Test Asset Object** | Imported scenarios/cases/plans/suites | Reconciliation with Trace Links |
| **Defect Object** | Defect reports | Risk/history; not new Requirements |
| **API Knowledge Object** | API specs | Integration context |
| **Architecture Object** | Architecture/TDD docs | Constraints/context |
| **Knowledge Summary** | Any intake | Short governed summary for retrieval routing |
| **Document** | All intakes | EIM Document identity always created |

### 3.2 Transformation principles

1. Preserve provenance: structured object → Document version → Intake Bundle.  
2. Explicit vs inferred claims labeled (Decision & Evidence alignment).  
3. Ambiguities recorded; unknowns remain unknown.  
4. Supporting objects cannot rewrite Approved Requirements Source content.  
5. Existing Test/Defect assets import as **assets**, not as automatic new requirements.  
6. Structured objects are what workflows exchange — **not raw prompts**.

### 3.3 Creation modes

| Mode | Behavior |
|------|----------|
| **Derive** | Create new structured object from intake |
| **Enrich** | Add supporting facets to existing object |
| **Reconcile** | Match imported Test Asset / Defect to existing masters |
| **Propose** | Create Learning Candidate / draft Knowledge Item for approval |

---

## 4. Workflow Architecture

A **Workflow** is a governed business process with trigger, inputs, outputs, engines, HITL points, and completion criteria.

### 4.1 Knowledge Intake Workflow

| Field | Definition |
|-------|------------|
| **Purpose** | Accept, normalize, classify, structure, designate roles, route |
| **Trigger** | Manual intake, connector sync event, scheduled sync, import job |
| **Inputs** | Raw Knowledge Inputs + channel metadata |
| **Outputs** | Intake Bundle, Document(s), classifications, structured objects, routing plan |
| **Engines** | Document Engine; Classification capability; optional Knowledge Engine |
| **Human Review** | Low classification confidence; ACL/classification disputes; Approved Requirements Source designation when ambiguous |
| **Completion** | Bundle `routed` or `awaiting_human` / `failed_intake` |

---

### 4.2 Requirement Analysis Workflow

| Field | Definition |
|-------|------------|
| **Purpose** | Build/validate Requirement Object from Approved Requirements Source |
| **Trigger** | Intake routed with Requirement Knowledge + designated Approved Requirements Source; or explicit Execution Mode |
| **Inputs** | Approved Requirements Source; optional supporting objects |
| **Outputs** | Requirement Object; Ambiguities; Validation findings; Decision Records |
| **Engines** | Understanding; Validation; Knowledge (supporting); RKG build |
| **Human Review** | Blocking Ambiguities; conflicting specs; validation `fail` |
| **Completion** | Validation gate ≠ fail (or waived); Requirement Object version sealed for next workflow |

---

### 4.3 Knowledge Synchronization Workflow

| Field | Definition |
|-------|------------|
| **Purpose** | Sync enterprise repositories into ATI Documents / draft Knowledge |
| **Trigger** | Schedule, webhook/change token, manual sync |
| **Inputs** | Repository selectors, sync policy |
| **Outputs** | New/updated Documents; draft/proposed Knowledge Items; stale_source markers |
| **Engines** | Document Engine; Knowledge validation assists |
| **Human Review** | Publish approvals for product-fact knowledge |
| **Completion** | Sync cycle complete with audit; items in correct lifecycle states |

---

### 4.4 Knowledge Validation Workflow

| Field | Definition |
|-------|------------|
| **Purpose** | Validate Knowledge Items / structured objects for eligibility |
| **Trigger** | Pre-publish; conflict detection; scheduled freshness |
| **Inputs** | Knowledge Items / structured objects; Approved Requirements Source if in scope |
| **Outputs** | Validation findings; quarantine recommendations |
| **Engines** | Knowledge validation; Decision review checks |
| **Human Review** | Conflicts with Approved Requirements Source; classification errors |
| **Completion** | Items `validated` / `quarantined` / `returned` |

---

### 4.5 Scenario Generation Workflow

| Field | Definition |
|-------|------------|
| **Purpose** | Produce traced Scenarios from validated requirements |
| **Trigger** | After Requirement Analysis success; or Execution Mode Scenario Generation |
| **Inputs** | Validated Requirement Object; RKG; supporting knowledge (optional) |
| **Outputs** | Scenario Set; Decision Records; Trace Links |
| **Engines** | Scenario Reasoning; Knowledge (patterns); QA heuristics |
| **Human Review** | Low confidence clusters; merge disputes; invent-risk suppressions needing confirmation |
| **Completion** | Scenario Set ready for review/test-case workflow per policy |

---

### 4.6 Test Case Generation Workflow

| Field | Definition |
|-------|------------|
| **Purpose** | Expand Scenarios into Test Cases |
| **Trigger** | After Scenario Generation; or Execution Mode |
| **Inputs** | Scenario Set; Requirement Object; RKG |
| **Outputs** | Test Case Set; Trace Links; automation candidacy tags |
| **Engines** | Test Case Reasoning; Automation Analysis heuristics |
| **Human Review** | Unverifiable oracles; low confidence expansions |
| **Completion** | Cases ready for AI Review / Approval path |

---

### 4.7 AI Review Workflow

| Field | Definition |
|-------|------------|
| **Purpose** | Critique Reasoning Package / design set |
| **Trigger** | After generation; on-demand re-review |
| **Inputs** | Reasoning Package members |
| **Outputs** | AI Review; Findings; disposition |
| **Engines** | QA Review Engine; Decision review strategy |
| **Human Review** | Acknowledge disposition; accept/reject findings |
| **Completion** | Review `Completed` + acknowledgment recorded |

---

### 4.8 Coverage Validation Workflow

| Field | Definition |
|-------|------------|
| **Purpose** | Measure coverage sufficiency |
| **Trigger** | After AI Review or parallel to it per policy |
| **Inputs** | RKG; Scenarios; Cases; Coverage policy |
| **Outputs** | Coverage Assessment / Report; gaps |
| **Engines** | Coverage Engine |
| **Human Review** | Waivers for insufficient coverage |
| **Completion** | Sufficiency decision recorded |

---

### 4.9 Test Case Revalidation Workflow

| Field | Definition |
|-------|------------|
| **Purpose** | Re-check Cases after Approved Requirements Source / Requirement changes |
| **Trigger** | Feature Version supersede; Clarification accepted; Requirement revision |
| **Inputs** | Stale Cases/Scenarios; new Requirement Object |
| **Outputs** | Stale markers cleared or revise directives; Decision Records |
| **Engines** | Validation; Scenario/Test Case Reasoning (delta); Review |
| **Human Review** | Material oracle changes |
| **Completion** | Revalidation package published or revise loop |

---

### 4.10 Release Planning Workflow

| Field | Definition |
|-------|------------|
| **Purpose** | Assemble release scope and readiness plan |
| **Trigger** | Release created/activated; planning mode |
| **Inputs** | Release; Feature Versions; Suites; Coverage; open Findings |
| **Outputs** | Release plan artifacts; risk recommendations |
| **Engines** | Risk Assessment decisions; Coverage; Knowledge (release) |
| **Human Review** | Scope confirmation; risk acceptance |
| **Completion** | Release plan approved for Testing phase entry |

---

### 4.11 Impact Analysis Workflow

| Field | Definition |
|-------|------------|
| **Purpose** | Assess blast radius of change |
| **Trigger** | New Approved Requirements Source version; release planning; on-demand |
| **Inputs** | Feature delta; historical/supporting knowledge; defects |
| **Outputs** | Impact Analysis artifact; regression recommendations |
| **Engines** | Regression heuristics; Knowledge retrieval; Risk Assessment |
| **Human Review** | High-risk impact confirmation |
| **Completion** | Impact Analysis published |

---

### 4.12 Automation Preparation Workflow

| Field | Definition |
|-------|------------|
| **Purpose** | Prepare automation recommendations / binding readiness |
| **Trigger** | Approved Test Cases; automation mode |
| **Inputs** | Approved Cases; Automation Knowledge; existing Assets |
| **Outputs** | Automation Recommendations; candidate links (not silent Asset creation without policy) |
| **Engines** | Automation Analysis; Decision recommendations |
| **Human Review** | Feasibility disputes; binder approval |
| **Completion** | Recommendations acknowledged / Assets linked per Automation Management |

---

### 4.13 Documentation Generation Workflow

| Field | Definition |
|-------|------------|
| **Purpose** | Produce governed documentation outputs from sealed packages |
| **Trigger** | On-demand; release close; package publish |
| **Inputs** | Reasoning Package / Reports sources |
| **Outputs** | Generated Documents / Knowledge Summaries (draft→approve) |
| **Engines** | Documentation-oriented composition (logical); Decision Records for inclusions |
| **Human Review** | Publish approval |
| **Completion** | Document Published or draft retained |

---

### 4.14 Report Generation Workflow

| Field | Definition |
|-------|------------|
| **Purpose** | Produce stakeholder Reports |
| **Trigger** | Schedule; release gate; user request |
| **Inputs** | Snapshot sources (coverage, execution, review) |
| **Outputs** | Report snapshot |
| **Engines** | Reporting composition; reads Decision/Coverage/Execution info |
| **Human Review** | Optional publish approval by report type |
| **Completion** | Report Published |

---

## 5. Workflow Orchestration

### 5.1 Orchestrator role

The **Workflow Orchestrator** (logical) coordinates workflows and AI engines. It does not contain product business rules belonging to Domain/Brain; it sequences contracts and enforces gates.

### 5.2 Coordination patterns

| Pattern | Use |
|---------|-----|
| **Sequential** | Requirement Analysis → Scenario Generation → Test Case Generation → AI Review → Coverage |
| **Parallel** | AI Review ∥ Coverage (when inputs stable); multi-document normalize/classify in Intake |
| **Conditional branching** | If validation `fail` → HITL Clarification path; if class = Collaboration Insight → Insight structuring, not Scenario Generation |
| **Fan-out / Fan-in** | Fan-out heuristic packs or multi-feature impact; fan-in to merge Decision Packages / Coverage |
| **Reusable sub-workflows** | “Validate Requirement Object”, “Run AI Review”, “Publish Report” |
| **Nested workflows** | Release Planning nests Impact Analysis + Coverage Validation |
| **Composition** | Execution Modes compose workflows into declared graphs |

### 5.3 Structured exchange (not prompts)

Workflows and engines exchange:

- Intake Bundles  
- Document Bundles  
- Structured Knowledge Objects  
- Requirement Objects / RKG  
- Scenario/Test Case sets  
- Evidence Packages / Decision Records / Explanation Packets  
- Coverage Assessments / AI Reviews  
- Workflow Context (mode, gates, correlation ids, framework versions)  

**Raw prompts are not the integration contract.** Prompt assets (when later authorized) remain inside engine adapters, not between workflows.

### 5.4 Engine invocation contract (logical)

```
Workflow Step
  → declares required input object types
  → invokes Engine Port with task contract
  → receives structured outputs + Decision Records
  → updates Workflow State + Observability events
```

### 5.5 Typical composed graph (generation path)

```
Knowledge Intake
    → [if Approved Requirements Source designated]
Requirement Analysis
    → Scenario Generation
    → Test Case Generation
    → (AI Review ∥ Coverage Validation)
    → Finalize Reasoning Package
    → [optional] Automation Preparation / Documentation / Report
```

Supporting-only intakes never enter Scenario/Test Case Generation without an Approved Requirements Source designation.

---

## 6. Execution Modes

An **Execution Mode** is a declared composition of workflows for a user/system intent.

| Mode | Purpose | Expected outputs |
|------|---------|------------------|
| **Knowledge Analysis Only** | Classify/structure/summarize intake; no generation | Classifications, structured objects, summaries, Ambiguities |
| **Requirement Analysis** | Build/validate Requirement Object | Requirement Object, validation gate, Clarification requests |
| **Scenario Generation** | Produce Scenarios (requires prior/ co-run Requirement Analysis success) | Scenario Set + Trace Links |
| **Test Case Generation** | Produce Cases from Scenarios | Test Case Set + Trace Links |
| **AI Review** | Critique existing package | AI Review + Findings |
| **Release Planning** | Scope/readiness planning | Release plan + risk recommendations |
| **Regression Planning** | Impact-focused regression recommendations | Impact Analysis + regression Scenario recommendations |
| **Automation Preparation** | Automation candidacy/readiness | Automation Recommendations |
| **Documentation Generation** | Produce docs from sealed sources | Draft/Published Documents |
| **Knowledge Synchronization** | Repository sync | Sync results + draft knowledge |

Modes may chain (e.g., Requirement Analysis → Scenario → Test Case → AI Review) as a single orchestrated run with one correlation id.

---

## 7. Human-in-the-Loop Workflow

### 7.1 Pause triggers

Orchestrator **must pause** (or open a parallel wait state) when:

- Missing / undesignated Approved Requirements Source for a generation mode  
- Conflicting Knowledge Inputs or internal spec contradictions  
- Low classification or decision confidence below policy  
- Multiple valid interpretations with different test implications  
- Missing Approvals / waivers required by Domain gates  
- Knowledge conflicts with Approved Requirements Source  
- Release scope/ambiguity blocking readiness claims  
- Security classification / ACL uncertainty  

### 7.2 Pause mechanics (logical)

1. Workflow state → `AwaitingHuman`  
2. Emit Human Review Event with Explanation Packet / Clarification Request  
3. Checkpoint workflow (inputs + partial outputs sealed)  
4. Do not invent answers to unblock  

### 7.3 Resume mechanics

1. Human provides Clarification / designation / Approval / rejection  
2. Orchestrator validates response against Decision/Domain rules  
3. Resume from checkpoint at earliest required stage (often rewind to Understanding/Validation if requirements meaning changed)  
4. Record Decision lineage: pause → human disposition → resume  
5. Rejected AI recommendations are not auto-retried without new evidence  

---

## 8. Failure & Recovery Strategy

| Failure class | Conceptual handling |
|---------------|---------------------|
| **Engine failure** | Mark step failed; retry per policy; else `AwaitingOps` / fail workflow with partial package retained |
| **Missing knowledge** | Continue with Approved Requirements Source–only where valid; flag `knowledge_unavailable`; do not invent |
| **Partial execution** | Persist partial structured outputs as Draft; expose progress; allow resume |
| **Retry** | Idempotent step retry with same checkpoint inputs; Decision Records note attempt |
| **Resume** | Continue from last successful checkpoint |
| **Fallback** | Skip optional supporting retrieval; never fallback to inventing requirements |
| **Graceful degradation** | Deliver Knowledge Analysis Only results if generation blocked |
| **Cancellation** | Cooperative cancel at step boundary; mark `Cancelled`; retain audit |

**Hard rule:** Recovery never bypasses Approved Requirements Source authority or Approval gates.

---

## 9. Long-Running Operations

### 9.1 Long-running examples

- Large document ingestion  
- Bulk SharePoint / repository synchronization  
- Knowledge repository synchronization  
- Automation execution coordination (conceptual)  
- Bulk report generation  
- Large-scale AI review across many packages  

### 9.2 Checkpointing & resumability

| Concept | Meaning |
|---------|---------|
| **Checkpoint** | Immutable snapshot of workflow state + object versions after a step |
| **Progress cursor** | Position within fan-out sets (e.g., N of M documents) |
| **Heartbeat** | Liveness signal for observability |
| **Resume token** | Logical handle to continue without redoing completed steps |
| **Exactly-once effect aim** | Steps idempotent on resume |

Long-running workflows expose Observability (§10) continuously and support pause for HITL without losing progress.

---

## 10. Workflow Observability

Conceptual monitoring facets for every workflow instance:

| Facet | Meaning |
|-------|---------|
| **Workflow Status** | `Accepted` / `Running` / `AwaitingHuman` / `AwaitingOps` / `Succeeded` / `Failed` / `Cancelled` / `Degraded` |
| **Current Stage** | Active step/sub-workflow name |
| **Progress** | Percent or cursor (documents processed, engines completed) |
| **AI Engine Participation** | Engines invoked, versions, outcomes |
| **Decision Checkpoints** | Decision Records emitted / pending review |
| **Human Review Events** | Requests, responses, overrides |
| **Warnings** | Non-blocking findings, knowledge unavailable, low confidence |
| **Errors** | Step failures with safe messages + correlation ids |
| **Execution Timeline** | Ordered stage transitions with timestamps |

Observability supports audit and operations without exposing secrets or raw provider payloads as the system of record.

---

## 11. Extensibility

| Extension | Mechanism |
|-----------|-----------|
| New Knowledge Input type | Input Type Manifest |
| New classification class | Classification vocabulary version bump |
| New structured object | EIM Information Object Manifest + intake mapper |
| New workflow | Workflow Manifest (trigger, IO, engines, HITL, completion) |
| New execution mode | Mode graph composing registered workflows |
| New engine | Engine Manifest already defined in Reasoning Architecture |
| New orchestration pattern | Pattern library additive (e.g., saga-style compensate) |

**Require ADR if:** generation allowed without Approved Requirements Source; supporting knowledge becomes authority; prompts become inter-workflow contracts; HITL removed for product-fact Approvals.

---

## 12. Governance

### 12.1 Ownership

| Concern | Owner |
|---------|-------|
| Knowledge Intake & classification policies | Knowledge Governance + Platform Architect |
| Generation workflows | QA Architect / Requirement & Test Design stewards |
| Release/Impact workflows | Release Manager + QA Lead |
| Orchestrator integrity | Platform Architect |
| HITL SLAs / roles | Product Owner + QA Lead |

### 12.2 Approval gates

Orchestrator enforces Domain/Decision gates: Validation, AI Review acknowledgment, Coverage sufficiency or waiver, Knowledge publish, Release risk acceptance.

### 12.3 Auditability

Every Intake Bundle, workflow transition, engine invocation summary, Decision Record, HITL event, and completion/cancel is auditable with actor, time, and object versions.

### 12.4 Version awareness

Workflows stamp: Intake id, Document versions, Approved Requirements Source version, structured object revisions, framework/pack versions, workflow definition version.

### 12.5 Traceability

Operational runs must remain navigable: Intake → structured objects → Decisions → Scenarios/Cases → Packages → Reports.

### 12.6 Security boundaries

- Tenancy isolation on all intakes and workflow instances  
- Classification enforced before engine invocation to external providers  
- Supporting repository sync respects ACL projection  
- Observability redacts secrets  

### 12.7 Operational governance

- Idempotent retries  
- Cancellation ethics (no silent partial publish as final)  
- Degraded mode messaging honesty  

---

## 13. Architectural Risks and Mitigations

| Risk | Mitigation |
|------|------------|
| FDD-upload mindset returns | Universal Knowledge Intake; no separate FDD pipeline |
| Collaboration notes become requirements | Role designation + authority hierarchy |
| Prompt-coupling between steps | Structured object contracts only |
| Unbounded long runs | Checkpoints, cursors, observability |
| Silent resume after reject | Decision lineage; no auto-reapply |
| Orchestrator absorbs domain rules | Keep business rules in Domain/Brain; orchestrator sequences |

---

## 14. Implementation Readiness (Not Authorization)

This document authorizes **orchestration architecture only**.

Future implementation must:

1. Implement Intake Bundle + classification + role designation  
2. Map Execution Modes to workflow graphs  
3. Invoke engines via ports with structured IO  
4. Persist workflow state/checkpoints/observability events  
5. Enforce HITL and Approved Requirements Source gates  

No code, APIs, schemas, prompts, or technology choices are made here.

---

## 15. Document Control

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-07-25 | Initial Knowledge Intake & Workflow Orchestration Architecture |

---

*End of Knowledge Intake & Workflow Orchestration Architecture.*
