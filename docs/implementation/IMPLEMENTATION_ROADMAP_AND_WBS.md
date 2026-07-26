# ATI Implementation Roadmap and Work Breakdown Structure

**Document ID:** ATI-IMPL-ROADMAP-001  
**Status:** Approved implementation planning document (no implementation code)  
**Product:** AI QA Intelligence Platform (ATI v2)  
**Audience:** Principal Software Architect, Technical Program Manager, Enterprise Engineering Manager, AI Platform Architect, Delivery Lead, Implementation Engineer  
**Phase:** Implementation Planning — executable build order from empty repository to production readiness  
**Last updated:** 2026-07-25

---

## 0. Purpose and Scope

This document is the **canonical implementation planning document** for ATI.

It transforms approved Enterprise Architecture, AI Brain Architecture, Engineering Specifications, and AI Engine Development & Implementation Standards into an **executable implementation roadmap**: phases, work packages, milestones, dependencies, acceptance criteria, risks, and deliverables.

### This document is

- A planning / delivery sequencing document  
- Detailed enough for phase-by-phase implementation without guessing build order  
- Consuming of all approved architecture and engineering specifications  

### This document is not

- Architecture redesign or an ADR  
- Implementation (code, APIs, schemas, prompts, UI)  
- A redefinition of Domain, Brain, Knowledge, Orchestration, Integration, or Security meaning  
- A schedule with calendar estimates or staffing plans  

### Relationship to other roadmaps

| Document | Role |
|----------|------|
| [docs/roadmap/ROADMAP.md](../roadmap/ROADMAP.md) | Product/architecture capability phases (design history + high-level capability sequencing) |
| [Implementation Readiness & Technical Blueprint](../architecture/IMPLEMENTATION_READINESS_AND_TECHNICAL_BLUEPRINT.md) | Architecture Gate 9 — readiness, mapping, AI-dev governance |
| **This document** | **Executable WBS and delivery roadmap** for build-out |

Capability names and ownership remain those of approved architecture. This document only organizes **how to build**.

**Implementation authorization:** Architecture baseline is **FROZEN** and implementation is **authorized** per [ARCHITECTURE_BASELINE_STATUS.md](../architecture/ARCHITECTURE_BASELINE_STATUS.md) (25-Jul-2026). Still complete Blueprint §15 kickoff checklist at start of Phase 1; specialized ADRs remain milestone-gated (tenancy, threat model, connectors, prompts).

---

## 1. Implementation Principles

| Principle | Delivery meaning |
|-----------|------------------|
| **Build from the Platform Spine outward** | Runtime foundation before cognition, UI, or integrations |
| **Complete one vertical slice before the next** | Prefer thin end-to-end paths over unfinished horizontal layers |
| **Preserve architecture boundaries** | Clean Architecture, ports/adapters, Orchestration ownership, ARS primacy, invent ban |
| **Avoid speculative implementation** | No engines, connectors, or UX ahead of their phase without authorization |
| **Prefer incremental delivery** | Each phase leaves a demoable, testable increment |
| **Keep all work independently testable** | Packages and engines testable behind ports; no “big bang” only integration |
| **Engineering standards are binding** | [AI Engine Development and Implementation Standards](../engineering/AI_ENGINE_DEVELOPMENT_AND_IMPLEMENTATION_STANDARDS.md) + Framework + Spine |
| **AI benchmark gate is binding** | [AI Benchmark and Golden Dataset Framework](../engineering/AI_BENCHMARK_AND_GOLDEN_DATASET_FRAMEWORK.md) — engines production-ready only after published suite acceptance |
| **Evidence and HITL over speed** | Do not ship invented requirements or skipped governance for velocity |
| **Provider independence** | AI and external systems only behind Integration ports |
| **No architecture by code** | Gaps → ADR/eng-spec update, not silent redesign |

---

## 2. Development Phases

Objectives only — no implementation detail.

| Phase | Name | Objective |
|-------|------|-----------|
| **0** | Planning Baseline (complete) | Architecture, eng specs, and this roadmap accepted; baseline frozen; implementation authorized |
| **1** | Platform Spine | Establish deployable runtime foundation (`web` / `api` / `worker` hosts), shared platform services, registration, health, and AI runtime host shell |
| **2** | Shared Infrastructure | Establish shared packages, identity/tenancy context baseline, configuration, logging/diagnostics, events, feature flags, and cross-cutting error philosophy |
| **3** | Knowledge Intake | Operationalize Knowledge Intake entry, classification signals, ARS designation under Orchestration, Feature Version / lineage primitives |
| **4** | AI Runtime | Operationalize provider-agnostic AI ports, engine registration/execution host, provenance, retry/degradation hooks under Orchestration |
| **5** | AI Brain Engines | Implement Brain engines and gates through QA Readiness / Final Output packaging per eng specs and implementation standards |
| **6** | Knowledge Repository | Operationalize Enterprise Knowledge Base retrieval/governance paths (augmenting only) at product scale |
| **7** | User Interface | Deliver workspaces for Intake, HITL review, reasoning navigation, coverage/readiness visibility |
| **8** | Integrations | Deliver external connectors (IdP hardening, SharePoint/knowledge sources, ALM, notify/storage as authorized) behind contracts |
| **9** | Release & Reporting | Deliver documentation, automation readiness, reporting, release-planning enablement on sealed packages |
| **10** | Hardening & Production Readiness | Security hardening, performance/scale validation, ops readiness, compliance evidence, production cutover criteria |

