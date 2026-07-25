# Knowledge Architecture — ATI Knowledge System Blueprint

**Document ID:** ATI-ARCH-KNOWLEDGE-001  
**Status:** Approved architecture (design only — no implementation)  
**Product:** AI QA Intelligence Platform (ATI v2)  
**Audience:** Chief Architect, Implementation Engineer, Product Owner, Knowledge Stewards, Security  
**Depends on:** [ARCHITECTURE.md](./ARCHITECTURE.md), [CANONICAL_TERMINOLOGY.md](./CANONICAL_TERMINOLOGY.md), [AI_REASONING_ARCHITECTURE.md](./AI_REASONING_ARCHITECTURE.md), [AI_DEVELOPMENT_CHARTER.md](../standards/AI_DEVELOPMENT_CHARTER.md)  
**ADR:** [0005 — Knowledge Architecture](../adr/0005-knowledge-architecture.md); terminology clarified by [ADR 0010](../adr/0010-knowledge-intake-terminology.md)  
**Last updated:** 2026-07-25

---

## 0. Purpose and Scope

This document is the permanent reference architecture for **how ATI stores, organizes, retrieves, validates, versions, governs, and learns knowledge**.

Knowledge is a **first-class platform component**, not an LLM side-effect and not an optional cache of chat history.

### Goals

1. Persist organizational and product knowledge independently of any AI provider.
2. Supply **intentional, minimal, validated** context to reasoning engines.
3. Preserve Approved Requirements Source primacy for generation and prevent supporting knowledge from inventing functionality.
4. Enable auditability, versioning, approval, retention, and secure access.
5. Integrate enterprise sources (including SharePoint) without coupling the core model to a vendor.

### Explicitly out of scope

- Application code, APIs, database tables, physical indexes
- Prompt text / prompt packs
- Concrete RAG pipelines, embedding models, or vector database products
- Package installation or runtime configuration
- Implementation of SharePoint connectors

### Foundational statements

1. **ATI starts with Knowledge Intake.** Knowledge Inputs include FDD, PRD, SRS, historical documents, transcripts, cloud references, product documentation, standards, and other governed sources — not FDD alone.
2. For **requirement analysis, scenario generation, and test case generation**, the **Approved Requirements Source** (FDD, PRD, SRS, or equivalent) is authoritative. All other Knowledge Inputs are **supporting** and never override or invent requirements.
3. **Knowledge augments reasoning; it never overrides the Approved Requirements Source.**
4. **Every knowledge item has provenance and a version.**
5. **Retrieval is intentional** — not “retrieve everything.”
6. **Historical knowledge must never introduce undocumented functionality.**
7. **The platform — not an LLM — remembers.** Provider models are ephemeral executors.
8. **Minimize context and cost** by retrieving only what the current reasoning task requires.

See [CANONICAL_TERMINOLOGY.md](./CANONICAL_TERMINOLOGY.md). Operational intake/routing/orchestration: [KNOWLEDGE_INTAKE_AND_WORKFLOW_ORCHESTRATION_ARCHITECTURE.md](./KNOWLEDGE_INTAKE_AND_WORKFLOW_ORCHESTRATION_ARCHITECTURE.md) (ADR 0011).

### Relationship to the ATI Brain

| Concept | Home |
|---------|------|
| Requirement Knowledge Graph (RKG) | Built per reasoning run from the Requirement Object ([AI Reasoning Architecture](./AI_REASONING_ARCHITECTURE.md)) |
| Enterprise Knowledge Base (EKB) | This document — durable, governed knowledge across domains |
| Knowledge Engine | Consumer/facade that queries EKB under retrieval policy |
| Learning Engine | Proposes candidates; this architecture defines promotion into EKB |

The RKG is **run-scoped structured understanding**. The EKB is **durable organizational memory**. They must not be conflated.

---

## 1. Knowledge Domains

A **Knowledge Domain** is a governed partition of the EKB with clear ownership, sources, consumers, and update/version policies.

### 1.1 Domain catalog

| Domain ID | Name |
|-----------|------|
| `product` | Product Knowledge |
| `feature` | Feature Knowledge |
| `historical_fdd` | Historical FDD Knowledge |
| `cloud` | Cloud Knowledge |
| `testing` | Testing Knowledge |
| `automation` | Automation Knowledge |
| `release` | Release Knowledge |
| `defect` | Defect Knowledge |
| `org_standards` | Organizational Standards |
| `user_docs` | User Documentation |
| `architecture` | Architecture Knowledge |
| `ai_generated` | AI Generated Knowledge |
| `glossary` | Glossary & Ubiquitous Language |
| `compliance` | Compliance & Regulatory Knowledge |
| `integration` | Integration & Dependency Knowledge |

