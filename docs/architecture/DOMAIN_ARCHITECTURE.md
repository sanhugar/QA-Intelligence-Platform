# Domain Architecture — Canonical Business Model

**Document ID:** ATI-ARCH-DOMAIN-001  
**Status:** Approved architecture (design only — no implementation)  
**Product:** AI QA Intelligence Platform (ATI v2)  
**Audience:** Product Owner, Chief Architect, Domain Experts, Implementation Engineer  
**Depends on:** [ARCHITECTURE.md](./ARCHITECTURE.md), [CANONICAL_TERMINOLOGY.md](./CANONICAL_TERMINOLOGY.md), [AI_REASONING_ARCHITECTURE.md](./AI_REASONING_ARCHITECTURE.md), [KNOWLEDGE_ARCHITECTURE.md](./KNOWLEDGE_ARCHITECTURE.md), [AI_DEVELOPMENT_CHARTER.md](../standards/AI_DEVELOPMENT_CHARTER.md)  
**ADR:** [0006 — Domain Architecture](../adr/0006-domain-architecture.md); terminology clarified by [ADR 0010](../adr/0010-knowledge-intake-terminology.md)  
**Last updated:** 2026-07-25

---

## 0. Purpose and Scope

This document defines **WHAT ATI IS** as a business system: the ubiquitous language, bounded contexts, domain objects, relationships, lifecycles, invariants, domain events, extensibility, and governance.

It is the **canonical business model**. Future database schemas, APIs, UI, AI engines, reporting, and automation must conform to this model — not invent parallel vocabularies.

### Explicitly out of scope

- Code, APIs, UI, prompts  
- Database tables / physical columns / field lists  
- Technology choices for persistence or messaging  

### Design stance

- **Domain-Driven Design** (ubiquitous language, bounded contexts, aggregates as business ownership units, domain events)
- **Knowledge Intake** as platform entry; multi-source Knowledge Inputs  
- **Approved Requirements Source primacy** (FDD/PRD/SRS/equivalent) for Requirements → Scenarios → Test Cases  
- **Reason before generate** for QA artifacts  
- **Supporting knowledge augments; never owns or invents requirements**  
- Aligns with ATI Brain and Knowledge Architecture without restating their internal engine mechanics  
- Terminology: [CANONICAL_TERMINOLOGY.md](./CANONICAL_TERMINOLOGY.md) 

---

## 1. Ubiquitous Language

Terms below are normative. Synonyms in conversation must map to these names in artifacts and designs.

| Term | Definition |
|------|------------|
| **Organization** | The top-level enterprise tenant boundary that owns products, users, policies, and knowledge governance for ATI usage. |
| **Workspace** | A collaboration boundary within an Organization used to group related Products, Projects, and teams for day-to-day QA intelligence work. |
| **Product** | A shippable software offering (or major platform) under an Organization for which Features, Releases, and QA artifacts are managed. |
| **Project** | A time-bounded or initiative-bounded effort within a Workspace that coordinates Features, Sprints, and Releases toward a business outcome. |
| **Knowledge Intake** | Canonical platform entry: accepting one or more Knowledge Inputs for registration, understanding, and reasoning. |
| **Knowledge Input** | Any governed source accepted via Knowledge Intake (FDD, PRD, SRS, transcripts, cloud refs, product docs, standards, AI-derived candidates, etc.). |
| **Approved Requirements Source** | The designated approved requirements specification for a Feature Version (FDD, PRD, SRS, or equivalent). Authoritative for requirement analysis, scenario generation, and test case generation. |
| **Feature** | A coherent unit of product capability described and evolved through Approved Requirements Sources and Feature Versions. |
| **Feature Version** | An immutable revision of a Feature’s design authority for a point in time, anchored by an Approved Requirements Source Document and used as the scope for Requirements and downstream artifacts. |
| **Feature Design Document (FDD)** | A common Knowledge Input type and common form of Approved Requirements Source. Not the sole platform entry; not the only possible approved specification type. |
| **Document** | A governed content artifact ingested or referenced by ATI (specifications, policies, guides, transcripts exports, etc.), with provenance and version identity. |
| **Requirement** | A discrete, testable statement of need or constraint belonging to exactly one Feature Version (functional or non-functional). |
| **Requirement Object** | The structured, evidence-backed business understanding of a Feature Version produced by analysis over the Approved Requirements Source; subordinate to that source. |
| **Ambiguity** | An explicit unknown or unclear point in understanding that must not be silently filled with invented behavior. |
| **Assumption** | A provisional interpretation recorded for progress, never treated as approved product fact until accepted by an authorized human role. |
| **Scenario** | A reasoned testable behavior/journey/condition derived from one or more Requirements; describes *what* to verify, not full procedural test detail. |
| **Test Case** | A reasoned verification procedure that belongs to a Scenario and specifies how that Scenario is checked at a logical level. |
| **Test Suite** | A curated collection of Test Cases (and/or Scenarios) grouped for planning, execution, or release confidence — does not own Requirements. |
| **Automation Asset** | An automation implementation (script, module, flow, or binder) that realizes one or more Test Cases for machine execution. |
| **Release** | A planned delivery of Product capability to an environment/channel, against which scope, testing, and confidence are managed. |
| **Sprint** | A short planning cadence within a Project used to organize work; may associate Features/Test Suites/Executions but does not redefine Requirements. |
| **Execution** | A run of tests (manual and/or automated) against a defined scope (Suite, Release, Sprint, or ad-hoc selection) producing results. |
| **Defect** | A recorded failure or deviation discovered in Execution (or otherwise reported) that should link back into the traceability chain when possible. |
| **Knowledge Item** | A governed unit of durable organizational knowledge in the Enterprise Knowledge Base; augments reasoning; never overrides the Approved Requirements Source. |
| **Knowledge Domain** | A stewardship partition of Knowledge Items (product, testing patterns, standards, etc.). |
| **AI Review** | A governed critique produced by ATI (and/or humans) over reasoning/design artifacts, yielding findings and a readiness disposition — not an automatic overwrite of approved work. |
| **Coverage Assessment** | A business evaluation of how well Scenarios/Test Cases address Requirements and mandatory QA dimensions for a Feature Version or Release. |
| **Trace Link** | An explicit business relationship connecting artifacts in the verification chain (e.g., Requirement→Scenario→Test Case). |
| **Report** | A presentable business summary derived from domain state (coverage, release readiness, defect trends, AI Review outcomes). |
| **User** | A person (or service identity treated as an actor) who uses ATI under an Organization. |
| **Role** | A named set of permissions and responsibilities assigned to Users (e.g., Product Owner, QA Lead, Automation Architect). |
| **Approval** | An authorized human decision that advances an artifact’s lifecycle (distinct from AI suggestion). |
| **Reasoning Package** | The versioned business bundle of analysis outputs for a Feature Version (Requirement Object, Scenarios, Test Cases, AI Review, Coverage Assessment, Trace Links). |
| **Clarification** | An authorized Product answer that resolves Ambiguities; becomes an input to understanding without inventing undocumented features unilaterally. |

