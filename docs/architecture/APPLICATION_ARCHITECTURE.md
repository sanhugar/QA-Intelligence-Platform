# Enterprise Application Architecture

**Document ID:** ATI-ARCH-APP-001  
**Status:** Approved architecture (design only — no implementation)  
**Product:** AI QA Intelligence Platform (ATI v2)  
**Audience:** Chief Software Architect, Principal Enterprise Architect, Platform Architect, Implementation Engineer  
**Depends on:** [ARCHITECTURE.md](./ARCHITECTURE.md), [CANONICAL_TERMINOLOGY.md](./CANONICAL_TERMINOLOGY.md), [DOMAIN_ARCHITECTURE.md](./DOMAIN_ARCHITECTURE.md), [AI_REASONING_ARCHITECTURE.md](./AI_REASONING_ARCHITECTURE.md), [KNOWLEDGE_ARCHITECTURE.md](./KNOWLEDGE_ARCHITECTURE.md), [QA_INTELLIGENCE_FRAMEWORK.md](./QA_INTELLIGENCE_FRAMEWORK.md), [AI_DECISION_AND_EVIDENCE_FRAMEWORK.md](./AI_DECISION_AND_EVIDENCE_FRAMEWORK.md), [ENTERPRISE_DATA_ARCHITECTURE.md](./ENTERPRISE_DATA_ARCHITECTURE.md), [KNOWLEDGE_INTAKE_AND_WORKFLOW_ORCHESTRATION_ARCHITECTURE.md](./KNOWLEDGE_INTAKE_AND_WORKFLOW_ORCHESTRATION_ARCHITECTURE.md), [INTEGRATION_AND_EXTERNAL_SYSTEMS_ARCHITECTURE.md](./INTEGRATION_AND_EXTERNAL_SYSTEMS_ARCHITECTURE.md)  
**ADR:** [0013 — Enterprise Application Architecture](../adr/0013-application-architecture.md)  
**Last updated:** 2026-07-25

---

## 0. Purpose and Scope

This document is the **canonical logical software application architecture** for ATI.

It defines how approved architecture is organized into:

- Logical applications  
- Internal modules  
- Service boundaries  
- Worker responsibilities  
- Shared packages  
- Cross-module communication  
- Event flow  
- Layer responsibilities  
- Deployment boundaries  

### Explicitly out of scope

- Code, APIs, UI mockups, prompts  
- Database schemas or physical persistence design  
- New implementation frameworks beyond those already approved in Foundation Architecture  
- Redefinition of Domain, Brain, Knowledge, QA heuristics, Decisions/Evidence, EIM, Intake/Workflows, or Integration contracts  

### Normative stance

1. **Consume existing architecture; do not redefine it.**  
2. **Domain remains independent** of presentation, infrastructure, and vendors.  
3. **AI reasoning remains independent** of transport, UI, and connectors.  
4. **External systems are reached only through Integration Architecture.**  
5. **Applications communicate through well-defined boundaries.**  
6. **Workers handle long-running and background operations.**  
7. **Shared functionality belongs in shared packages.**  
8. **Every module has a single responsibility.**  
9. **Support future modular decomposition** without redesigning Core meaning.  

### Alignment (ownership map)

| Concern | Owned by |
|---------|----------|
| Business language & invariants | Domain Architecture |
| How ATI reasons (engines) | AI Reasoning Architecture |
| Knowledge authority & EKB | Knowledge Architecture |
| QA heuristics & test design strategy | QA Intelligence Framework |
| Decisions, evidence, HITL | AI Decision & Evidence Framework |
| Information meaning / seals | Enterprise Data Architecture (EIM) |
| Intake, workflows, orchestration | Knowledge Intake & Workflow Orchestration |
| External connectors / adapters | Integration & External Systems Architecture |
| Stack, monorepo, Clean Architecture baseline | Foundation Architecture |
| **How software is packaged into apps/modules/workers** | **This document** |

---

## 1. Application Landscape

ATI is composed of logical applications. Initial physical deployment follows the Foundation modular monolith (`web`, `api`, `worker`); logical applications may later extract without changing Domain or Brain meaning.

```
┌────────────────────┐     ┌──────────────────────────────────────────┐
│  Web Application   │────►│         Backend Application              │
│  (presentation)    │     │  (interactive application services)      │
└────────────────────┘     └───────────────┬──────────────────────────┘
                                           │ enqueue / coordinate
                                           ▼
                           ┌──────────────────────────────────────────┐
                           │         Background Worker Host           │
                           │  (async jobs over shared Application)    │
                           └───────────────┬──────────────────────────┘
                                           │
                 ┌─────────────────────────┼─────────────────────────┐
                 ▼                         ▼                         ▼
      ┌──────────────────┐   ┌──────────────────────┐   ┌────────────────────┐
      │ AI Processing    │   │ Knowledge Sync       │   │ Reporting / Jobs   │
      │ Engine (logical) │   │ Service (logical)    │   │ (logical)          │
      └──────────────────┘   └──────────────────────┘   └────────────────────┘
                                           │
                                           ▼
                           Integration Contracts → Adapters → Connectors
                                           │
                                           ▼
                                    External Systems
```

### 1.1 Web Application