Additional domains may be registered via the extensibility model (§9) without redesign.

---

### 1.2 Product Knowledge

| Field | Definition |
|-------|------------|
| **Purpose** | Describe the product as a whole: capabilities, modules, terminology baseline, cross-feature constraints that are product-approved. |
| **Owner** | Product Owner / Product Knowledge Steward |
| **Source** | Approved product briefs, module maps, product glossaries, architecture overviews (human-approved) |
| **Consumers** | Understanding, Validation, Scenario Reasoning, Coverage, Reporting |
| **Update Strategy** | Event-driven on product release train; steward-triggered updates; no silent AI overwrite |
| **Version Strategy** | Semantic product knowledge version aligned to product release train where possible; immutable published revisions |

---

### 1.3 Feature Knowledge

| Field | Definition |
|-------|------------|
| **Purpose** | Durable knowledge about a specific feature beyond a single FDD revision (scope summaries, approved clarifications, known constraints). |
| **Owner** | Feature Owner / QA Lead for the feature |
| **Source** | Approved FDD summaries, PO clarifications, accepted review decisions tied to the feature |
| **Consumers** | Understanding (diff/context), Scenario Reasoning, Review |
| **Update Strategy** | On FDD supersede, clarification acceptance, or feature retirement |
| **Version Strategy** | Feature-scoped versions; link to `approvedRequirementsSourceId`/`approvedRequirementsSourceVersion` (and Feature Version) that justified the knowledge |

**Rule:** Feature Knowledge that asserts behavior must cite FDD evidence or an approved clarification artifact. Otherwise it is ineligible for product-fact use.

---

### 1.4 Historical FDD Knowledge

| Field | Definition |
|-------|------------|
| **Purpose** | Preserve prior Approved Requirements Source versions (commonly FDD, also PRD/SRS/equivalent) and derived summaries for impact analysis and delta reasoning — not as live authority for current behavior. |
| **Owner** | Document Control / Platform Steward |
| **Source** | Archived FDD packages; prior Final Reasoning Packages (read-only references) |
| **Consumers** | Impact Analysis (future), Understanding (delta mode), Release Intelligence |
| **Update Strategy** | Append-only archival when an Approved Requirements Source version is superseded |
| **Version Strategy** | Exact Approved Requirements Source version identity; never mutate historical payloads |

**Rule:** Historical requirements-source Knowledge is **contextual**, not authoritative for current requirements. The current **Approved Requirements Source** overrides history.

---

### 1.5 Cloud Knowledge

| Field | Definition |
|-------|------------|
| **Purpose** | Platform/cloud operational facts relevant to QA (regions, service limits, shared platform behaviors) when product-approved for use. |
| **Owner** | Cloud/Platform Engineering Steward |
| **Source** | Internal cloud runbooks, approved platform docs, vendor docs mirrored with attribution |
| **Consumers** | Validation (NFR completeness), Scenario/Test Reasoning for environment constraints, Review |
| **Update Strategy** | Periodic refresh + change-triggered updates from platform releases |
| **Version Strategy** | Dated revisions with `validUntil` / supersession links |

---

### 1.6 Testing Knowledge

| Field | Definition |
|-------|------------|
| **Purpose** | QA methods, scenario taxonomies, completeness heuristics, risk-based testing patterns — **not product behavior**. |
| **Owner** | QA Architecture Steward |
| **Source** | Org QA standards, approved playbooks, curated patterns from Learning Engine promotions |
| **Consumers** | Validation, Scenario Reasoning, Test Case Reasoning, QA Review, Coverage |
| **Update Strategy** | Steward-approved pattern updates; learning promotions only after approval |
| **Version Strategy** | Pattern pack versions; checklist schema versions |

---

### 1.7 Automation Knowledge

| Field | Definition |
|-------|------------|
| **Purpose** | How automation is structured: frameworks, conventions, locator strategies, reusable flows, flaky-test learnings (engineering practice). |
| **Owner** | Automation Architect |
| **Source** | Automation standards, approved framework docs, tagged automation history summaries |
| **Consumers** | Automation Preparation (future), Test Case Reasoning (feasibility notes only) |
| **Update Strategy** | On framework major changes; post-mortem promotions |
| **Version Strategy** | Framework-aligned versions |

---

### 1.8 Release Knowledge

| Field | Definition |
|-------|------------|
| **Purpose** | Release trains, inclusion lists, known deferred items, release notes that affect test scope. |
| **Owner** | Release Manager |
| **Source** | Release plans, notes, GO/NO-GO records |
| **Consumers** | Coverage, Reporting, Impact Analysis, Release Intelligence |
| **Update Strategy** | Per release lifecycle events |
| **Version Strategy** | Release identifier as primary version key |