### Language rules

1. Prefer these terms in all ADRs, APIs (later), UI labels, and AI artifact names.  
2. Do not use “spec,” “story,” or “ticket” as substitutes for **Requirement** unless mapped explicitly.  
3. “Test” alone is ambiguous — use **Scenario**, **Test Case**, or **Execution**.  
4. **Knowledge Item** is never a synonym for **Requirement**.  

---

## 2. Bounded Contexts

Contexts below are **business capability boundaries**. Each owns its models and publishes contracts to others. Shared kernel terms come from §1.

### 2.1 Context map (summary)

```
Administration
    │ tenancy, identity, roles
    ▼
Requirement Management ◄──── Knowledge Management (augment only)
    │
    ▼
Test Design ◄──── AI Review (critique)
    │
    ├──────────► Automation Management
    │
    ▼
Execution Management ──► Defects (within Execution or shared Defect capability)
    │
    ▼
Release Management
    │
    ▼
Reporting (reads many; owns Report definitions/outputs)
```

---

### 2.2 Administration

| Aspect | Definition |
|--------|------------|
| **Responsibilities** | Organizations, Workspaces, Users, Roles, membership, security policy baselines, platform configuration stewardship. |
| **Owned domain objects** | Organization, Workspace, User, Role, Membership, (policy references). |
| **Services provided** | Identity & access boundaries; workspace provisioning; role assignment; audit identity context. |
| **Dependencies** | None for core tenancy; may consume Compliance Knowledge for policy baselines (read). |

---

### 2.3 Requirement Management

| Aspect | Definition |
|--------|------------|
| **Responsibilities** | Products, Projects, Features, Feature Versions, Documents (as business information once registered), Requirements, Requirement Objects, Ambiguities, Assumptions, Clarifications; maintain Approved Requirements Source primacy for generation. **Does not own** Knowledge Intake operational entry, classification, or role designation — those are owned by Knowledge Intake & Workflow Orchestration (ADR 0011); Application Architecture packages the Intake Coordination module. |
| **Owned domain objects** | Product, Project, Feature, Feature Version, Document, Requirement, Requirement Object, Ambiguity, Assumption, Clarification, Reasoning Package (analysis portion). |
| **Services provided** | Register Feature Versions; analyze designated Approved Requirements Source Documents into Requirement Objects; validate understanding; approve Requirements; expose requirement baselines to other contexts. |
| **Dependencies** | Administration (tenancy/authz); Knowledge Management (optional augment); consumes Intake-orchestrated Document registration; does **not** depend on Test Design to exist. |

---

### 2.4 Test Design

| Aspect | Definition |
|--------|------------|
| **Responsibilities** | Scenarios, Test Cases, Test Suites, Trace Links from requirements through cases; scenario/case reasoning outcomes as business artifacts. |
| **Owned domain objects** | Scenario, Test Case, Test Suite, Trace Link (design-level), Coverage Assessment (design-scope). |
| **Services provided** | Produce and govern test design artifacts; enforce traceability to Requirements; package design for review/release planning. |
| **Dependencies** | Requirement Management (mandatory upstream); Knowledge Management (patterns); AI Review (critique before approval). |

---

### 2.5 Knowledge Management

| Aspect | Definition |
|--------|------------|
| **Responsibilities** | Knowledge Domains, Knowledge Items, lifecycle/approval of knowledge, retrieval intents as business capability (not LLM memory). |
| **Owned domain objects** | Knowledge Domain, Knowledge Item, Knowledge Publication, Learning Candidate. |
| **Services provided** | Publish/retire knowledge; answer intentional retrieval for other contexts; govern learning promotions. |
| **Dependencies** | Administration; may reference Documents/Features for scoping; **never owns Requirements**. |

*Detail authority: [KNOWLEDGE_ARCHITECTURE.md](./KNOWLEDGE_ARCHITECTURE.md).*

---

### 2.6 Release Management

