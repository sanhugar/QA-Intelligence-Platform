# Enterprise Security & Governance Architecture

**Document ID:** ATI-ARCH-SEC-GOV-001  
**Status:** Approved architecture (design only — no implementation)  
**Product:** AI QA Intelligence Platform (ATI v2)  
**Audience:** Chief Information Security Architect, Enterprise Governance Architect, Principal AI Platform Architect, Platform & Compliance stakeholders  
**Depends on:** [ARCHITECTURE.md](./ARCHITECTURE.md), [CANONICAL_TERMINOLOGY.md](./CANONICAL_TERMINOLOGY.md), [DOMAIN_ARCHITECTURE.md](./DOMAIN_ARCHITECTURE.md), [AI_REASONING_ARCHITECTURE.md](./AI_REASONING_ARCHITECTURE.md), [KNOWLEDGE_ARCHITECTURE.md](./KNOWLEDGE_ARCHITECTURE.md), [QA_INTELLIGENCE_FRAMEWORK.md](./QA_INTELLIGENCE_FRAMEWORK.md), [AI_DECISION_AND_EVIDENCE_FRAMEWORK.md](./AI_DECISION_AND_EVIDENCE_FRAMEWORK.md), [ENTERPRISE_DATA_ARCHITECTURE.md](./ENTERPRISE_DATA_ARCHITECTURE.md), [KNOWLEDGE_INTAKE_AND_WORKFLOW_ORCHESTRATION_ARCHITECTURE.md](./KNOWLEDGE_INTAKE_AND_WORKFLOW_ORCHESTRATION_ARCHITECTURE.md), [INTEGRATION_AND_EXTERNAL_SYSTEMS_ARCHITECTURE.md](./INTEGRATION_AND_EXTERNAL_SYSTEMS_ARCHITECTURE.md), [APPLICATION_ARCHITECTURE.md](./APPLICATION_ARCHITECTURE.md)  
**ADR:** [0014 — Security & Governance Architecture](../adr/0014-security-and-governance-architecture.md)  
**Last updated:** 2026-07-25

---

## 0. Purpose and Scope

This document is the **canonical Security & Governance Architecture** for ATI.

It defines enterprise principles, responsibilities, ownership, governance, and **conceptual controls** so that ATI is:

- Secure  
- Explainable  
- Auditable  
- Governed  
- Compliant (policy-ready)  
- Enterprise-ready  
- Multi-tenant aware  
- AI accountable  
- Knowledge governed  
- Operationally manageable  

### Explicitly out of scope

- Code, APIs, UI, prompts  
- Database schemas or physical control implementations  
- Specific product/framework recommendations  
- Redefinition of Domain, Brain, Knowledge, QA heuristics, Decision/Evidence rules, EIM objects, Intake/Workflows, Integration contracts, or Application packaging  
- Binding to any named regulation or certification program  

### Core principles (normative)

| # | Principle | Architectural consequence |
|---|-----------|---------------------------|
| 1 | Security by Design | Controls are designed with architecture, not bolted on after features |
| 2 | Governance by Default | Approvals, evidence, and stewardship are required paths—not optional extras |
| 3 | Least Privilege | Humans, services, and connectors receive minimum necessary authority |
| 4 | Human Authority over AI | Humans own governance dispositions; AI proposes and explains |
| 5 | Explainable AI | Significant AI outcomes must be explainable via Decisions/Evidence |
| 6 | Evidence-Based Decisions | Claims require Evidence; confidence ≠ certainty |
| 7 | Separation of Duties | Critical stewardship, approval, and administration roles are separable |
| 8 | Zero Trust Mindset (conceptual) | No implicit trust across identity, network, or connector boundaries |
| 9 | Privacy Awareness | Classification, minimization, and access scoping guide data handling |
| 10 | Auditability | Security, AI, knowledge, and operational actions leave durable audit trails |
| 11 | Traceability | Artifacts remain linked Intake → Approved Requirements Source → analysis → design → review → automation |
| 12 | Compliance Readiness | Policy/retention/residency/legal-hold hooks are extensible without redesign |
| 13 | Vendor Independence | Security/governance must not depend on a single IdP, AI provider, or cloud |
| 14 | Defense in Depth (conceptual) | Multiple independent control layers; failure of one does not erase all protection |
| 15 | Architecture Before Implementation | This gate authorizes security/governance *architecture only* |

### Alignment (ownership map)

