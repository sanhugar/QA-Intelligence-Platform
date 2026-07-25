# Platform Spine Engineering Specification

**Document ID:** ATI-ENG-SPINE-001  
**Status:** Approved engineering specification (no implementation code)  
**Product:** AI QA Intelligence Platform (ATI v2)  
**Audience:** Principal Software Engineer, Platform Engineering, Backend/Worker Engineers, Implementation Engineer (Cursor), Technical Lead  
**Phase:** Engineering Specification — Platform Spine  
**Last updated:** 2026-07-25

---

## 0. Purpose and Scope

This document is the **canonical Platform Spine Engineering Specification**.

The Platform Spine is the **runtime foundation** of ATI. It defines how every module, AI engine, workflow, connector, and background process operates consistently within the platform, and the engineering standards every implementation must follow.

### This document is

- An engineering specification for the runtime foundation  
- Configuration-, registration-, and observability-oriented  
- Consuming of approved architecture and the AI Engine Specification Framework  

### This document is not

- An architecture redesign or ADR  
- Application/domain business logic  
- Code, APIs, UI, prompts, or database schemas  

### Guiding principles (normative)

The Platform Spine must be: **modular**, **provider-independent**, **event-aware**, **workflow-aware**, **AI-ready**, **extensible**, **observable**, **fault tolerant**, **configuration-driven**, and **enterprise scalable**.

**Hard rule:** The Platform Spine contains **no business logic**. Business capabilities belong to bounded contexts (Domain / Application modules). The Spine provides hosting, registration, shared services, orchestration runtime, AI runtime host, integration runtime host, and operational fabric.

---

## 1. Platform Spine Vision

### 1.1 Purpose

Provide a single, consistent runtime foundation so that:

- Interactive requests, background jobs, AI engine runs, workflows, integrations, and reporting jobs share the same identity, configuration, tenancy context, observability, and failure philosophy  
- Modules and engines plug in through registration rather than ad hoc wiring  
- Approved architectural boundaries (Clean Architecture, Orchestration ownership, Integration contracts, AI ports) are enforced at engineering time  

### 1.2 Responsibilities

| Responsibility | Meaning |
|----------------|---------|
| **Runtime hosting** | Boot and run Backend, Worker, and (conceptually) Web-adjacent platform clients against shared contracts |
| **Lifecycle** | Startup, readiness, graceful shutdown, health |
| **Registration** | Modules, workflows, AI engines, connectors, shared services |
| **Shared platform services** | Config, logging, diagnostics, events, scheduling, feature flags, audit support, storage/cache abstractions |
| **Context propagation** | Correlation, tenant/workspace actor context, reasoning/workflow run identities |
| **Workflow runtime host** | Execute Orchestration-owned workflows (pause/resume/HITL/retry) |
| **AI runtime host** | Execute engines per AI Engine Specification Framework under Orchestration |
| **Integration runtime host** | Resolve connectors via Integration Facade; health/degrade |
| **Observability & recovery fabric** | Logs, metrics, traces, health, degradation, operational events |

### 1.3 Intentionally does NOT own

| Not owned by Spine | Owned by |
|--------------------|----------|
| Ubiquitous language, Domain invariants, Approvals | Domain Architecture |
| Cognitive engine meaning / reason-before-generate rules | AI Reasoning Architecture + AI Engine Spec |
| Knowledge hierarchy / EKB authority | Knowledge Architecture |
| Intake designation & workflow *meaning* | Knowledge Intake & Workflow Orchestration |
| Decision/Evidence/HITL *rules* | AI Decision & Evidence Framework |
| Connector contract *meaning* | Integration Architecture |
| Module *business* packaging intent | Application Architecture |
| Product Requirements / Test Design content | Bounded-context modules |
| Secrets values | Vault/enterprise secret stewardship (via Integration/Security) |

The Spine **hosts and enforces** these owners’ boundaries; it does not redefine them.

---

## 2. Platform Startup Lifecycle