**Mapping note (no redesign):** Product ROADMAP “Phase 1b” ≈ this Phase 1–3 start; “Reasoning Engine Implementation” ≈ Phases 4–5; later product phases map to Phases 6–10. Names above are the **implementation** taxonomy.

---

## 3. Work Breakdown Structure (WBS)

Work packages are implementation packages — not task-level tickets. No APIs/schemas/code defined here.

### Phase 1 — Platform Spine

#### WP-1.1 Application Host Bootstraps

| Field | Content |
|-------|---------|
| **Purpose** | Stand up logical apps (`web`, `api`, `worker`) as empty-but-runnable hosts |
| **Dependencies** | Phase 0 complete; baseline freeze / implementation authorization |
| **Expected outcomes** | Hosts start/stop cleanly; environment boot order respected |
| **Completion criteria** | Health/readiness observable; no business cognition; Spine boot checklist satisfied |
| **Implementation status** | Complete — see [WP-1.1_DEFERRED_CAPABILITY_REGISTER.md](./WP-1.1_DEFERRED_CAPABILITY_REGISTER.md) |

#### WP-1.2 Platform Registration & Module Shell

| Field | Content |
|-------|---------|
| **Purpose** | Registration model for modules, workflows, engines, connectors (shell) |
| **Dependencies** | WP-1.1 |
| **Expected outcomes** | Discoverable registered units; disabled-by-default unused capabilities |
| **Completion criteria** | Registration documented; no ad hoc wiring required for next phases |
| **Implementation status** | **Complete** — Independent Architecture Review approved — closed |
| **Artifacts** | [WP-1.2_IMPLEMENTATION_REPORT.md](./WP-1.2_IMPLEMENTATION_REPORT.md) · [WP-1.2_DEFERRED_CAPABILITY_REGISTER.md](./WP-1.2_DEFERRED_CAPABILITY_REGISTER.md) · [WP-1.2_CLOSEOUT_REPORT.md](./WP-1.2_CLOSEOUT_REPORT.md) · [PLATFORM_REGISTRATION_DEPENDENCY_MATRIX.md](../engineering/PLATFORM_REGISTRATION_DEPENDENCY_MATRIX.md) · [PLATFORM_SPINE_WP-1.2.md](../engineering/PLATFORM_SPINE_WP-1.2.md) |
| **Process** | [IMPLEMENTATION_WORKFLOW.md](../development/IMPLEMENTATION_WORKFLOW.md) |

#### WP-1.3 Spine Shared Service Shell

| Field | Content |
|-------|---------|
| **Purpose** | Initialize config, diagnostics, event, scheduling, feature-flag, audit-support abstractions |
| **Dependencies** | WP-1.1 (registration from WP-1.2 recommended before shared-service consumers) |
| **Expected outcomes** | Shared services available to modules without Domain logic |
| **Completion criteria** | Spine eng spec shell responsibilities met; independently testable |
| **Implementation status** | **Complete** — Independent Architecture Review approved — closed |
| **Artifacts** | [WP-1.3_IMPLEMENTATION_REPORT.md](./WP-1.3_IMPLEMENTATION_REPORT.md) · [WP-1.3_DEFERRED_CAPABILITY_REGISTER.md](./WP-1.3_DEFERRED_CAPABILITY_REGISTER.md) · [WP-1.3_CLOSEOUT_REPORT.md](./WP-1.3_CLOSEOUT_REPORT.md) · [PLATFORM_SPINE_WP-1.3.md](../engineering/PLATFORM_SPINE_WP-1.3.md) |
| **Process** | [IMPLEMENTATION_WORKFLOW.md](../development/IMPLEMENTATION_WORKFLOW.md) |

#### WP-1.4 AI Runtime Host Shell