| Aspect | Definition |
|--------|------------|
| **Responsibilities** | Releases, release scope (Features/Feature Versions/Suites), readiness gates, linkage to Executions and Reports. |
| **Owned domain objects** | Release, Release Scope Item, Sprint (if treated as release-planning cadence; may be shared with Project planning). |
| **Services provided** | Plan/activate/close Releases; declare in-scope Feature Versions; consume Coverage and Execution outcomes for readiness. |
| **Dependencies** | Requirement Management, Test Design, Execution Management, Reporting. |

---

### 2.7 Automation Management

| Aspect | Definition |
|--------|------------|
| **Responsibilities** | Automation Assets, linkage to Test Cases, automation readiness, framework conventions as practice (not product specs). |
| **Owned domain objects** | Automation Asset, Automation Link. |
| **Services provided** | Register automation; bind to Test Cases; report automation coverage of approved cases. |
| **Dependencies** | Test Design (approved Test Cases); Knowledge Management (automation patterns); Execution Management (runtime feedback). |

---

### 2.8 Execution Management

| Aspect | Definition |
|--------|------------|
| **Responsibilities** | Executions, results, evidence of runs; association to Suites/Releases/Sprints; Defect discovery hooks. |
| **Owned domain objects** | Execution, Execution Item Result, (Defect if owned here or in a Defect sub-capability — see §3). |
| **Services provided** | Plan/start/complete Executions; record pass/fail; emit completion events; link Defects. |
| **Dependencies** | Test Design, Automation Management, Release Management; Administration for actors. |

---

### 2.9 Reporting

| Aspect | Definition |
|--------|------------|
| **Responsibilities** | Report definitions and produced Reports for coverage, readiness, quality trends, AI Review summaries. |
| **Owned domain objects** | Report, Report Definition/Snapshot. |
| **Services provided** | Generate and retain business Reports; never invent Requirements while reporting. |
| **Dependencies** | Read models from Requirement, Test Design, Knowledge, Release, Automation, Execution. |

---

### 2.10 AI Assurance (cross-cutting capability within Test Design / Requirement Management)

AI Review and Coverage Assessment are **business capabilities** primarily consumed at the boundary of Requirement Management and Test Design. They may be modeled as a supporting context **AI Assurance** if organizational scale warrants separation:

| Aspect | Definition |
|--------|------------|
| **Responsibilities** | AI Review records, Coverage Assessments, readiness dispositions for Reasoning Packages. |
| **Owned domain objects** | AI Review, Coverage Assessment, Finding. |
| **Services provided** | Critique packages; gate “ready for approval”; never auto-overwrite Approved artifacts. |
| **Dependencies** | Requirement Management, Test Design; Knowledge Management (standards/checklists). |

*Reasoning mechanics: [AI_REASONING_ARCHITECTURE.md](./AI_REASONING_ARCHITECTURE.md).*

---

## 3. Domain Objects

For each major object: purpose, responsibilities, lifecycle summary, ownership context, relationships, business rules. **No fields/columns.**

---

### 3.1 Organization

| Aspect | Detail |
|--------|--------|
| **Purpose** | Tenant root for ATI business data and policy. |
| **Responsibilities** | Boundary for Users, Products, Knowledge governance defaults. |
| **Lifecycle** | Provisioned → Active → Suspended → Decommissioned. |
| **Ownership** | Administration. |
| **Relationships** | Contains Workspaces, Users, Products (directly or via Workspace policy). |
| **Business rules** | No cross-Organization leakage of Features, Knowledge, or Executions. |

---

### 3.2 Workspace

| Aspect | Detail |
|--------|--------|
| **Purpose** | Team collaboration boundary inside an Organization. |
| **Responsibilities** | Group Products/Projects and access for a working group. |
| **Lifecycle** | Created → Active → Archived. |
| **Ownership** | Administration. |
| **Relationships** | Belongs to one Organization; hosts Projects; associates Products. |
| **Business rules** | Workspace cannot span Organizations. |

---

### 3.3 Product

| Aspect | Detail |
|--------|--------|
| **Purpose** | The software offering under quality intelligence. |
| **Responsibilities** | Anchor Features, Releases, Product Knowledge scope. |
| **Lifecycle** | Planned → Active → Sunset → Retired. |
| **Ownership** | Requirement Management (catalog); Product Owner accountable. |
| **Relationships** | Organization/Workspace; has many Features, Releases, Knowledge Items (scoped). |
| **Business rules** | Requirements and Knowledge product-facts must resolve to a Product. |

---

### 3.4 Project

| Aspect | Detail |
|--------|--------|
| **Purpose** | Initiative container coordinating delivery work. |
| **Responsibilities** | Associate Features, Sprints, and planning intent. |
| **Lifecycle** | Proposed → Active → Completed → Archived. |
| **Ownership** | Requirement Management / delivery planning. |
| **Relationships** | Workspace; many Features; many Sprints; may link Releases. |
| **Business rules** | Project does not own Requirement statements; Feature Version does. |

---

### 3.5 Feature

| Aspect | Detail |
|--------|--------|
| **Purpose** | Long-lived capability identity across versions. |
| **Responsibilities** | Collect Feature Versions; maintain feature identity. |
| **Lifecycle** | Identified → In Design → Active → Deprecated → Retired. |
| **Ownership** | Requirement Management; Feature Owner accountable. |
| **Relationships** | Product (required); many Feature Versions; optional Project links. |
| **Business rules** | Business behavior for testing is taken from a selected **Feature Version**, not an unversioned Feature blob. |

---

### 3.6 Feature Version

