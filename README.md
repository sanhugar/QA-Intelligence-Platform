# AI QA Intelligence Platform (ATI v2)

Enterprise AI QA Knowledge Platform.

**ATI starts with Knowledge Intake** (multiple Knowledge Inputs). For requirement analysis, scenario generation, and test case generation, the **Approved Requirements Source** (FDD, PRD, SRS, or equivalent) is authoritative; all other Knowledge Inputs are supporting context only.

## Current Status

**Architecture Status: BASELINE FROZEN (v1.0, 25-Jul-2026). Implementation Authorized.**

- See [docs/architecture/ARCHITECTURE_BASELINE_STATUS.md](docs/architecture/ARCHITECTURE_BASELINE_STATUS.md).
- ADRs 0001–0015 are the approved development baseline — no redesign via implementation.
- Execution follows [docs/implementation/IMPLEMENTATION_ROADMAP_AND_WBS.md](docs/implementation/IMPLEMENTATION_ROADMAP_AND_WBS.md).
- **WP-1.1 complete (hosts):** empty-but-runnable `web` / `api` / `worker` — see [Getting Started](docs/development/GETTING_STARTED.md) and [Deferred Capability Register](docs/implementation/WP-1.1_DEFERRED_CAPABILITY_REGISTER.md).

## Start Here