| Field | Content |
|-------|---------|
| **Purpose** | Host capacity to discover/execute registered engines under Orchestration (no Brain engines yet) |
| **Dependencies** | WP-1.2, WP-1.3 |
| **Expected outcomes** | Engine manifest registration path; invocation envelope ready |
| **Completion criteria** | Can run a no-op/stub engine under host rules without provider binding in core |
| **Implementation status** | **Complete** — Independent Architecture Review approved — closed |
| **Artifacts** | [WP-1.4_IMPLEMENTATION_REPORT.md](./WP-1.4_IMPLEMENTATION_REPORT.md) · [WP-1.4_DEFERRED_CAPABILITY_REGISTER.md](./WP-1.4_DEFERRED_CAPABILITY_REGISTER.md) · [WP-1.4_CLOSEOUT_REPORT.md](./WP-1.4_CLOSEOUT_REPORT.md) · [PLATFORM_SPINE_WP-1.4.md](../engineering/PLATFORM_SPINE_WP-1.4.md) |
| **Process** | [IMPLEMENTATION_WORKFLOW.md](../development/IMPLEMENTATION_WORKFLOW.md) |

---

### Phase 2 — Shared Infrastructure

#### WP-2.1 Shared Packages Baseline

| Field | Content |
|-------|---------|
| **Purpose** | Shared libraries for types, validation helpers, config, logger, errors (boundary-safe) |
| **Dependencies** | WP-1.1 |
| **Expected outcomes** | Apps consume shared packages; no Domain leakage into UI |
| **Completion criteria** | Package boundaries match Application Architecture; tests for shared utilities |
| **Implementation status** | **Complete** — Independent Architecture Review approved — closed |
| **Artifacts** | [WP-2.1_FINAL_PRE_IMPLEMENTATION_PLAN.md](./WP-2.1_FINAL_PRE_IMPLEMENTATION_PLAN.md) · [WP-2.1_IMPLEMENTATION_REPORT.md](./WP-2.1_IMPLEMENTATION_REPORT.md) · [WP-2.1_DEFERRED_CAPABILITY_REGISTER.md](./WP-2.1_DEFERRED_CAPABILITY_REGISTER.md) · [WP-2.1_CLOSEOUT_REPORT.md](./WP-2.1_CLOSEOUT_REPORT.md) |
| **Process** | [IMPLEMENTATION_WORKFLOW.md](../development/IMPLEMENTATION_WORKFLOW.md) |

#### WP-2.2 Identity & Access Baseline

| Field | Content |
|-------|---------|
| **Purpose** | AuthN/AuthZ baseline (OIDC) and request identity context |
| **Dependencies** | WP-1.1; Security Architecture consumption; WP-2.1 |
| **Expected outcomes** | Authenticated access to protected host surfaces |
| **Completion criteria** | Unauthenticated access denied where required; no AI Approval bypass |
| **Implementation status** | **Complete** — Delta Verification v2 verified — closed |
| **Artifacts** | [WP-2.2_IMPLEMENTATION_REPORT.md](./WP-2.2_IMPLEMENTATION_REPORT.md) · [WP-2.2_DEFERRED_CAPABILITY_REGISTER.md](./WP-2.2_DEFERRED_CAPABILITY_REGISTER.md) · [WP-2.2_MANDATORY_REMEDIATION_IMPLEMENTATION_REPORT.md](./WP-2.2_MANDATORY_REMEDIATION_IMPLEMENTATION_REPORT.md) · [WP-2.2_REPOSITORY_CLOSEOUT.md](./WP-2.2_REPOSITORY_CLOSEOUT.md) |
| **Process** | [IMPLEMENTATION_WORKFLOW.md](../development/IMPLEMENTATION_WORKFLOW.md) |

#### WP-2.3 Observability Baseline

| Field | Content |
|-------|---------|
| **Purpose** | Logging, correlation, basic metrics/traces for hosts and jobs |
| **Dependencies** | WP-1.3, WP-2.1 |
| **Expected outcomes** | Correlated logs across api/worker; failure classes visible |
| **Completion criteria** | Ops can diagnose boot/runtime failures without Domain features |
| **Implementation status** | **Complete** — Independent Architecture Review APPROVED WITH OBSERVATIONS — closed |
| **Artifacts** | [WP-2.3_IMPLEMENTATION_REPORT.md](./WP-2.3_IMPLEMENTATION_REPORT.md) · [WP-2.3_DEFERRED_CAPABILITY_REGISTER.md](./WP-2.3_DEFERRED_CAPABILITY_REGISTER.md) · [WP-2.3_REPOSITORY_CLOSEOUT.md](./WP-2.3_REPOSITORY_CLOSEOUT.md) · [WP-2.3_INDEPENDENT_ARCHITECTURE_REVIEW.md](./WP-2.3_INDEPENDENT_ARCHITECTURE_REVIEW.md) |
| **Process** | [IMPLEMENTATION_WORKFLOW.md](../development/IMPLEMENTATION_WORKFLOW.md) |

#### WP-2.4 Tenancy / Workspace Context Baseline

| Field | Content |
|-------|---------|
| **Purpose** | Carry tenant/workspace scope in execution context (specialized tenancy ADR if required by milestone) |
| **Dependencies** | WP-2.1, WP-2.2 |
| **Expected outcomes** | Context propagated to worker/AI runs |
| **Completion criteria** | No cross-tenant context bleed in baseline tests |