---

### 1.9 Defect Knowledge

| Field | Definition |
|-------|------------|
| **Purpose** | Curated defect patterns, recurring failure modes, regression hotspots — linked to requirements/scenarios when known. |
| **Owner** | QA Lead / Defect Triage Steward |
| **Source** | Defect system exports (approved curated views), post-mortems |
| **Consumers** | Scenario Reasoning (risk), Review, Coverage, Learning |
| **Update Strategy** | Continuous curation with severity filters; no raw dump as authority |
| **Version Strategy** | Snapshot versions of curated sets; individual defect refs retain external IDs |

**Rule:** A past defect does not create a new requirement. It may justify risk-oriented scenarios only where current FDD still implies the behavior.

---

### 1.10 Organizational Standards

| Field | Definition |
|-------|------------|
| **Purpose** | Enterprise policies: security testing expectations, accessibility baseline, audit requirements, definition of done. |
| **Owner** | Quality/Compliance Governance |
| **Source** | Policy documents, standards catalogs |
| **Consumers** | Validation, Review, Coverage policy |
| **Update Strategy** | Governance-controlled publication cycles |
| **Version Strategy** | Policy version IDs; effective dating |

---

### 1.11 User Documentation

| Field | Definition |
|-------|------------|
| **Purpose** | End-user facing docs that may clarify intended UX language — subordinate to FDD for requirements. |
| **Owner** | Documentation Steward |
| **Source** | Help centers, manuals, SharePoint user-doc libraries |
| **Consumers** | Understanding (terminology), Review (consistency checks) |
| **Update Strategy** | Sync from doc CMS / SharePoint per §8 |
| **Version Strategy** | Document version + published date; conflict with FDD → finding, not merge |

---

### 1.12 Architecture Knowledge

| Field | Definition |
|-------|------------|
| **Purpose** | System architecture constraints, integration topology, non-negotiable design rules relevant to testability. |
| **Owner** | Chief/System Architect |
| **Source** | Architecture docs, ADRs, approved diagrams |
| **Consumers** | Validation, Integration scenarios, Impact Analysis |
| **Update Strategy** | On ADR acceptance / architecture release |
| **Version Strategy** | ADR/doc version linkage |

---

### 1.13 AI Generated Knowledge

| Field | Definition |
|-------|------------|
| **Purpose** | Candidates produced by AI (summaries, patterns, suggested links) awaiting or having received governance promotion. |
| **Owner** | Knowledge Governance Board (promotion); originating engine (draft) |
| **Source** | Learning Engine proposals; approved AI summaries of FDDs/packages |
| **Consumers** | None for product-fact reasoning until `approved`; after approval, consumers of the target domain |
| **Update Strategy** | Create as `proposed` → validate → approve → publish into target domain; never silent publish |
| **Version Strategy** | Candidate versions distinct from published knowledge versions; promotion creates a new published item with provenance to the candidate |

**Hard rule:** AI Generated Knowledge in `proposed` or `rejected` state is invisible to product-fact retrieval paths.

---

### 1.14 Glossary & Ubiquitous Language

| Field | Definition |
|-------|------------|
| **Purpose** | Canonical terms, synonyms, disambiguation to reduce misunderstanding. |
| **Owner** | Product + Architecture jointly |
| **Source** | Glossary registers, FDD term sections |
| **Consumers** | Document/Understanding engines, all retrieval query normalization |
| **Update Strategy** | Steward edits; FDD-driven term proposals |
| **Version Strategy** | Glossary revision numbers |

---

### 1.15 Compliance & Regulatory Knowledge

| Field | Definition |
|-------|------------|
| **Purpose** | Regulatory obligations affecting test evidence (e.g., audit trails, data retention expectations). |
| **Owner** | Compliance Officer |
| **Source** | Controlled compliance libraries |
| **Consumers** | Validation, Review (audit dimension), Coverage policy |
| **Update Strategy** | Legal/compliance controlled |
| **Version Strategy** | Effective dating mandatory |

---

### 1.16 Integration & Dependency Knowledge

| Field | Definition |
|-------|------------|
| **Purpose** | External systems, contracts, SLAs, and dependency behaviors relevant to integration testing. |
| **Owner** | Integration Owner / Platform Steward |
| **Source** | Interface specs, approved partner docs |
| **Consumers** | Scenario/Test Reasoning (integration), Impact Analysis |
| **Update Strategy** | On contract change |
| **Version Strategy** | Interface contract version keys |

---

## 2. Knowledge Hierarchy

When ATI reasons, authoritative weight follows this **descending priority**. Lower layers may not contradict higher layers for product behavior.