| Document | Purpose |
|----------|---------|
| [docs/architecture/ARCHITECTURE_BASELINE_STATUS.md](docs/architecture/ARCHITECTURE_BASELINE_STATUS.md) | Baseline freeze + implementation authorization |
| [docs/architecture/ARCHITECTURE.md](docs/architecture/ARCHITECTURE.md) | Complete platform foundation |
| [docs/architecture/CANONICAL_TERMINOLOGY.md](docs/architecture/CANONICAL_TERMINOLOGY.md) | Knowledge Intake / Approved Requirements Source terms |
| [docs/architecture/KNOWLEDGE_INTAKE_AND_WORKFLOW_ORCHESTRATION_ARCHITECTURE.md](docs/architecture/KNOWLEDGE_INTAKE_AND_WORKFLOW_ORCHESTRATION_ARCHITECTURE.md) | Intake, routing, workflow orchestration |
| [docs/architecture/INTEGRATION_AND_EXTERNAL_SYSTEMS_ARCHITECTURE.md](docs/architecture/INTEGRATION_AND_EXTERNAL_SYSTEMS_ARCHITECTURE.md) | External systems, adapters, connectors |
| [docs/architecture/APPLICATION_ARCHITECTURE.md](docs/architecture/APPLICATION_ARCHITECTURE.md) | Logical apps, modules, workers, packages |
| [docs/architecture/SECURITY_AND_GOVERNANCE_ARCHITECTURE.md](docs/architecture/SECURITY_AND_GOVERNANCE_ARCHITECTURE.md) | Security, governance, compliance, AI accountability |
| [docs/architecture/IMPLEMENTATION_READINESS_AND_TECHNICAL_BLUEPRINT.md](docs/architecture/IMPLEMENTATION_READINESS_AND_TECHNICAL_BLUEPRINT.md) | Final architecture gate — implementation strategy bridge |
| [docs/architecture/ARCHITECTURE_CONSISTENCY_AND_GAP_ANALYSIS.md](docs/architecture/ARCHITECTURE_CONSISTENCY_AND_GAP_ANALYSIS.md) | Pre-implementation ARB audit (Ready for Implementation) |
| [docs/engineering/AI_ENGINE_SPECIFICATION_FRAMEWORK.md](docs/engineering/AI_ENGINE_SPECIFICATION_FRAMEWORK.md) | Engineering spec for all AI engines (no code) |
| [docs/engineering/AI_ENGINE_DEVELOPMENT_AND_IMPLEMENTATION_STANDARDS.md](docs/engineering/AI_ENGINE_DEVELOPMENT_AND_IMPLEMENTATION_STANDARDS.md) | Canonical implementation standard for all AI engines (no code) |
| [docs/engineering/AI_BENCHMARK_AND_GOLDEN_DATASET_FRAMEWORK.md](docs/engineering/AI_BENCHMARK_AND_GOLDEN_DATASET_FRAMEWORK.md) | Permanent AI engine evaluation / golden dataset quality gate (no code) |
| [docs/engineering/PLATFORM_SPINE_ENGINEERING_SPECIFICATION.md](docs/engineering/PLATFORM_SPINE_ENGINEERING_SPECIFICATION.md) | Platform Spine runtime engineering spec (no code) |
| [docs/engineering/REQUIREMENT_UNDERSTANDING_ENGINE_SPECIFICATION.md](docs/engineering/REQUIREMENT_UNDERSTANDING_ENGINE_SPECIFICATION.md) | Requirement Understanding Engine eng spec (no code) |
| [docs/engineering/REQUIREMENT_VALIDATION_ENGINE_SPECIFICATION.md](docs/engineering/REQUIREMENT_VALIDATION_ENGINE_SPECIFICATION.md) | Requirement Validation Engine eng spec — quality gate (no code) |
| [docs/engineering/KNOWLEDGE_RESOLUTION_ENGINE_SPECIFICATION.md](docs/engineering/KNOWLEDGE_RESOLUTION_ENGINE_SPECIFICATION.md) | Knowledge Resolution Engine eng spec — augmenting only (no code) |
| [docs/engineering/REQUIREMENT_KNOWLEDGE_GRAPH_ENGINE_SPECIFICATION.md](docs/engineering/REQUIREMENT_KNOWLEDGE_GRAPH_ENGINE_SPECIFICATION.md) | Requirement Knowledge Graph Engine eng spec (no code) |
| [docs/engineering/SCENARIO_REASONING_ENGINE_SPECIFICATION.md](docs/engineering/SCENARIO_REASONING_ENGINE_SPECIFICATION.md) | Scenario Reasoning Engine eng spec — what/why to test (no code) |
| [docs/engineering/SCENARIO_REVIEW_ENGINE_SPECIFICATION.md](docs/engineering/SCENARIO_REVIEW_ENGINE_SPECIFICATION.md) | Scenario Review Engine eng spec — scenario QA gate (no code) |
| [docs/engineering/TEST_CASE_REASONING_ENGINE_SPECIFICATION.md](docs/engineering/TEST_CASE_REASONING_ENGINE_SPECIFICATION.md) | Test Case Reasoning Engine eng spec — logical cases from approved scenarios (no code) |
| [docs/engineering/TEST_CASE_REVIEW_ENGINE_SPECIFICATION.md](docs/engineering/TEST_CASE_REVIEW_ENGINE_SPECIFICATION.md) | Test Case Review Engine eng spec — test case QA gate (no code) |
| [docs/engineering/COVERAGE_ANALYSIS_ENGINE_SPECIFICATION.md](docs/engineering/COVERAGE_ANALYSIS_ENGINE_SPECIFICATION.md) | Coverage Analysis Engine eng spec — Trace Matrix & dimension measurement (no code) |
| [docs/engineering/FINAL_QA_REVIEW_ENGINE_SPECIFICATION.md](docs/engineering/FINAL_QA_REVIEW_ENGINE_SPECIFICATION.md) | Final QA Review Engine eng spec — full-chain readiness gate (no code) |
| [docs/architecture/AI_REASONING_ARCHITECTURE.md](docs/architecture/AI_REASONING_ARCHITECTURE.md) | ATI Brain — how ATI reasons |
| [docs/architecture/KNOWLEDGE_ARCHITECTURE.md](docs/architecture/KNOWLEDGE_ARCHITECTURE.md) | Enterprise knowledge system |
| [docs/architecture/DOMAIN_ARCHITECTURE.md](docs/architecture/DOMAIN_ARCHITECTURE.md) | Canonical business / DDD model |
| [docs/architecture/QA_INTELLIGENCE_FRAMEWORK.md](docs/architecture/QA_INTELLIGENCE_FRAMEWORK.md) | How ATI reasons like Senior QA |
| [docs/architecture/AI_DECISION_AND_EVIDENCE_FRAMEWORK.md](docs/architecture/AI_DECISION_AND_EVIDENCE_FRAMEWORK.md) | Evidence, explainability, decision governance |
| [docs/architecture/ENTERPRISE_DATA_ARCHITECTURE.md](docs/architecture/ENTERPRISE_DATA_ARCHITECTURE.md) | Enterprise Information Model (EIM) |
| [docs/standards/AI_DEVELOPMENT_CHARTER.md](docs/standards/AI_DEVELOPMENT_CHARTER.md) | Roles, gates, development rules |
| [docs/development/CURSOR_DEVELOPMENT_CONTRACT.md](docs/development/CURSOR_DEVELOPMENT_CONTRACT.md) | Permanent AI coding-assistant implementation contract |
| [docs/standards/CODING_STANDARDS.md](docs/standards/CODING_STANDARDS.md) | Naming, testing, git, logging |
| [docs/standards/CONTRIBUTION.md](docs/standards/CONTRIBUTION.md) | How to contribute |
| [docs/roadmap/ROADMAP.md](docs/roadmap/ROADMAP.md) | Capability phases |
| [docs/implementation/IMPLEMENTATION_ROADMAP_AND_WBS.md](docs/implementation/IMPLEMENTATION_ROADMAP_AND_WBS.md) | Executable implementation roadmap & WBS (planning only) |
| [docs/adr/](docs/adr/) | Architecture Decision Records |

## Repository Layout (summary)

```
apps/             Deployable applications (web, api, worker)
packages/         Shared libraries (types, validation, config, logger, errors)
modules/ai/       AI module boundary (contracts later)
database/         Schemas, migrations, seeds (no tables yet)
prompts/          Versioned prompt assets (empty until authorized)
docs/             Architecture, ADRs, standards, roadmap
infrastructure/   Docker, Kubernetes, Terraform
tests/            Cross-app e2e, integration, performance
scripts/          Automation scripts
config/           Environment templates (no secrets)
```

## Design Principles (short)

1. Knowledge Intake entry; Approved Requirements Source primacy for generation  
2. Reason before generate  
3. Traceability for every artifact  
4. Clean Architecture + DDD + SOLID  
5. AI-provider and cloud independent  
6. No business logic in the UI  

## License

Proprietary — all rights reserved (update when corporate license is assigned).