*WP-2.x may proceed largely in parallel with late Phase 1 once WP-1.1 exists.*

---

### Phase 3 — Knowledge Intake

#### WP-3.1 Intake Entry Workflow

| Field | Content |
|-------|---------|
| **Purpose** | Knowledge Intake entry under Orchestration ownership |
| **Dependencies** | Phase 1–2 baselines; Orchestration Architecture |
| **Expected outcomes** | Inputs registerable with identity/version/checksum metadata |
| **Completion criteria** | Intake without inventing ARS; audit/lineage primitives present |

#### WP-3.2 Classification & Designation

| Field | Content |
|-------|---------|
| **Purpose** | Classification signals + Approved Requirements Source designation (Orchestration-owned) |
| **Dependencies** | WP-3.1 |
| **Expected outcomes** | Clear `approved_requirements_source` vs supporting roles |
| **Completion criteria** | Generation paths cannot proceed without designation; HITL on low-confidence classification per policy |

#### WP-3.3 Feature Version & Lineage Primitives

| Field | Content |
|-------|---------|
| **Purpose** | Feature Version aggregate and lineage hooks for reasoning runs |
| **Dependencies** | WP-3.1 |
| **Expected outcomes** | Reasoning runs correlatable to ARS identity/version |
| **Completion criteria** | Lineage queryable for an intake→designation path |

---

### Phase 4 — AI Runtime

#### WP-4.1 AI Reasoning Port & Provider Adapters

| Field | Content |
|-------|---------|
| **Purpose** | Provider-agnostic AI port; first adapter(s) behind Integration boundary |
| **Dependencies** | WP-1.4, WP-2.x; Integration Architecture; prompt ADR before production prompts |
| **Expected outcomes** | Engine cores call ports only; provenance of provider/model recordable |
| **Completion criteria** | Swap/disable provider without changing engine core; failure classes normalized |

#### WP-4.2 Engine Lifecycle Execution

| Field | Content |
|-------|---------|
| **Purpose** | Execute engines per Framework + Implementation Standards lifecycle |
| **Dependencies** | WP-4.1, WP-1.4 |
| **Expected outcomes** | Validate→reason→evidence→confidence→explain→package→audit path enforced |
| **Completion criteria** | Non-compliant engine publish paths rejected by host policy |

#### WP-4.3 Orchestration ↔ AI Runtime Integration

| Field | Content |
|-------|---------|
| **Purpose** | Workflow modes, pause/resume HITL, retry/rewind hooks for AI jobs |
| **Dependencies** | WP-3.x, WP-4.2 |
| **Expected outcomes** | Durable checkpoints; no unbounded interactive waits on providers |
| **Completion criteria** | HITL pause/resume demonstrated with a stub/engine slice |

---

### Phase 5 — AI Brain Engines

Implement in **pipeline order**. Each engine WP consumes its eng spec + Implementation Standards. Do not skip review/coverage gates.

#### WP-5.1 Requirement Understanding Engine

| Field | Content |
|-------|---------|
| **Purpose** | Stage 1 Understanding Package |
| **Dependencies** | Phase 3–4; Understanding eng spec |
| **Expected outcomes** | Evidence-backed understanding; unknowns preserved |
| **Completion criteria** | Spec compliance checklist + standards compliance; no invented requirements |

#### WP-5.2 Requirement Validation Engine

| Field | Content |
|-------|---------|
| **Purpose** | Stage 2 validation gate |
| **Dependencies** | WP-5.1 |
| **Expected outcomes** | Validation Report; gate fail blocks progress |
| **Completion criteria** | Cannot proceed to RKG/scenarios on failing gate without disposition |

#### WP-5.3 Knowledge Resolution Engine

| Field | Content |
|-------|---------|
| **Purpose** | Augmenting retrieval only |
| **Dependencies** | WP-5.1 (and Validation as policy requires); Knowledge eng spec |
| **Expected outcomes** | Supporting patterns; ARS wins conflicts |
| **Completion criteria** | Supporting knowledge never authorizes product behaviour |

#### WP-5.4 Requirement Knowledge Graph Engine

| Field | Content |
|-------|---------|
| **Purpose** | Stage 3 run-scoped RKG |
| **Dependencies** | WP-5.2 |
| **Expected outcomes** | RKG ≠ EKB; structure for coverage/trace |
| **Completion criteria** | Graph artifacts lineage-linked to ARS/understanding |

#### WP-5.5 Scenario Reasoning + Scenario Review

| Field | Content |
|-------|---------|
| **Purpose** | Stage 4 scenarios + scenario-scoped QA gate → Approved Scenario Package |
| **Dependencies** | WP-5.4 |
| **Expected outcomes** | Scenario Package; Scenario Review Report; disposition binding |
| **Completion criteria** | No Test Case Reasoning on blocked/rejected scenarios; no silent rewrite |