```
[0] Approved Requirements Source (FDD / PRD / SRS / equivalent, versioned)
        ← absolute authority for Requirements / Scenarios / Test Cases generation
        ↓
[1] Current Requirement Object + RKG
        ← structured interpretation of [0] (defective if ≠ Approved Requirements Source)
        ↓
[2] Approved Product Knowledge                         ← supporting
        ↓
[3] Approved Feature Knowledge (current)               ← supporting
        ↓
[4] Historical Feature / Historical requirements docs  ← context only; not live authority
        ↓
[5] Cloud / Integration / Architecture Knowledge       ← supporting
        ↓
[6] Organizational Standards / Compliance              ← dimensions/policy; not inventing features
        ↓
[7] Testing / Automation Knowledge                     ← methods & patterns, not product facts
        ↓
[8] Release / Defect Knowledge                         ← risk & scope signals
        ↓
[9] User Documentation / meeting transcripts / etc.  ← supporting; Approved Requirements Source wins
        ↓
[10] Public / Vendor Knowledge (mirrored)              ← attributed, lowest internal trust
        ↓
[11] General LLM Parametric Knowledge                  ← never authoritative; ephemeral only
```

**Platform entry note:** Knowledge Intake may accept many of the layers above as Knowledge Inputs. Hierarchy [0] applies when ATI is generating or asserting Requirements, Scenarios, or Test Cases. Outside that generation authority path, supporting domains remain useful for understanding, impact, and methods — still without inventing requirements.

### 2.1 Reasoning behind the ordering

1. **Approved Requirements Source** defines what the product *shall* do for generation scope. Supporting Knowledge Inputs are secondary.
2. **Requirement Object / RKG** is the working structured form of that source; if it conflicts with the Approved Requirements Source, the object is wrong.
3. **Product / Feature Knowledge** supplies stable cross-cutting context when approved and non-conflicting.
4. **Historical knowledge** informs deltas and regressions; it must not resurrect retired behavior as current requirements.
5. **Cloud / Architecture / Integration** constrain *how* and *where* behavior runs; they do not invent feature scope.
6. **Org standards / compliance** raise mandatory QA dimensions; they do not add product features.
7. **Testing / Automation** improve *methods*; they never assert undocumented product behavior.
8. **Release / Defect** knowledge prioritizes risk and scope; defects are not specs.
9. **User docs / transcripts** help context; Approved Requirements Source wins on contradiction.
10. **Public/vendor** knowledge is least trusted internally and always attributed.
11. **LLM memory** is not a store.

### 2.2 Conflict resolution algorithm (logical)

```
if claim about product behavior (for Requirements / Scenarios / Test Cases):
  prefer Approved Requirements Source evidence
  else if approved clarification artifact exists → use it (recorded)
  else → mark unknown / ambiguity
never resolve by majority of supporting Knowledge Inputs
never resolve by LLM “familiarity”
```

---

## 3. Knowledge Lifecycle

```
Creation
  → Validation
    → Approval
      → Versioning
        → Publication
          → Usage
            → Retirement
              → Archival
```

### 3.1 Creation

- **Sources:** human authoring, controlled sync (SharePoint), Learning Engine candidates, curated imports.
- **State:** `draft` or `proposed` (AI).
- **Required at creation:** provisional metadata (§4), provenance, domain, owner.

### 3.2 Validation

Automated + steward checks (§6): freshness, schema, provenance completeness, domain fit, conflict scan vs higher hierarchy layers (especially current FDD when feature-scoped), security classification present.

- **Pass** → eligible for approval  
- **Fail** → remain draft/proposed with findings  

### 3.3 Approval

Human (or governed dual-control) decision by domain owner / Knowledge Governance Board.

- Outcomes: `approved`, `rejected`, `returned_for_revision`
- AI cannot self-approve into product-fact domains.

### 3.4 Versioning

- Every publish creates an **immutable version**.
- Edits produce a new version; prior versions remain readable per retention policy.
- Supersession links: `supersedes` / `supersededBy`.

### 3.5 Publication

- State becomes `published`.
- Only `published` + not expired + ACL-allowed items are eligible for standard retrieval.
- Publication emits an audit event.

### 3.6 Usage

- Knowledge Engine retrieves under policy; every use records **usage lineage** (which reasoning run, which engine, which item versions).
- Usage never mutates the item.

### 3.7 Retirement

- Owner marks `retired` when no longer valid for new reasoning (e.g., feature removed, standard replaced).
- Retired items are excluded from default retrieval; may remain available for historical explanation with explicit `includeRetired` intent.

### 3.8 Archival

- Cold storage of retired/superseded content per retention schedule.
- Archival preserves provenance and hashes for audit; retrieval is exceptional and governed.

