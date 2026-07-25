# Enterprise Data Architecture & Information Model (EIM)

**Document ID:** ATI-ARCH-EIM-001  
**Status:** Approved architecture (design only — no implementation)  
**Product:** AI QA Intelligence Platform (ATI v2)  
**Audience:** Enterprise Information Architect, Chief Architect, Data Stewards, Security, Implementation Engineer  
**Depends on:** [DOMAIN_ARCHITECTURE.md](./DOMAIN_ARCHITECTURE.md), [CANONICAL_TERMINOLOGY.md](./CANONICAL_TERMINOLOGY.md), [KNOWLEDGE_ARCHITECTURE.md](./KNOWLEDGE_ARCHITECTURE.md), [AI_REASONING_ARCHITECTURE.md](./AI_REASONING_ARCHITECTURE.md), [AI_DECISION_AND_EVIDENCE_FRAMEWORK.md](./AI_DECISION_AND_EVIDENCE_FRAMEWORK.md), [QA_INTELLIGENCE_FRAMEWORK.md](./QA_INTELLIGENCE_FRAMEWORK.md)  
**ADR:** [0009 — Enterprise Data Architecture](../adr/0009-enterprise-data-architecture.md); terminology clarified by [ADR 0010](../adr/0010-knowledge-intake-terminology.md)  
**Last updated:** 2026-07-25

---

## 0. Purpose and Scope

This document is the canonical **Enterprise Information Model (EIM)** for ATI.

It defines **what information ATI manages** — business information, AI artifacts, documents, traceability, versioning, and lifecycle — **independent of how or where it is stored**.

### This document does

- Define information domains, objects, relationships, identity/versioning, governance, discoverability, and extensibility  
- Align to Domain Architecture (business meaning) and Decision/Knowledge architectures (AI governance)  
- Remain technology-independent and enterprise-scalable  

### This document does not

- Create database schemas, SQL, Prisma models, indexes, or storage layouts  
- Recommend databases or search engines  
- Design APIs, UI, code, or prompts  

### Foundational statements

1. **Information ≠ storage.** The EIM is logical.  
2. **Domain language owns meaning**; the EIM records and governs that information.  
3. **Knowledge Intake** is the information entry; **Approved Requirements Source / Feature Version** anchors product-behavior truth for generation.  
4. **Knowledge and AI artifacts support; they do not own** Requirements.  
5. **Every significant AI output is information** with identity, version, evidence, and lifecycle.  
6. **Traceability is first-class information**, not a reporting afterthought.  
7. **Historical preservation** is mandatory for audit and supersession.  

### Relationship to sibling architectures

| Document | Role |
|----------|------|
| Domain Architecture | Business objects, contexts, invariants (WHAT ATI is) |
| Knowledge Architecture | Knowledge domains, retrieval authority, learning |
| Decision & Evidence Framework | Decision Records, Evidence Packages, explainability |
| AI Reasoning / QA Intelligence | How artifacts are reasoned |
| **This EIM** | Enterprise information domains, identity, versioning, document/AI artifact models, governance of information |

---

## 1. Enterprise Information Domains

An **Information Domain** is a stewardship partition of related information objects with shared lifecycle and quality rules.

| Domain ID | Name |
|-----------|------|
| `product` | Product Information |
| `feature` | Feature Information |
| `requirement` | Requirement Information |
| `scenario` | Scenario Information |
| `testcase` | Test Case Information |
| `knowledge` | Knowledge Information |
| `ai_artifact` | AI Artifact Information |
| `document` | Document Information |
| `release` | Release Information |
| `automation` | Automation Information |
| `execution` | Execution Information |
| `reporting` | Reporting Information |
| `administration` | Administration Information |
| `traceability` | Traceability Information |
| `decision` | Decision & Evidence Information |

---

### 1.1 Product Information

| Field | Definition |
|-------|------------|
| **Purpose** | Catalog and scope Products and their structural membership in Organizations/Workspaces. |
| **Owner** | Product Steward / Product Owner |
| **Primary Consumers** | Requirement, Release, Knowledge, Reporting |
| **Lifecycle** | Planned → Active → Sunset → Retired → Archived |
| **Relationships** | Organization/Workspace → Product → Features, Releases, scoped Knowledge |

---

### 1.2 Feature Information

| Field | Definition |
|-------|------------|
| **Purpose** | Long-lived Feature identity and Feature Version baselines. |
| **Owner** | Feature Owner |
| **Primary Consumers** | Requirement, AI Artifact, Test Design, Release, Impact Analysis |
| **Lifecycle** | Feature: Identified → Active → Deprecated → Retired; Feature Version: Draft → … → Superseded → Archived |
| **Relationships** | Knowledge Intake → Documents/Inputs; Product → Feature → Feature Version ← Document (Approved Requirements Source) |