| Aspect | Definition |
|--------|------------|
| **Purpose** | Human-facing presentation and interaction surface for ATI workspaces. |
| **Responsibilities** | Render feature workspaces; capture user intent; display Decisions, Evidence, Explanation Packets, workflow status, and HITL queues; never own Domain invariants or Brain logic. |
| **Does not** | Call AI providers, SharePoint, ALM, or automation tools directly; re-implement QA heuristics; invent requirements. |
| **Deployable affinity** | Foundation `apps/web`. |

### 1.2 Backend Application

| Aspect | Definition |
|--------|------------|
| **Purpose** | Interactive application host for module use cases, authz, workflow initiation, and synchronous collaboration. |
| **Responsibilities** | Compose backend modules; enforce tenancy/authorization policies; accept Knowledge Intake requests; start/resume workflows; publish job intents; return presentable application results. |
| **Does not** | Embed vendor SDKs in Domain; run unbounded AI pipelines synchronously when Foundation/Orchestration require async; redefine Integration Contracts. |
| **Deployable affinity** | Foundation `apps/api` (modular monolith). |

### 1.3 Background Worker Host

| Aspect | Definition |
|--------|------------|
| **Purpose** | Execute long-running, retryable, and scheduled work using the **same** Application/Domain meaning as the Backend Application. |
| **Responsibilities** | Consume job intents; run Application use cases asynchronously; checkpoint progress; honor idempotency; surface health/failure without corrupting sealed information. |
| **Does not** | Own a second Domain; invent parallel business rules; talk to externals except via Integration Architecture. |
| **Deployable affinity** | Foundation `apps/worker`. |

### 1.4 AI Processing Engine (logical application)

| Aspect | Definition |
|--------|------------|
| **Purpose** | Host and execute Brain reasoning/generation workloads under Orchestration control. |
| **Responsibilities** | Run engine pipeline stages; produce structured artifacts and provenance; pause for HITL when required; invoke AI only through Integration AI contracts. |
| **Ownership of meaning** | Cognitive duties remain in AI Reasoning Architecture; this application only packages/runs them. |
| **Deployable affinity** | Initially within Worker Host (and/or Backend for short interactive slices); extractable as dedicated process later if scale demands. |

### 1.5 Knowledge Synchronization Service (logical application)

| Aspect | Definition |
|--------|------------|
| **Purpose** | Synchronize external knowledge sources into ATI Intake / EKB draft paths without making remotes semantic masters. |
| **Responsibilities** | Poll/webhook receive → normalize via connectors → Knowledge Intake classification path → draft/proposed Knowledge Items; ACL/classification projection; degrade when remote unhealthy. |
| **Ownership of meaning** | Hierarchy and authority remain in Knowledge Architecture; connectors remain in Integration Architecture. |
| **Deployable affinity** | Initially Worker Host jobs; extractable later. |

### 1.6 Reporting Service (logical application)

| Aspect | Definition |
|--------|------------|
| **Purpose** | Produce Reports and bulk analytical summaries from domain state. |
| **Responsibilities** | Schedule/generate Report outputs; export via Integration Export contracts; never invent Requirements or override Approvals. |
| **Deployable affinity** | Initially Worker Host + Backend query composition; extractable later. |

### 1.7 Future CLI / API Consumers

| Aspect | Definition |
|--------|------------|
| **Purpose** | Non-UI clients (automation, partner systems, operator CLI) that consume the same Backend application boundaries. |
| **Responsibilities** | Authenticated use of the same module contracts; no private Domain bypass. |
| **Rule** | Additional consumers extend presentation/access, not Core meaning. |

---

## 2. Backend Module Architecture

Backend modules are **logical capability modules** inside the Backend Application (and shared Application layer used by workers). They align to Domain bounded contexts and Foundation growth guidance without redefining Domain objects.

Dependency direction (normative):

```
Presentation / API boundary
        → Application modules (use cases)
            → Domain (shared kernel + context ownership)
            → AI Reasoning (via application orchestration ports)
            → Integration Contracts (never vendor SDKs)
```

Modules **must not** depend inward-to-outward on Web, nor sideways redefine another module’s aggregates.

---

### 2.1 Administration

| Aspect | Definition |
|--------|------------|
| **Purpose** | Tenancy, identity context, roles, and platform stewardship. |
| **Responsibilities** | Organizations, Workspaces, Users, Roles, membership; baseline security policy references; audit actor context. |
| **Consumed architectures** | Domain (Administration context); Integration (Identity connectors); Foundation (auth baseline). |
| **Dependencies** | None for core tenancy; may read compliance knowledge. |
| **Ownership** | Administration module owners; Domain owns object meaning. |

### 2.2 User & Access Management

| Aspect | Definition |
|--------|------------|
| **Purpose** | Authorization and access-policy application across modules. |
| **Responsibilities** | Role checks, workspace/product scopes, capability gates; never owns IdP vendor logic (Integration does). |
| **Consumed architectures** | Domain Roles; Integration Identity; Decision/Evidence for approval actor provenance. |
| **Dependencies** | Administration. |
| **Ownership** | Platform security stewardship within Administration / Access slice. |

### 2.3 Configuration

