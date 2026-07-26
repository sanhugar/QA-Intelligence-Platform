# Product Roadmap (Architecture Phases)

This roadmap is intentional sequencing for a 5–10 year platform. It does **not** authorize implementation of later phases until requested.

## Phase 0 — Platform Foundation (complete as design)

- Architecture document and ADRs
- Monorepo skeleton and standards
- AI Development Charter
- No business logic, prompts, UI pages, APIs, or tables

## Phase 1a — AI Reasoning Architecture (complete as design)

- ATI Brain blueprint: [AI_REASONING_ARCHITECTURE.md](../architecture/AI_REASONING_ARCHITECTURE.md)
- ADR 0004 accepted
- Still **no** application code, APIs, tables, or prompts

## Phase 1a+ — Knowledge Architecture (complete as design)

- Enterprise Knowledge Base blueprint: [KNOWLEDGE_ARCHITECTURE.md](../architecture/KNOWLEDGE_ARCHITECTURE.md)
- ADR 0005 accepted
- Domains, hierarchy, lifecycle, retrieval, learning, SharePoint strategy (design only)
- Still **no** RAG implementation, vector DB, APIs, or tables

## Phase 1a++ — Domain Architecture (complete as design)

- Canonical business model: [DOMAIN_ARCHITECTURE.md](../architecture/DOMAIN_ARCHITECTURE.md)
- ADR 0006 accepted
- Ubiquitous language, bounded contexts, lifecycles, invariants, domain events
- Still **no** application code, APIs, UI, or tables

## Phase 1a+++ — QA Intelligence Framework (complete as design)

- Senior QA reasoning standard: [QA_INTELLIGENCE_FRAMEWORK.md](../architecture/QA_INTELLIGENCE_FRAMEWORK.md)
- ADR 0007 accepted
- Thinking model, heuristics, question library, coverage, test design strategy, maturity L1–L7
- Still **no** prompts, code, APIs, or schemas

## Phase 1a++++ — AI Decision & Evidence Framework (complete as design)

- Decision governance: [AI_DECISION_AND_EVIDENCE_FRAMEWORK.md](../architecture/AI_DECISION_AND_EVIDENCE_FRAMEWORK.md)
- ADR 0008 accepted
- Evidence model, confidence≠certainty, explainability, HITL, audit, governed learning
- Still **no** prompts, code, APIs, or schemas

## Phase 1a+++++ — Enterprise Data Architecture / EIM (complete as design)

- Information model: [ENTERPRISE_DATA_ARCHITECTURE.md](../architecture/ENTERPRISE_DATA_ARCHITECTURE.md)
- ADR 0009 accepted
- Domains, objects, identity/versioning, AI artifacts, documents, traceability, governance
- Still **no** SQL, Prisma, database selection, APIs, or code

## Terminology consistency (complete)

- [CANONICAL_TERMINOLOGY.md](../architecture/CANONICAL_TERMINOLOGY.md) + ADR 0010
- Knowledge Intake entry; Approved Requirements Source for generation; no redesign of approved concepts

## Phase 1a++++++ — Knowledge Intake & Workflow Orchestration (complete as design)

- Operational architecture: [KNOWLEDGE_INTAKE_AND_WORKFLOW_ORCHESTRATION_ARCHITECTURE.md](../architecture/KNOWLEDGE_INTAKE_AND_WORKFLOW_ORCHESTRATION_ARCHITECTURE.md)
- ADR 0011 accepted (ADR 0010 retained for terminology)
- Intake, classification, structured objects, workflows, modes, HITL, recovery, observability
- Still **no** code, APIs, schemas, or prompts

## Phase 1a+++++++ — Integration & External Systems (complete as design)

- Integration architecture: [INTEGRATION_AND_EXTERNAL_SYSTEMS_ARCHITECTURE.md](../architecture/INTEGRATION_AND_EXTERNAL_SYSTEMS_ARCHITECTURE.md)
- ADR 0012 accepted
- Core → contracts → adapters → connectors; AI/knowledge/ALM/automation/IdP/storage/notify
- Still **no** code, APIs, SDKs, or schemas

## Phase 1a++++++++ — Enterprise Application Architecture (complete as design)