---

### 1.3 Requirement Information

| Field | Definition |
|-------|------------|
| **Purpose** | Requirements, Requirement Objects, Ambiguities, Assumptions, Clarifications. |
| **Owner** | Requirement Steward / QA Lead + Product Owner |
| **Primary Consumers** | Scenario, AI Artifact, Coverage, Reporting |
| **Lifecycle** | Per Domain Requirement / Requirement Object lifecycles |
| **Relationships** | Feature Version owns Requirements; Requirement Object interprets Feature Version; Clarifications resolve Ambiguities |

---

### 1.4 Scenario Information

| Field | Definition |
|-------|------------|
| **Purpose** | Scenarios, classifications, suite membership references. |
| **Owner** | QA Lead (Test Design) |
| **Primary Consumers** | Test Case, Coverage, Automation, Execution, Reporting |
| **Lifecycle** | Draft → Generated → Reviewed → Approved → Archived |
| **Relationships** | Requirements ↔ Scenarios (Trace Links); Scenarios → Test Cases |

---

### 1.5 Test Case Information

| Field | Definition |
|-------|------------|
| **Purpose** | Test Cases, quality attributes, automation candidacy flags. |
| **Owner** | QA Lead |
| **Primary Consumers** | Automation, Execution, Coverage, Reporting |
| **Lifecycle** | Generated → Reviewed → Approved → Automated → Deprecated → Archived |
| **Relationships** | Primary Scenario required; optional Automation Links; Execution results |

---

### 1.6 Knowledge Information

| Field | Definition |
|-------|------------|
| **Purpose** | Enterprise Knowledge Base items, domains, publications, learning candidates. |
| **Owner** | Knowledge Domain Stewards / Governance Board |
| **Primary Consumers** | AI engines (augment), Review, Reporting |
| **Lifecycle** | Draft/Proposed → … → Published → Retired → Archived |
| **Relationships** | May reference Product/Feature/Document; **never owns Requirements** |

---

### 1.7 AI Artifact Information

| Field | Definition |
|-------|------------|
| **Purpose** | Versioned outputs of reasoning/decision processes (packages, reviews, assessments). |
| **Owner** | Producing bounded context + QA Architect stewardship |
| **Primary Consumers** | Human reviewers, Release, Reporting, Learning |
| **Lifecycle** | Draft → Under Review → Published/Ready → Stale → Archived |
| **Relationships** | Anchored to Feature Version / FDD; cite Evidence and Decision Records; feed but do not replace business masters |

---

### 1.8 Document Information

| Field | Definition |
|-------|------------|
| **Purpose** | Ingested and generated content artifacts (FDD files, SharePoint docs, exports). |
| **Owner** | Document Control / Feature Owner (FDD); Report owner (generated) |
| **Primary Consumers** | Requirement Understanding, Knowledge sync, Reporting |
| **Lifecycle** | Received → Registered → Active → Superseded → Archived |
| **Relationships** | Anchors Feature Version; sources Knowledge; embeds in Evidence Packages |

---

### 1.9 Release Information

| Field | Definition |
|-------|------------|
| **Purpose** | Releases, Sprints, scope associations, readiness assessments. |
| **Owner** | Release Manager |
| **Primary Consumers** | Execution, Reporting, Impact Analysis |
| **Lifecycle** | Planned → Active → Testing → Released → Closed → Archived |
| **Relationships** | Product → Release ↔ Feature Versions / Suites / Executions |

---

### 1.10 Automation Information

| Field | Definition |
|-------|------------|
| **Purpose** | Automation Assets and bindings to Test Cases. |
| **Owner** | Automation Architect |
| **Primary Consumers** | Execution, Reporting, Recommendations |
| **Lifecycle** | Draft → Linked → Active → Broken → Deprecated → Archived |
| **Relationships** | Test Cases ↔ Automation Assets; used by Executions |

---

### 1.11 Execution Information

| Field | Definition |
|-------|------------|
| **Purpose** | Executions, item results, evidence of runs, Defect discovery hooks. |
| **Owner** | Execution owner / QA Lead |
| **Primary Consumers** | Release readiness, Defect, Reporting, Learning |
| **Lifecycle** | Planned → Running → Completed/Cancelled → Archived |
| **Relationships** | Suite/Release/Sprint scope; results → Test Cases; Defects |

---

### 1.12 Reporting Information