| Concern | Owned by |
|---------|----------|
| Business language & Approvals as Domain facts | Domain Architecture |
| How ATI reasons | AI Reasoning Architecture |
| Knowledge authority & EKB lifecycle meaning | Knowledge Architecture |
| Decision lifecycle, Evidence, HITL, decision audit | AI Decision & Evidence Framework |
| Information identity, seals, classification meaning | Enterprise Data Architecture (EIM) |
| Intake entry & workflow pause/resume | Knowledge Intake & Workflow Orchestration |
| Connector trust, secrets references, degradation | Integration & External Systems Architecture |
| App/module/worker packaging of controls | Application Architecture |
| Stack & secrets-hygiene baseline | Foundation Architecture |
| **Enterprise security, governance, compliance posture, risk & control ownership** | **This document** |

---

## 1. Enterprise Security Architecture

### 1.1 Conceptual security model

`
┌─────────────────────────────────────────────────────────────────┐
│                     Enterprise Trust Fabric                      │
│  Policy · Identity · Classification · Audit · Stewardship        │
└─────────────────────────────────────────────────────────────────┘
        │
        ▼
┌──────────────┐   ┌──────────────┐   ┌──────────────────────────┐
│ Presentation │   │  Application │   │ Workers / AI Processing  │
│   (Web)      │──►│   (Backend)  │──►│   (background)           │
└──────────────┘   └──────┬───────┘   └────────────┬─────────────┘
                          │                        │
                          ▼                        ▼
                   ┌────────────────────────────────────┐
                   │ Domain · Decisions · Knowledge · EIM│  ← Core trust zone
                   └────────────────┬───────────────────┘
                                    │ Integration Contracts only
                                    ▼
                   ┌────────────────────────────────────┐
                   │ Adapters / Connectors (untrusted    │
                   │ relative to Core meaning)           │
                   └────────────────┬───────────────────┘
                                    ▼
                             External Systems
`

### 1.2 Identity boundaries

| Boundary | Definition |
|----------|------------|
| **Human identity** | Persons authenticated via enterprise identity providers (Integration Identity domain) |
| **Service identity** | Platform runtimes (Backend, Worker, future extractable services) acting under least privilege |
| **Connector identity** | Per-connector credentials/references distinct from end-user tokens where sync/automation requires |
| **Tenant identity** | Organization (and nested Workspace) as the primary tenancy boundary from Domain Administration |

Actors crossing a boundary must re-establish trust (authenticate/authorize); prior trust is not inherited blindly.

### 1.3 Trust boundaries

| Boundary | Trust posture |
|----------|---------------|
| Browser / Web client | Untrusted relative to Core; may only use Backend application contracts |
| Backend Application | Trusted to enforce policy; not trusted to invent Domain meaning |
| Worker / AI Processing | Trusted to run Application use cases; must not escalate beyond job intent authority |
| Domain / EIM sealed artifacts | Highest integrity zone; mutations require governed paths |
| Integration Adapter/Connector | Semi-trusted transport; outputs are untrusted until validated/normalized |
| External systems | Untrusted as Requirements masters; optional; degradable |

### 1.4 Security zones (conceptual)

| Zone | Contains | Control emphasis |
|------|----------|------------------|
| **Presentation zone** | Web Application | Session integrity, XSS/CSRF-class mindset, no secrets, no direct connectors |
| **Application zone** | Backend modules, policies | AuthZ, tenancy, audit emission, workflow initiation |
| **Processing zone** | Workers, AI Processing, Knowledge Sync, Reporting jobs | Isolation of long-running work; idempotency; secret redaction in logs |
| **Core meaning zone** | Domain, Decisions/Evidence, Knowledge rules, EIM seals | Integrity, immutability of published snapshots, Approval supremacy |
| **Integration zone** | Adapters/Connectors | Credential scoping, connector health, egress control mindset, non-corruption |
| **Enterprise zone** | IdP, vault, SIEM/observability sinks (external) | Enterprise-owned; ATI consumes via contracts |

### 1.5 Security ownership

| Concern | Owner |
|---------|-------|
| Enterprise security posture & this architecture | Chief Information Security Architect / Security stewardship |
| Identity provider & connector credential governance | Security + Integration stewardship |
| Application AuthZ policies | Application Architecture (User & Access) under Security governance |
| AI accountability controls | AI Governance (this doc) consuming Decision & Evidence Framework |
| Knowledge publication controls | Knowledge Governance (this doc) consuming Knowledge Architecture |
| Operational controls | Operational Governance (§8) |
| Architecture change controls | Architecture Governance (§14) |

### 1.6 Data protection philosophy

1. **Classify before broadly share** — security classification is a first-class governance attribute (EIM/Knowledge).  
2. **Minimize exposure** — supporting knowledge and exports follow need-to-know within tenant/workspace scopes.  
3. **Protect integrity of published truth** — sealed/published artifacts do not silently mutate.  
4. **Separate confidentiality from authenticity** — access denial ≠ rewriting history.  
5. **No secrets in Core entities or git** — vault references only (Foundation + Integration).  
6. **Approved Requirements Source primacy** — security controls must not create alternate “requirements truth” channels.