| Aspect | Definition |
|--------|------------|
| **Purpose** | Platform and organization configuration surfaces (non-secret product settings). |
| **Responsibilities** | Feature flags at application level; org preferences; connector enablement *metadata* (not secrets storage design). |
| **Consumed architectures** | Foundation config principles; Integration connector configuration model. |
| **Dependencies** | Administration. |
| **Ownership** | Platform Configuration module. |

### 2.4 Document Management

| Aspect | Definition |
|--------|------------|
| **Purpose** | Govern Document identity, versions, and storage locators for Knowledge Inputs. |
| **Responsibilities** | Register Documents; preserve provenance; cooperate with Intake; store bytes via Integration Storage contracts. |
| **Consumed architectures** | EIM Document identity; Knowledge Intake; Integration Storage. |
| **Dependencies** | Administration; Knowledge Intake coordination. |
| **Ownership** | Document Management module (EIM meaning remains canonical). |

### 2.5 Knowledge Intake Coordination

| Aspect | Definition |
|--------|------------|
| **Purpose** | Application-facing module that initiates and tracks Knowledge Intake entry. |
| **Responsibilities** | Accept Intake Bundles; trigger classification/routing per Orchestration Architecture; designate Approved Requirements Source vs supporting; never invent requirements. |
| **Consumed architectures** | Canonical Terminology; Knowledge Intake & Workflow Orchestration; Knowledge Architecture; Domain. |
| **Dependencies** | Document Management; Administration. |
| **Ownership** | Intake Coordination module (orchestration *meaning* owned by Orchestration Architecture). |

### 2.6 Requirement Management

| Aspect | Definition |
|--------|------------|
| **Purpose** | Products, Features, Feature Versions, Requirements, Requirement Objects, Ambiguities, Assumptions, Clarifications. |
| **Responsibilities** | Maintain Approved Requirements Source primacy for analysis/generation; expose requirement baselines; coordinate analysis workflows. |
| **Consumed architectures** | Domain Requirement Management; AI Reasoning (analysis engines); QA Intelligence; Decision & Evidence; EIM. |
| **Dependencies** | Administration; Document/Intake; optional Knowledge Management (augment only). |
| **Ownership** | Requirement Management module. |

### 2.7 Knowledge Management

| Aspect | Definition |
|--------|------------|
| **Purpose** | Enterprise Knowledge Base stewardship inside ATI. |
| **Responsibilities** | Knowledge Domains/Items lifecycle; intentional retrieval requests; learning candidates; never override Approved Requirements Source. |
| **Consumed architectures** | Knowledge Architecture; Domain Knowledge Management; Integration knowledge-source connectors (via sync service). |
| **Dependencies** | Administration; Document/Intake. |
| **Ownership** | Knowledge Management module. |

### 2.8 Test Design

| Aspect | Definition |
|--------|------------|
| **Purpose** | Scenarios, Test Cases, Test Suites, design-level Trace Links and Coverage Assessments. |
| **Responsibilities** | Govern test design artifacts; enforce traceability to Requirements; package design for review/release. |
| **Consumed architectures** | Domain Test Design; AI Reasoning (scenario/case engines); QA Intelligence; Decision & Evidence. |
| **Dependencies** | Requirement Management (mandatory); Knowledge Management (patterns); AI Review. |
| **Ownership** | Test Design module. |

### 2.9 AI Reasoning (application module)

| Aspect | Definition |
|--------|------------|
| **Purpose** | Application boundary that invokes Brain engines under Orchestration. |
| **Responsibilities** | Expose use cases to start/continue reasoning packages; attach provenance; enforce reason-before-generate sequencing at application level. |
| **Consumed architectures** | AI Reasoning Architecture (owns cognitive duties); Integration AI contracts; Decision & Evidence. |
| **Dependencies** | Requirement/Test Design/Knowledge as inputs; Orchestration for workflow control. |
| **Ownership** | AI Reasoning application module — **does not redefine engines**. |

### 2.10 AI Review

| Aspect | Definition |
|--------|------------|
| **Purpose** | Governed critique and readiness disposition over reasoning/design artifacts. |
| **Responsibilities** | Produce AI Review findings; route HITL; never auto-overwrite Approvals. |
| **Consumed architectures** | Domain AI Review; QA Intelligence; Decision & Evidence; AI Reasoning Review engine. |
| **Dependencies** | Requirement Management; Test Design. |
| **Ownership** | AI Review module. |

### 2.11 Automation

| Aspect | Definition |
|--------|------------|
| **Purpose** | Automation Asset management and preparation for execution frameworks. |
| **Responsibilities** | Bind Test Cases to Automation Assets; prepare exports; invoke automation runners only via Integration Automation contracts. |
| **Consumed architectures** | Domain Automation; Integration Automation; QA Intelligence (signals only). |
| **Dependencies** | Test Design; Execution (downstream). |
| **Ownership** | Automation module. |

### 2.12 Execution & Defects

| Aspect | Definition |
|--------|------------|
| **Purpose** | Executions and Defects as business outcomes of verification. |
| **Responsibilities** | Record runs/results; link Defects into traceability when possible; ingest external results via Integration ALM/automation *as aliases*, not masters. |
| **Consumed architectures** | Domain Execution/Defects; Integration ALM/Automation; Decision & Evidence for disposition. |
| **Dependencies** | Test Design; Automation; Release Management (consumer). |
| **Ownership** | Execution Management module. |