| Field | Definition |
|-------|------------|
| **Purpose** | Report definitions and published Report snapshots. |
| **Owner** | Report owner (by type) |
| **Primary Consumers** | Stakeholders, audit, Release governance |
| **Lifecycle** | Requested → Generated → Published → Archived |
| **Relationships** | Snapshot references to Feature Version/Release/Execution/Coverage |

---

### 1.13 Administration Information

| Field | Definition |
|-------|------------|
| **Purpose** | Organization, Workspace, User, Role, membership, policy references. |
| **Owner** | Platform Admin |
| **Primary Consumers** | All domains (tenancy, authz, audit actor identity) |
| **Lifecycle** | Provisioned/Active/Suspended/Decommissioned patterns |
| **Relationships** | Tenant root for all other information |

---

### 1.14 Traceability Information

| Field | Definition |
|-------|------------|
| **Purpose** | Trace Links, Trace Matrices, staleness markers. |
| **Owner** | Platform Information Architect / QA Architect |
| **Primary Consumers** | Coverage, AI Review, Reporting, Audit |
| **Lifecycle** | Created → Active → Stale → Superseded → Archived |
| **Relationships** | Connects Requirement → Scenario → Test Case → Automation → Execution → Defect (and lateral Release/Report links) |

---

### 1.15 Decision & Evidence Information

| Field | Definition |
|-------|------------|
| **Purpose** | Decision Records, Evidence Packages, Explanation Packets, Review/Approval of decisions. |
| **Owner** | AI Assurance / Information Governance |
| **Primary Consumers** | Audit, HITL, Learning, AI Review |
| **Lifecycle** | Per Decision Framework states; immutable after execution |
| **Relationships** | Cite Documents/Requirements/Knowledge; lineage to AI Artifacts created |

---

## 2. Information Objects

Objects below are **logical information objects**. No database fields are defined. Business meaning aligns with Domain Architecture; this section states **information responsibility** and **traceability expectations**.

---

### 2.1 Feature

| Aspect | Definition |
|--------|------------|
| **Business Purpose** | Durable capability identity across versions. |
| **Information Responsibility** | Hold stable feature identity and version collection membership. |
| **Ownership** | Feature Information domain / Feature Owner |
| **Lifecycle** | Identified → In Design → Active → Deprecated → Retired → Archived |
| **Relationships** | Product (required); many Feature Versions |
| **Traceability Expectations** | All behavioral work traces through a Feature Version, not an unversioned Feature alone |

---

### 2.2 Feature Version

| Aspect | Definition |
|--------|------------|
| **Business Purpose** | Immutable design baseline for a point-in-time Feature authority. |
| **Information Responsibility** | Anchor Approved Requirements Source Document, Requirements, AI Artifacts, and staleness of dependents. |
| **Ownership** | Feature Information / Requirement Management |
| **Lifecycle** | Draft → Under Analysis → Analysed → Approved → Superseded → Deprecated → Archived |
| **Relationships** | Feature; primary Approved Requirements Source Document; Requirements; Reasoning Packages |
| **Traceability Expectations** | Every Requirement, Scenario, Case, Package for that baseline cites Feature Version + Approved Requirements Source version |

---

### 2.3 Requirement

| Aspect | Definition |
|--------|------------|
| **Business Purpose** | Single testable need/constraint. |
| **Information Responsibility** | Represent approvable requirement statements with status and evidence linkage. |
| **Ownership** | Requirement Information |
| **Lifecycle** | Draft → Analysed → Approved → Implemented → Deprecated (Domain) |
| **Relationships** | Exactly one Feature Version; many Scenarios via Trace Links |
| **Traceability Expectations** | Forward to Scenarios/Cases; backward to Approved Requirements Source evidence |

---

### 2.4 Requirement Object

| Aspect | Definition |
|--------|------------|
| **Business Purpose** | Structured understanding after analysis. |
| **Information Responsibility** | Store organized interpretation, Ambiguities, Assumptions, evidence maps as information. |
| **Ownership** | Requirement Information (AI Artifact aspects also registered under AI Artifact domain) |
| **Lifecycle** | Draft → Validated → Approved Snapshot → Superseded → Archived |
| **Relationships** | Feature Version; Approved Requirements Source Document; feeds Scenarios |
| **Traceability Expectations** | Every material claim cites evidence; conflicts with Approved Requirements Source mark object defective |

---

### 2.5 Scenario

| Aspect | Definition |
|--------|------------|
| **Business Purpose** | Testable behavior/journey unit. |
| **Information Responsibility** | Persist scenario intent, classification, rationale, links. |
| **Ownership** | Scenario Information |
| **Lifecycle** | Draft → Generated → Reviewed → Approved → Archived |
| **Relationships** | ≥1 Requirement; many Test Cases; optional Suites |
| **Traceability Expectations** | Mandatory Requirement links; rationale and decision refs preferred |