### 1.7 Secure interaction principles

- All privileged actions require authenticated identity + authorized role/scope.  
- AI outputs are **proposals** until human (or explicit policy-allowed automated path) dispositions them per Decision Framework.  
- External content enters only via Knowledge Intake semantics.  
- Fail-secure on identity outage for privileged actions; optional read-only degrade only if policy allows (Integration).  
- Observability must not leak secrets, raw tokens, or unconstrained sensitive bodies.

---

## 2. Identity & Access Governance

Conceptual architecture only. Authentication/authorization *mechanisms* remain with Foundation/Integration; this section owns **governance of access**.

### 2.1 Authentication

| Aspect | Governance |
|--------|------------|
| **Responsibility** | Establish who (human or service) is acting |
| **Ownership** | Integration Identity connectors + Application auth boundary |
| **Rules** | Enterprise SSO preferred; no local standing admin passwords as primary enterprise pattern; session/token validation at Application boundary |

### 2.2 Authorization

| Aspect | Governance |
|--------|------------|
| **Responsibility** | Decide what an authenticated actor may do within tenant/workspace/product scopes |
| **Ownership** | User & Access Management module (Application Architecture) under Security governance |
| **Rules** | Deny by default for privileged actions; authorize at Application layer; Domain enforces invariants regardless of UI |

### 2.3 RBAC (primary)

| Aspect | Governance |
|--------|------------|
| **Model** | Roles from Domain Administration (e.g., Product Owner, QA Lead, Automation Architect, Knowledge Steward, Platform Admin) |
| **Ownership** | Domain owns Role meaning; Application enforces; Security governs privileged Role assignment |
| **Separation of duties** | Platform Admin ≠ sole Knowledge Publisher ≠ sole Release Approver where enterprise policy requires split |

### 2.4 Future ABAC (extensible)

| Aspect | Governance |
|--------|------------|
| **Intent** | Attributes (classification, residency, feature scope, connector capability) may refine allow/deny without replacing RBAC core |
| **Ownership** | Security Architecture extends policy model via ADR; Domain/EIM supply attributes |
| **Rule** | ABAC supplements RBAC; must not bypass Approvals or Evidence requirements |

### 2.5 Tenant awareness

| Aspect | Governance |
|--------|------------|
| **Boundary** | Organization is hard tenant boundary; Workspace is collaboration scope |
| **Rules** | No cross-tenant data access; connector credentials scoped per tenant/enablement; audit includes tenant context |
| **Ownership** | Administration module + Security governance |

### 2.6 Administrative privileges

| Aspect | Governance |
|--------|------------|
| **Examples** | Tenant bootstrap, role grant, connector enablement, feature flags with security impact |
| **Rules** | Elevated, audited, time-aware where policy requires; dual control encouraged for high-risk changes |
| **Ownership** | Platform Admin role under Security + Operational Governance |

### 2.7 Service identities

| Aspect | Governance |
|--------|------------|
| **Actors** | Backend, Worker, Reporting, Knowledge Sync, AI Processing hosts |
| **Rules** | Least privilege; distinct from human tokens; job intents carry actor + purpose; no standing “god” service role across tenants |

### 2.8 Human identities

| Aspect | Governance |
|--------|------------|
| **Actors** | Users mapped from IdP |
| **Rules** | Membership and Role assignment governed; deactivated IdP users lose ATI privileged access; Approvals record acting human identity |

### 2.9 Delegated access

| Aspect | Governance |
|--------|------------|
| **Intent** | Temporary or scoped delegation (e.g., review on behalf of role) without sharing credentials |
| **Rules** | Explicit, time-bounded, audited; cannot delegate Platform Admin casually; cannot transfer Approval accountability without recorded actor |

---

## 3. AI Governance Architecture

This section **governs** AI decision-making. Cognitive engine duties remain in AI Reasoning Architecture; Decision/Evidence/HITL mechanics remain in AI Decision & Evidence Framework.

### 3.1 Human-in-the-loop approval

- HITL checkpoints and human override supremacy are **inherited** from Decision & Evidence Framework.  
- Application AI Review Workspace and Orchestration pause/resume **host** those checkpoints (Application + Orchestration Architectures).  
- Security governance requires that bypass of mandatory HITL for governed dispositions is a **governance defect**.

### 3.2 Confidence thresholds