| Aspect | Detail |
|--------|--------|
| **Purpose** | Immutable design baseline for analysis and verification. |
| **Responsibilities** | Anchor Approved Requirements Source Document, Requirements, Requirement Object, Reasoning Package. |
| **Lifecycle** | Draft → Under Analysis → Analysed → Approved → Superseded → Deprecated. |
| **Ownership** | Requirement Management. |
| **Relationships** | One Feature; one primary Approved Requirements Source Document (versioned); many Requirements; one current Requirement Object revision lineage; many Scenarios (via Test Design). |
| **Business rules** | Superseding creates a new Feature Version; downstream artifacts of the old version become stale relative to the new authority. |

---

### 3.7 Document

| Aspect | Detail |
|--------|--------|
| **Purpose** | Governed content input/reference (Approved Requirements Sources and other Knowledge Inputs). |
| **Responsibilities** | Carry provenance, version identity, classification, input role. |
| **Lifecycle** | Received → Parsed → Active Reference → Superseded → Archived. |
| **Ownership** | Requirement Management for Approved Requirements Sources; Knowledge Management for supporting mirrored sources; both respect Document identity. |
| **Relationships** | May anchor a Feature Version as Approved Requirements Source; may source Knowledge Items as supporting inputs. |
| **Business rules** | Designated Approved Requirements Source for a Feature Version is authoritative for Requirements/Scenarios/Test Cases. |

---

### 3.8 Requirement

| Aspect | Detail |
|--------|--------|
| **Purpose** | Single testable need/constraint for a Feature Version. |
| **Responsibilities** | Be approvable; be linkable to Scenarios; express status honestly (including untestable). |
| **Lifecycle** | See §5.1. |
| **Ownership** | Requirement Management. |
| **Relationships** | Belongs to **one** Feature Version; linked from many Scenarios; evidenced by Document. |
| **Business rules** | Cannot move to Approved while marked conflicting with Approved Requirements Source; Knowledge Items cannot own or replace it. |

---

### 3.9 Requirement Object

| Aspect | Detail |
|--------|--------|
| **Purpose** | Structured understanding of the Feature Version after analysis. |
| **Responsibilities** | Hold organized requirements facets, ambiguities, assumptions, evidence mapping at the business level. |
| **Lifecycle** | Draft → Validated → Approved Snapshot → Superseded. |
| **Ownership** | Requirement Management. |
| **Relationships** | One Feature Version; derives from Approved Requirements Source; feeds Test Design. |
| **Business rules** | If it disagrees with Approved Requirements Source, the Requirement Object is defective; supporting knowledge cannot invent features. |

---

### 3.10 Scenario

| Aspect | Detail |
|--------|--------|
| **Purpose** | Testable behavior unit derived from Requirements. |
| **Responsibilities** | Express intent/preconditions/type; maintain requirement Trace Links. |
| **Lifecycle** | See §5.2. |
| **Ownership** | Test Design. |
| **Relationships** | ≥1 Requirement; many Test Cases; may belong to Suites. |
| **Business rules** | Cannot exist without ≥1 Requirement link; cannot invent behavior absent Requirements/Clarifications. |

---

### 3.11 Test Case

| Aspect | Detail |
|--------|--------|
| **Purpose** | Verification procedure for a Scenario. |
| **Responsibilities** | Provide logical steps/expectations; stay traced. |
| **Lifecycle** | See §5.3. |
| **Ownership** | Test Design. |
| **Relationships** | Primary Scenario (required); optional secondary Scenario links; optional Automation Assets; Execution results. |
| **Business rules** | Must belong to a Scenario; expected results must not invent product facts. |

---

### 3.12 Test Suite

| Aspect | Detail |
|--------|--------|
| **Purpose** | Curated set for planning and execution. |
| **Responsibilities** | Group cases/scenarios; define suite purpose (smoke, regression, release). |
| **Lifecycle** | Draft → Active → Locked (for release) → Archived. |
| **Ownership** | Test Design. |
| **Relationships** | Contains Test Cases/Scenarios; used by Releases/Executions. |
| **Business rules** | Suite membership does not create Trace Links; underlying case links remain source of truth. |

---

### 3.13 Automation Asset

| Aspect | Detail |
|--------|--------|
| **Purpose** | Machine-executable realization of Test Cases. |
| **Responsibilities** | Maintain binding to cases; reflect automation readiness. |
| **Lifecycle** | Draft → Linked → Active → Broken → Deprecated. |
| **Ownership** | Automation Management. |
| **Relationships** | Links to ≥1 Test Case; used in Executions. |
| **Business rules** | Cannot be “Approved Test Case substitute”; automation does not approve design. |

---

### 3.14 Release

| Aspect | Detail |
|--------|--------|
| **Purpose** | Delivery vehicle for Product changes. |
| **Responsibilities** | Define scope; track testing readiness; close with records. |
| **Lifecycle** | See §5.4. |
| **Ownership** | Release Management. |
| **Relationships** | Product; Feature Versions in scope; Suites; Executions; Reports; Defects. |
| **Business rules** | Release readiness cannot claim coverage without Trace/Coverage evidence for in-scope Feature Versions. |

---

### 3.15 Sprint

| Aspect | Detail |
|--------|--------|
| **Purpose** | Cadence container for work organization. |
| **Responsibilities** | Time-box planning associations. |
| **Lifecycle** | Planned → Active → Completed → Closed. |
| **Ownership** | Project/Release planning (Release Management or Project planning jointly). |
| **Relationships** | Project; optional Release; optional Suite/Execution associations. |
| **Business rules** | Sprint dates do not alter Requirement meaning. |