### 2.13 Release Management

| Aspect | Definition |
|--------|------------|
| **Purpose** | Releases, scope, readiness gates. |
| **Responsibilities** | Associate Features/Suites/Executions; readiness views; never invent Requirements. |
| **Consumed architectures** | Domain Release Management; Reporting (read models). |
| **Dependencies** | Requirement Management; Test Design; Execution. |
| **Ownership** | Release Management module. |

### 2.14 Reporting

| Aspect | Definition |
|--------|------------|
| **Purpose** | Report definitions and generation orchestration. |
| **Responsibilities** | Coverage/release readiness/defect trend/AI Review summaries; export via Integration Export. |
| **Consumed architectures** | Domain Reporting; EIM; Decision & Evidence (explainable summaries). |
| **Dependencies** | Read-only across many modules; owns Report artifacts. |
| **Ownership** | Reporting module. |

### 2.15 Notification

| Aspect | Definition |
|--------|------------|
| **Purpose** | User/system notifications for workflow and HITL events. |
| **Responsibilities** | Emit notification intents; deliver via Integration Notification connectors; no business Approvals by notification alone. |
| **Consumed architectures** | Orchestration HITL events; Integration Notifications. |
| **Dependencies** | Administration (recipients); Workflow events. |
| **Ownership** | Notification module. |

### 2.16 Workflow Orchestration (application module)

| Aspect | Definition |
|--------|------------|
| **Purpose** | Application host for Orchestration Architecture workflows and execution modes. |
| **Responsibilities** | Sequence Intake → reasoning → review → generation; pause/resume/retry/checkpoint; coordinate workers. |
| **Consumed architectures** | Knowledge Intake & Workflow Orchestration (**owns meaning**); Decision & Evidence HITL. |
| **Dependencies** | All capability modules as participants; Integration health signals. |
| **Ownership** | Orchestration application module — **does not redefine workflow catalog**. |

### 2.17 Integration Facade (application module)

| Aspect | Definition |
|--------|------------|
| **Purpose** | Application-side composition of Integration Contracts for Core use cases. |
| **Responsibilities** | Resolve connectors; apply degradation; normalize remote failures into Decision/Evidence-compatible inputs; never put vendor types in Domain. |
| **Consumed architectures** | Integration & External Systems Architecture (**owns contracts/adapters/connectors**). |
| **Dependencies** | Used by Intake, Knowledge Sync, AI Reasoning, Automation, Notification, Export. |
| **Ownership** | Integration Facade module — thin; stewardship of connectors remains Integration Architecture. |

---

## 3. Frontend Module Architecture

Frontend modules are **presentation workspaces**. They compose UX around Backend module contracts. No Domain invariants or Brain heuristics are re-implemented in the browser.

| Frontend area | Responsibilities | Boundaries |
|---------------|------------------|------------|
| **Dashboard** | Cross-cutting status: in-flight workflows, HITL queues, readiness signals | Read aggregates; no silent Approvals |
| **Knowledge Workspace** | Browse EKB, draft/proposed items, retrieval intents, learning candidates | Supporting knowledge only; cannot override Approved Requirements Source |
| **Requirement Workspace** | Products/Features/Feature Versions, Requirements, Requirement Objects, Ambiguities/Assumptions/Clarifications | Generation authority remains Approved Requirements Source |
| **Knowledge Intake Workspace** | Submit/monitor Intake Bundles, classification outcomes, role designation | Entry UX only; Intake meaning owned by Orchestration/Terminology |
| **Scenario Workspace** | Scenarios and design Trace Links | Depends on approved/understood Requirements |
| **Test Case Workspace** | Test Cases, Suites, design coverage views | Trace to Scenarios/Requirements required |
| **AI Review Workspace** | Findings, Explanation Packets, HITL accept/override | Human override supremacy; no auto-seal bypass |
| **Automation Workspace** | Automation Assets, prep/export status | Framework-neutral; runners via Backend/Integration |
| **Release Workspace** | Release scope and readiness | Consumes Execution/Reporting signals |
| **Reporting** | Report catalogs, generation status, exports | No invention of Requirements |
| **Administration** | Orgs, Workspaces, Users, Roles | Identity via Backend; no direct IdP admin reimplementation unless authorized |
| **Settings** | Preferences, feature flags, connector enablement UX | Secrets never handled in client beyond secure auth session patterns |

**Frontend rules (normative)**

1. Features own UI + client hooks; pages remain thin composers.  
2. Server state is fetched via Backend contracts; UI state is local presentation only.  
3. No direct provider/connector SDKs in the browser.  
4. Terminology labels must follow Canonical Terminology and Domain ubiquitous language.  

---

## 4. Shared Packages

Shared packages hold **cross-application contracts and utilities** with no business invariant ownership. Logical packages below align with Foundation `packages/*` and Integration/AI contract packaging; this document does not authorize code.