- Confidence models and “confidence ≠ certainty” are owned by Decision & Evidence Framework.  
- Security/Governance defines that threshold policies are **organization-stewarded settings**, not silent code defaults hidden from audit.  
- Crossing thresholds may force HITL, degrade automation, or block publication — without inventing new decision types here.

### 3.3 Decision explainability

- Explanation Packets and explainability levels are owned by Decision & Evidence Framework.  
- Governance requires significant AI outcomes presented to humans to be accompanied by explainability adequate to the decision category.

### 3.4 Evidence requirements

- Evidence Model and primacy rules are inherited (human disposition > Approved Requirements Source > …; LLM text alone is not evidence).  
- Governance forbids treating provider output as Approval.

### 3.5 AI approval workflow

Conceptual sequence (orchestration meaning unchanged):

```
AI proposal → Decision + Evidence + Explanation
     → (threshold / category policy)
     → HITL Review / Approval / Override / Clarification
     → Governed disposition recorded
     → Downstream artifact advance (only if allowed)
```

### 3.6 AI review responsibilities

| Role | Responsibility |
|------|----------------|
| **AI Review engine / module** | Produce critique findings (Brain + AI Review module) |
| **Authorized human reviewer** | Disposition findings; override when needed |
| **QA Lead / Product roles** | Accountable for accepting design/requirement advances per Domain Approvals |
| **Security/Governance** | Ensure review paths cannot be silently skipped for governed categories |

### 3.7 AI accountability

| Question | Answer (governance) |
|----------|---------------------|
| Who proposed? | AI Processing / engine run identity (provenance metadata) |
| Who decided? | Recorded human Approval/Override or explicit automated policy path |
| Who is accountable? | Human Role owning the Domain Approval — never “the model” |

### 3.8 AI output ownership

- AI-generated artifacts are ATI-governed business artifacts under Domain/EIM identity once accepted into lifecycle.  
- Provider terms do not become Requirements masters.  
- Published/sealed outputs are owned by the Organization tenant stewardship model.

### 3.9 AI escalation

| Trigger (conceptual) | Escalation |
|----------------------|------------|
| Mandatory HITL unmet | Block advance; notify; audit |
| Low confidence / conflict with Approved Requirements Source | Clarification or reject path per Decision Framework |
| Suspected prompt/data exfil or policy violation | Security incident path (§8 / §10) |
| Connector/provider untrusted or unhealthy | Degrade/fail per Integration; no invented Requirements |

### 3.10 AI decision lineage

- Decision audit facets and immutable lineage are owned by Decision & Evidence Framework.  
- Governance requires lineage to remain reconstructable: inputs → evidence → decision → disposition → artifact effect.  
- Application Reporting and Audit views consume lineage; they do not redefine it.

---

## 4. Knowledge Governance

Consumes Knowledge Architecture lifecycle and hierarchy. Does not redefine domain authority tiers.

### 4.1 Knowledge ownership

| Aspect | Governance |
|--------|------------|
| **Owner / steward** | Assigned per Knowledge Item/Domain (Knowledge Architecture metadata) |
| **Accountability** | Stewards approve publish/retire; AI cannot silently publish |

### 4.2 Publication workflow

Inherited lifecycle direction: `draft/proposed → validated → approved → published → retired → archived` (and quarantine paths).  
Governance rule: **no silent publish**; every publish creates an immutable version.

### 4.3 Approval & review

- Publication requires authorized Approval distinct from AI suggestion.  
- Conflict with higher hierarchy (especially Approved Requirements Source for generation claims) yields finding — not silent merge.

### 4.4 Versioning, retirement, lineage

- Immutable published revisions; retirement stops use as live authority for new reasoning.  
- Lineage/provenance required for stewardship and audit.  
- Historical knowledge informs deltas; must not resurrect retired behavior as current requirements.

### 4.5 Stewardship & classification

- Classification must be present for publish eligibility.  
- ACL/classification projection from sources must not widen access beyond tenant policy.  
- Quality assurance checks at publish and use-time remain Knowledge Architecture duties; Governance requires they are not optional for authority-class items.

### 4.6 Non-negotiable

**Knowledge must never silently change published truth.**  
Corrections create new versions or governed retirement/supersession — not in-place mutation of published snapshots.

---

## 5. Information Governance

Consumes Enterprise Data Architecture (EIM). No schemas.