---

### 3.16 Execution

| Aspect | Detail |
|--------|--------|
| **Purpose** | A concrete test run producing results. |
| **Responsibilities** | Record outcomes/evidence; spawn or link Defects. |
| **Lifecycle** | Planned → Running → Completed → Cancelled → Archived. |
| **Ownership** | Execution Management. |
| **Relationships** | Suite/Release/Sprint scope; Execution Item Results; Defects; Automation Assets used. |
| **Business rules** | Results attach to Test Cases (or explicit manual items); cannot rewrite Requirements. |

---

### 3.17 Defect

| Aspect | Detail |
|--------|--------|
| **Purpose** | Recorded product/quality problem. |
| **Responsibilities** | Capture issue; preferably close the loop to Case/Scenario/Requirement. |
| **Lifecycle** | Open → Triaged → In Progress → Resolved → Verified → Closed → Reopened. |
| **Ownership** | Execution Management (discovery) with Product/QA stewardship. |
| **Relationships** | Execution; optional Test Case/Scenario/Requirement/Feature Version; Release. |
| **Business rules** | Defects are not Requirements; recurring patterns may promote to Knowledge (risk), not to silent new Requirements. |

---

### 3.18 Knowledge Item

| Aspect | Detail |
|--------|--------|
| **Purpose** | Durable governed knowledge unit. |
| **Responsibilities** | Remain versioned, approved, attributable; serve retrieval. |
| **Lifecycle** | Per Knowledge Architecture (draft→…→archived). |
| **Ownership** | Knowledge Management. |
| **Relationships** | Domain; Product/Feature scope optional; evidence Documents; used by reasoning runs. |
| **Business rules** | Never owns Requirements; never overrides Approved Requirements Source; AI-proposed items are not published facts until Approval. |

---

### 3.19 AI Review

| Aspect | Detail |
|--------|--------|
| **Purpose** | Critique of a Reasoning Package / design set. |
| **Responsibilities** | Produce Findings; recommend readiness; identify rewind targets. |
| **Lifecycle** | Requested → In Progress → Completed → Acknowledged → Superseded. |
| **Ownership** | AI Assurance / Test Design boundary. |
| **Relationships** | Feature Version / Reasoning Package; Findings; may reference Coverage Assessment. |
| **Business rules** | Cannot automatically overwrite Approved Requirements, Scenarios, or Test Cases. |

---

### 3.20 Coverage Assessment

| Aspect | Detail |
|--------|--------|
| **Purpose** | Business statement of coverage sufficiency. |
| **Responsibilities** | Expose gaps; support Release/Feature readiness. |
| **Lifecycle** | Draft → Calculated → Accepted → Superseded. |
| **Ownership** | AI Assurance / Test Design. |
| **Relationships** | Feature Version or Release; Trace Links; Scenarios; Test Cases. |
| **Business rules** | Unknowns do not count as covered. |

---

### 3.21 Report

| Aspect | Detail |
|--------|--------|
| **Purpose** | Stakeholder-facing summary artifact. |
| **Responsibilities** | Present derived truth honestly with lineage. |
| **Lifecycle** | Requested → Generated → Published → Archived. |
| **Ownership** | Reporting. |
| **Relationships** | Source Feature Version/Release/Execution snapshots. |
| **Business rules** | Reports must not fabricate Requirements or hide Ambiguities material to the claim. |

---

### 3.22 User & Role

| Aspect | Detail |
|--------|--------|
| **Purpose** | People and responsibility models for governance actions. |
| **Responsibilities** | Authenticate identity (platform); authorize Approvals and stewardship. |
| **Lifecycle** | User: Invited → Active → Suspended → Removed. Role: Defined → Active → Retired. |
| **Ownership** | Administration. |
| **Relationships** | Organization membership; Role assignments; Approval actors on artifacts. |
| **Business rules** | Approvals require Users with appropriate Roles; AI identities cannot replace mandatory human Approvals for product-fact publication. |

---

### 3.23 Finding

| Aspect | Detail |
|--------|--------|
| **Purpose** | Discrete issue from Validation, AI Review, or Coverage. |
| **Responsibilities** | Severity, target artifact, disposition. |
| **Lifecycle** | Open → Accepted → Resolved → Waived → Closed. |
| **Ownership** | Context that created it (Requirement Management or AI Assurance). |
| **Relationships** | AI Review / Validation / Coverage Assessment; target Requirement/Scenario/Test Case. |
| **Business rules** | Waiver requires authorized human Role; waiver is recorded, not silent. |

---

### 3.24 Reasoning Package

| Aspect | Detail |
|--------|--------|
| **Purpose** | Versioned business bundle of reasoning outputs for a Feature Version. |
| **Responsibilities** | Provide an immutable publishable unit for review and downstream use. |
| **Lifecycle** | Draft → Under Review → Ready → Published → Stale (on Feature Version supersede) → Archived. |
| **Ownership** | Requirement Management + Test Design jointly (package as integration aggregate). |
| **Relationships** | Feature Version; Requirement Object; Scenarios; Test Cases; AI Review; Coverage Assessment; Trace Links. |
| **Business rules** | Published packages are immutable; corrections produce a new package revision. |

---

## 4. Relationship Model

### 4.1 Primary verification chain

```
Knowledge Intake → Knowledge Inputs (Documents / specs / supporting sources)
Organization
  └── Workspace
        └── Product
              └── Feature
                    └── Feature Version  ←── Document (Approved Requirements Source:
                                              FDD / PRD / SRS / equivalent)
                          └── Requirement
                                └── Scenario
                                      └── Test Case
                                            └── Automation Asset
                                                  └── Execution
                                                        └── Defect
```

