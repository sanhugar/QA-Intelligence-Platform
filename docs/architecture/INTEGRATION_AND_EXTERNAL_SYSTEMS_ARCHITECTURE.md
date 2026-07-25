# Integration & External Systems Architecture

**Document ID:** ATI-ARCH-INTEGRATION-001  
**Status:** Approved architecture (design only — no implementation)  
**Product:** AI QA Intelligence Platform (ATI v2)  
**Audience:** Principal Enterprise Integration Architect, Platform Architect, Security, Implementation Engineer  
**Depends on:** [ARCHITECTURE.md](./ARCHITECTURE.md), [CANONICAL_TERMINOLOGY.md](./CANONICAL_TERMINOLOGY.md), [KNOWLEDGE_ARCHITECTURE.md](./KNOWLEDGE_ARCHITECTURE.md), [KNOWLEDGE_INTAKE_AND_WORKFLOW_ORCHESTRATION_ARCHITECTURE.md](./KNOWLEDGE_INTAKE_AND_WORKFLOW_ORCHESTRATION_ARCHITECTURE.md), [AI_REASONING_ARCHITECTURE.md](./AI_REASONING_ARCHITECTURE.md), [AI_DECISION_AND_EVIDENCE_FRAMEWORK.md](./AI_DECISION_AND_EVIDENCE_FRAMEWORK.md), [DOMAIN_ARCHITECTURE.md](./DOMAIN_ARCHITECTURE.md), [ENTERPRISE_DATA_ARCHITECTURE.md](./ENTERPRISE_DATA_ARCHITECTURE.md)  
**ADR:** [0012 — Integration & External Systems Architecture](../adr/0012-integration-and-external-systems-architecture.md)  
**Last updated:** 2026-07-25

---

## 0. Purpose and Scope

This document is the canonical architecture for **how ATI communicates with external systems** while keeping **ATI Core** independent of vendors, providers, and third-party technologies.

### Explicitly out of scope

- Code, APIs, UI, prompts  
- Database schemas  
- Implementation frameworks, SDKs, or product SKUs as mandates  
- Redesign of Domain, Brain, Knowledge, or Orchestration intent  

### Core architectural principles (normative)

1. **ATI Core owns all business logic.**  
2. **External systems are replaceable.**  
3. **All integrations occur through well-defined integration contracts.**  
4. **Every external capability must have an adapter.**  
5. **ATI never embeds vendor-specific logic into the core platform.**  
6. **AI providers are interchangeable.**  
7. **Enterprise systems are optional integrations.**  
8. **Integrations must support graceful degradation.**  
9. **Integration failures must never corrupt ATI business information.**  
10. **Future integrations should require extension rather than redesign** (Open/Closed).  

---

## 1. Enterprise Integration Architecture

### 1.1 Philosophy

ATI is an **independent AI QA Knowledge Platform**. External products provide *capabilities* (models, files, identity, tickets, runners, notifications). They never become the system of record for ATI Domain meaning, Approvals, Trace Links, Decision Records, or Approved Requirements Source authority.

Integration is **capability-oriented**, not product-oriented: Core asks for “complete a reasoning task” or “fetch document versions,” not for “call Vendor X API shape Y.”

### 1.2 Layered model

```
┌──────────────────────────────────────────┐
│              ATI Core                     │
│  Domain · Application · Workflows · EIM  │
│  (business logic, authority, lineage)    │
└──────────────────┬───────────────────────┘
                   │ Integration Contracts
                   │ (capability ports)
┌──────────────────▼───────────────────────┐
│            Adapter Layer                  │
│  Maps Core contracts ↔ connector ops     │
│  Normalizes errors, auth, pagination     │
└──────────────────┬───────────────────────┘
                   │ Connector SPI
┌──────────────────▼───────────────────────┐
│           Connector Layer                 │
│  Registered, versioned, health-checked   │
│  Vendor/protocol-specific implementations│
└──────────────────┬───────────────────────┘
                   │
┌──────────────────▼───────────────────────┐
│           External Systems                │
│  AI · Knowledge · ALM · SCM · Automation │
│  IdP · Storage · Notify · Export · …     │
└──────────────────────────────────────────┘
```

### 1.3 Layer responsibilities

| Layer | Responsibilities | Must not |
|-------|------------------|----------|
| **ATI Core** | Business rules, workflows, authority hierarchy, structured objects, Decision/Evidence, Approvals, tenancy | Import vendor SDKs, store vendor-only identifiers as sole identity, branch logic on vendor product names |
| **Integration Contracts** | Stable capability interfaces (logical ports): inputs/outputs, errors, capability negotiation, versioning | Expose vendor payload shapes as the contract |
| **Adapter Layer** | Translate between Core contracts and Connector SPI; retries policy hooks; redact secrets; map identities | Contain Domain business rules (e.g., invent Requirements) |
| **Connector Layer** | Talk to one external system/family; declare capabilities; health; config schema (logical); version | Be invoked directly from Domain entities |
| **External Systems** | Provide remote capabilities | Own ATI master data meaning |