| Concern | Governance expectation | Owned meaning |
|---------|------------------------|---------------|
| **Classification** | Required for governed Documents/artifacts; drives access & export caution | EIM + Security policy |
| **Retention** | Schedules by class/type; archival after retirement | Information Governance + Operational |
| **Archival** | Cold retention of retired/superseded content | EIM lifecycle + Ops |
| **Integrity** | Seals/immutability of published snapshots; checksum/provenance mindset | EIM |
| **Ownership** | Organization/Workspace/steward accountability | Domain + EIM |
| **Audit** | Who created/changed/accessed sensitive governed actions | This doc §11 + Decision audit |
| **Traceability** | Trace Links and Intake→artifact chain | Domain + EIM + Orchestration |
| **Lifecycle** | Draft through archive without silent rewrite | EIM + Knowledge/Domain lifecycles |

**Approved Requirements Source documents** remain generation authority; information governance protects them from unauthorized alteration and uncontrolled export.

---

## 6. Integration Security

Consumes Integration & External Systems Architecture.

| Topic | Conceptual control |
|-------|--------------------|
| **Trust establishment** | Connector registration ≠ production trust; enablement is a governed act |
| **Connector permissions** | Capability negotiation; least privilege scopes; tenant-scoped enablement |
| **Credential ownership** | Enterprise/tenant secret stewardship; vault references only; never in Domain entities |
| **Secrets responsibility** | Integration adapters redact; workers/apps must not log secrets; Security owns secret policy |
| **Connector isolation** | Circuit isolation when Unhealthy; no lateral privilege across connectors |
| **Provider trust** | AI/knowledge/ALM providers are replaceable; trust is policy + health + provenance, not brand |
| **External dependency governance** | Optional integrations; graceful degradation; failures must not corrupt sealed ATI information |
| **Identity outage** | Fail-secure for privileged actions |

External systems are **never** Requirements masters and **never** Approval authorities for ATI Core dispositions.

---

## 7. Application Security

Expectations by Application Architecture deployable/logical app. No implementation.

| Application | Conceptual security expectations |
|-------------|----------------------------------|
| **Web Application** | Authenticated sessions only; no connector SDKs; no Domain invariant reimplementation; CSRF/XSS-class mindset; no standing secrets in client |
| **Backend** | Enforce AuthZ/tenancy; validate Intake entry; emit audit; authorize Approvals; mediate all externals via Integration Facade |
| **Workers** | Execute only authorized job intents; idempotent; least-privilege service identity; redact secrets in logs; checkpoint without corrupting seals |
| **AI Processing** | Provider calls via Integration AI contracts only; attach provenance; honor HITL pauses; no auto-Approval |
| **Reporting** | Respect classification/ACL; exports via governed Export contracts; no invention of Requirements |
| **Document Management** | Provenance-preserving registration; storage via Integration Storage; classification required for governed use |
| **Administrative functions** | Elevated audit; separation of duties; dual control encouraged for connector enablement and role grants |

---

## 8. Operational Governance

| Topic | Ownership / expectation |
|-------|-------------------------|
| **Configuration ownership** | Configuration module + Platform stewardship; security-impacting flags require Security review |
| **Operational responsibilities** | Platform Ops runs deployables; Security defines control requirements; Product stewards own content Approvals |
| **Deployment governance** | Changes follow change management; architecture-impacting deploys require ADR/compliance check |
| **Incident management** | Security, availability, AI-policy, and data incidents have escalation owners (§10) |
| **Operational audit** | Privileged ops actions are auditable |
| **Monitoring ownership** | Platform Observability hosts signals; Integration owns connector health meaning; Orchestration owns workflow observability meaning |
| **Platform stewardship** | Accountable for runtime hygiene, dependency scanning mindset, secret rotation policy |
| **Change management** | Separates routine ops from architectural change (ADRs) and from Domain Approvals |

---

## 9. Compliance Architecture

Conceptual support only — **no specific regulation targeted**.

| Capability | Governance intent |
|------------|-------------------|
| **Audit readiness** | Reconstruct who/what/when/why for security, AI decisions, knowledge publish, and integrations |
| **Regulatory extensibility** | New frameworks attach as policy packs/control mappings without rewriting Core meaning |
| **Data residency awareness** | Classification + connector/routing policy awareness (Integration/Application); no hardcoding a single region as architecture truth |
| **Enterprise policy compliance** | Org policies bind Roles, HITL thresholds, connector allowlists, retention |
| **Retention policies** | Align to Information Governance; prevent unbounded sensitive retention without policy |
| **Information protection** | Classification-driven handling; export control mindset |
| **Traceability** | Preserve verification chain for assurance reviews |
| **Legal hold awareness** | Capability to suspend destructive retention/retirement paths under hold — design hook only |

Compliance mappings are **extensions** (§13), not Core redesigns.

---

## 10. Risk Management