---

### 2.6 Test Case

| Aspect | Definition |
|--------|------------|
| **Business Purpose** | Verification procedure for a Scenario. |
| **Information Responsibility** | Persist logical case design and quality/automation flags. |
| **Ownership** | Test Case Information |
| **Lifecycle** | Generated → Reviewed → Approved → Automated → Deprecated → Archived |
| **Relationships** | Primary Scenario; Automation Assets; Execution results |
| **Traceability Expectations** | Primary Scenario always; Requirements via Scenario |

---

### 2.7 Knowledge Item

| Aspect | Definition |
|--------|------------|
| **Business Purpose** | Durable governed knowledge unit. |
| **Information Responsibility** | Versioned content + metadata + authority class + eligibility. |
| **Ownership** | Knowledge Information |
| **Lifecycle** | Per Knowledge Architecture |
| **Relationships** | Domain; optional Product/Feature; source Document |
| **Traceability Expectations** | Provenance mandatory; usage cited in Decision/Evidence Packages; never master of Requirements |

---

### 2.8 Document

| Aspect | Definition |
|--------|------------|
| **Business Purpose** | Governed content artifact (ingest or generate). |
| **Information Responsibility** | Identity, format class, provenance, version, classification, parse status. |
| **Ownership** | Document Information |
| **Lifecycle** | Received → Registered → Active → Superseded → Archived |
| **Relationships** | May anchor Feature Version; may source Knowledge; may be Report output |
| **Traceability Expectations** | Checksum/version identity retained; citations use Document version |

---

### 2.9 Reasoning Package

| Aspect | Definition |
|--------|------------|
| **Business Purpose** | Immutable bundle of reasoning outputs for a Feature Version. |
| **Information Responsibility** | Package Requirement Object, Scenarios, Cases, Reviews, Coverage, Trace Matrix references. |
| **Ownership** | AI Artifact Information |
| **Lifecycle** | Draft → Under Review → Ready → Published → Stale → Archived |
| **Relationships** | Feature Version; Decision lineage; Evidence Packages |
| **Traceability Expectations** | Full forward/backward navigation from package members to Approved Requirements Source |

---

### 2.10 Evidence Package

| Aspect | Definition |
|--------|------------|
| **Business Purpose** | Bundle of validated evidence used for one or more Decisions / Packages. |
| **Information Responsibility** | Cite evidence items, eligibility outcomes, conflicts rejected. |
| **Ownership** | Decision & Evidence Information |
| **Lifecycle** | Assembled → Sealed (immutable with consuming Decision/Package) → Archived |
| **Relationships** | Documents, Requirements, Knowledge versions, Human Review records |
| **Traceability Expectations** | Exact versions frozen at seal time for reproducibility |

---

### 2.11 Decision Record

| Aspect | Definition |
|--------|------------|
| **Business Purpose** | Single AI (or governed) decision with outcome and explanation hooks. |
| **Information Responsibility** | Persist type, outcome, confidence, review/approval status, lineage. |
| **Ownership** | Decision & Evidence Information |
| **Lifecycle** | Per Decision Framework; immutable after execution |
| **Relationships** | Evidence Package; targets (Scenario/Case/etc.); parent/child decisions |
| **Traceability Expectations** | Must answer explainability questions; supersession not in-place edit |

---

### 2.12 Clarification

| Aspect | Definition |
|--------|------------|
| **Business Purpose** | Human resolution of Ambiguity / conflicting interpretations. |
| **Information Responsibility** | Question, response, acceptor, effective Feature Version scope. |
| **Ownership** | Requirement Information |
| **Lifecycle** | Requested → Answered → Accepted → Superseded |
| **Relationships** | Ambiguity; Feature Version; may create/adjust Requirements via governed process |
| **Traceability Expectations** | Cited as high-authority evidence after Acceptance |

---

### 2.13 AI Review

| Aspect | Definition |
|--------|------------|
| **Business Purpose** | Critique record over a Reasoning Package / design set. |
| **Information Responsibility** | Findings, disposition, acknowledgment. |
| **Ownership** | AI Artifact Information |
| **Lifecycle** | Requested → In Progress → Completed → Acknowledged → Superseded |
| **Relationships** | Reasoning Package; Findings; Coverage Assessment |
| **Traceability Expectations** | Findings target artifact identities; cannot auto-overwrite Approved masters |

---

### 2.14 Automation Asset