Release and Sprint attach laterally:

```
Product → Release → (Feature Versions, Test Suites, Executions, Reports)
Project → Sprint → (work associations; not requirement ownership)
```

Knowledge attaches as augmentation:

```
Organization/Product/Feature → Knowledge Item   (no ownership of Requirement)
Document → Knowledge Item (source)
```

### 4.2 Cardinality (conceptual)

| Relationship | Cardinality | Ownership rule |
|--------------|-------------|----------------|
| Organization → Workspace | 1 → many | Organization owns |
| Organization → Product | 1 → many | Organization owns |
| Product → Feature | 1 → many | Product owns |
| Feature → Feature Version | 1 → many | Feature owns versions |
| Feature Version → Document (Approved Requirements Source) | 1 → 1 primary | Version anchored by FDD/PRD/SRS/equivalent |
| Feature Version → Requirement | 1 → many | Version owns Requirements |
| Requirement → Scenario | many ↔ many (via Trace Links), Scenario requires ≥1 Requirement | Test Design owns Scenario; links mandatory |
| Scenario → Test Case | 1 → many (primary) | Scenario owns cases as design children |
| Test Case → Automation Asset | many ↔ many | Automation Management owns assets; links explicit |
| Test Case → Execution results | 1 → many over time | Execution owns results |
| Execution → Defect | 1 → many | Execution/Defect stewardship |
| Product → Release | 1 → many | Release Management owns Release |
| Release → Feature Version (scope) | many ↔ many | Scope links; does not copy Requirements |
| Knowledge Item → Requirement | none (forbidden ownership) | May *reference* only as supporting evidence |
| AI Review → Reasoning Package | many → 1 over time | Reviews critique; do not become the package |

### 4.3 Ownership principles

1. **Single ownership** — each object has one owning context.  
2. **References across contexts** use identities + Trace Links, not duplicated master data.  
3. **Downstream cannot redefine upstream meaning** (e.g., Execution cannot change a Requirement).  
4. **Supersession flows downward as staleness**, not silent mutation.  

---

## 5. Domain Lifecycles

Transition rules are business rules. Technical workflows must honor them.

### 5.1 Requirement

```
Draft → Analysed → Approved → Implemented → Deprecated
         │           │
         └→ Rejected ┘
         └→ Blocked (ambiguity) → Draft/Analysed after Clarification
```

| Transition | Rule |
|------------|------|
| Draft → Analysed | Understanding/validation produced coherent analysed state |
| Analysed → Approved | Authorized Approval; no unresolved blocking Ambiguity unless waived |
| Approved → Implemented | Delivery acknowledges implementation against this Requirement (signal from delivery process) |
| Any → Deprecated | Feature Version superseded or Requirement withdrawn |
| → Blocked | Blocking Ambiguity/conflict with FDD |
| Approved cannot be silently edited | Changes require new revision / re-approval path |

---

### 5.2 Scenario

```
Draft → Generated → Reviewed → Approved → Archived
                      │
                      └→ Returned for Revision → Draft/Generated
```

| Transition | Rule |
|------------|------|
| Draft → Generated | Produced by Scenario Reasoning (or equivalent authorized design act) with ≥1 Requirement link |
| Generated → Reviewed | AI Review and/or human review performed |
| Reviewed → Approved | Authorized Approval |
| → Returned | Findings require rework |
| → Archived | Obsolete after Feature Version supersede or suite cleanup |
| No Approval without Requirement links | Invariant |

---

### 5.3 Test Case

```
Generated → Reviewed → Approved → Automated → Deprecated
                │           │
                └→ Returned ┘
```

| Transition | Rule |
|------------|------|
| Generated → Reviewed | Review complete (AI and/or human) |
| Reviewed → Approved | Authorized Approval; Scenario still Approved or co-approved per policy |
| Approved → Automated | Automation Asset linked and accepted as implementing the case |
| → Deprecated | Case withdrawn or Scenario archived |
| Automated does not imply Approved | Cannot skip Approval by linking automation |

---

### 5.4 Release

```
Planned → Active → Testing → Released → Closed
             │         │
             └→ Aborted / Deferred
```

| Transition | Rule |
|------------|------|
| Planned → Active | Scope declared (Feature Versions / Suites) |
| Active → Testing | Execution phase begun |
| Testing → Released | Readiness gates satisfied or explicit risk Acceptance by authorized Role |
| Released → Closed | Post-release activities complete |
| Cannot claim Released with unknown mandatory coverage | Unless formal waiver recorded |

---

### 5.5 Feature Version

```
Draft → Under Analysis → Analysed → Approved → Superseded → Deprecated
```

| Transition | Rule |
|------------|------|
| Under Analysis | Document registered; analysis in progress |
| Analysed | Requirement Object validated (gate ≠ fail) |
| Approved | Product/QA authority accepts baseline for design/test |
| Superseded | Newer Feature Version becomes current |
| Downstream packages marked Stale on Superseded | Mandatory |

---

### 5.6 Knowledge Item

```
Draft/Proposed → Validated → Approved → Published → Retired → Archived
                      └→ Rejected
```

(Aligned with Knowledge Architecture; product-fact path requires human Approval.)

---

### 5.7 Execution

```
Planned → Running → Completed
                 └→ Cancelled
Completed → Archived
```