| Risk class | Examples | Ownership | Escalation |
|------------|----------|-----------|------------|
| **AI risks** | Hallucinated requirements, skipped HITL, over-trust in confidence | AI Governance + Decision Framework stewards | Security + Product Owner / QA Lead |
| **Knowledge risks** | Silent publish, hierarchy violations, stale authority | Knowledge stewards | Knowledge Architecture owner + Security if ACL breach |
| **Operational risks** | Misconfig, failed jobs, observability gaps | Platform Ops | Platform stewardship → Security if abuse/outage impact |
| **Security risks** | Privilege abuse, secret leak, tenant isolation break | Security Architecture | Incident management / CISO path |
| **Integration risks** | Vendor outage, credential compromise, corruptive sync | Integration stewardship | Degrade/disable connector; Security if credential incident |
| **Data risks** | Classification gaps, unauthorized export, integrity loss | Information Governance + EIM stewards | Security + Legal/Compliance (enterprise) |
| **Governance risks** | ADR bypass, dual uncontrolled truth, SoD collapse | Architecture Governance (§14) | Chief Architect + Security |

**Escalation principle:** technical degrade first to protect integrity; human governance escalation for accountability and policy breach.

---

## 11. Audit & Observability Governance

| Audit domain | What is governed | Meaning owned by |
|--------------|------------------|------------------|
| **Security audit** | AuthN/AuthZ decisions, admin actions, privilege grants, security incidents | This architecture + Application Access |
| **AI audit** | Engine runs, provider provenance, proposals | AI Reasoning + Decision Framework |
| **Decision audit** | Decision lifecycle, Evidence, Explanation, HITL dispositions | AI Decision & Evidence Framework |
| **Evidence audit** | Evidence completeness and primacy compliance | AI Decision & Evidence Framework |
| **Knowledge audit** | Publish/retire/approve, hierarchy conflicts, ACL denials | Knowledge Architecture |
| **Operational audit** | Deployments, config changes, job failures, recoveries | Operational Governance |
| **Integration audit** | Connector enablement, health transitions, degraded modes, secret-reference rotations (not secret values) | Integration Architecture |
| **User activity audit** | Significant user actions in workspaces (Intake submit, Approval, export) | Application + Security |

**Rules**

1. Audit trails for governed actions are durable and tamper-evident in intent.  
2. Observability complements audit but is not a substitute for Decision/Evidence records.  
3. Logs must not become a covert channel for secrets or unconstrained sensitive payloads.  
4. Failure to answer lineage questions for significant decisions is a governance defect (Decision Framework).

---

## 12. Business Continuity & Resilience

Architecture only — no infrastructure design.

| Topic | Principle |
|-------|-----------|
| **Service continuity** | Critical paths (authz, Intake acceptance, read of sealed artifacts) prioritized over optional enrichment |
| **Recovery principles** | Restore integrity before completeness; replay idempotent jobs; never “recover” by inventing Requirements |
| **High availability awareness** | Deployables (Web/Backend/Worker) may scale independently; Core meaning remains single logical truth |
| **Graceful degradation** | Inherited from Integration (skip unhealthy connectors; Approved Requirements Source–only paths) |
| **Disaster recovery alignment** | Backup/restore governed so seals/lineage/approvals survive; residency/policy respected |
| **Backup governance** | Backups are classified assets; access least privilege; restoration is an audited operational act |

---

## 13. Extensibility

ATI evolves security/governance by **extension packs**, not Core redesign:

| Evolution | Extension path |
|-----------|----------------|
| New enterprise security requirements | New control mappings + Application policy hooks + ADR if architecture-impacting |
| New compliance frameworks | Compliance mapping packs over existing audit/lineage/retention hooks |
| New governance models | Role/SoD packs; HITL threshold policies; steward matrices |
| New identity providers | Integration Identity connectors behind existing contracts |
| New audit requirements | Additional audit facets consuming existing Decision/Knowledge/Integration events |
| Future AI governance standards | Map to Decision/Evidence/HITL/Explanation model; extend categories via Decision Framework extensibility |

**Forbidden:** inventing a parallel Approval system, a second Requirements authority, or vendor-locked security cores inside Domain.

---

## 14. Architecture Governance

| Rule | Expectation |
|------|-------------|
| **Architectural compliance** | Implementation (when authorized) must conform to approved architecture docs + ADRs; charter roles apply |
| **ADR approval** | Significant/reversible decisions require ADRs (process in `docs/adr/README.md`) |
| **Architecture ownership** | Each architecture document has an owner; this document owned by Security & Governance Architects |
| **Future architectural changes** | Propose → review → ADR → update owning doc; no silent drift |
| **Review process** | Security-impacting designs reviewed by Security stewardship; AI-accountability by AI Platform + Decision stewards; cross-cutting by Chief Architect |
| **Version management** | Architecture docs carry Document Control versions; breaking intent changes bump version and ADR |