| Aspect | Definition |
|--------|------------|
| **Business Purpose** | Machine-executable realization of Test Cases. |
| **Information Responsibility** | Asset identity, link set, readiness state. |
| **Ownership** | Automation Information |
| **Lifecycle** | Draft → Linked → Active → Broken → Deprecated → Archived |
| **Relationships** | Test Cases; Executions |
| **Traceability Expectations** | Links explicit; automation ≠ design Approval |

---

### 2.15 Release

| Aspect | Definition |
|--------|------------|
| **Business Purpose** | Delivery vehicle and readiness scope. |
| **Information Responsibility** | Release identity, state, scope links, readiness refs. |
| **Ownership** | Release Information |
| **Lifecycle** | Planned → Active → Testing → Released → Closed → Archived |
| **Relationships** | Product; Feature Versions; Suites; Executions; Reports; Assessments |
| **Traceability Expectations** | Scope items resolve to Feature Versions; readiness cites Coverage/Execution evidence |

---

### 2.16 Sprint

| Aspect | Definition |
|--------|------------|
| **Business Purpose** | Cadence container for planning associations. |
| **Information Responsibility** | Time-box identity and work associations. |
| **Ownership** | Release / Project planning information |
| **Lifecycle** | Planned → Active → Completed → Closed → Archived |
| **Relationships** | Project; optional Release; optional Suite/Execution links |
| **Traceability Expectations** | Does not own Requirements; associations are informational |

---

### 2.17 Execution

| Aspect | Definition |
|--------|------------|
| **Business Purpose** | Concrete test run with results. |
| **Information Responsibility** | Run identity, scope, results, completion state. |
| **Ownership** | Execution Information |
| **Lifecycle** | Planned → Running → Completed/Cancelled → Archived |
| **Relationships** | Test Cases / Automation Assets; Defects; Release/Sprint |
| **Traceability Expectations** | Results attach to Cases; immutable after Completed per Domain rules |

---

### 2.18 Defect

| Aspect | Definition |
|--------|------------|
| **Business Purpose** | Recorded quality problem. |
| **Information Responsibility** | Defect identity, state, preferred trace links upward. |
| **Ownership** | Execution Information (discovery) + Product triage stewardship |
| **Lifecycle** | Open → … → Closed / Reopened |
| **Relationships** | Execution; optional Case/Scenario/Requirement/Feature Version/Release |
| **Traceability Expectations** | Prefer closed-loop links; defects are not Requirements |

---

### 2.19 Report

| Aspect | Definition |
|--------|------------|
| **Business Purpose** | Stakeholder snapshot communication. |
| **Information Responsibility** | Definition vs published snapshot; source refs. |
| **Ownership** | Reporting Information |
| **Lifecycle** | Requested → Generated → Published → Archived |
| **Relationships** | Snapshot of Feature Version/Release/Coverage/Execution sets |
| **Traceability Expectations** | Published Reports cite source versions; no fabricated Requirements |

---

### 2.20 Supporting objects (summary)

| Object | Role |
|--------|------|
| **Organization / Workspace / User / Role** | Tenancy and governance actors |
| **Test Suite** | Curated collection; membership ≠ Trace Links |
| **Ambiguity / Assumption / Finding** | Honesty and review information |
| **Coverage Assessment / Trace Matrix** | Coverage information products |
| **Learning Candidate** | Pre-published knowledge promotion information |
| **Explanation Packet** | Explainability information bound to Decision Records |

---

## 3. Identity & Versioning Strategy

### 3.1 Unique identity

- Every information object has a **stable logical identifier** within its Organization (enterprise uniqueness policy).  
- Identifiers are **opaque and durable**; business labels (names, codes) are attributes, not sole identity.  
- Cross-context references use identity + type, never duplicated master copies.

### 3.2 Logical keys

Logical keys support human recognition and idempotent intake, e.g.:

- Product code within Organization  
- Feature key within Product  
- Feature Version number/label within Feature  
- Document source locator + source version for external docs  
- Knowledge item key within Domain  

Logical keys **do not replace** stable identifiers and may change only under governed rename rules with alias history.

### 3.3 Versioning principles

| Principle | Meaning |
|-----------|---------|
| **Immutable published versions** | Published/Approved/Completed snapshots are not edited in place |
| **Revision on change** | Material change creates a new version/revision |
| **Version identity** | `objectId` + `versionId` (or revision) jointly identify a snapshot |
| **Effective dating** | Optional `validFrom`/`validUntil` for policies/knowledge |
| **Framework version stamping** | AI Artifacts/Decisions record EIM + framework/pack versions used |

### 3.4 Lineage

Lineage records **derivation and ancestry**:

- Feature Version lineage (supersession chain)  
- Requirement revision lineage  
- Decision parent/child lineage  
- AI Artifact “produced from” lineage (Knowledge Intake, Approved Requirements Source version, Requirement Object revision, Evidence Package)  
- Knowledge promotion lineage (candidate → published item)