Conceptual startup sequence for Backend and Worker hosts (Web consumes Backend readiness; it does not register Domain modules).

```
1. Platform initialization
2. Configuration loading
3. Shared package / facade bootstrap
4. Module discovery
5. Module registration
6. Shared service initialization
7. AI engine registration
8. Workflow registration
9. Connector registration (enabled set)
10. Health verification
11. Platform ready
```

| Stage | Responsibilities |
|-------|------------------|
| **Platform initialization** | Process boot; runtime identity; fail-fast on unsupported environment |
| **Configuration loading** | Load and validate externalized config hierarchy (§10); refuse boot on invalid/missing required config |
| **Shared package / facade bootstrap** | Logger, error taxonomy, config helpers, correlation primitives |
| **Module discovery** | Discover declared Application modules eligible for this host |
| **Module registration** | Register identity, dependencies, lifecycle hooks, health contributors |
| **Shared service initialization** | Start config, diagnostics, event publishing, scheduling, feature flags, audit support, storage/cache abstractions |
| **AI engine registration** | Register engine manifests from AI Engine Specification Framework (enabled subset) |
| **Workflow registration** | Register Orchestration workflow types/modes available on this host |
| **Connector registration** | Register enabled Integration connectors; verify credential *references* resolve (not secret values in Spine) |
| **Health verification** | Aggregate module/connector/shared-service health; distinguish live vs ready |
| **Platform ready** | Accept interactive traffic and/or consume jobs per host role |

**Shutdown (conceptual):** stop accepting new work → drain/checkpoint in-flight workflows/jobs → flush diagnostics → release resources. Never corrupt sealed Domain/EIM artifacts during shutdown.

---

## 3. Runtime Architecture

Logical runtimes coexist inside the Foundation modular monolith initially (`api` + `worker`; Web is presentation). They share Application/Domain meaning and Spine services; they do not fork business rules.

| Runtime | Role | Typical host |
|---------|------|--------------|
| **Interactive runtime** | AuthZ, short use cases, Intake acceptance, HITL command capture, status queries | Backend (`api`) |
| **Background runtime** | Job intents, retries, scheduled work, sync, bulk | Worker |
| **AI runtime** | AI engine lifecycle execution under Orchestration | Worker (primary); short slices may run interactively only when policy allows |
| **Workflow runtime** | Workflow state progression, checkpoints, HITL pause/resume | Backend initiates; Worker continues long-running |
| **Integration runtime** | Adapter/connector invocation, health, degrade, normalized errors | Backend + Worker via Integration Facade |
| **Reporting runtime** | Report materialization/export jobs | Worker (primary); Backend for query/status |

### Coexistence rules

1. **One Domain meaning** across all runtimes.  
2. **Interactive must not wait unbounded** on AI/provider completion — enqueue + observe workflow state.  
3. **Workers execute Application use cases**, not a second Domain.  
4. **Externals only through Integration runtime.**  
5. **Orchestration owns workflow meaning**; Spine provides the runtime host.  
6. **AI Engine Spec owns engine contracts**; Spine provides discovery/execution host.

```
Web (presentation)
   → Interactive runtime
        → Workflow runtime (start/resume commands)
        → Integration runtime (short, safe calls)
        → enqueue → Background / AI / Reporting runtimes
```

---

## 4. Module Registration Framework

Every platform module registers with the Spine before serving traffic or consuming jobs.

### 4.1 Registration facets

| Facet | Expectation |
|-------|-------------|
| **Identity** | Stable `moduleId`, version, owning bounded context / Application module name |
| **Responsibilities** | Declared capability summary (non-Domain prose); must not claim Spine-owned or Orchestration-owned meaning |
| **Dependencies** | Explicit module and shared-service dependencies; no undeclared deep imports |
| **Lifecycle** | `register` → `init` → `ready` → `drain` → `stopped` |
| **Configuration** | Module config schema reference (externalized); validated at boot |
| **Health** | Contribute health signals (`Healthy` / `Degraded` / `Unhealthy` / `Unknown`) |
| **Extension points** | Documented hooks (events consumed/published, workflow participation, engines invoked) — not ad hoc internals |