| Transition | Rule |
|------------|------|
| Running → Completed | All planned items terminal or explicitly truncated with reason |
| Results immutable after Completed | Corrections via new Execution or amendment record — policy-governed |

---

### 5.8 AI Review

```
Requested → In Progress → Completed → Acknowledged → Superseded
```

| Transition | Rule |
|------------|------|
| Completed produces Findings + disposition | `ready` / `revise` / `blocked` |
| Acknowledged | Humans recorded response; does not auto-change Approved artifacts |
| Superseded | Newer review replaces prior as current critique |

---

### 5.9 Defect

```
Open → Triaged → In Progress → Resolved → Verified → Closed
                              └→ Reopened → …
```

| Transition | Rule |
|------------|------|
| Verified preferably via Execution | Linked Test Case when applicable |
| Closing without trace links allowed but discouraged | Quality metric |

---

### 5.10 Reasoning Package

```
Draft → Under Review → Ready → Published → Stale → Archived
                 └→ Blocked
```

| Transition | Rule |
|------------|------|
| Ready | AI Review + Coverage gates acceptable or waived |
| Published | Immutable snapshot |
| Stale | Feature Version superseded or upstream Approved baseline changed |

---

## 6. Business Rules (Cross-Domain Invariants)

### 6.1 Traceability invariants

1. A **Scenario cannot exist** without at least one **Requirement** Trace Link.  
2. A **Test Case must belong** to one primary **Scenario**.  
3. A **Requirement belongs to exactly one Feature Version**.  
4. A **Feature Version** belongs to exactly one **Feature**, which belongs to one **Product**.  
5. **Trace Links** are first-class; suite membership is not a substitute for Trace Links.  
6. Prefer Defect → Test Case → Scenario → Requirement linkage when Defects are found in Execution.  

### 6.2 Authority invariants

7. Platform entry is **Knowledge Intake** (multi-source); FDD is one Knowledge Input type.  
8. The designated **Approved Requirements Source** for a Feature Version is the primary authority for Requirements, Scenarios, and Test Cases.  
9. The **Requirement Object** cannot override the Approved Requirements Source; conflicts mean the object is wrong.  
10. **Knowledge Items / supporting Knowledge Inputs never own Requirements** and never override the Approved Requirements Source.  
11. **Historical Feature Versions** are not live authority for current behavior.  
12. **General LLM knowledge** is not a domain authority.  
13. **Assumptions** are not Requirements until converted via Clarification/Approval.  
14. **Unknown remains unknown** — invention of functionality is forbidden.  

### 6.3 Lifecycle / approval invariants

15. **AI Reviews cannot overwrite Approved artifacts automatically.**  
16. **Learning Candidates cannot publish product facts without Approval.**  
17. Moving to **Approved** requires an authorized **User Role**, not only an AI disposition.  
18. **Automated ≠ Approved** for Test Cases.  
19. **Published Reasoning Packages are immutable**; changes create a new revision.  
20. When a Feature Version is **Superseded**, dependent Scenarios/Test Cases/Packages become **Stale** until re-reasoned/re-approved.  
21. **Waivers** of gates (coverage, review, ambiguity) require recorded Approval by an authorized Role.  

### 6.4 Scope / tenancy invariants

22. Domain objects are confined to their **Organization** (and Workspace rules).  
23. Retrieval/use of Knowledge must respect Product/Feature scope and classification.  
24. A Release scope item must reference Feature Versions of the Release’s Product.  

### 6.5 Design quality invariants

25. Scenario Reasoning and Test Case creation **must not run** against a Feature Version whose validation gate is `fail` (per Reasoning Architecture).  
26. Test Cases must not assert expected behavior absent Requirement/Clarification evidence from the Approved Requirements Source path.  
27. Coverage cannot treat Ambiguities as covered.  
28. Reports that assert readiness must cite Coverage Assessment / Execution evidence.  

### 6.6 Knowledge invariants

29. Only **Published** (and eligible) Knowledge Items influence standard augmentation paths.  
30. Knowledge conflicts with Approved Requirements Source surface as Findings — not merges.  
31. Defect patterns may inform risk Scenarios only when current Requirements still imply the behavior.  

---

## 7. Domain Events

Events are meaningful business occurrences other contexts may react to. Names are logical.

| Event | Why it matters |
|-------|----------------|
| **OrganizationProvisioned** | Establishes tenant boundary for all work. |
| **WorkspaceCreated** | Opens collaboration space. |
| **ProductCreated** | Enables Feature/Release catalogs. |
| **FeatureCreated** | New capability identity exists. |
| **FeatureVersionCreated** | New design baseline identity available. |
| **KnowledgeIntakeAccepted** / **DocumentRegistered** / **ApprovedRequirementsSourceDesignated** | Intake complete; generation authority designated; provenance fixed. |
| **RequirementObjectDrafted** | Structured understanding exists for review. |
| **RequirementValidated** | Gate results available; may unblock Test Design. |
| **RequirementApproved** | Baseline locked for design/test commitments. |
| **AmbiguityRaised** / **ClarificationAccepted** | Blocks or unblocks progress honestly. |
| **ScenarioGenerated** | Test design progressed; traceability must hold. |
| **ScenarioApproved** | Scenario eligible for suite/release planning. |
| **TestCaseGenerated** | Verification detail available. |
| **TestCasesReviewed** | Review disposition recorded (human and/or AI). |
| **TestCaseApproved** | Eligible for automation/execution commitments. |
| **AIReviewCompleted** | Findings/disposition available; may force revise. |
| **CoverageAssessed** | Readiness evidence updated. |
| **ReasoningPackagePublished** | Immutable package available downstream. |
| **KnowledgeItemProposed** | Learning/governance workflow starts. |
| **KnowledgePublished** | Eligible for intentional retrieval. |
| **KnowledgeRetired** | Must drop from default retrieval. |
| **AutomationLinked** | Case has machine realization. |
| **ReleaseCreated** / **ReleaseActivated** | Scope & readiness tracking starts. |
| **ReleaseReleased** / **ReleaseClosed** | Delivery milestone for reporting/audit. |
| **SprintStarted** / **SprintCompleted** | Cadence signals for planning metrics. |
| **ExecutionStarted** / **ExecutionCompleted** | Quality signal for Release/Feature. |
| **DefectLogged** / **DefectLinked** | Closes feedback loop into trace chain. |
| **FeatureVersionSuperseded** | Marks downstream Stale; triggers impact analysis. |
| **ReportPublished** | Stakeholder communication artifact available. |