### 3.5 Superseding

- Supersede creates a new current version and marks prior as `superseded`.  
- Dependents of the prior Feature Version become `stale` until re-aligned.  
- Supersession links are bidirectional conceptually (`supersedes` / `supersededBy`).

### 3.6 Branching (limited applicability)

ATI does **not** require git-style branching for all objects.

| Allowed | Not default |
|---------|-------------|
| Parallel **draft** analyses for the same Feature Version under controlled experiment labels | Divergent Approved Requirements without Feature Version split |
| Alternate Reasoning Package drafts before Publish | Forking Approved Cases silently |

If two competing approved baselines are needed, create **distinct Feature Versions** (or Organization policy-approved variants), not hidden branches of one Approved version.

### 3.7 Historical preservation

- Superseded and Completed information remains readable per retention policy.  
- Evidence Packages seal cited versions so later edits cannot rewrite history.  
- Execution/Report/Decision history is append-only.

### 3.8 Archival

- Archival moves information to cold/governed retention while preserving identity and hashes/provenance.  
- Archived items are excluded from default discovery but remain audit-retrievable.  
- Archival does not delete lineage required for compliance.

### 3.9 Conceptual version graph

```
Knowledge Intake → Knowledge Inputs…
Feature
  └── FeatureVersion v1 ──supersededBy──► FeatureVersion v2
        │                                      │
        ├── Approved Requirements Source @a    ├── Approved Requirements Source @b
        ├── RequirementObject rev1             ├── RequirementObject rev1'
        ├── ReasoningPackage pub1 (stale)      └── ReasoningPackage pub1'
        └── Decisions… (historical)
```

---

## 4. Information Relationships

### 4.1 Primary business chain

```
Knowledge Intake → Knowledge Inputs (specs + supporting)
Organization
  └── Workspace
        └── Product
              └── Feature
                    └── Feature Version
                          ├── Document (Approved Requirements Source)
                          ├── Requirement
                          │     └── Scenario
                          │           └── Test Case
                          │                 └── Automation Asset
                          │                       └── Execution
                          │                             └── Defect
                          ├── Requirement Object
                          ├── Reasoning Package
                          ├── Evidence Package / Decision Records
                          └── AI Review / Coverage Assessment
```

### 4.2 Lateral relationships

```
Product → Release → scope(Feature Versions, Suites) → Executions → Reports
Project → Sprint → planning associations
Knowledge Item → references (Product/Feature/Document) — support only
```

### 4.3 Ownership vs support

| Relationship style | Rule |
|--------------------|------|
| **Owns** | Feature Version owns Requirements; Scenario owns design children Cases (context ownership) |
| **Traces** | Trace Links connect without transferring ownership |
| **Supports** | Knowledge, Evidence, Decisions, AI Reviews support masters |
| **Snapshots** | Reports/Packages freeze references to versions |

### 4.4 Integrity rules (information-level)

1. No Scenario information without Requirement Trace Links.  
2. No Test Case information without primary Scenario.  
3. Knowledge information cannot become Requirement master.  
4. AI Artifact publication cannot rewrite Approved masters in place.  
5. Cross-Organization references are forbidden.  

---

## 5. AI Artifact Architecture

AI Artifacts are **information products** of reasoning/decision processes. They are governed objects, not chat logs.

### 5.1 Artifact catalog (logical)

| Artifact | Purpose |
|----------|---------|
| **Requirement Summary** | Concise evidenced summary of Feature Version intent |
| **Requirement Object** | Structured understanding (also Requirement Information) |
| **Reasoning Package** | Sealed bundle for handoff/approval |
| **Evidence Package** | Sealed evidence set for reproducibility |
| **Decision Package** | Coherent set of related Decision Records for a run |
| **Coverage Report / Assessment** | Dimension sufficiency information |
| **Clarification Report** | Aggregated Clarification requests/status |
| **AI Review** | Critique + Findings + disposition |
| **Impact Analysis** | Blast-radius / regression impact information product |
| **Automation Recommendation** | Candidacy/priority recommendations (not Assets) |
| **Test Plan** | Planned Scenario/Case/Suite organization for a Feature Version or Release |
| **Release Assessment** | Readiness/risk information for a Release |

### 5.2 Ownership

- Producing context owns draft artifacts.  
- Upon Publish, stewardship shared with QA Architect / Release Manager as applicable.  
- Decision Package ownership sits with Decision & Evidence Information domain.

### 5.3 Lifecycle (common pattern)