### 4.2 Module classes (registration targets)

Aligned with Application Architecture (examples, not a redesign):

- Administration / Access / Configuration  
- Document Management / Knowledge Intake Coordination  
- Requirement Management / Knowledge Management / Test Design  
- AI Reasoning (application boundary) / AI Review  
- Workflow Orchestration (application host) / Integration Facade  
- Automation / Execution / Release / Reporting / Notification  

Presentation workspaces register as **frontend feature modules** against Backend contracts; they do not register Domain engines.

### 4.3 Rules

- Unregistered modules must not run in production hosts.  
- Registration order respects dependency graph (§6).  
- Modules expose no vendor SDK surfaces through registration.  

---

## 5. Shared Platform Services

Shared services are Spine capabilities. They **must not** contain Domain business behaviour.

| Service | Responsibilities |
|---------|------------------|
| **Configuration** | Load/validate hierarchical config; typed access; no scattered env reads |
| **Logging** | Structured logs; correlation IDs; redaction of secrets/sensitive bodies |
| **Diagnostics** | Runtime diagnostics dumps for ops (policy-gated); no secret leakage |
| **Notifications** | Deliver notification *intents* via Integration Notification connectors |
| **File management** | Temporary/work file handling for Intake/export pipelines (not EIM meaning) |
| **Storage abstraction** | Object/blob port usage for bytes; identity remains EIM/Domain |
| **Caching abstraction** | Acceleration only; never Requirements truth |
| **Event publishing** | Publish platform/domain/integration/operational events via approved channels (e.g., outbox mindset) |
| **Scheduling** | Cron/delayed intents for sync, recovery, report jobs |
| **Feature flags** | Runtime capability gates; not Domain invariants |
| **Audit support** | Emit audit records for privileged/Spine-mediated actions; Decision audit remains Decision Framework |
| **Identity context** | Propagate authenticated actor / service identity into runtimes |
| **Idempotency support** | Keys for jobs and Intake-like operations |
| **Clock / ID generation** | Portable time and identity helpers for Application use |

---

## 6. Dependency Management

| Rule | Expectation |
|------|-------------|
| **Module dependencies** | Explicit; acyclic at module graph; depend on published application contracts only |
| **Shared service dependencies** | Modules may depend on Spine services; services must not depend on Domain modules |
| **AI engine dependencies** | Engines depend on ports + upstream artifacts; not on UI or connector SDKs |
| **Integration dependencies** | Application/Integration Facade → contracts → adapters → connectors; Domain never imports connectors |
| **Circular dependency prevention** | Reject registration graphs with cycles; prefer events for cross-module reactions |
| **Layer isolation** | Presentation → Application → Domain; Infrastructure/Integration implement ports only |
| **Worker/Backend** | Share Application/Domain packages; no duplicate business rules |
| **Web** | Must not import Backend internals; contracts via shared packages only |

---

## 7. Event Model

### 7.1 Philosophy

Events decouple modules and enable async reactions **without** transferring Domain ownership. Spine provides publishing/subscription fabric; **meaning** of Domain events remains Domain Architecture.

### 7.2 Event classes

| Class | Ownership of meaning | Typical use |
|-------|----------------------|-------------|
| **Domain events** | Domain Architecture | Facts that already happened in the business model |
| **Platform events** | Spine / Application | Module ready, config reload, feature flag change, host lifecycle |
| **AI events** | AI Runtime / Brain contracts | Engine started/completed/blocked; package published; confidence gate outcomes |
| **Workflow events** | Orchestration Architecture | Stage transitions, pause/resume, HITL waiting, checkpoint, cancel |
| **Integration events** | Integration Architecture | Connector health, degrade, sync completed/failed (normalized) |
| **Operational events** | Spine / Security / Ops | Security audit signals, incident markers, job poison, drain |