### 1.4 Dependency rule

Dependencies point **outward from Core through contracts**. Connectors depend on external systems. Core never depends on connectors by concrete type — only on contract ports resolved via registration/discovery.

---

## 2. Integration Domains

Each domain is a **capability family**. Listed products are **examples of replaceable targets**, not mandated choices.

### 2.1 AI Providers

**Capability:** Reasoning/completion, optional embeddings, moderation — behind AI Reasoning Port.

Examples: OpenAI, Azure OpenAI, Anthropic, Google Gemini, Ollama, OpenRouter, future providers.

**Core expectation:** Provider-independent task contracts; provenance records provider/model ids without leaking SDK types into Domain.

---

### 2.2 Enterprise Knowledge

**Capability:** List/fetch/version documents; optional change detection; ACL projection.

Examples: SharePoint, Confluence, internal KBs, file systems, document repositories.

**Core expectation:** Knowledge Intake + Knowledge Architecture authority rules; supporting knowledge never overrides Approved Requirements Source.

---

### 2.3 ALM / Work Management

**Capability:** Optional sync/link of work items, defects, and statuses.

Examples: Jira, Azure DevOps, GitHub Issues, GitLab Issues, future ALM platforms.

**Core expectation:** Anti-corruption — external tickets map to Defect/Execution associations; they do not become ATI Requirements masters.

---

### 2.4 Source Control

**Capability:** Optional repository metadata, file fetch, PR/commit references for impact/automation context.

Examples: GitHub, GitLab, Azure Repos, Bitbucket.

**Core expectation:** SCM is supporting context / Automation Asset location hints — not Approved Requirements Source unless explicitly designated via Intake.

---

### 2.5 Automation Platforms

**Capability:** Prepare/bind/execute/collect results for Automation Assets; framework-agnostic status model.

Examples: Playwright, Selenium, Cypress, REST Assured, JMeter, future frameworks.

**Core expectation:** Automation Management Domain remains framework-neutral; connectors adapt runner semantics to ATI Execution/result objects.

---

### 2.6 Identity Providers

**Capability:** Authenticate users; provide identity claims; support enterprise SSO.

Examples: Microsoft Entra ID, generic OAuth/OIDC, LDAP (future), enterprise SSO.

**Core expectation:** Core speaks User/Role/Permission; IdP-specific claim shapes stay in identity adapters.

---

### 2.7 Storage Providers

**Capability:** Persist binary/object content (documents, exports, evidence blobs).

Examples: Local storage, S3-compatible, Azure Blob, future object stores.

**Core expectation:** Content addressed by ATI Document/object identity; storage locator is an adapter concern.

---

### 2.8 Reporting & Export

**Capability:** Render or deliver exports in enterprise formats.

Examples: Excel, CSV, PDF, dashboard export channels.

**Core expectation:** Report Information is owned by Core; exporters are format connectors.

---

### 2.9 Notifications

**Capability:** Deliver human-facing or system events.

Examples: Email, Microsoft Teams, Slack, Webhooks.

**Core expectation:** Notification intent from workflows (HITL, completion, failure); channels are replaceable.

---

### 2.10 Future Integrations

Any future enterprise application fits by registering a **Connector** that implements one or more **Integration Contracts** (capability ports). Unlimited connector types are allowed without Core redesign.

---

## 3. Connector Architecture

A **Connector** is a versioned, registrable unit that implements one or more capability contracts for a specific external system (or protocol family).

### 3.1 Connector lifecycle

```
Develop → Register → Discoverable → Configure
  → Enable → Healthy/Degraded/Unhealthy
  → Upgrade (new version) → Deprecate → Retire
```

Side states: `Disabled`, `Quarantined` (security), `Misconfigured`.

### 3.2 Connector registration

Logical registration record includes:

- `connectorId`, display name  
- `connectorVersion`  
- `integrationDomain(s)`  
- `capabilities[]` (contract ids + versions supported)  
- `configSchemaRef` (logical configuration shape — not a DB schema)  
- `owner` / steward  
- `securityClassification` handling notes  
- `deprecation` metadata  

Registration makes the connector **discoverable**, not automatically trusted for production use.

### 3.3 Connector discovery

Core/Adapter layer discovers connectors by:

- Required capability + contract version  
- Organization allow-list / entitlement  
- Health state  
- Capability negotiation result  

Discovery never hard-codes vendor class names in Domain code.

### 3.4 Connector capabilities

Capabilities are fine-grained flags/operations, e.g.:

- `document.fetch` / `document.listVersions` / `document.changes`  
- `ai.reason` / `ai.embed` (optional)  
- `alm.defect.upsert` / `alm.workitem.link`  
- `automation.execute` / `automation.collectResults`  
- `identity.validateToken`  
- `storage.put` / `storage.get`  
- `notify.send`  
- `export.render`  

### 3.5 Connector health

Health is conceptual: `Healthy`, `Degraded`, `Unhealthy`, `Unknown`.