### 3.9 State machine (logical)

`draft/proposed → validated → approved → published → retired → archived`  
Side paths: `rejected`, `returned_for_revision`, `quarantined` (security/conflict emergency).

---

## 4. Knowledge Metadata Model (Logical)

Every knowledge item carries metadata. This is a **logical model**, not a database schema.

### 4.1 Core identity

| Field | Meaning |
|-------|---------|
| `knowledgeId` | Stable identifier of the knowledge item (logical entity) |
| `knowledgeVersion` | Immutable version of the item body + metadata snapshot |
| `schemaVersion` | Metadata schema version |
| `knowledgeType` | Item kind within domain (e.g., `summary`, `pattern`, `policy`, `glossary_term`, `defect_pattern`, `fdd_archive_ref`) |
| `domainId` | Domain from §1 |
| `title` | Human label |
| `summary` | Short abstract for retrieval routing |
| `bodyRef` | Reference to content payload (logical locator — not storage tech) |

### 4.2 Product scoping

| Field | Meaning |
|-------|---------|
| `productId` | Product scope |
| `moduleId` | Module/bounded context (optional) |
| `featureId` | Feature scope (optional) |
| `approvedRequirementsSourceId` / `approvedRequirementsSourceVersion` | Anchoring Approved Requirements Source (FDD/PRD/SRS/equivalent) when applicable |
| `releaseId` | Release association when applicable |

### 4.3 Provenance & ownership

| Field | Meaning |
|-------|---------|
| `source` | Origin system/document (`sharepoint`, `manual`, `learning_engine`, `defect_system`, …) |
| `sourceLocator` | External URI/path/id |
| `sourceChecksum` | Integrity of source snapshot when ingested |
| `owner` | Accountable steward/role |
| `createdBy` / `updatedBy` | Actor ids |
| `createdAt` / `updatedAt` | Timestamps |
| `evidence[]` | Links/quotes/supporting artifact ids that justify the knowledge |
| `relationships[]` | Typed links to other knowledge items or ATI artifacts |

### 4.4 Trust & governance

| Field | Meaning |
|-------|---------|
| `approvalStatus` | `draft` / `proposed` / `validated` / `approved` / `published` / `rejected` / `retired` / `archived` / `quarantined` |
| `approvedBy` / `approvedAt` | Approval record |
| `confidence` | Steward or system trust band for *this knowledge item* (distinct from reasoning confidence) |
| `authorityClass` | `product_fact` / `method_pattern` / `contextual` / `risk_signal` / `candidate` |
| `securityClassification` | e.g., `public` / `internal` / `confidential` / `restricted` |
| `tags[]` | Controlled + free tags |
| `validFrom` / `validUntil` | Effectiveness window |
| `retrievalEligibility` | Policy flags (e.g., allowed engines, min hierarchy tier) |

### 4.5 Relationship types (controlled vocabulary examples)

- `derived_from_fdd`
- `summarizes`
- `supports_pattern`
- `conflicts_with` (recorded finding; does not auto-resolve)
- `supersedes`
- `related_to_requirement` / `related_to_scenario` / `related_to_defect`
- `synced_from_sharepoint`

### 4.6 Authority class rules

| Authority class | May assert product behavior? | Typical domains |
|-----------------|------------------------------|-----------------|
| `product_fact` | Only if evidenced + approved + non-conflicting with current FDD | product, feature |
| `method_pattern` | No | testing, automation |
| `contextual` | No (history/environment) | historical_fdd, cloud |
| `risk_signal` | No | defect, release |
| `candidate` | No | ai_generated (pre-promotion) |

---

## 5. Retrieval Strategy

Retrieval is a **planned, policy-driven act**, not ambient RAG over the entire corpus.

### 5.1 Retrieval triggers

Knowledge is fetched only when an engine emits a **Retrieval Intent**:

| Trigger | Example |
|---------|---------|
| Stage entry assist | Understanding needs glossary + product module map |
| Gap-driven | Validation detects possible missing permission patterns → fetch Testing Knowledge patterns |
| Delta mode | New Approved Requirements Source version → fetch historical requirements-source Knowledge for same feature |
| Risk boost | High-risk feature tags → fetch curated Defect Knowledge |
| Review assist | QA Review requests org standards checklist pack |
| Explicit user action | Human asks “compare to last release” |

**Non-triggers:** idle chat; speculative prefetch of whole domains; “embed everything and hope.”

### 5.2 Domain selection

The orchestrator + Knowledge Engine apply a **Domain Selector**:

1. Read current reasoning stage and task type.
2. Apply allow-list of domains for that task (policy table).
3. Restrict by `productId` / `moduleId` / `featureId` from the active FDD context.
4. Exclude domains whose `authorityClass` is illegal for the claim type being formed.
5. Prefer higher hierarchy layers first; stop when sufficiency criteria met (§5.4).

### 5.3 Relevance determination

Logical relevance pipeline:

1. **Scope filter** — product/module/feature/release match.
2. **Eligibility filter** — published, not expired, ACL pass, not quarantined.
3. **Conflict pre-check** — drop or flag items conflicting with current FDD claims already established.
4. **Semantic/structural relevance** — rank by intent match (implementation technology is deferred; architecture requires ranked candidates with scores and reasons).
5. **Authority weighting** — hierarchy tier adjusts rank; lower tiers cannot outrank FDD-grounded items for product facts.
6. **Diversity control** — avoid near-duplicate hits consuming context.

Each hit returns: item version, snippet/summary, score, authority class, conflict flags, provenance.

### 5.4 Context assembly

Assemble a **Knowledge Context Packet** for the calling engine:

- Ordered by hierarchy priority
- Deduplicated
- Separated into buckets: `product_fact_candidates`, `method_patterns`, `contextual`, `risk_signals`
- Includes machine-readable citations
- Includes explicit `do_not_override_fdd` banner in packet contract

Calling engines must treat buckets differently (per AI Reasoning Architecture).

### 5.5 Retrieval limits

Policy-configurable caps (conceptual):

- Max items per domain per request
- Max total tokens/characters of assembled context
- Max historical versions considered
- Max candidate AI-generated items (normally **zero** on product-fact paths)
- Time budget for retrieval

Sufficiency rule: if high-priority domains already satisfy the intent, **do not consume budget on lower domains**.

### 5.6 Cost optimization

1. Prefer metadata/summary retrieval before full-body fetch.
2. Cache published immutable versions by id/version (logical cache; tech neutral).
3. Stage-specific allow-lists prevent broad queries.
4. Deny speculative multi-domain fan-out by default.
5. Record cost/usage metrics per reasoning run for governance.
6. Reuse Context Packets within a run when intents overlap.

### 5.7 Failure handling

| Failure | Behavior |
|---------|----------|
| Knowledge service unavailable | Continue **Approved Requirements Source–only** with `knowledge_unavailable`; lower confidence; do not invent |
| Zero eligible hits | Proceed without augmentation; record `no_hits` |
| Conflict with Approved Requirements Source | Return hits with `conflict=true`; Validation/Review consume as findings; do not merge |
| ACL denial | Omit item; do not leak existence details beyond audit logs as policy requires |
| Stale index / sync lag | Prefer freshness validators; if uncertain, mark hit `freshness_unknown` and down-rank |

---

## 6. Knowledge Validation

Validation occurs at **publish time** and again at **retrieval/use time** (defense in depth).

### 6.1 Publish-time validation

| Check | Question |
|-------|----------|
| Schema | Required metadata present? |
| Provenance | Source + evidence adequate for authority class? |
| Ownership | Owner/steward assigned? |
| Classification | Security classification set? |
| Versioning | Version identity unique; supersession coherent? |
| Domain fit | Type belongs in claimed domain? |
| Freshness | `validUntil` sensible; not already expired? |
| Conflict scan | Contradicts higher-priority published knowledge or known current FDD anchors? |
| AI origin | If AI-generated, approval path enforced? |

### 6.2 Use-time validation (before injection into reasoning)

| Check | Question |
|-------|----------|
| Current? | Within `validFrom`–`validUntil`; not retired/archived? |
| Approved/Published? | Status eligible? |
| Relevant? | Passes scope + intent filters? |
| Same product? | `productId` matches active context (unless domain is global standards)? |
| Conflicts with Approved Requirements Source? | If yes → flag, do not apply as fact |
| Contradicts another selected source? | Prefer higher hierarchy; surface residual conflicts to Validation/Review |
| Authority class appropriate? | Method patterns cannot be used as functional requirements |
| ACL | Caller/engine permitted? |

### 6.3 Conflict outcomes

- `ignore_for_facts` + optional `surface_as_finding`
- `quarantine` item if systematically harmful
- Never auto-edit Approved Requirements Source or Requirement Object to match supporting knowledge

---

## 7. Learning Strategy

Learning improves future assistance. It must **never silently change** published knowledge.

### 7.1 Learning signals (inputs)

| Signal | Use |
|--------|-----|
| FDD summaries (AI-proposed) | Candidate Feature/Product Knowledge |
| Approved scenarios / test cases | Method patterns; trace exemplars (not new product facts) |
| Human feedback (accept/reject/edit) | Strong supervision for promotions |
| AI review outcomes | Checklist/pattern improvements |
| Release history | Release Knowledge curation |
| Automation history | Automation Knowledge (flakiness, reusable flows) |
| Defect trends | Defect Knowledge patterns |
| Clarifications from Product Owner | Feature Knowledge with explicit approval |