**Charter alignment:** Cursor/Implementation Engineer must not invent or change architecture without approval ([AI_DEVELOPMENT_CHARTER.md](../standards/AI_DEVELOPMENT_CHARTER.md)).

---

## 15. Architectural Dependencies & Boundaries

### 15.1 Consumed Architectures

| Approved architecture | Consumed / inherited | Intentionally not redefined |
|-----------------------|----------------------|-----------------------------|
| [Foundation Architecture](./ARCHITECTURE.md) (ADRs 0001–0003) | OIDC baseline, secrets hygiene, observability baseline, modular deployables | Stack re-selection; coding standards |
| [AI Reasoning Architecture](./AI_REASONING_ARCHITECTURE.md) (ADR 0004) | Engine provenance, reason-before-generate | Cognitive engine duties, prompts |
| [Knowledge Architecture](./KNOWLEDGE_ARCHITECTURE.md) (ADR 0005) | Hierarchy, lifecycle, stewardship metadata, ACL projection | Authority tier meanings |
| [Domain Architecture](./DOMAIN_ARCHITECTURE.md) (ADR 0006) | Roles, Approvals, tenancy objects, invariants | Ubiquitous language / object meanings |
| [QA Intelligence Framework](./QA_INTELLIGENCE_FRAMEWORK.md) (ADR 0007) | Heuristics as Core cognitive policy | Heuristic content |
| [AI Decision & Evidence Framework](./AI_DECISION_AND_EVIDENCE_FRAMEWORK.md) (ADR 0008) | Decision lifecycle, Evidence, Explanation, HITL, decision audit | Decision types & evidence primacy rules |
| [Enterprise Data Architecture (EIM)](./ENTERPRISE_DATA_ARCHITECTURE.md) (ADR 0009) | Classification, seals, identity, lineage | Physical information schemas |
| [Canonical Terminology](./CANONICAL_TERMINOLOGY.md) (ADR 0010) | Knowledge Intake / Approved Requirements Source terms | Term definitions |
| [Knowledge Intake & Workflow Orchestration](./KNOWLEDGE_INTAKE_AND_WORKFLOW_ORCHESTRATION_ARCHITECTURE.md) (ADR 0011) | Intake entry, HITL pause/resume, checkpoints | Workflow catalog semantics |
| [Integration & External Systems](./INTEGRATION_AND_EXTERNAL_SYSTEMS_ARCHITECTURE.md) (ADR 0012) | Connector trust/health, secrets references, degradation, identity integration | Connector SPI/vendor details |
| [Application Architecture](./APPLICATION_ARCHITECTURE.md) (ADR 0013) | Apps/modules/workers where controls are enforced | Module packaging redesign |

### 15.2 Architectural Boundaries

This document **must not redefine**:

| Concept area | Owning architecture |
|--------------|---------------------|
| Domain concepts, Roles-as-meaning, Approvals-as-Domain-facts | Domain Architecture |
| Brain engines / cognitive pipeline | AI Reasoning Architecture |
| Knowledge hierarchy & EKB lifecycle meaning | Knowledge Architecture |
| Decision types, Evidence model, HITL trigger catalog | AI Decision & Evidence Framework |
| EIM objects, seals, identity rules | Enterprise Data Architecture |
| Intake stages & workflow definitions | Knowledge Intake & Workflow Orchestration |
| Integration contracts / connector lifecycle mechanics | Integration & External Systems Architecture |
| Logical apps/modules/workers packaging | Application Architecture |
| QA heuristic packs | QA Intelligence Framework |

**Allowed extension (security & governance only):** trust/identity/access governance, AI accountability posture, knowledge/information governance overlays, integration security posture, application security expectations, operational/compliance/risk/audit/continuity governance, architecture governance rules, extensibility of control mappings.

### 15.3 Extension Responsibilities

**This architecture introduces**

- Enterprise security zones, trust/identity boundaries, and data protection philosophy  
- Identity & access governance (RBAC primary, ABAC-ready, tenant/admin/service/human/delegation)  
- AI governance overlay (accountability, escalation, output ownership) referencing Decision Framework  
- Knowledge & information governance overlays  
- Integration and application security expectations  
- Operational, compliance, risk, audit/observability, and continuity governance  
- Architecture governance rules for compliance and change  
- Dependency matrix for Security & Governance  

**Future gates that will depend on it**

- Formal threat model (platform spine authenticated surfaces)  
- Tenant model ADR before first migration  
- Compliance mapping packs (customer/enterprise-specific)  
- Secret management operationalization  
- Penetration/security review gates per release train  
- Legal hold / retention implementation policies  