Health signals: reachability, auth validity, latency class, error rate class, quota pressure — reported to Observability (§10). Unhealthy connectors are skipped or trigger fallback per policy.

### 3.6 Connector configuration

Configuration is **per Organization** (and optionally Workspace), stored outside Core business objects as integration configuration:

- Endpoints, tenants, scopes (logical)  
- Credential references (vault handles — never secrets in Core entities)  
- Feature toggles (e.g., sync libraries allow-list)  
- Rate/timeout policy overlays  

### 3.7 Connector versioning

- Connectors are versioned independently of ATI Core.  
- Contract compatibility is negotiated (§4).  
- Breaking connector changes require new major connector version and compatibility matrix entry.  
- Core remains on stable contracts; adapters may support multiple connector majors temporarily.

### 3.8 Connector retirement

1. Deprecate with successor recommendation  
2. Disable new bindings  
3. Drain in-flight jobs  
4. Retire registration  
5. Retain audit history of past invocations  

Retirement must not delete ATI business information previously ingested.

---

## 4. Integration Contracts

Integration Contracts are **logical capability ports** between Core and the Adapter/Connector stack. They are not HTTP API designs.

### 4.1 Contract anatomy (conceptual)

| Element | Meaning |
|---------|---------|
| **Contract id + version** | Stable capability identity |
| **Inputs** | Structured ATI objects / intent DTOs (logical) |
| **Outputs** | Structured results normalized to ATI shapes |
| **Validation** | Pre-conditions (authz, tenancy, required fields, capability present) |
| **Error model** | Normalized error classes (§9) — never raw vendor errors in Core |
| **Capability negotiation** | Optional features the connector may/may not support |
| **Compatibility** | Supported contract version range |
| **Version awareness** | External entity versions mapped to ATI provenance fields |
| **Idempotency** | Keys for safe retry |
| **Timeout/budget hints** | Logical deadlines for orchestration |

### 4.2 Validation principles

- Reject calls that would violate tenancy or classification.  
- Reject use of supporting-knowledge connectors to assert Approved Requirements Source authority.  
- Validate connector enabled + healthy (or explicit degraded allow).  

### 4.3 Error handling principles

Adapters map vendor failures to normalized classes: `Unavailable`, `Timeout`, `AuthFailed`, `RateLimited`, `PartialSuccess`, `Conflict`, `NotFound`, `InvalidRemoteState`, `UnsupportedCapability`.

Core decides business impact (retry, degrade, HITL) — connectors do not invent Requirements or Approvals on failure.

### 4.4 Capability negotiation

Before use, Adapter asks: “Do you support `document.changes`?” If not, Orchestrator chooses alternate path (e.g., full re-list) or degrades sync fidelity with explicit warning.

### 4.5 Compatibility & version awareness

- Contract major bumps are ADR-worthy when Core-facing.  
- External version tokens (etag, rev, commit SHA) stored as **provenance**, not as ATI primary keys.  
- Dual-run periods allowed when migrating connectors.

---

## 5. AI Provider Architecture

### 5.1 Goals

- Multiple providers simultaneously configurable  
- Selection by policy (Organization, workflow, cost class, data residency class — conceptual)  
- Fallback chains on outage/rate limit  
- Local, cloud, and hybrid deployments  
- **Business reasoning remains provider-independent** (Brain + QA Intelligence + Decision frameworks)

### 5.2 Logical flow

```
Engine (Core)
  → AiReasoningPort / related AI contracts
      → AI Provider Adapter
          → AI Provider Connector (vendor-specific)
              → External model endpoint
```

### 5.3 Provider selection (conceptual)

Selection inputs: Organization policy, Execution Mode, data classification, required capabilities, health, fallback order.

Selection outputs: chosen connector/version + model identity recorded in Decision/Artifact provenance.

### 5.4 Fallback

On `Unavailable` / `Timeout` / `RateLimited`: try next provider in chain if classification policy allows; else fail step with `knowledge_unavailable`-style honesty for AI (do not invent). Partial model responses are rejected or marked invalid — never silently accepted as Requirements.

### 5.5 Hybrid deployments

Local connectors and cloud connectors implement the **same contracts**. Core cannot branch on “isLocal” for business rules — only adapters may optimize transport.

### 5.6 Non-goals

- Embedding vendor prompt formats in Domain  
- Treating model memory as EKB  
- Provider lock-in via Core types  

---

## 6. Knowledge Source Architecture

### 6.1 Role

Knowledge source connectors feed **Knowledge Intake** and Knowledge Synchronization workflows. They are **Source Adapters** in Knowledge Architecture terms.

### 6.2 Operations (logical)

- Discover libraries/sites/paths (scoped)  
- List documents + versions  
- Fetch content + metadata  
- Detect changes (when capable)  
- Project ACL/sensitivity labels into ATI classification concepts  

### 6.3 Authority alignment