| Logical package | Contents (conceptual) | Ownership | Usage |
|-----------------|----------------------|-----------|--------|
| **Shared Domain Contracts** | Stable identities, enumerations, and boundary shapes shared across apps | Domain stewardship + package owners | FE/BE/Worker agreement without leaking Nest/React |
| **Common Types** | IDs, result types, correlation identifiers | Platform packages | All apps |
| **Validation** | Boundary validation schemas for cross-app contracts | Platform packages | FE + Backend boundaries only — not Domain core |
| **Logging** | Structured logging facade | Platform packages | All runtimes |
| **Configuration** | Config loading helpers and base schemas | Platform packages | Apps extend; no secrets in repo |
| **Observability** | Correlation, metrics/trace facades | Platform packages | API + Worker + future services |
| **Security Utilities** | Auth context helpers, permission check utilities (no IdP SDK) | Platform + Access | Backend/Worker primarily |
| **AI Contracts** | Provider-agnostic AI port shapes / engine invocation contracts | AI Reasoning + Integration alignment | Application + Worker; never UI |
| **Integration Contracts** | Logical IO/error/capability contracts for connectors | Integration Architecture | Application Integration Facade + adapters |
| **Document Utilities** | Hashing, content-type helpers, locator helpers (non-EIM meaning) | Platform | Document/Intake modules |
| **Error Taxonomy** | Stable application error codes and mappers | Platform | All boundaries |
| **Event Contracts** | Domain/application event envelope shapes | Domain + Orchestration | Backend ↔ Worker ↔ modules |

**Package rules**

1. Small composable packages over a junk drawer.  
2. Breaking contract changes require ADR.  
3. Domain meaning is not redefined inside packages — packages carry *contracts*, not rival models.  
4. Vendor SDKs stay in Integration adapters, never in shared Domain contracts.  

---

## 5. Worker Architecture

Workers execute **Application use cases asynchronously**. They are not a second Domain.

### 5.1 Work that belongs in workers

| Worker class | Responsibility |
|--------------|----------------|
| **Knowledge Synchronization** | Remote fetch/sync → Intake draft path; ACL projection; retries/degrade |
| **AI Processing** | Long-running Brain pipelines; multi-engine orchestration; provider fallback at Integration layer |
| **Bulk Analysis** | Large Feature Version / portfolio analyses; batch validation |
| **SharePoint / Knowledge Source Sync** | Connector-driven sync jobs (Integration + Knowledge Sync logical app) |
| **Report Generation** | Heavy Report materialization and export packaging |
| **Automation Execution Prep / Dispatch** | Prepare assets; dispatch to external runners via connectors; ingest results |
| **Scheduled Jobs** | Periodic health sweeps, stale workflow recovery triggers, retention housekeeping *intents* |
| **Notification Delivery** | Async fan-out of notification intents |
| **Workflow Checkpoint Continuation** | Resume Orchestration after pause/retry/timer |

### 5.2 Work that stays interactive (Backend Application)

- AuthN/AuthZ and session establishment  
- Short CRUD-style collaboration on Domain objects within policy  
- Starting workflows and acknowledging Intake acceptance  
- HITL decision capture (approve/override/clarify)  
- Lightweight status queries and Explanation Packet retrieval  
- Configuration changes that must be immediately consistent for the actor  

### 5.3 Rules

1. Workers share Application/Domain packages with Backend — **no duplicated business rules**.  
2. Jobs are idempotent and checkpointable per Orchestration Architecture.  
3. Failures must not corrupt sealed EIM/Domain snapshots (Integration non-corruption).  
4. Interactive UI never waits unbounded on AI/provider completion; it observes workflow state.  

---

## 6. Communication Architecture

Communication is **conceptual**. No APIs are defined here.

### 6.1 Direct collaboration

- Same-process module calls within the modular monolith via Application services.  
- Allowed when a single user action needs transactional consistency (e.g., Intake acceptance + Document registration).  
- Must respect module ownership: callers use published application contracts, not private aggregates of another module.

### 6.2 Request/response (interactive)

- Web → Backend Application for commands/queries.  
- Backend → Integration Contracts for short external calls that are safe synchronously (e.g., identity token validation, health probe).  
- Backend → AI Reasoning only for short interactive slices; long pipelines enqueue to AI Processing.

### 6.3 Event-driven communication

- Domain events express facts that already happened (owned by Domain Architecture).  
- Application event handlers update projections, enqueue workers, or notify.  
- Cross-module reactions prefer events when multiple modules must respond and tight coupling would form.

### 6.4 Background processing

- Backend publishes job intents (queue/outbox conceptually).  
- Worker Host consumes intents and runs Application use cases.  
- Progress/checkpoints feed Orchestration observability.

### 6.5 Workflow coordination

- Orchestration module sequences stages and HITL pauses (meaning from Orchestration Architecture).  
- Engines, Knowledge retrieval, and connectors are **participants**, not orchestrators of each other.  
- Human decisions re-enter via Backend interactive commands that resume workflows.

### 6.6 Conceptual event flow (example)

```
User submits Knowledge Input (Web)
   → Backend Intake Coordination (accept)
   → Domain/EIM Document registered
   → Orchestration routes workflow
   → Worker: classification / structured object creation
   → (optional) Worker: Knowledge Sync / retrieval prep
   → Worker: AI Processing (reason-before-generate)
   → Decision & Evidence records + Explanation Packets
   → HITL pause → Notification → Web AI Review Workspace
   → Human Approval/Override (Backend)
   → Orchestration resume → Test Design artifacts
   → Reporting / Automation prep as downstream intents
```