### Event rules

- Events report **facts that happened**, not commands.  
- Consumers may not violate invariants while reacting.  
- AI provider internals are not domain events; **AIReviewCompleted** is.  

---

## 8. Extensibility

### 8.1 Adding capabilities without breaking contexts

| Extension style | How |
|-----------------|-----|
| **New bounded context** | Introduce context with own objects; integrate via identities + domain events; publish anti-corruption layer if external models differ |
| **New object in existing context** | Allowed if ownership clear and invariants updated via ADR |
| **New Trace Link type** | Extend controlled relation vocabulary; do not overload Suite membership |
| **New Knowledge Domain** | Register domain manifest (Knowledge Architecture) — does not change Requirement ownership |
| **New Report type** | Reporting context extension reading existing models |
| **New lifecycle state** | Additive states preferred; breaking transitions need ADR |

### 8.2 Anti-corruption guidance

- External ALM/defect tools map into Defect/Execution ports without renaming ATI Requirements to foreign “tickets” inside the core language.  
- SharePoint Documents map to Document/Knowledge source adapters — SharePoint lists are not ATI Requirements.  

### 8.3 Compatibility promises

Safe without redesign:

- New Roles, Report kinds, Suite purposes, Knowledge Domains, Automation Asset kinds  
- Additional domain events (additive)  

Require Domain ADR:

- Allowing Knowledge to own Requirements  
- Removing Scenario↔Requirement mandatory link  
- Letting AI Approval replace human Approval for product facts  
- Collapsing Feature Version versioning  

---

## 9. Governance

### 9.1 Ownership matrix (accountable roles)

| Object / concern | Accountable role |
|------------------|------------------|
| Organization/Workspace/Roles | Platform Admin |
| Product / Feature | Product Owner |
| Feature Version / Approved Requirements Source / Requirements | Product Owner + QA Lead |
| Requirement Object quality | QA Architect / Requirement Steward |
| Scenarios / Test Cases / Suites | QA Lead |
| AI Review disposition acknowledgment | QA Architect / QA Lead |
| Knowledge Domains / Publications | Domain Steward / Knowledge Governance Board |
| Automation Assets | Automation Architect |
| Releases | Release Manager |
| Executions | QA Lead / Execution owner |
| Defects | Triage owner + Product Owner for prioritization |
| Reports | Report owner (QA Lead/Release Manager by type) |

### 9.2 Auditability

Every Approval, Waiver, Publish, Retire, Supersede, and AI Review acknowledgment must be attributable to a User (or recorded system actor) with timestamp and target identity/version.

### 9.3 Versioning responsibilities

| Object | Versioning expectation |
|--------|------------------------|
| Feature Version | Immutable once Analysed/Approved path established; supersede to change |
| Requirement | Revision lineage under Feature Version policy |
| Requirement Object / Reasoning Package | Immutable published snapshots |
| Scenario / Test Case | Revision on material change; Approvals re-applied per policy |
| Knowledge Item | Immutable published versions (Knowledge Architecture) |
| Release | Identity stable; state progresses; scope changes audited |
| Execution / Report | Immutable completed/published outputs |

### 9.4 Traceability expectations

For any Approved Scenario or Test Case, ATI must be able to answer:

- Which Feature Version and Approved Requirements Source version authorized it?  
- Which Requirements does it verify?  
- Which AI Review/Coverage Assessment supported its Approval?  
- Which Knowledge Item versions (if any) augmented reasoning?  
- Which Automation Assets and Executions later exercised it?  
- Which Defects relate back?  

Failure to answer these for Approved artifacts is a **governance defect**, not a UI inconvenience.

---

## 10. Alignment Summary

| Sibling architecture | Domain relationship |
|----------------------|---------------------|
| Platform Foundation | Technical modular monolith hosts these contexts |
| AI Reasoning Architecture | Explains *how* Requirement Objects, Scenarios, Test Cases, AI Reviews are reasoned |
| Knowledge Architecture | Explains *how* Knowledge Items are stored, retrieved, governed |
| This Domain Architecture | Explains *what* the business objects and rules *are* |

---

## 11. Implementation Readiness (Not Authorization)

This document authorizes the **business model only**. It does not authorize schemas, APIs, UI, or code.

When implementation is approved, map contexts to application modules and persistence **after** this language and invariants are respected.

---

## 12. Document Control

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-07-25 | Initial canonical Domain Architecture |
| 1.1 | 2026-07-25 | ARB harmonization (F-05): Requirement Management owns business concepts after Intake; Intake/designation owned by Orchestration; module packaging by Application Architecture (no ADR decision change) |

---

*End of Domain Architecture.*