| Rule | Meaning |
|------|---------|
| Intake first | All fetches enter via Knowledge Intake semantics |
| Classification | Before generation routing |
| Approved Requirements Source | Only by designation — not because a file lived in SharePoint |
| Supporting only | Historical/cloud/product docs augment; never override Approved Requirements Source |
| Publish governance | Sync creates draft/proposed knowledge; publish still governed |
| Conflict | Approved Requirements Source wins; Finding raised |

### 6.4 Failure isolation

Remote knowledge outage ⇒ continue Approved Requirements Source–only paths where valid; mark `knowledge_unavailable`; never invent; never mutate Core masters to “match” a stale remote.

---

## 7. Automation Integration Architecture

### 7.1 Goals

ATI Automation Management remains **framework-independent**. Connectors adapt specific runners/tools to Core Execution and Automation Asset concepts.

### 7.2 Capability groups (logical)

| Capability | Meaning |
|------------|---------|
| **Preparation** | Accept Automation Recommendations; locate/bind assets |
| **Generation assist** | Optional export of automation stubs (never silent overwrite of design Approvals) |
| **Execution** | Start/monitor runs |
| **Status** | Normalize running/completed/failed/cancelled |
| **Result collection** | Map to Execution Item Results |
| **Coverage mapping** | Link results back to Test Cases / Trace Links |
| **Recommendations feedback** | Feasibility/flakiness signals → Learning Candidates (governed) |

### 7.3 Independence rules

1. No Core dependency on a single automation framework.  
2. Multiple automation connectors may coexist per Organization.  
3. Execution truth in ATI is the normalized Execution object — vendor reports are evidence attachments.  
4. Automation cannot Approve Test Cases.  
5. Connector failure must not mark Cases as business-passed/failed incorrectly without explicit mapping rules.

---

## 8. Identity & Security Integration

### 8.1 Capabilities

| Concern | Integration role |
|---------|------------------|
| **Authentication** | Validate session/token via Identity connector |
| **Authorization** | Core policies use Role/Permission; IdP groups may map via adapter |
| **User identity** | Stable ATI User id linked to external subject id as alias |
| **Role propagation** | Mapped claims → ATI Roles (explicit mapping config) |
| **Audit identity** | Actor recorded on Approvals, Intake, workflow events |
| **Tenant awareness** | Organization binding from IdP tenant/app context |

### 8.2 Principles

- Core never embeds IdP-specific authorization DSLs.  
- Least privilege for connector credentials (separate from user tokens when syncing).  
- User-bound knowledge fetch must not exceed user’s external rights (Knowledge Architecture).  
- Identity outage ⇒ fail-secure (deny privileged actions); read-only degrade only if policy explicitly allows.  

---

## 9. Failure & Resilience

### 9.1 Failure classes (normalized)

Connector/provider failures, outages, partial responses, timeouts, rate limits, network failures, authentication failures.

### 9.2 Strategies (conceptual)

| Strategy | When |
|----------|------|
| **Retry** | Idempotent ops; transient `Timeout` / `Unavailable` / `RateLimited` with backoff policy |
| **Fallback** | Alternate connector/provider in same capability family |
| **Graceful degradation** | Skip optional enrichment; continue Core path (e.g., FDD/Approved Requirements Source–only) |
| **Partial success handling** | Persist successful subset with explicit partial status; do not mark whole sync authoritative |
| **Circuit isolation** | Stop calling Unhealthy connectors temporarily |
| **Fail-secure** | Auth failures deny access |
| **Compensation** | Long-running syncs resume from cursor; no corruption of sealed Core snapshots |
| **HITL escalation** | When business progress requires human after repeated failure |

### 9.3 Corruption prevention

1. External writes never directly mutate sealed Approved/Published Core artifacts.  
2. Ingested data lands as Intake/Draft until validation.  
3. Transactions/units of work in Core commit independently of remote success where possible (outbox/inbox conceptual patterns).  
4. Poison messages quarantined with audit.  

---

## 10. Observability

Conceptual integration monitoring:

| Facet | Meaning |
|-------|---------|
| **Connector health** | Per connector instance state |
| **Provider availability** | AI and other critical capabilities |
| **Synchronization status** | Knowledge/ALM sync cursors, lag, last success |
| **Execution history** | Automation connector runs linked to ATI Executions |
| **Integration diagnostics** | Normalized error codes, correlation ids |
| **Usage metrics** | Invocation counts, latency classes, rate-limit hits (no secrets) |
| **Error reporting** | Aggregated failure views for operators |

Observability must not become a channel for leaking credentials, raw tokens, or full sensitive document bodies.

---

## 11. Governance

### 11.1 Connector ownership

Each connector has a steward (platform or integration team) accountable for versions, security review, and deprecation.

### 11.2 Version compatibility

Maintain a compatibility matrix: ATI Core contract versions ↔ connector versions. Breaking Core contract changes require ADR.

### 11.3 Security boundaries

- Secrets in vault references only  
- Network egress allow-lists (operational policy)  
- Classification gates before external AI/knowledge calls  
- Tenant isolation on all connector configs and invocations  

### 11.4 Approval process