### 7.3 Lifecycle (conceptual)

`emit` → (optional outbox durability) → `dispatch` → `handle` → `ack` / `retry` / `dead-letter (policy)`  

Handlers must be idempotent. Events are not a backdoor to invent Requirements or Approvals.

**No message formats are defined here.**

---

## 8. Workflow Runtime

Consumes [Knowledge Intake & Workflow Orchestration Architecture](../architecture/KNOWLEDGE_INTAKE_AND_WORKFLOW_ORCHESTRATION_ARCHITECTURE.md) (ADR 0011).

| Concern | Engineering expectation |
|---------|-------------------------|
| **Registration** | Workflow types/modes register at startup with attachment points to modules/engines |
| **Discovery** | Orchestrator resolves workflow by Intake classification + requested mode + policy |
| **State progression** | Deterministic stage advancement per registered definition |
| **Pause** | HITL, policy, or resource wait → checkpoint |
| **Resume** | Human disposition or timer/signal → continue from checkpoint |
| **Cancellation** | Cooperative cancel; mark workflow cancelled; do not corrupt sealed artifacts |
| **Retry** | Idempotent retries for transient failures; rewind to earliest broken stage when cognition fails |
| **Long-running workflows** | Worker-hosted continuation; interactive only for commands/status |
| **Human approval checkpoints** | Decision/Evidence HITL; Spine surfaces `awaiting_human`; Approvals remain Domain facts |

**Ownership reminder:** Workflow *catalog and meaning* = Orchestration Architecture. Spine = runtime host only.

---

## 9. AI Runtime

Consumes [AI Engine Specification Framework](./AI_ENGINE_SPECIFICATION_FRAMEWORK.md) and AI Reasoning Architecture.

| Concern | Engineering expectation |
|---------|-------------------------|
| **Engine discovery** | Enabled engines from manifests at boot |
| **Engine registration** | Identity, version, I/O artifact types, ports, HITL participation |
| **Shared execution context** | `reasoningRunId`, ARS identity, feature/tenant scope, correlation, policy thresholds |
| **Evidence access** | Read evidence refs per Decision & Evidence Framework; no LLM-memory-as-evidence |
| **Confidence propagation** | Bands/drivers flow with artifacts; package ≤ blocking constituents |
| **Cancellation** | Cooperative cancel mid-run; partial artifacts marked non-final |
| **Retry** | Provider/transient retries via Integration; never retry by inventing data |
| **Timeout** | Policy timeouts → degrade/block/HITL — not silent success |
| **Parallel execution** | Only for independent supporting work; merge via Orchestrator |
| **Explainability support** | Capture Explanation Packet facets for significant decisions |
| **Provider independence** | AI Port + Integration AI connectors only |

AI runtime **hosts** engines; it does not own QA heuristics, Domain Approvals, or Intake designation.

---

## 10. Configuration Framework

Configuration is **externalized** (12-factor). Validated at boot. Secrets are references, never committed.

### 10.1 Hierarchy (conceptual, highest specificity wins where policy allows)

```
Platform configuration
  → Environment configuration
    → Runtime / host configuration (api vs worker)
      → Module configuration
        → Workflow / AI engine configuration (enabled subset)
          → AI provider configuration (via Integration)
            → Connector configuration (enabled instances)
              → Feature flags (runtime overlays)
```

| Layer | Examples of concern |
|-------|---------------------|
| **Platform** | Service names, log levels baseline, observability endpoints mindset |
| **Environment** | fv/rv/prod-class settings; residency hints |
| **Runtime** | Interactive vs worker role; concurrency classes |
| **Module** | Module-specific non-secret settings |
| **AI provider** | Provider selection/fallback *policy* (not prompts) |
| **Connector** | Enablement, capability flags, vault references |
| **Feature flags** | Gradual enablement of modules/engines/connectors |