### 7.2 Learning flow

```
Signal captured
  → Learning Candidate (AI Generated Knowledge domain, status=proposed)
    → Validation
      → Human/governed Approval
        → Promotion publish into target domain (new version)
          → Audit log
```

Rejected candidates remain auditable and do not affect retrieval.

### 7.3 Non-negotiable learning rules

1. No auto-publish to `product_fact` authority.
2. No mutation of historical versions.
3. No learning that invents functionality absent FDD/clarification evidence.
4. Promotion must set provenance to the candidate + approving actor.
5. Learning Engine confidence ≠ approval.
6. Past Final Reasoning Packages remain immutable; learning cannot rewrite them.

### 7.4 Feedback into hierarchy

Promoted method patterns feed Testing/Automation domains (lower for product facts).  
Promoted feature summaries feed Feature Knowledge only with FDD anchors.  
Defect trends feed risk signals, not requirements.

---

## 8. SharePoint Integration Strategy (Architectural)

SharePoint is an **external content source adapter**, not the system of record for ATI knowledge semantics. ATI stores governed knowledge items derived from or linked to SharePoint content.

### 8.1 Supported document types (logical)

| Type | Typical use |
|------|-------------|
| FDD / design specs | Primary intake candidates → Document Engine / Historical FDD |
| Architecture docs / ADRs | Architecture Knowledge |
| QA standards / templates | Organizational Standards / Testing Knowledge |
| User guides / manuals | User Documentation |
| Release notes | Release Knowledge |
| Runbooks | Cloud / Integration Knowledge |
| Policy PDFs/pages | Compliance / Org Standards |

Unsupported or unscannable formats are ingested as stubs with `parseStatus=failed` and do not become product facts.

### 8.2 Synchronization strategy

| Mode | When |
|------|------|
| **On-demand fetch** | User/system selects a SharePoint item for a reasoning run |
| **Scheduled sync** | Approved libraries mirrored on interval for registered sources |
| **Event-driven sync** | Webhooks/change tokens when available for registered libraries |
| **Manual promote** | Steward pulls a document into draft knowledge |

Sync creates or updates **draft/proposed** ATI items; publication still requires validation/approval unless a pre-approved library policy says “trusted mirror as contextual only.”

### 8.3 Version awareness

- Capture SharePoint version identifiers / etags / lastModified.
- Map to ATI `sourceLocator` + `sourceChecksum`.
- When SharePoint version changes: mark ATI item `stale_source`; require re-validation before remaining eligible.
- Never assume latest SharePoint draft is approved product truth.

### 8.4 Metadata synchronization

Map when available:

- Title, path, library, site, content type
- Authors, modified times
- Sensitivity labels (to security classification mapping)
- Custom columns (product/module/feature) when present

Unmapped metadata must not block ingestion; stewards may enrich in ATI.

### 8.5 Permission boundaries

1. **Least privilege:** ATI sync principals read only designated sites/libraries.
2. **User-bound retrieval:** when acting for a user, do not expose SharePoint content that user could not access (token delegation or equivalent policy).
3. **ACL projection:** ATI knowledge items inherit or map security classification; restricted content excluded from unauthorized reasoning runs.
4. **No cross-tenant leakage** in multi-product deployments.
5. **Audit:** every sync and access logged.
6. **Secrets:** connector credentials via vault adapters — never in knowledge bodies.

### 8.6 Conflict with Approved Requirements Source

If SharePoint user docs, transcripts, or other supporting inputs conflict with the **Approved Requirements Source** under generation/reasoning:

- Approved Requirements Source wins
- Create Validation/Review finding
- Optionally quarantine the knowledge item for that feature scope

---

## 9. Extensibility

### 9.1 Domain registration

New domains register a **Domain Manifest** (logical):

- `domainId`, `name`, `description`
- `defaultAuthorityClass`
- `owners` / approval roles
- `allowedKnowledgeTypes[]`
- `retrievalAllowListStages[]`
- `hierarchyTier` (numeric tier in §2)
- `retentionPolicyRef`
- `securityDefaults`

No core pipeline redesign required to add a domain.

### 9.2 Source adapter registration

New sources (Confluence, Git wikis, ITSM, etc.) implement a **Source Adapter** contract:

- list/fetch/version/checksum
- ACL mapping
- metadata projection
- change detection

Knowledge semantics remain in ATI; adapters are replaceable.

### 9.3 Retrieval policy packs