New production connectors require: security review, contract conformance review, stewardship assignment, Organization enablement approval.

### 11.5 Lifecycle management

Registration → enablement → monitor → upgrade → retire per §3.

### 11.6 Operational governance

- Change windows for breaking connector upgrades  
- Runbooks for provider outages (conceptual)  
- Disable switches per Organization  

---

## 12. Extensibility (Open/Closed)

### 12.1 Open for extension

Add without modifying ATI Core business logic:

- New AI providers  
- New document repositories  
- New automation frameworks  
- New identity providers  
- New reporting/export formats  
- New notification systems  
- New ALM/SCM systems  
- Future enterprise applications  

Mechanism: **new Connector + Adapter binding to existing Integration Contracts** (or additive new contract with ADR if capability is novel).

### 12.2 Closed for modification

Core Domain, authority rules, and workflow meaning do not change to accommodate a vendor.

### 12.3 When ADR is required

- New Core-facing Integration Contract major version  
- Granting any external system authority over Requirements  
- Removing adapter requirement for a vendor  
- Making a single vendor mandatory in Core  

---

## 13. Architecture Dependencies

This architecture is part of the ATI Enterprise Architecture. It **consumes** prior approved architectures, **inherits** their responsibilities and assumptions, and **extends** them only where integration concerns require. It does **not** redefine Core meaning.

### 13.1 Consumed Architectures

#### Foundation Architecture  
([ARCHITECTURE.md](./ARCHITECTURE.md), ADRs 0001–0003)

| Aspect | Detail |
|--------|--------|
| **Concepts consumed** | Modular monolith, Clean Architecture ports/adapters, cloud independence, AI-provider independence, observability baseline, configuration/secrets hygiene, deployable apps (`api` / `worker` / `web`). |
| **Responsibilities inherited** | Technology neutrality at Core; no vendor SDK in Domain; 12-factor config; portable topology. |
| **Assumptions relied upon** | External capabilities are reached through ports; infrastructure adapters are swappable; CI/CD and containerization remain outside Domain meaning. |

#### AI Reasoning Architecture  
([AI_REASONING_ARCHITECTURE.md](./AI_REASONING_ARCHITECTURE.md), ADR 0004)

| Aspect | Detail |
|--------|--------|
| **Concepts consumed** | Reasoning pipeline stages; Document / Understanding / Validation / Knowledge / Scenario / Test Case / QA Review / Coverage / Learning engines; AI Reasoning Port; provenance (engine, run, model identity as metadata). |
| **Responsibilities inherited** | Reason-before-generate; provider-agnostic engine contracts; structured artifact outputs. |
| **Assumptions relied upon** | Engines invoke AI only through ports; this Integration Architecture supplies the **AI Provider Adapter/Connector** realization of those ports without changing engine logic. |

#### Knowledge Architecture  
([KNOWLEDGE_ARCHITECTURE.md](./KNOWLEDGE_ARCHITECTURE.md), ADR 0005)

| Aspect | Detail |
|--------|--------|
| **Concepts consumed** | Enterprise Knowledge Base; knowledge domains; authority hierarchy; lifecycle (draft→publish→retire); intentional retrieval; source adapters; SharePoint-as-source (not semantic master). |
| **Responsibilities inherited** | Supporting knowledge never overrides Approved Requirements Source; sync creates draft/proposed items; ACL/classification projection. |
| **Assumptions relied upon** | Knowledge source connectors implement Source Adapter semantics; retrieval planner remains in Core; remote outage ⇒ Approved Requirements Source–only degrade. |

#### Domain Architecture  
([DOMAIN_ARCHITECTURE.md](./DOMAIN_ARCHITECTURE.md), ADR 0006)

| Aspect | Detail |
|--------|--------|
| **Concepts consumed** | Ubiquitous language (Organization, User, Role, Feature Version, Requirement, Scenario, Test Case, Automation Asset, Execution, Defect, Approval, etc.); bounded contexts; invariants; domain events. |
| **Responsibilities inherited** | External tickets/files/runners are not Domain masters; Approvals remain human-gated where Domain requires; Trace Link invariants stand. |
| **Assumptions relied upon** | Integration maps external identities to ATI identities as **aliases**; anti-corruption at adapter boundary. |

#### QA Intelligence Framework  
([QA_INTELLIGENCE_FRAMEWORK.md](./QA_INTELLIGENCE_FRAMEWORK.md), ADR 0007)

| Aspect | Detail |
|--------|--------|
| **Concepts consumed** | QA Thinking Model; heuristic packs; question library; coverage dimensions; test design strategy; self-evaluation. |
| **Responsibilities inherited** | Heuristics remain Core cognitive policy; integrations must not replace heuristics with vendor “auto-test” shortcuts. |
| **Assumptions relied upon** | Automation/ALM connectors may supply *signals* (results, defects) that feed Learning Candidates — not new product requirements. |

#### AI Decision & Evidence Framework  
([AI_DECISION_AND_EVIDENCE_FRAMEWORK.md](./AI_DECISION_AND_EVIDENCE_FRAMEWORK.md), ADR 0008)