**Rules:** Fail-fast on invalid required config; module code must not read raw environment ad hoc; security-impacting flags require Security stewardship awareness.

---

## 11. Error Handling & Recovery

| Class | Conceptual handling |
|-------|---------------------|
| **Recoverable errors** | Retry with backoff/idempotency; checkpoint; continue |
| **Non-recoverable errors** | Fail closed for the unit of work; emit operational/AI/workflow event; surface typed failure |
| **Retry strategies** | Transient integration/AI transport only; never invent Domain data to “succeed” |
| **Circuit breaking concepts** | Skip Unhealthy connectors; isolate failing providers per Integration Architecture |
| **Graceful degradation** | Optional enrichment skipped; ARS-only paths when knowledge/provider degraded |
| **User-visible failures** | Stable error taxonomy via shared errors package; no stack traces as UX; no secret leakage |
| **AI provider failures** | Normalized remote errors; fallback order; HITL/block if generation cannot proceed honestly |
| **Workflow failures** | Orchestrator decides retry/rewind/HITL/cancel; sealed artifacts untouched |
| **Integration failures** | Non-corruption guarantee; degrade or fail-secure (identity outage) |

Spine recovery must **never** rewrite published/sealed EIM or Domain truth to clear an error.

---

## 12. Observability Framework

Consumes Security & Governance audit/observability ownership and Foundation telemetry baseline.

| Signal | Purpose |
|--------|---------|
| **Logging** | Structured, correlated, redacted |
| **Metrics** | Host health, job counts, gate outcomes, connector health classes, latency classes |
| **Health monitoring** | Liveness vs readiness; module and connector contributors |
| **Distributed tracing (conceptual)** | Correlate interactive → workflow → AI → integration spans |
| **AI execution visibility** | Engine, run id, provider provenance, confidence bands, gate results (not full sensitive bodies) |
| **Workflow visibility** | Stage, mode, checkpoint, HITL wait reasons |
| **Integration visibility** | Connector instance health, degrade mode, error classes |
| **Platform diagnostics** | Operator-facing Spine diagnostics under policy |
| **Operational dashboards** | Aggregate the above for SRE/platform stewardship |

Observability complements — does not replace — Decision/Evidence audit records.

---

## 13. Extension Framework

New capabilities extend the Spine by **registration**, not Core forks.

| Extension | How added |
|-----------|-----------|
| **New modules** | Module registration + dependency declaration + config schema + health |
| **New AI engines** | Engine Manifest per AI Engine Specification Framework |
| **New workflow types** | Orchestration catalog extension + workflow registration |
| **New connectors** | Integration Open/Closed path + connector registration + enablement review |
| **New reports** | Reporting module + optional Report Generation Engine + job registration |
| **New exporters** | Integration Export connector + Reporting/Document consumers |
| **New validation engines** | Engine/module registration; must not redefine Domain invariants |

**Extension principles:** Open/Closed; no business logic in Spine services; ADR if architectural boundaries change; Security review for privileged extensions.

---

## 14. Engineering Constraints

Developers **must never**:

1. Bypass the Platform Spine for module/engine/connector startup in production hosts.  
2. Create direct cross-module dependencies outside approved published contracts.  
3. Put Domain business rules into shared Spine services.  
4. Let an AI engine own Domain Approvals, Intake designation, or Requirements authorship.  
5. Call external vendors from Domain or Web directly.  
6. Violate Clean Architecture layering (Presentation → Application → Domain).  
7. Fork a second Domain inside Worker/AI runtimes.  
8. Use cache, metrics, or logs as Sources of Requirements truth.  
9. Hardcode secrets or commit environment secrets.  
10. Treat feature flags as substitutes for Domain invariants or ADR decisions.  
11. Insert Release as a mandatory Brain pipeline step (Release remains lateral).  
12. Use FDD-only identity fields — use Approved Requirements Source identity.  
13. Skip HITL/Decision/Evidence paths required by architecture for governed advances.  
14. Redesign architecture silently during Spine implementation.  