Stage allow-lists, caps, and sufficiency rules are **versioned policy packs**, not hard-coded engine logic. New stages or engines subscribe to packs.

### 9.4 Compatibility guarantees

Allowed without architecture redesign:

- New domain manifests
- New source adapters
- New tags/types within a domain
- New retrieval policy pack versions

Require ADR:

- Changing hierarchy so supporting knowledge can override the Approved Requirements Source
- Treating platform entry as FDD-only (rejects Knowledge Intake)
- Auto-approving AI-generated product facts
- Removing provenance/version requirements
- Making an LLM the system of record

---

## 10. Governance

### 10.1 Ownership

| Role | Responsibility |
|------|----------------|
| Knowledge Governance Board | Cross-domain policy, exceptions, audits |
| Domain Steward | Domain quality, approvals, retirement |
| Product Owner | Product/Feature fact acceptance |
| Security/Compliance | Classification, retention, regulatory domains |
| Platform Architect | Manifests, hierarchy integrity, adapter standards |
| Implementation Engineer | Realize approved design later — no silent redesign |

### 10.2 Approval workflow

1. Create/sync → draft/proposed  
2. Validate → validated or returned  
3. Domain steward (and second approver for `product_fact` / `restricted`) → approved  
4. Publish → published  
5. Emergency quarantine path with post-facto review  

Dual control recommended for product-fact and compliance domains.

### 10.3 Auditability

Audit events (logical): create, validate, approve, reject, publish, retrieve, retire, archive, quarantine, sync, promote-from-learning.

Each event includes actor, timestamp, knowledgeId/version, rationale.

### 10.4 Traceability

- Knowledge → evidence/source
- Knowledge → reasoning run usage (Context Packet citations)
- Reasoning artifacts → knowledge versions used
- Learning candidate → published promotion

Supports enterprise questions: “Why did ATI consider X?” and “Which knowledge influenced this scenario set?”

### 10.5 Retention

| Class | Typical policy (conceptual) |
|-------|-----------------------------|
| Historical FDD archives | Long-term retain |
| Published product/feature facts | Retain while product live + legal minimum after retirement |
| AI candidates rejected | Shorter retain for audit then purge per policy |
| Defect/release snapshots | Align to release audit needs |
| Raw sync caches | Short-lived; republish derives durable items |

Exact durations are organizational policy references, not hardcoded here.

### 10.6 Security classification

- Every item classified.
- Retrieval and sync enforce classification + ACL.
- Higher classification never down-exported into lower-trust channels.
- LLM provider calls must respect data handling policy (redaction/allow-lists at AI gateway — see platform foundation).

---

## 11. Logical Component View

```
Knowledge Governance Services (logical)
├── Domain Registry
├── Metadata Catalog
├── Lifecycle Manager (states/versions)
├── Validation Service
├── Approval Workflow
├── Retrieval Planner + Knowledge Engine facade
├── Context Packet Assembler
├── Learning Promotion Service
├── Source Adapters (SharePoint, …)
├── Audit & Usage Ledger
└── Policy Pack Manager
```

These components are architectural; deployment shape (modular monolith modules vs services) follows the platform foundation ADR and future extraction ADRs.

---

## 12. Architectural Risks and Mitigations

| Risk | Mitigation |
|------|------------|
| Knowledge treated as requirements | Hierarchy + authorityClass + Approved Requirements Source conflict checks |
| RAG sprawl / cost explosion | Intentional triggers, caps, sufficiency stops, summary-first |
| LLM as memory | EKB is system of record; providers ephemeral |
| Silent learning drift | Candidates + approval; immutable versions |
| SharePoint ACL leaks | User-bound access + classification mapping |
| Stale mirrored docs | Version/etag freshness; stale_source state |
| Historical behavior resurrection | Historical tier is contextual only |

---

## 13. Implementation Readiness (Not Authorization)

This document authorizes **design**. It does **not** authorize code, APIs, schemas, RAG, vector databases, or SharePoint connectors.

When later approved, suggested implementation order:

1. Domain registry + metadata contracts  
2. Lifecycle/approval states  
3. Retrieval planner policies  
4. Knowledge Engine port integration with Reasoning Orchestrator  
5. Source adapters (SharePoint) behind ACL rules  
6. Learning promotion workflow  

Technology choices for search/indexing remain open within platform foundation constraints (cloud-independent ports).

---

## 14. Document Control

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-07-25 | Initial Knowledge Architecture blueprint |
| 1.1 | 2026-07-25 | ARB harmonization (F-04): Approved Requirements Source identity replaces `fddId`/`fddVersion` shorthand (no ADR decision change) |

---

*End of Knowledge Architecture.*