| Aspect | Detail |
|--------|--------|
| **Concepts consumed** | Decision lifecycle; Evidence Model; Explanation Packets; HITL override; audit immutability; confidence ≠ certainty. |
| **Responsibilities inherited** | LLM/provider output is not evidence by itself; provider/model ids are provenance; human override supremacy. |
| **Assumptions relied upon** | AI and knowledge connectors return data that Core wraps into Decision/Evidence records; connectors do not “decide” Approvals. |

#### Enterprise Data Architecture (EIM)  
([ENTERPRISE_DATA_ARCHITECTURE.md](./ENTERPRISE_DATA_ARCHITECTURE.md), ADR 0009)

| Aspect | Detail |
|--------|--------|
| **Concepts consumed** | Information domains/objects; Document identity; versioning/lineage; Trace Links; AI Artifact seals; classification; immutability of published snapshots. |
| **Responsibilities inherited** | Storage locators and external version tokens are provenance, not primary keys; sealed artifacts are not corrupted by integration failure. |
| **Assumptions relied upon** | Object-storage connectors persist bytes for Documents/exports; EIM meaning stays in Core. |

#### Knowledge Intake & Workflow Orchestration Architecture  
([KNOWLEDGE_INTAKE_AND_WORKFLOW_ORCHESTRATION_ARCHITECTURE.md](./KNOWLEDGE_INTAKE_AND_WORKFLOW_ORCHESTRATION_ARCHITECTURE.md), ADR 0011)  
*(Terminology: [CANONICAL_TERMINOLOGY.md](./CANONICAL_TERMINOLOGY.md), ADR 0010)*

| Aspect | Detail |
|--------|--------|
| **Concepts consumed** | Knowledge Intake as entry; classification; structured object creation; workflows; execution modes; orchestration patterns; HITL pause/resume; long-running checkpoints; workflow observability. |
| **Responsibilities inherited** | All external content enters via Intake semantics; workflows exchange structured objects; Orchestrator sequences Core contracts and consumes connector health/degradation signals. |
| **Assumptions relied upon** | This Integration Architecture provides connectors for AI, knowledge sync, storage, identity, notifications, automation execution, exports — without redefining workflow catalogs or Intake stages. |

---

### 13.2 Architectural Boundaries

This document **MUST NOT redefine**:

| Forbidden to redefine | Owned by |
|-----------------------|----------|
| Domain concepts / ubiquitous language | Domain Architecture |
| AI reasoning logic / engine cognitive duties | AI Reasoning Architecture |
| Knowledge hierarchy / authority / EKB lifecycle | Knowledge Architecture |
| Information objects / EIM identity-version rules | Enterprise Data Architecture |
| Workflow definitions / execution modes / Intake stages | Knowledge Intake & Workflow Orchestration |
| Decision framework / evidence primacy rules | AI Decision & Evidence Framework |
| QA reasoning heuristics / question library / coverage dimensions | QA Intelligence Framework |

**Allowed extension (integration-only):**

- Integration Contracts, Adapter Layer, Connector Layer  
- Connector lifecycle, health, discovery, configuration, retirement  
- Normalized integration error model and resilience strategies  
- Provider selection/fallback **transport** policies (not reasoning policies)  
- Mapping rules from external payloads → existing Core/EIM shapes (anti-corruption)  
- Integration observability and connector governance  

---

### 13.3 Extension Responsibility

#### Capabilities this document introduces

1. Enterprise integration layering (Core → Contracts → Adapters → Connectors → Externals)  
2. Integration domains catalog (AI, Knowledge, ALM, SCM, Automation, Identity, Storage, Export, Notifications, future)  
3. Connector architecture (register, discover, capability, health, config, version, retire)  
4. Logical Integration Contracts (negotiation, compatibility, idempotency, normalized errors)  
5. AI provider multi-connector selection/fallback/hybrid **integration** model  
6. Knowledge/automation/identity/storage/notification **connector** patterns  
7. Integration failure isolation and non-corruption guarantees  
8. Integration observability and connector stewardship governance  
9. Open/Closed connector extensibility without Core modification  

#### Existing architectures this document extends

| Architecture | How extended (integration only) |
|--------------|----------------------------------|
| Foundation | Realizes cloud/AI independence as connector replaceability |
| AI Reasoning | Supplies AI Provider Adapter/Connector behind Reasoning Port |
| Knowledge | Supplies Source Adapters as Knowledge Source connectors |
| Domain | Supplies anti-corruption maps for ALM/SCM/IdP aliases |
| QA Intelligence | Supplies automation result/defect **signals** via connectors |
| Decision & Evidence | Supplies provider/model provenance channel; normalized remote failures for Decision handling |
| EIM | Supplies object-storage and document-fetch transport for Document bodies |
| Intake & Orchestration | Supplies connectors invoked by Intake/Sync/Execution/Notify/Export steps |

#### Future architecture gates that depend upon it