---

## 7. Layer Responsibilities

Layers follow Foundation Clean Architecture. This section assigns **application organization** duties only.

| Layer | Responsibilities | Must not |
|-------|------------------|----------|
| **Presentation** | Web workspaces; display Decisions/Evidence; capture user intent | Domain invariants; provider SDKs; silent Approvals |
| **Application** | Use cases; policies; workflow initiation; DTO mapping at boundaries; job intents | SQL/vendor details; Brain cognitive redesign; Domain redefinition |
| **Domain** | Entities, VOs, invariants, domain events, repository *interfaces* | Nest/React/Prisma/AI SDKs; integration vendor types |
| **AI Reasoning** | Engine cognitive pipeline (owned by AI Reasoning Architecture); invoked via Application | UI concerns; connector implementation details |
| **Integration** | Contracts, adapters, connectors (owned by Integration Architecture) | Business Approvals; Requirements authorship |
| **Infrastructure** | Persistence adapters, queue adapters, telemetry adapters, config bootstrapping | Business rules; EIM meaning changes |

**Dependency rule:** dependencies point inward. Infrastructure and Integration adapters implement ports defined by Application/Domain. Presentation depends on Application contracts only.

---

## 8. Deployment Units

Conceptual deployable units (aligned with Foundation; infrastructure implementation deferred):

| Deployable unit | Contains (logical) | Notes |
|-----------------|--------------------|-------|
| **Frontend** | Web Application | Independent release unit |
| **Backend** | Backend Application + module composition + Integration Facade host | Modular monolith initially |
| **Worker** | Background Worker Host + AI Processing / Knowledge Sync / Reporting / scheduled jobs | Shares Application/Domain meaning with Backend |
| **Supporting Services** | Platform-provided capabilities already approved (identity provider, queue, object storage, search) accessed **only** via Integration/Infrastructure adapters | Not ATI Domain masters |

**Extraction principle:** any backend module or logical application may become its own deployable when scale, isolation, or ownership demands it — via ADR — without redefining Domain/Brain/Knowledge meaning.

---

## 9. Cross-Cutting Capabilities

Platform-wide capabilities. Ownership is stewardship, not a license to redefine Domain.

| Capability | Ownership | Notes |
|------------|-----------|-------|
| **Logging** | Platform packages + runtime hosts | Structured; correlation IDs across API/Worker |
| **Monitoring / Observability** | Platform + Orchestration (workflow) + Integration (connector health) | Traces/metrics; no business truth in metrics alone |
| **Configuration** | Configuration module + Foundation config packages | 12-factor; validated at boot |
| **Feature Flags** | Configuration / Administration | Gate UX and optional connectors; not Domain invariants |
| **Audit** | Administration + Decision & Evidence (decision audit) | Immutable decision/evidence history remains ADR 0008 |
| **Versioning** | EIM + Domain artifact versions | Apps expose/version contracts; do not invent parallel identity |
| **Error Handling** | Platform error taxonomy + Integration normalized remote errors | Map at boundaries |
| **Localization** | Presentation stewardship | Labels map to ubiquitous language |
| **Caching (conceptual)** | Infrastructure adapters | Cache is acceleration only; never source of Requirements truth |
| **Security** | User & Access + Integration Identity + Foundation security baseline | Deep threat model remains a future gate |

---

## 10. Extensibility

New capabilities are introduced by **extension**, not Core redesign.

| Extension | How introduced |
|-----------|----------------|
| **New backend module** | Add module with single responsibility; publish application contracts; consume Domain events; ADR if boundary changes |
| **New frontend workspace** | Feature folder under Web Application; uses existing Backend contracts |
| **New logical application** | Define purpose/worker split; host initially in Worker/Backend; extract later with ADR |
| **New connector** | Integration Architecture Open/Closed path — register connector behind existing contracts |
| **New workflow** | Orchestration Architecture catalog extension — Application Orchestration module hosts it |
| **New AI engine step** | AI Reasoning Architecture extension — Application AI module invokes; no UI heuristics fork |
| **New consumer (CLI/partner)** | Authenticate to Backend boundaries; no private Domain access |

**Forbidden “extensions”**

- Embedding vendor logic in Domain  
- Letting supporting knowledge invent Requirements  
- Duplicating Brain heuristics in Web  
- Creating a second orchestration inside a feature module  

---

## 11. Governance

### 11.1 Module ownership

| Module / application | Primary steward |
|----------------------|-----------------|
| Administration / Access / Configuration | Platform & Security Architecture |
| Document / Intake Coordination / Orchestration app module | Platform Orchestration stewardship |
| Requirement / Test Design / AI Review | Product QA Domain stewardship |
| Knowledge Management / Knowledge Sync | Knowledge Architecture stewardship |
| AI Reasoning app module / AI Processing | AI Reasoning stewardship |
| Automation / Execution | Automation stewardship |
| Release / Reporting | Release & Insights stewardship |
| Integration Facade | Integration Architecture stewardship |
| Web workspaces | Frontend Architecture stewardship |
| Shared packages | Platform package owners |