---

## 15. Architecture Dependencies

| Dependency | Inherited / consumed |
|------------|----------------------|
| [Foundation Architecture](../architecture/ARCHITECTURE.md) (ADRs 0001–0003) | Modular monolith hosts (`web`/`api`/`worker`), Clean Architecture, config/logging/OTel baselines, approved stack |
| [Application Architecture](../architecture/APPLICATION_ARCHITECTURE.md) (ADR 0013) | Logical apps, modules, worker vs interactive split, shared packages |
| [AI Engine Specification Framework](./AI_ENGINE_SPECIFICATION_FRAMEWORK.md) | Engine catalog, lifecycle, contracts, evidence/confidence/explainability engineering |
| [Knowledge Intake & Workflow Orchestration](../architecture/KNOWLEDGE_INTAKE_AND_WORKFLOW_ORCHESTRATION_ARCHITECTURE.md) (ADR 0011) | Workflow meaning, Intake, HITL pause/resume, modes |
| [Domain Architecture](../architecture/DOMAIN_ARCHITECTURE.md) (ADR 0006) | What Spine must not own; Domain events meaning |
| [Security & Governance](../architecture/SECURITY_AND_GOVERNANCE_ARCHITECTURE.md) (ADR 0014) | AuthZ posture, audit, AI accountability, fail-secure |
| [Implementation Readiness Blueprint](../architecture/IMPLEMENTATION_READINESS_AND_TECHNICAL_BLUEPRINT.md) (ADR 0015) | Build order (Spine first), AI-dev governance, quality gates |
| [Integration Architecture](../architecture/INTEGRATION_AND_EXTERNAL_SYSTEMS_ARCHITECTURE.md) (ADR 0012) | Connector runtime, degrade, non-corruption |
| [AI Reasoning / Decision / Knowledge / EIM / Terminology](../architecture/) | Consumed constraints for AI/workflow/identity fields |

This specification **does not redefine** any of the above.

---

## 16. Platform Readiness Checklist

Complete before implementing domain business modules beyond Administration/Access scaffolding:

| # | Check | Status |
|---|-------|--------|
| 1 | Startup lifecycle defined (§2) | ☐ |
| 2 | Runtime responsibilities defined (§3) | ☐ |
| 3 | Module registration framework defined (§4) | ☐ |
| 4 | Shared platform services defined (§5) | ☐ |
| 5 | Dependency / layer rules defined (§6) | ☐ |
| 6 | Event philosophy defined (§7) | ☐ |
| 7 | Workflow runtime defined (§8) | ☐ |
| 8 | AI runtime defined (§9) | ☐ |
| 9 | Configuration hierarchy defined (§10) | ☐ |
| 10 | Error handling & recovery principles defined (§11) | ☐ |
| 11 | Observability framework defined (§12) | ☐ |
| 12 | Extension model defined (§13) | ☐ |
| 13 | Engineering constraints acknowledged by implementers (§14) | ☐ |
| 14 | Architecture dependencies traced (§15) | ☐ |
| 15 | Spine contains **no** Domain business logic by design | ☐ |
| 16 | Product/Architect authorization exists to begin Phase 1b coding | ☐ |

**Specification completeness:** Items 1–15 are defined by this document. Item 16 is an authorization gate, not a missing specification.

---

## 17. Document Control

| Field | Value |
|-------|-------|
| **Version** | 1.0 |
| **Status** | Approved engineering specification (no code) |
| **Owner** | Principal Software Engineer / Enterprise Platform Architect / Technical Lead |
| **Dependencies** | ADRs 0001–0015; AI Engine Specification Framework v1.0 |
| **Related ADRs** | Consumes 0001–0003, 0011–0015 primarily; creates **no new ADR** |
| **Last updated** | 2026-07-25 |

### Change History

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-07-25 | Initial Platform Spine Engineering Specification |

---

*End of Platform Spine Engineering Specification.*