```
Draft → Validated/Under Review → Ready → Published → Stale → Archived
                              └→ Rejected / Blocked
```

Published AI Artifacts are **immutable**. Corrections produce a new artifact revision and supersession link.

### 5.4 Traceability expectations for AI Artifacts

Every published AI Artifact must reference:

- Organization / Product / Feature Version  
- Approved Requirements Source Document version  
- Framework versions (Reasoning, QA Intelligence, Decision, EIM)  
- Evidence Package and/or Decision Package  
- Member business object identities (Requirements/Scenarios/Cases as applicable)  

### 5.5 Authority limits

AI Artifacts **recommend and structure**; they do not become Requirements or Approvals by themselves.

---

## 6. Document Architecture

### 6.1 Document classes (format-agnostic)

| Class | Examples | Typical role |
|-------|----------|--------------|
| **Design authority** | PDF/DOCX/MD FDD/PRD/SRS/equivalent | Anchors Feature Version as Approved Requirements Source |
| **Structured intake** | JSON/CSV/XLSX requirement exports | Secondary intake; still evidenced |
| **Knowledge source** | SharePoint pages/docs, MD standards | Knowledge sync sources |
| **Binary/media** | Images/diagrams | Supporting evidence; captioned/referenced |
| **Generated output** | Reports (PDF/MD/HTML logical), exports | Reporting Information snapshots |
| **Machine interchange** | JSON packages | Interop representations of Packages (logical) |

ATI manages **Document information** uniformly; parsers/adapters are technology concerns outside this EIM.

### 6.2 Document metadata (logical concepts — not fields/schema)

Conceptual metadata facets:

- Identity & version / source locator / checksum  
- Format class & parse status  
- Classification / ACL projection  
- Product/Feature/Feature Version association  
- Author/source system (incl. SharePoint site/library concepts)  
- Relationship role (`fdd_authority`, `supporting`, `knowledge_source`, `report_output`)  

### 6.3 Document lifecycle

```
Received/Imported → Registered → Parsed (success/fail)
  → Active Reference → Superseded → Archived
Generated → Published → Archived
```

Failed parse ⇒ Document exists with `parse_failed`; cannot silently invent content.

### 6.4 SharePoint Documents

- Represented as Documents with external source identity + version/etag concepts.  
- Sync may create/update draft Knowledge or register Documents; **publication still governed**.  
- SharePoint is not the semantic master of Requirements (Knowledge Architecture alignment).  

### 6.5 Relationships

- Feature Version → primary Approved Requirements Source Document  
- Evidence Package → Document versions cited  
- Knowledge Item → source Document  
- Report → generated Document representation  

---

## 7. Traceability Architecture

### 7.1 Trace layers

```
Business Objects (Domain meaning)
        ↓
Information Objects (EIM managed)
        ↓
AI Artifacts (reasoned products)
        ↓
Automation
        ↓
Execution
        ↓
Defects
        ↓
Reports
```

### 7.2 Forward traceability

From Feature Version / Requirements outward:

- Which Scenarios verify this Requirement?  
- Which Test Cases implement those Scenarios?  
- Which Automation Assets bind those Cases?  
- Which Executions ran them and with what results?  
- Which Defects were found?  
- Which Reports claimed readiness?  

### 7.3 Backward traceability

From Defect / Execution / Case / Scenario inward:

- Which Scenario/Requirements/Feature Version/Approved Requirements Source justified this Case?  
- Which Decisions/Evidence supported creation?  
- Which Knowledge versions augmented (if any)?  
- Which AI Review/Coverage Assessment gated Approval?  

### 7.4 Trace Link information

Trace Links are first-class Information Objects in the Traceability domain:

- From/to identities + types  
- Relation type (`verified_by`, `implements`, `executed_in`, `found_in`, …)  
- Creator (engine/user)  
- Evidence/rationale reference  
- Confidence (optional, independent)  
- Staleness vs current Feature Version  

### 7.5 Trace Matrix

A Trace Matrix is a derived (but publishable) information product projecting Requirements × Scenarios × Cases (+ later Automation/Execution). Published matrices freeze with Reasoning Packages / Coverage Reports.

### 7.6 Staleness

When Feature Version or Requirement revisions supersede, dependent links/artifacts mark `stale` until re-validated — information must not silently appear current.

---

## 8. Information Governance

### 8.1 Ownership & stewardship

| Role | Responsibility |
|------|----------------|
| **Information Owner** | Accountable for meaning and fitness of a domain |
| **Data Steward** | Quality, classification, lifecycle operations |
| **Platform Information Architect** | EIM integrity, cross-domain rules |
| **Security/Compliance** | Classification, retention, access |
| **Product Owner / QA Lead** | Business Approvals on masters |