#### WP-5.6 Test Case Reasoning + Test Case Review

| Field | Content |
|-------|---------|
| **Purpose** | Stage 5 logical cases + test-case-scoped QA gate → Approved Test Case Package |
| **Dependencies** | WP-5.5 |
| **Expected outcomes** | Test Case Package; Test Case Review Report; primary-scenario invariant |
| **Completion criteria** | No invented expected results; no automation scripts |

#### WP-5.7 Coverage Analysis Engine

| Field | Content |
|-------|---------|
| **Purpose** | Stage 7 measurement → Coverage Assessment Package |
| **Dependencies** | WP-5.5, WP-5.6 |
| **Expected outcomes** | Trace Matrix / dimension states; gaps; unknowns ≠ covered |
| **Completion criteria** | Fabricated coverage impossible under validation rules |

#### WP-5.8 Final QA Review + Final Output Packaging

| Field | Content |
|-------|---------|
| **Purpose** | Stage 6 full-chain readiness → QA Readiness Package; Stage 8 sealed Final Reasoning Package |
| **Dependencies** | WP-5.1–WP-5.7 artifacts |
| **Expected outcomes** | Readiness verdict; sealed package with lineage |
| **Completion criteria** | Downstream release paths require accepting readiness (or explicit waiver artifact) |

*First end-to-end reasoning flow = WP-5.1 through WP-5.8 on a designated ARS sample under HITL.*

---

### Phase 6 — Knowledge Repository

#### WP-6.1 EKB Storage & Governance Path

| Field | Content |
|-------|---------|
| **Purpose** | Persist/govern enterprise knowledge per Knowledge Architecture |
| **Dependencies** | Phase 3; Knowledge Architecture; security review for knowledge stores |
| **Expected outcomes** | Governed promote/retire; no silent ARS overwrite |
| **Completion criteria** | Learning Candidates cannot auto-mutate sealed packages/ARS |

#### WP-6.2 Retrieval at Scale

| Field | Content |
|-------|---------|
| **Purpose** | Scale retrieval used by Knowledge Resolution (and later workflows) |
| **Dependencies** | WP-6.1, WP-5.3 |
| **Expected outcomes** | Reliable augmenting retrieval with provenance |
| **Completion criteria** | Retrieval failures degrade honestly; no invented facts |

---

### Phase 7 — User Interface

#### WP-7.1 Intake & Workspace Shell

| Field | Content |
|-------|---------|
| **Purpose** | UI for Intake and workspace navigation |
| **Dependencies** | Phase 3; WP-2.2 |
| **Expected outcomes** | Humans can register/designate inputs per policy |
| **Completion criteria** | UI cannot designate ARS outside Orchestration rules |

#### WP-7.2 HITL Review Workspaces

| Field | Content |
|-------|---------|
| **Purpose** | Scenario/Test Case/Final QA review and residual-risk Accept UX |
| **Dependencies** | Phase 5 gates; Decision Framework |
| **Expected outcomes** | Human supremacy visible; dispositions recorded |
| **Completion criteria** | AI cannot auto-Approve governed decisions via UI shortcuts |

#### WP-7.3 Reasoning Navigation & Coverage/Readiness Views

| Field | Content |
|-------|---------|
| **Purpose** | Traceability, coverage, readiness visibility |
| **Dependencies** | WP-5.7, WP-5.8 |
| **Expected outcomes** | Explainability navigable from UI |
| **Completion criteria** | Views consume sealed packages; no client-side “fix” of coverage |

---

### Phase 8 — Integrations

#### WP-8.1 IdP / Enterprise Auth Hardening

| Field | Content |
|-------|---------|
| **Purpose** | Production-grade identity integration |
| **Dependencies** | WP-2.2; Security Architecture; threat model milestone as required |
| **Expected outcomes** | Enterprise SSO patterns operational |
| **Completion criteria** | Security review passed for auth path |

#### WP-8.2 Knowledge Source Connectors (e.g., SharePoint)

| Field | Content |
|-------|---------|
| **Purpose** | External knowledge intake/sync behind Integration contracts |
| **Dependencies** | Phase 3, Phase 6; connector ADR as required |
| **Expected outcomes** | SharePoint (or authorized source) operational as supporting/intake channel |
| **Completion criteria** | Connector failures isolated; Core unaware of vendor SDKs |

#### WP-8.3 ALM / Notify / Storage Connectors (as authorized)

| Field | Content |
|-------|---------|
| **Purpose** | Additional Integration Architecture adapters |
| **Dependencies** | Phase 5 sealed packages for export-like flows; Integration Architecture |
| **Expected outcomes** | Contract-compliant adapters only |
| **Completion criteria** | Each connector has fail-closed behaviour and auditability |