### 15.4 Architecture Dependency Matrix

| Architecture | Relationship | Responsibility |
|--------------|--------------|----------------|
| Foundation Architecture | Consumed | Baseline auth, secrets, observability assumptions |
| AI Reasoning Architecture | Consumed | Provenance of AI runs; no cognitive redefinition |
| Knowledge Architecture | Consumed | Publish/retire truth rules; governance overlays stewardship |
| Domain Architecture | Consumed | Roles, Approvals, tenancy as business facts |
| QA Intelligence Framework | Consumed | Heuristics remain Core; security does not replace QA reasoning |
| AI Decision & Evidence Framework | Consumed | Decision/Evidence/HITL/audit mechanics |
| Enterprise Data Architecture (EIM) | Consumed | Classification, seals, integrity meaning |
| Canonical Terminology (ADR 0010) | Consumed | Intake / Approved Requirements Source terms |
| Knowledge Intake & Workflow Orchestration | Consumed | Operational HITL pause/resume hosting |
| Integration & External Systems | Consumed | Connector trust, secrets references, degradation |
| Application Architecture | Consumed | Where controls are placed across apps/modules/workers |
| **Security & Governance Architecture (this document)** | Introduces | Enterprise security, governance, compliance posture, risk & audit ownership |
| Future Threat Model / Compliance / Tenant ADRs | Depend on this | Specialize controls without redesigning Core |

---

## 16. Cross References

| Document / ADR | Role relative to this architecture |
|----------------|-------------------------------------|
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Foundation security/secrets/auth baselines |
| [SECURITY.md](./SECURITY.md) | Short foundation index; defers canonical detail here |
| [APPLICATION_ARCHITECTURE.md](./APPLICATION_ARCHITECTURE.md) / ADR 0013 | Apps/modules/workers control placement |
| [INTEGRATION_AND_EXTERNAL_SYSTEMS_ARCHITECTURE.md](./INTEGRATION_AND_EXTERNAL_SYSTEMS_ARCHITECTURE.md) / ADR 0012 | Connector/identity/secrets integration |
| [AI_DECISION_AND_EVIDENCE_FRAMEWORK.md](./AI_DECISION_AND_EVIDENCE_FRAMEWORK.md) / ADR 0008 | Decision, Evidence, HITL, decision audit |
| [AI_REASONING_ARCHITECTURE.md](./AI_REASONING_ARCHITECTURE.md) / ADR 0004 | Brain provenance |
| [KNOWLEDGE_ARCHITECTURE.md](./KNOWLEDGE_ARCHITECTURE.md) / ADR 0005 | Knowledge lifecycle/hierarchy |
| [DOMAIN_ARCHITECTURE.md](./DOMAIN_ARCHITECTURE.md) / ADR 0006 | Roles, Approvals, tenancy |
| [ENTERPRISE_DATA_ARCHITECTURE.md](./ENTERPRISE_DATA_ARCHITECTURE.md) / ADR 0009 | EIM classification/seals |
| [QA_INTELLIGENCE_FRAMEWORK.md](./QA_INTELLIGENCE_FRAMEWORK.md) / ADR 0007 | QA cognitive policy |
| [CANONICAL_TERMINOLOGY.md](./CANONICAL_TERMINOLOGY.md) / ADR 0010 | Intake terminology |
| [KNOWLEDGE_INTAKE_AND_WORKFLOW_ORCHESTRATION_ARCHITECTURE.md](./KNOWLEDGE_INTAKE_AND_WORKFLOW_ORCHESTRATION_ARCHITECTURE.md) / ADR 0011 | Workflow HITL hosting |
| [ADR 0014](../adr/0014-security-and-governance-architecture.md) | Accepts this document |
| [AI_DEVELOPMENT_CHARTER.md](../standards/AI_DEVELOPMENT_CHARTER.md) | Roles, gates, no silent architecture change |
| [docs/adr/README.md](../adr/README.md) | ADR process |

Do **not** duplicate the contents of those documents here.

---

## 17. Document Control

| Field | Value |
|-------|-------|
| **Version** | 1.0 |
| **Status** | Approved architecture (design only — no implementation) |
| **Owner** | Chief Information Security Architect / Enterprise Governance Architect |
| **Related ADR** | [0014 — Security & Governance Architecture](../adr/0014-security-and-governance-architecture.md) |
| **Dependencies** | ADRs 0001–0013 and their architecture documents listed in §15–§16 |
| **Last updated** | 2026-07-25 |

### Change History

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-07-25 | Initial Enterprise Security & Governance Architecture (Architecture Gate 8) |

---

*End of Enterprise Security & Governance Architecture.*