- Application architecture: [APPLICATION_ARCHITECTURE.md](../architecture/APPLICATION_ARCHITECTURE.md)
- ADR 0013 accepted
- Logical apps, backend/frontend modules, workers, shared packages, communication, deployable units
- Consumes prior architectures; does **not** redefine Domain/Brain/Knowledge/Orchestration/Integration
- Still **no** code, APIs, schemas, UI, or prompts

## Phase 1a+++++++++ — Security & Governance Architecture (complete as design)

- Security & governance: [SECURITY_AND_GOVERNANCE_ARCHITECTURE.md](../architecture/SECURITY_AND_GOVERNANCE_ARCHITECTURE.md)
- ADR 0014 accepted
- Identity/access, AI accountability, knowledge/information governance, integration/app security, compliance/risk/audit
- Consumes ADRs 0001–0013; does **not** redefine Decision/Evidence, Knowledge, Integration, or Application meaning
- Still **no** code, APIs, schemas, UI, or prompts

## Phase 1a++++++++++ — Implementation Readiness & Technical Blueprint (complete as design)

- Blueprint: [IMPLEMENTATION_READINESS_AND_TECHNICAL_BLUEPRINT.md](../architecture/IMPLEMENTATION_READINESS_AND_TECHNICAL_BLUEPRINT.md)
- ADR 0015 accepted
- Readiness assessment, architecture→implementation mapping, build order, workstreams, AI-dev governance, DoD, quality gates
- Final architecture gate before implementation; does **not** redesign prior architecture
- Still **no** code, APIs, schemas, UI, or prompts — Product/Architect go-ahead required to start Phase 1b

## Pre-implementation ARB audit (complete)

- [ARCHITECTURE_CONSISTENCY_AND_GAP_ANALYSIS.md](../architecture/ARCHITECTURE_CONSISTENCY_AND_GAP_ANALYSIS.md)
- Verdict: **Ready for Implementation** (F-01–F-05 harmonized; no redesign; no ADR decision changes)
- Remaining operational gates: Blueprint §15 checklist at kickoff; Product/Architect go-ahead; specialized ADRs remain milestone-gated (tenancy, threat model, connectors, prompts)

## Engineering Specification phase (started — design specs only)

- AI Engine Specification Framework: [AI_ENGINE_SPECIFICATION_FRAMEWORK.md](../engineering/AI_ENGINE_SPECIFICATION_FRAMEWORK.md)
- Platform Spine Engineering Specification: [PLATFORM_SPINE_ENGINEERING_SPECIFICATION.md](../engineering/PLATFORM_SPINE_ENGINEERING_SPECIFICATION.md)
- Requirement Understanding Engine Specification: [REQUIREMENT_UNDERSTANDING_ENGINE_SPECIFICATION.md](../engineering/REQUIREMENT_UNDERSTANDING_ENGINE_SPECIFICATION.md)
- Requirement Validation Engine Specification: [REQUIREMENT_VALIDATION_ENGINE_SPECIFICATION.md](../engineering/REQUIREMENT_VALIDATION_ENGINE_SPECIFICATION.md)
- Knowledge Resolution Engine Specification: [KNOWLEDGE_RESOLUTION_ENGINE_SPECIFICATION.md](../engineering/KNOWLEDGE_RESOLUTION_ENGINE_SPECIFICATION.md)
- Requirement Knowledge Graph Engine Specification: [REQUIREMENT_KNOWLEDGE_GRAPH_ENGINE_SPECIFICATION.md](../engineering/REQUIREMENT_KNOWLEDGE_GRAPH_ENGINE_SPECIFICATION.md)
- Scenario Reasoning Engine Specification: [SCENARIO_REASONING_ENGINE_SPECIFICATION.md](../engineering/SCENARIO_REASONING_ENGINE_SPECIFICATION.md)
- Scenario Review Engine Specification: [SCENARIO_REVIEW_ENGINE_SPECIFICATION.md](../engineering/SCENARIO_REVIEW_ENGINE_SPECIFICATION.md)
- Test Case Reasoning Engine Specification: [TEST_CASE_REASONING_ENGINE_SPECIFICATION.md](../engineering/TEST_CASE_REASONING_ENGINE_SPECIFICATION.md)
- Test Case Review Engine Specification: [TEST_CASE_REVIEW_ENGINE_SPECIFICATION.md](../engineering/TEST_CASE_REVIEW_ENGINE_SPECIFICATION.md)
- Coverage Analysis Engine Specification: [COVERAGE_ANALYSIS_ENGINE_SPECIFICATION.md](../engineering/COVERAGE_ANALYSIS_ENGINE_SPECIFICATION.md)
- Final QA Review Engine Specification: [FINAL_QA_REVIEW_ENGINE_SPECIFICATION.md](../engineering/FINAL_QA_REVIEW_ENGINE_SPECIFICATION.md)
- AI Engine Development and Implementation Standards: [AI_ENGINE_DEVELOPMENT_AND_IMPLEMENTATION_STANDARDS.md](../engineering/AI_ENGINE_DEVELOPMENT_AND_IMPLEMENTATION_STANDARDS.md)
- AI Benchmark and Golden Dataset Framework: [AI_BENCHMARK_AND_GOLDEN_DATASET_FRAMEWORK.md](../engineering/AI_BENCHMARK_AND_GOLDEN_DATASET_FRAMEWORK.md)
- Stage 1–7 + scenario/test-case review gates eng specs + cross-engine implementation standard + permanent AI evaluation gate (Approved packages → Coverage Assessment → QA Readiness Package; Stage 8 Final Output packaging still later)
- Still **no** code, APIs, schemas, or prompts