| Likely future gate | Dependency on this architecture |
|--------------------|----------------------------------|
| Security / Threat Model (deep) | Identity connector boundaries, egress, secret handling |
| Deployment / SRE / Multi-region | Connector health, fallback, residency-aware provider selection |
| Concrete connector enablement packs | Registration, stewardship, approval process herein |
| Platform Spine implementation | Ports in Core bound to Adapter/Connector SPI |
| ALM bi-directional sync productization | ALM domain contracts + non-corruption rules |
| Automation execution productization | Automation connector capability groups |
| Customer-specific enterprise connectors | Open/Closed extension model |

---

### 13.4 Architecture Dependency Matrix

| Architecture | Relationship | Responsibility |
|--------------|--------------|----------------|
| Foundation Architecture | **Consumed** | Provides Clean Architecture / portability assumptions; Integration realizes ports as Contracts→Adapters→Connectors |
| AI Reasoning Architecture | **Consumed / Extended** | Owns reasoning engines & ports; Integration extends with AI Provider connectors behind those ports |
| Knowledge Architecture | **Consumed / Extended** | Owns hierarchy, EKB lifecycle, source-adapter *semantics*; Integration extends with knowledge-source connectors |
| Domain Architecture | **Consumed** | Owns business language & invariants; Integration must not redefine Domain — only map external aliases |
| QA Intelligence Framework | **Consumed** | Owns QA heuristics & design strategy; Integration must not replace them with vendor auto-generation |
| AI Decision & Evidence Framework | **Consumed / Extended** | Owns Decision/Evidence rules; Integration extends with provider provenance & normalized remote failure inputs |
| Enterprise Data Architecture (EIM) | **Consumed / Extended** | Owns information objects & seals; Integration extends with storage/fetch transport without changing EIM meaning |
| Canonical Terminology (ADR 0010) | **Consumed** | Owns Knowledge Intake / Approved Requirements Source terms; Integration must honor them |
| Knowledge Intake & Workflow Orchestration | **Consumed / Extended** | Owns Intake, workflows, modes, HITL, checkpoints; Integration extends with connectors those workflows invoke |
| **This Integration & External Systems Architecture** | **Introduces** | Vendor-neutral integration fabric, connector lifecycle, resilience, integration governance |
| Future Security / Deployment / Connector Pack gates | **Depend on this** | Assume Contracts/Adapters/Connectors and non-corruption rules already defined |

---

## 14. Implementation Readiness (Not Authorization)

This document authorizes **integration architecture only**.

Future implementation must:

1. Define Integration Contracts as Core ports  
2. Implement Adapter + Connector SPI without leaking vendors into Domain  
3. Register connectors with health, config, versioning  
4. Enforce degradation and non-corruption rules  
5. Wire observability and governance gates  
6. Preserve boundaries in §13.2 (no redefinition of consumed architectures)  

No code, APIs, schemas, prompts, or SDK mandates are defined here.

---

## 15. Document Control

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-07-25 | Initial Integration & External Systems Architecture |
| 1.1 | 2026-07-25 | Added §13 Architecture Dependencies (consumed architectures, boundaries, extension responsibility, dependency matrix) |
| 1.2 | 2026-07-25 | Governance amendment only: added final section *Architectural Dependencies & Boundaries* (no change to approved integration decisions in §§1–12) |

---

## Architectural Dependencies & Boundaries

This amendment strengthens architectural governance and traceability only. It does **not** alter approved integration decisions in §§1–12 or any other approved ATI architecture. §13 remains a detailed narrative companion; this section is the normative governance summary.

---

### 1. Consumed Architectures

This document depends on the following approved architectures and inherits their concepts as listed.

| Approved architecture | Inherited concepts (consumed, not redefined) |
|-----------------------|-----------------------------------------------|
| [Foundation Architecture](./ARCHITECTURE.md) (ADRs 0001–0003) | Clean Architecture ports/adapters; modular monolith; cloud independence; AI-provider independence; config/secrets hygiene; deployable app boundaries |
| [AI Reasoning Architecture](./AI_REASONING_ARCHITECTURE.md) (ADR 0004) | Reasoning pipeline; engines; AI Reasoning Port; reason-before-generate; provider-agnostic engine contracts; artifact provenance metadata |
| [Knowledge Architecture](./KNOWLEDGE_ARCHITECTURE.md) (ADR 0005) | EKB; knowledge domains; authority hierarchy; knowledge lifecycle; intentional retrieval; source-adapter semantics; Approved Requirements Source supremacy over supporting knowledge |
| [Domain Architecture](./DOMAIN_ARCHITECTURE.md) (ADR 0006) | Ubiquitous language; bounded contexts; Domain invariants; Approvals; Trace Links; domain events; anti-corruption expectation for externals |
| [QA Intelligence Framework](./QA_INTELLIGENCE_FRAMEWORK.md) (ADR 0007) | QA Thinking Model; heuristics; question library; coverage dimensions; test design strategy; self-evaluation |
| [AI Decision & Evidence Framework](./AI_DECISION_AND_EVIDENCE_FRAMEWORK.md) (ADR 0008) | Decision lifecycle; Evidence Model; Explanation Packets; HITL override; confidence ≠ certainty; audit immutability |
| [Enterprise Data Architecture (EIM)](./ENTERPRISE_DATA_ARCHITECTURE.md) (ADR 0009) | Information domains/objects; Document identity; versioning/lineage; seals; classification; immutability of published snapshots |
| [Canonical Terminology](./CANONICAL_TERMINOLOGY.md) (ADR 0010) | Knowledge Intake; Knowledge Input; Approved Requirements Source; supporting knowledge rules |
| [Knowledge Intake & Workflow Orchestration](./KNOWLEDGE_INTAKE_AND_WORKFLOW_ORCHESTRATION_ARCHITECTURE.md) (ADR 0011) | Intake entry; classification; structured object handoff; workflows; execution modes; orchestration patterns; HITL pause/resume; checkpoints; workflow observability |