---

### Phase 9 — Release & Reporting

#### WP-9.1 Documentation Engine (enablement)

| Field | Content |
|-------|---------|
| **Purpose** | Documentation from sealed packages |
| **Dependencies** | WP-5.8 |
| **Expected outcomes** | Docs cite approved artifacts only |
| **Completion criteria** | Cannot invent requirements/scenarios/cases |

#### WP-9.2 Automation Readiness Engine (enablement)

| Field | Content |
|-------|---------|
| **Purpose** | Assess automation candidacy of logical cases |
| **Dependencies** | WP-5.6–WP-5.8 |
| **Expected outcomes** | Readiness assessment — not script generation unless later authorized |
| **Completion criteria** | No silent execution; respects QA Readiness |

#### WP-9.3 Reporting, Dashboards & Release Planning Signals

| Field | Content |
|-------|---------|
| **Purpose** | Reporting/analytics and release-planning recommendations |
| **Dependencies** | WP-5.7, WP-5.8 |
| **Expected outcomes** | Coverage/readiness/risk signals for humans |
| **Completion criteria** | Confidence ≠ release approval; HITL for readiness claims per policy |

---

### Phase 10 — Hardening & Production Readiness

#### WP-10.1 Security & Compliance Hardening

| Field | Content |
|-------|---------|
| **Purpose** | Threat mitigations, secrets, audit completeness, governance evidence |
| **Dependencies** | Phases 1–9 relevant surfaces |
| **Expected outcomes** | Security review sign-off path |
| **Completion criteria** | No critical open findings without documented risk Accept |

#### WP-10.2 Performance, Scale & Resilience

| Field | Content |
|-------|---------|
| **Purpose** | Validate worker/AI job behaviour under load; recovery drills |
| **Dependencies** | Phases 4–6 |
| **Expected outcomes** | Degradation/retry/HITL behaviour proven |
| **Completion criteria** | Known limits documented; no silent data loss |

#### WP-10.3 Production Operability

| Field | Content |
|-------|---------|
| **Purpose** | Runbooks, SLOs, on-call, backup/restore, config promotion |
| **Dependencies** | WP-10.1, WP-10.2 |
| **Expected outcomes** | Ops can run ATI without eng-spec archaeology |
| **Completion criteria** | Production readiness milestone criteria met (§5) |

---

## 4. Dependency Graph

### Prerequisites (blocking)

```
Phase 0 (Architecture + Eng Specs + this Roadmap)
        ↓
Phase 1 Platform Spine ──┬──► Phase 2 Shared Infrastructure
                         └──► (parallelizable after WP-1.1)
        ↓
Phase 3 Knowledge Intake
        ↓
Phase 4 AI Runtime
        ↓
Phase 5 AI Brain Engines (strict internal order WP-5.1→5.8)
        ↓
        ├──► Phase 6 Knowledge Repository (scale; WP-5.3 may use interim retrieval earlier)
        ├──► Phase 7 User Interface (HITL UX needs Phase 5 gates; Intake UI can start after Phase 3)
        └──► Phase 9 Release & Reporting (requires sealed packages)
Phase 8 Integrations (IdP early possible after Phase 2; SharePoint after Intake/Knowledge paths)
        ↓
Phase 10 Hardening (after target production surface exists)
```

### Parallel work opportunities

| Parallel set | Notes |
|--------------|-------|
| WP-1.3 ∥ WP-1.2 after WP-1.1 | Spine internals vs registration |
| Phase 2 ∥ late Phase 1 | Shared packages/obs while AI host shell finishes |
| WP-7.1 after Phase 3 | Intake UI while Brain engines continue |
| WP-8.1 after Phase 2 | IdP hardening alongside Brain |
| WP-6.1 foundation ∥ late Phase 5 | Careful: retrieval must remain augmenting-only |
| CI/quality toolchain | From day one beside Phase 1 |

### Blocking dependencies (critical)

| Blocker | Blocks |
|---------|--------|
| No Spine host | Everything |
| No Intake/ARS designation | All generation engines |
| No AI Runtime ports | All Brain engines |
| Scenario Review not accepting | Test Case Reasoning |
| No Approved Test Case Package | Coverage / Final QA release paths |
| No QA Readiness | Downstream enablement release paths |
| Missing specialized ADR (when required) | Named milestone (tenancy/threat/connectors/prompts) |

### Critical path (conceptual)

**Spine → Shared infra baseline → Intake/ARS → AI Runtime → Understanding → Validation → RKG → Scenarios(+Review) → Cases(+Review) → Coverage → Final QA/Final Output → Hardening**

UI, EKB scale, and most connectors are **off** the first E2E reasoning critical path but on the **production** critical path.

---

## 5. Milestones