## Architecture baseline (frozen)

- [ARCHITECTURE_BASELINE_STATUS.md](../architecture/ARCHITECTURE_BASELINE_STATUS.md) — **BASELINE FROZEN** v1.0 (25-Jul-2026); **Implementation Authorized**
- Baseline-breaking changes require evidence + ARB; implementation must not redesign architecture
- AI coding assistants: [CURSOR_DEVELOPMENT_CONTRACT.md](../development/CURSOR_DEVELOPMENT_CONTRACT.md)

## Implementation execution roadmap

- Canonical WBS / build order: [IMPLEMENTATION_ROADMAP_AND_WBS.md](../implementation/IMPLEMENTATION_ROADMAP_AND_WBS.md)
- Work Package SOP: [IMPLEMENTATION_WORKFLOW.md](../development/IMPLEMENTATION_WORKFLOW.md)
- Organizes Phases 1–10 (Spine → Production readiness); does **not** redesign architecture
- **WP-1.1 complete** · **WP-1.2 complete** · **WP-1.3 complete** (Independent Architecture Review approved) · **WP-1.4 not started**
- WP-1.3 artifacts: [Implementation Report](../implementation/WP-1.3_IMPLEMENTATION_REPORT.md) · [Closeout](../implementation/WP-1.3_CLOSEOUT_REPORT.md) · [Deferred](../implementation/WP-1.3_DEFERRED_CAPABILITY_REGISTER.md) · [Spine note](../engineering/PLATFORM_SPINE_WP-1.3.md)

## Phase 1b — Platform Spine (implementation in progress)

- [x] App bootstraps (`web`, `api`, `worker`) — WP-1.1
- [x] Platform registration & module shells — WP-1.2
- [x] Spine shared service shell — WP-1.3
- [ ] AI runtime host shell — WP-1.4 (not authorized yet)
- AuthN/AuthZ baseline (OIDC), observability baseline, Knowledge Intake — later Phase 1/2 WPs
- Detailed WBS: [IMPLEMENTATION_ROADMAP_AND_WBS.md](../implementation/IMPLEMENTATION_ROADMAP_AND_WBS.md)

## Phase 2 — Reasoning Engine Implementation

- Implement engines/orchestrator per AI Reasoning Architecture
- Requirement Object + validation + RKG
- Traceable analysis artifacts
- Provider adapters behind ports

## Phase 3 — Scenario & Test Case Reasoning (generation after reasoning)

- Scenario Reasoning Engine
- Test Case Reasoning Engine
- Prompt asset versioning and model lineage metadata

## Phase 4 — Knowledge, Review & Coverage at scale

- Knowledge Engine + OpenSearch
- QA Review + Coverage gates in product UX
- Human-in-the-loop approval patterns
- Learning Engine governance

## Phase 5 — Delivery Enablement

- Automation preparation
- Documentation generation
- Reporting

## Phase 6 — Enterprise Integrations & Release Intelligence

- SharePoint integration
- Impact analysis
- Release management
- Execution/defect feedback into learning

## Guiding Rule

Later phases must plug into Phase 0–1 contracts (ports, events, lineage, reasoning pipeline). If a feature cannot preserve Knowledge Intake, Approved Requirements Source primacy for generation, and traceability, it is redesigned—not bolted on.