---

### 2. Architectural Boundaries

This document **must not redefine** the following. Ownership remains with the cited architectures:

| Concept area | Must not redefine | Owning architecture |
|--------------|-------------------|---------------------|
| Domain concepts / ubiquitous language | Objects, invariants, lifecycles, events | Domain Architecture |
| AI reasoning logic | Pipeline stages, engine cognitive duties | AI Reasoning Architecture |
| Knowledge hierarchy & EKB rules | Authority tiers, lifecycle, retrieval policy | Knowledge Architecture |
| Information objects | EIM identity, versioning, seals, trace model | Enterprise Data Architecture |
| Workflow definitions | Intake stages, workflow catalog, execution modes | Knowledge Intake & Workflow Orchestration |
| Decision framework | Decision types, evidence primacy, HITL supremacy | AI Decision & Evidence Framework |
| QA reasoning heuristics | Heuristics, questions, coverage dimensions, design strategy | QA Intelligence Framework |
| Canonical terms | Knowledge Intake / Approved Requirements Source meanings | Canonical Terminology (ADR 0010) |

This document may only add **integration-layer** concerns: contracts, adapters, connectors, connector lifecycle/health, normalized remote errors, transport fallback, and connector governance.

---

### 3. Extension Responsibilities

**This architecture introduces**

- ATI Core → Integration Contracts → Adapter Layer → Connector Layer → External Systems  
- Integration domains (AI, Knowledge, ALM, SCM, Automation, Identity, Storage, Export, Notifications, future)  
- Connector registration, discovery, capabilities, health, configuration, versioning, retirement  
- Logical Integration Contracts (validation, negotiation, compatibility, idempotency)  
- AI provider selection/fallback/hybrid **as integration transport**  
- Integration resilience and non-corruption guarantees  
- Integration observability and connector stewardship  
- Open/Closed extensibility for new connectors without Core modification  

**Future architecture gates that will depend on it**

- Deep Security / Threat Model (identity connectors, egress, secrets)  
- Deployment / SRE / multi-region operations (health, fallback, residency-aware routing)  
- Platform Spine implementation (binding Core ports to Adapter/Connector SPI)  
- Connector enablement packs (per-vendor stewardship under this model)  
- ALM and Automation productization (domain contracts + non-corruption rules)  
- Customer-specific enterprise connectors (extension without Core redesign)  

---

### 4. Architecture Dependency Matrix

| Architecture | Relationship | Responsibility |
|--------------|--------------|----------------|
| Foundation Architecture | Consumed | Supplies portability and Clean Architecture assumptions realized as Contracts→Adapters→Connectors |
| AI Reasoning Architecture | Consumed / Extended (integration only) | Owns reasoning; this doc supplies AI Provider connectors behind existing ports |
| Knowledge Architecture | Consumed / Extended (integration only) | Owns hierarchy/EKB semantics; this doc supplies knowledge-source connectors |
| Domain Architecture | Consumed | Owns business language/invariants; this doc maps external aliases only |
| QA Intelligence Framework | Consumed | Owns QA heuristics; this doc must not replace them with vendor shortcuts |
| AI Decision & Evidence Framework | Consumed / Extended (integration only) | Owns Decision/Evidence rules; this doc supplies provider provenance and normalized remote failures |
| Enterprise Data Architecture (EIM) | Consumed / Extended (integration only) | Owns information meaning/seals; this doc supplies storage/fetch transport |
| Canonical Terminology (ADR 0010) | Consumed | Owns Intake / Approved Requirements Source terms; this doc must honor them |
| Knowledge Intake & Workflow Orchestration | Consumed / Extended (integration only) | Owns Intake/workflows; this doc supplies connectors those workflows invoke |
| **Integration & External Systems Architecture (this document)** | Introduces | Vendor-neutral integration fabric, connector lifecycle, resilience, integration governance |
| Future Security / Deployment / Connector Pack gates | Depend on this | Rely on Contracts/Adapters/Connectors and non-corruption rules defined here |

---

*End of Integration & External Systems Architecture.*