| Milestone | Completion criteria |
|-----------|---------------------|
| **M1 — Platform Spine operational** | Hosts boot; registration; shared service shell; health/readiness; AI host shell; Phase 1 quality gate passed |
| **M2 — Shared Infrastructure baseline** | Shared packages, identity baseline, observability, context propagation; Phase 2 gate passed |
| **M3 — Knowledge Intake operational** | Intake entry, classification/designation, Feature Version/lineage; generation blocked without ARS designation |
| **M4 — AI Runtime operational** | Port + adapter(s); lifecycle execution; Orchestration pause/resume/retry hooks; provider-agnostic core |
| **M5 — First end-to-end reasoning flow** | Designated sample ARS through Understanding→…→QA Readiness/Final Output with lineage and explainability |
| **M6 — First reviewed test case package** | Approved Scenario Package + Approved Test Case Package with review reports; primary-scenario invariant held |
| **M7 — Coverage & Final QA operational** | Coverage Assessment + QA Readiness on sample; unknowns ≠ covered; HITL residual risk path proven |
| **M8 — Knowledge Repository operational** | Governed EKB path + retrieval at intended scale; learning non-authoritative |
| **M9 — HITL UI operational** | Intake + review workspaces enforce human supremacy |
| **M10 — SharePoint integration operational** | Authorized knowledge-source connector behind contracts; isolated failure behaviour |
| **M11 — Release planning / reporting operational** | Reporting + release-planning signals from sealed packages; no confidence-as-approval |
| **M12 — Production readiness** | Phase 10 criteria met; security/ops sign-off; known risks dispositioned |

---

## 6. Definition of Done

### Work package DoD

- Purpose met against this WBS and consumed architecture/eng specs  
- Dependencies satisfied  
- Independently testable evidence exists  
- Architecture boundaries preserved (no vendor in core, no invent ban violations)  
- Observability/audit hooks for the package’s behaviours present  
- Docs updated only where required for operators/developers (no speculative docs)  
- No open blocker without explicit waiver/risk Accept  

### Phase DoD

- All phase WPs complete or explicitly deferred with owner + milestone  
- Phase quality gate (§7) passed  
- Demoable increment available  
- No unauthorized scope pulled from later phases  

### Milestone DoD

- Stated completion criteria objectively demonstrable  
- Evidence retained (test results, review notes, gate checklist)  
- Downstream teams unblocked for the next critical-path WP  

### Platform DoD (production readiness)

- M12 criteria met  
- Mandatory gates green or waived by authorized Product/Architect policy artifact  
- Security, observability, operability, and governance evidence complete  
- Architecture compliance affirmed (no silent redesign)  
- Learning/automation/integrations cannot corrupt ARS primacy  

---

## 7. Quality Gates

Mandatory checkpoints **before progressing** to the next phase (or before declaring a milestone complete when it spans phases).

| Gate | Checkpoint |
|------|------------|
| **G-Arch** | Architecture compliance — boundaries, ownership, invent ban, ARS primacy |
| **G-Eng** | Engineering standards compliance — Framework, Spine, per-engine specs, Implementation Standards |
| **G-Test** | Testability — unit/integration paths behind ports; no untestable core |
| **G-Obs** | Observability — correlation, failure classes, engine/workflow signals |
| **G-Docs** | Documentation — runbooks/eng notes sufficient for the increment |
| **G-Sec** | Security review — appropriate to phase surface (auth, data, connectors, AI accountability) |

### Phase entry/exit expectations

| From → To | Minimum gates |
|-----------|---------------|
| 0 → 1 | Baseline freeze / Implementation Authorized; Blueprint §15 kickoff checklist |
| 1 → 3 | G-Arch, G-Eng, G-Obs on Spine (Phase 2 may overlap) |
| 3 → 4 | G-Arch on Intake/designation; G-Test on lineage |
| 4 → 5 | G-Eng + G-Sec on AI ports; provider independence proven |
| 5 → 6/7/9 | G-Arch/G-Eng on Brain path; M5–M7 as applicable |
| 8 connectors | G-Sec + connector ADR if required |
| → 10 / Prod | All gates; M12 |

Failing a gate **stops advancement** on the critical path; parallel non-blocking work may continue only if it cannot encode the failed assumption.

---

## 8. Risk Register