### 11.2 Responsibility boundaries

- Domain owns **what is true** in the business model.  
- Brain owns **how ATI reasons**.  
- Orchestration owns **how work runs**.  
- Integration owns **how externals are reached**.  
- This Application Architecture owns **how those are packaged into apps/modules/workers**.  

### 11.3 Architectural compliance

Implementation (when authorized) must demonstrate:

1. Dependency direction inward  
2. No vendor types in Domain  
3. Workers share Application/Domain — no fork  
4. Terminology compliance (ADR 0010)  
5. Approved Requirements Source primacy for generation paths  
6. HITL/Approval supremacy for governed advances  

### 11.4 Dependency direction (normative)

```
Web → Backend Application contracts
Backend modules → Domain / Application ports
Application → AI Reasoning ports (not SDKs)
Application → Integration Contracts (not connectors directly from Domain)
Workers → same Application/Domain as Backend
Infrastructure/Integration adapters → implement ports only
```

### 11.5 Version awareness

- Artifact versions follow EIM/Domain.  
- Shared package contract breaks require ADR.  
- Connector versions follow Integration lifecycle.  
- Application deployables may version independently after extraction, provided contracts remain compatible or are migrated explicitly.  

---

## 12. Architectural Dependencies & Boundaries

This architecture consumes, but does not redefine, prior approved architectures.

### 12.1 Consumed Architectures

| Approved architecture | Consumed / inherited | Intentionally not redefined |
|-----------------------|----------------------|-----------------------------|
| [Foundation Architecture](./ARCHITECTURE.md) (ADRs 0001–0003) | Modular monolith; `web`/`api`/`worker`; Clean Architecture; shared packages; approved stack baselines | Technology re-selection; coding standards rewrite |
| [AI Reasoning Architecture](./AI_REASONING_ARCHITECTURE.md) (ADR 0004) | Pipeline, engines, reason-before-generate, AI ports | Engine cognitive duties, prompts |
| [Knowledge Architecture](./KNOWLEDGE_ARCHITECTURE.md) (ADR 0005) | EKB, hierarchy, lifecycle, intentional retrieval | Authority tiers, SharePoint-as-source semantics |
| [Domain Architecture](./DOMAIN_ARCHITECTURE.md) (ADR 0006) | Ubiquitous language, bounded contexts, invariants, events | Business object meanings |
| [QA Intelligence Framework](./QA_INTELLIGENCE_FRAMEWORK.md) (ADR 0007) | Heuristics, questions, coverage dimensions, design strategy | Heuristic packs as application “shortcuts” |
| [AI Decision & Evidence Framework](./AI_DECISION_AND_EVIDENCE_FRAMEWORK.md) (ADR 0008) | Decision lifecycle, Evidence, Explanation Packets, HITL | Decision primacy rules |
| [Enterprise Data Architecture (EIM)](./ENTERPRISE_DATA_ARCHITECTURE.md) (ADR 0009) | Information objects, identity, seals, lineage | Physical schemas |
| [Canonical Terminology](./CANONICAL_TERMINOLOGY.md) (ADR 0010) | Knowledge Intake; Approved Requirements Source terms | Term meanings |
| [Knowledge Intake & Workflow Orchestration](./KNOWLEDGE_INTAKE_AND_WORKFLOW_ORCHESTRATION_ARCHITECTURE.md) (ADR 0011) | Intake stages, workflows, modes, HITL, checkpoints | Workflow catalog semantics |
| [Integration & External Systems](./INTEGRATION_AND_EXTERNAL_SYSTEMS_ARCHITECTURE.md) (ADR 0012) | Contracts → adapters → connectors; resilience; connector lifecycle | Vendor connector internals |

### 12.2 Architectural Boundaries

This document **must not redefine**:

| Concept area | Owning architecture |
|--------------|---------------------|
| Domain concepts / ubiquitous language | Domain Architecture |
| AI reasoning logic / engine duties | AI Reasoning Architecture |
| Knowledge hierarchy / EKB rules | Knowledge Architecture |
| Information objects / seals | Enterprise Data Architecture |
| Workflow definitions / Intake stages | Knowledge Intake & Workflow Orchestration |
| Decision / evidence / HITL supremacy | AI Decision & Evidence Framework |
| QA heuristics / coverage dimensions | QA Intelligence Framework |
| Integration contracts / connector model | Integration & External Systems Architecture |
| Canonical Intake terminology | Canonical Terminology (ADR 0010) |

**Allowed extension (application-organization only):** logical applications, backend/frontend modules, worker classes, shared package roles, communication patterns, deployable unit packaging, cross-cutting stewardship, extensibility/governance of the application landscape.

### 12.3 Extension Responsibilities

**This architecture introduces**

- Canonical application landscape (Web, Backend, Worker Host, logical AI Processing, Knowledge Sync, Reporting, future consumers)  
- Backend module map aligned to Domain contexts + Intake/Orchestration/Integration facades  
- Frontend workspace map and presentation boundaries  
- Shared package roles for cross-app contracts  
- Worker vs interactive responsibility split  
- Conceptual communication and event flow between modules  
- Layer packaging responsibilities for the software system  
- Deployment unit packaging and extraction path  
- Application-level governance (ownership, dependency direction, compliance)  