### 8.2 Approval

- Aligns with Domain Approval and Decision HITL.  
- Information state transitions that affect enterprise trust require Approval Records.  
- AI cannot self-approve product-fact or design masters.

### 8.3 Auditability

- Identity of actor, time, action, before/after version references for governed transitions.  
- Decision/Evidence/Approval history retained per policy.  

### 8.4 Retention

| Class | Conceptual retention stance |
|-------|----------------------------|
| Approved Requirements Sources & Feature Version history | Long-term |
| Published Reasoning/Decision/Evidence Packages | Long-term (audit) |
| Executions/Reports | Align to release/compliance needs |
| Rejected AI drafts / learning rejects | Shorter, still auditable window |
| Raw sync caches | Short-lived |

Exact durations are organizational policy references.

### 8.5 Classification & security

- Every information object carries a security classification concept.  
- Access follows Organization/Workspace/ACL and classification.  
- Higher classification never flows into lower-trust channels without policy controls.  

### 8.6 Data quality & integrity

| Principle | Meaning |
|-----------|---------|
| **Completeness** | Required relationships present for state (e.g., Approved Scenario has links) |
| **Consistency** | No Approved Requirements Source↔Requirement Object contradictions left unmarked |
| **Accuracy** | Evidence-backed claims preferred; unknowns explicit |
| **Timeliness** | Stale markers when baselines move |
| **Uniqueness** | One master identity; duplicates merged via governed decisions |
| **Trace integrity** | Link invariants continuously enforceable |

### 8.7 Integrity controls (logical)

- Referential integrity of Trace Links at the information level  
- Immutability of published snapshots  
- Tenancy isolation  
- Supersession over silent edit  

---

## 9. Search & Discoverability

Conceptual discovery capabilities (no implementation):

| Mechanism | Purpose |
|-----------|---------|
| **Metadata** | Type, product, feature, version, state, classification, dates, owner |
| **Tags** | Controlled vocab + free tags for retrieval aids |
| **Relationships** | Graph navigation along Trace Links and ownership edges |
| **Semantic Links** | Conceptual relatedness (e.g., impact neighbors) — subordinate to Approved Requirements Source authority |
| **Full-text Search** | Content of Documents, Knowledge, artifact summaries |
| **Faceted Search** | Filter by domain, state, release, confidence band, classification, artifact type |

### Discoverability rules

1. Default search excludes Archived and ineligible Knowledge/`proposed` AI product-facts.  
2. Security classification filters all discovery.  
3. Relationship navigation is preferred for traceability questions over blind full-text.  
4. Semantic discovery must not promote unapproved knowledge above the Approved Requirements Source.  

---

## 10. Extensibility

### 10.1 Adding information objects

Register an **Information Object Manifest**:

- `objectType`, domain, owner role  
- identity/versioning profile  
- lifecycle states  
- allowed relationships / trace participation  
- classification defaults  
- retention profile ref  
- search facets  

### 10.2 Adding domains

New Information Domains register with stewardship, default classification, and relationship boundaries — without rewriting existing domains.

### 10.3 Compatibility guarantees

Allowed without redesign:

- New AI Artifact types  
- New Document format classes  
- New Trace relation types (additive controlled vocabulary)  
- New Report kinds  
- New Decision/Evidence package variants  

Require ADR / EIM revision:

- Allowing Knowledge to own Requirements  
- Treating platform entry as FDD-only (rejects Knowledge Intake)  
- Removing Feature Version / Approved Requirements Source anchoring  
- Editable published history  
- Breaking Trace Link invariants  
- Cross-tenant information merging  

---

## 11. Architectural Risks and Mitigations

| Risk | Mitigation |
|------|------------|
| Storage-driven modeling | EIM-first; schemas later must map to EIM |
| AI artifact sprawl | Artifact catalog + immutability + supersession |
| Trace rot | Staleness markers; matrix publish seals |
| Document dual masters | Single Document identity; SharePoint as source adapter |
| Discovery oversharing | Classification + eligibility filters |
| Field-level premature design | Explicit ban on schemas in this phase |

---

## 12. Implementation Readiness (Not Authorization)

This EIM authorizes **information meaning and governance only**.

When persistence is later approved:

1. Map EIM objects to storage via adapters without leaking storage into domain language  
2. Preserve identity, versioning, immutability, and trace invariants  
3. Ensure Decision/Evidence/Document seals remain reproducible  
4. Choose technologies under separate ADRs — not in this document  

---

## 13. Document Control

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-07-25 | Initial Enterprise Information Model |

---

*End of Enterprise Data Architecture & Information Model.*