| Risk | Impact | Conceptual mitigation |
|------|--------|------------------------|
| **Technical complexity of Brain chain** | Delay; partial incorrect cognition | Strict WP-5 order; standards compliance; vertical slice on sample ARS |
| **AI provider changes** | Breakage; behaviour drift | Ports/adapters only; contract tests; no provider-specific business rules |
| **Integration delays** | Blocked enterprise adoption | Keep connectors off first E2E critical path; contract stubs |
| **Knowledge quality** | Bad augmenting retrieval; false confidence | ARS primacy; unknowns ≠ covered; HITL; non-authoritative learning |
| **Performance** | Slow AI jobs; UX timeouts | Async worker model; no unbounded interactive waits; early soak in Phase 10 |
| **Scalability** | EKB/retrieval or job backlog | Phase 6 scale focus; backpressure; degradation modes |
| **Governance / HITL bypass pressure** | Unsafe release | Quality gates; Decision Framework; UI cannot short-circuit Approval |
| **Delivery sequencing mistakes** | Rework; architecture drift | This roadmap; Charter veto; ADR for meaning changes |
| **Prompt/asset unmanaged versions** | Non-reproducible runs | Prompt ADR before production prompts; provenance mandatory |
| **Specialized ADR lag** | False start on tenancy/threat/connectors | Milestone-gate those WPs; do not invent in code |

---

## 9. Deliverable Matrix

| Implementation Phase | Primary Deliverables | Consumed Architecture / Eng Specs | Produced Capabilities |
|----------------------|----------------------|-----------------------------------|------------------------|
| **1 Platform Spine** | Runnable hosts; registration; service shell; AI host shell | App Arch; Spine eng spec; Security (baseline) | Bootable platform foundation |
| **2 Shared Infrastructure** | Shared packages; identity; observability; context | App Arch; Security; Blueprint | Cross-cutting runtime consistency |
| **3 Knowledge Intake** | Intake workflow; designation; lineage/Feature Version | Orchestration ADR 0011; EIM; Terminology | ARS-ready intake |
| **4 AI Runtime** | AI ports/adapters; lifecycle host; orchestration hooks | Integration ADR 0012; Engine Framework; Impl Standards | Provider-agnostic AI execution |
| **5 AI Brain Engines** | Engines WP-5.1–5.8; sealed Final Reasoning / QA Readiness | Brain ADR 0004; QA/Decision; all engine eng specs | End-to-end reasoned verification packages |
| **6 Knowledge Repository** | EKB governance + retrieval scale | Knowledge ADR 0005 | Augmenting knowledge at scale |
| **7 User Interface** | Intake + HITL + navigation views | App Arch; Decision HITL; Security | Human-operable Brain |
| **8 Integrations** | IdP hardening; SharePoint/other connectors | Integration; Security | Enterprise connectivity |
| **9 Release & Reporting** | Docs/automation-readiness/reporting/release signals | Brain Final Output; later enablement engines | Delivery enablement |
| **10 Hardening** | Security/perf/ops evidence; prod criteria | Security; Blueprint; this roadmap | Production readiness |

---

## 10. Governance

| Topic | Expectation |
|-------|-------------|
| **Change management** | Scope changes go through Delivery Lead + Architect; later-phase pull-forward requires explicit authorization |
| **Architecture review** | Meaning changes require ADR; eng-spec changes require Architect acceptance; code cannot redefine architecture |
| **ADR updates** | New/amended ADRs for specialized milestones (tenancy, threat model, connectors, prompts) before those WPs complete |
| **Version control** | Trunk-based or approved branching; no secrets committed; eng specs/architecture changes reviewed; Conventional commits per standards |
| **Implementation review process** | WP review against DoD + quality gates; AI-generated code subject to Charter + [Cursor Development Contract](../development/CURSOR_DEVELOPMENT_CONTRACT.md); architecture compliance spot-checks on Brain/Integration boundaries |
| **Risk Accept / waivers** | Explicit artifacts only; never silent |
| **Go-live authority** | Product/Architect (+ Security/Ops as required) for M12 |

---

## 11. Architecture Dependencies

This roadmap **consumes without redefining**:

- ADRs 0001–0015 and all approved architecture documents under `docs/architecture/`  
- AI Reasoning Architecture, Knowledge, Domain, QA Intelligence, Decision & Evidence, EIM, Orchestration, Integration, Application, Security & Governance, Implementation Readiness Blueprint  
- AI Engine Specification Framework, Platform Spine Engineering Specification, all approved AI engine engineering specifications, AI Engine Development & Implementation Standards  
- Product [ROADMAP.md](../roadmap/ROADMAP.md) capability sequencing  

**Explicit statement:** This document exists solely to **organize implementation**. It introduces **no** new architecture and **no** implementation artifacts (code/APIs/schemas/prompts).

---

## 12. Document Control

| Field | Value |
|-------|-------|
| **Version** | 1.0 |
| **Status** | Approved implementation planning document (no code) |
| **Owner** | Technical Program Manager / Principal Software Architect / Delivery Lead / AI Platform Architect |
| **Dependencies** | ADRs 0001–0015; Blueprint; all eng specs through Implementation Standards; product ROADMAP |
| **Related ADRs** | Consumes 0001–0015 — **creates no new ADR** |
| **Last updated** | 2026-07-25 |

### Change History

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-07-25 | Initial Implementation Roadmap and WBS |

---

*End of ATI Implementation Roadmap and Work Breakdown Structure.*