**Future architecture gates that will depend on it**

- Platform Spine implementation planning (bootstraps map to these units)  
- Deep Security / Threat Model (maps controls onto apps/modules)  
- Deployment / SRE topology (scales these deployables)  
- Module extraction ADRs (service split criteria)  
- Connector enablement packs (which worker/app hosts which connector)  
- Product feature delivery plans (which workspace + module pairs)  

### 12.4 Architecture Dependency Matrix

| Architecture | Relationship | Responsibility |
|--------------|--------------|----------------|
| Foundation Architecture | Consumed | Supplies stack/monorepo/Clean Architecture assumptions this landscape packages |
| AI Reasoning Architecture | Consumed | Owns Brain; this doc packages AI Processing / AI Reasoning application module |
| Knowledge Architecture | Consumed | Owns EKB semantics; this doc packages Knowledge Management + Sync hosting |
| Domain Architecture | Consumed | Owns business model; this doc maps modules/workspaces to contexts |
| QA Intelligence Framework | Consumed | Owns heuristics; this doc forbids UI/module shortcuts that replace them |
| AI Decision & Evidence Framework | Consumed | Owns decision governance; this doc routes HITL through Review workspace + Backend |
| Enterprise Data Architecture (EIM) | Consumed | Owns information meaning; this doc packages Document Management without schemas |
| Canonical Terminology (ADR 0010) | Consumed | Owns Intake terms; this doc’s Intake workspace/module must honor them |
| Knowledge Intake & Workflow Orchestration | Consumed | Owns operational workflows; this doc hosts Orchestration application module + workers |
| Integration & External Systems | Consumed | Owns externals path; this doc hosts Integration Facade and forbids direct vendor access |
| **Enterprise Application Architecture (this document)** | Introduces | Logical apps, modules, workers, packages, communication, deployable packaging, app governance |
| Future Security / Deployment / Extraction gates | Depend on this | Assume this landscape when placing controls, topology, and service splits |

---

## 13. Cross References

| Document / ADR | Role relative to this architecture |
|----------------|-------------------------------------|
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Foundation stack, monorepo, Clean Architecture |
| [BACKEND.md](./BACKEND.md) | Backend deep-dive index (defers to Foundation + this doc for landscape) |
| [FRONTEND.md](./FRONTEND.md) | Frontend deep-dive index |
| [CANONICAL_TERMINOLOGY.md](./CANONICAL_TERMINOLOGY.md) / ADR 0010 | Intake terminology |
| [DOMAIN_ARCHITECTURE.md](./DOMAIN_ARCHITECTURE.md) / ADR 0006 | Business model & bounded contexts |
| [AI_REASONING_ARCHITECTURE.md](./AI_REASONING_ARCHITECTURE.md) / ADR 0004 | Brain engines |
| [KNOWLEDGE_ARCHITECTURE.md](./KNOWLEDGE_ARCHITECTURE.md) / ADR 0005 | EKB |
| [QA_INTELLIGENCE_FRAMEWORK.md](./QA_INTELLIGENCE_FRAMEWORK.md) / ADR 0007 | QA heuristics |
| [AI_DECISION_AND_EVIDENCE_FRAMEWORK.md](./AI_DECISION_AND_EVIDENCE_FRAMEWORK.md) / ADR 0008 | Decisions & evidence |
| [ENTERPRISE_DATA_ARCHITECTURE.md](./ENTERPRISE_DATA_ARCHITECTURE.md) / ADR 0009 | EIM |
| [KNOWLEDGE_INTAKE_AND_WORKFLOW_ORCHESTRATION_ARCHITECTURE.md](./KNOWLEDGE_INTAKE_AND_WORKFLOW_ORCHESTRATION_ARCHITECTURE.md) / ADR 0011 | Intake & workflows |
| [INTEGRATION_AND_EXTERNAL_SYSTEMS_ARCHITECTURE.md](./INTEGRATION_AND_EXTERNAL_SYSTEMS_ARCHITECTURE.md) / ADR 0012 | External systems |
| [ADR 0003](../adr/0003-monorepo-modular-monolith.md) | Modular monolith + extract path |
| [ADR 0013](../adr/0013-application-architecture.md) | Accepts this document as canonical |
| [AI_DEVELOPMENT_CHARTER.md](../standards/AI_DEVELOPMENT_CHARTER.md) | Roles and architecture gates |

Do **not** duplicate the contents of those documents here.

---

## 14. Document Control

| Field | Value |
|-------|-------|
| **Version** | 1.0 |
| **Status** | Approved architecture (design only — no implementation) |
| **Owner** | Chief Software Architect / Principal Enterprise Architect |
| **Related ADR** | [0013 — Enterprise Application Architecture](../adr/0013-application-architecture.md) |
| **Dependencies** | ADRs 0001–0012 and their architecture documents listed in §12–§13 |
| **Last updated** | 2026-07-25 |

### Change History

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-07-25 | Initial Enterprise Application Architecture (Architecture Gate 7) |

---

*End of Enterprise Application Architecture.*
