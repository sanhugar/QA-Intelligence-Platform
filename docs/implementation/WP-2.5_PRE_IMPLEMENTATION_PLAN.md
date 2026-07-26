# WP-2.5_PRE_IMPLEMENTATION_PLAN.md
## Pre-Implementation Plan — Requirement Intelligence Engine Foundation (Historical Draft)

> **Relocation notice (2026-07-26):** Formerly filed as `WP-3.1_PRE_IMPLEMENTATION_PLAN.md`. Per [WP_IDENTITY_ARCHITECTURE_DECISION.md](./WP_IDENTITY_ARCHITECTURE_DECISION.md), this content is **WP-2.5** (RIE Foundation). Superseded for implementation by [WP-2.5_FINAL_PRE_IMPLEMENTATION_PLAN.md](./WP-2.5_FINAL_PRE_IMPLEMENTATION_PLAN.md). The path `WP-3.1_PRE_IMPLEMENTATION_PLAN.md` is reserved for **Intake Entry Workflow**.

**Work Package:** WP-2.5 — Requirement Intelligence Engine Foundation (historical draft labeled WP-3.1 at authoring)  
**Role:** ATI Platform Chief Architect  
**Date:** 2026-07-26  
**Status:** Historical / superseded by Final Pre-Implementation Plan  
**Implementation:** Delivered under WP-2.5 (see Release Baseline v2.5)

**Platform baseline at authoring:** Stable Development Baseline **v2.4**

---

## Executive Summary

WP-3.1 establishes the **Requirement Intelligence Engine Foundation**: a Nest-free, technology-neutral structural substrate for representing requirements sources and running a **deterministic parsing/normalization pipeline skeleton**. It defines the core requirement model, public engine interfaces, internal pipeline contracts, and host lifecycle hooks so later work packages can add format parsers, AI extraction, and Brain Stage 1 Requirement Understanding without inventing ad hoc types or host wiring.

This Work Package **does not** implement LLM extraction, embeddings, search, scenario/test generation, coverage, blueprint generation, Knowledge Intake product workflows, or persistence. It also **does not** designate Approved Requirements Source (ARS) — that remains Orchestration / Intake ownership (ADR 0011).

**Roadmap note (open for Architecture Review):** The canonical WBS currently labels WP-3.1 as *Intake Entry Workflow*. This plan adopts the Release-directed title **Requirement Intelligence Engine Foundation** under ID WP-3.1. Architecture Review must confirm WBS alignment (retain ID with updated purpose, or reassign Intake Entry to a different WP ID) before Final Plan / Authorization.

**Planning Verdict:** **READY FOR ARCHITECTURE REVIEW**

---

## Objectives

### Business objectives

1. Establish a stable **requirement structural foundation** that later analysis can trust.  
2. Enable multi-format source readiness (Markdown, FDD, PRD, User Story, future formats) via **extension points**, without shipping parsers in this WP.  
3. Preserve ATI generation authority rules: ARS primacy; no invention of requirements by foundation scaffolding.  
4. Unblock subsequent Requirement Understanding / Validation engines by fixing model and pipeline contracts early.

### Technical objectives

1. Deliver a framework-independent **Requirement Intelligence Engine** package (name locked in Architecture Review) with public API via `index.ts` only.  
2. Define technology-neutral models: Requirement, RequirementSection, RequirementFragment, Metadata, Source Reference.  
3. Define engine lifecycle and internal pipeline contracts (ingest → parse slot → normalize slot → model assemble) with **no AI ports**.  
4. Wire minimal host integration with Spine lifecycle, AuthN/AuthZ coexistence, Observability correlation, and WP-2.4 context propagation — **without** persistence.  
5. Prove foundation with unit/contract tests (model validation, pipeline no-op path, isolation from AuthZ/Brain).  
6. Record deferred capabilities explicitly (parsers, AI, Intake product, DB).

---

## Scope

### In Scope

| Area | Detail |
|------|--------|
| **Core engine package** | New Foundation/Application-boundary package for Requirement Intelligence Engine foundation (Nest/React/Domain-persistence-free) |
| **Public interfaces** | Engine facade: create/run foundation pipeline; register parser adapters (stubs/ports only); expose model types |
| **Internal pipeline contracts** | Ordered stages and stage interfaces; error/result envelopes; correlation/context carry-through fields |
| **Engine lifecycle** | Init / ready / shutdown hooks compatible with Platform Spine host bootstrap patterns (consumption only) |
| **Requirement model** | Technology-neutral types for Requirement, RequirementSection, RequirementFragment, Metadata, Source Reference |
| **Parsing pipeline extension points** | Ports for Markdown, FDD, PRD, User Story, and future formats — **interfaces + registry only** |
| **Normalization slot** | Contract for future normalizers; default identity/no-op normalizer allowed |
| **Host integration (thin)** | Optional platform probe or in-process harness on `apps/api` and/or `apps/worker` proving engine invoke under Auth + Context + correlation — **not** Domain product APIs |
| **Tests + docs** | Package tests; host smoke if wired; Implementation Report; Deferred Capability Register |

### Out of Scope (Non-Goals)

| Item | Rationale |
|------|-----------|
| LLM / provider integration | Brain / WP-4.x / Requirement Understanding Engine spec — later |
| Embeddings / vector databases / search | Knowledge / retrieval WPs |
| AI reasoning / Stage 1 extraction | Requirement Understanding Engine implementation WP |
| Scenario generation | Test Design / Scenario engines |
| Test case generation | Test Design engines |
| Coverage analysis / blueprint generation | Later engines |
| Parser implementations (Markdown/FDD/PRD/User Story) | Future format WPs; this WP = extension points only |
| Knowledge Intake entry / ARS designation / classification | ADR 0011 Orchestration; canonical WBS Intake Entry (ID conflict to resolve) |
| Persistence / Prisma / migrations | No database in WP-3.1 |
| Domain Approvals / HITL product | Decision & Evidence + Domain WPs |
| Requirement Knowledge Graph | Downstream Brain stage |
| Redesign of Spine, Auth, Observability, Context | Closed WP-1.x / WP-2.x |
| `apps/web` requirement UX | Later Application UX |

---

## Architecture Alignment

| Architecture | Alignment |
|--------------|-----------|
| **Platform Spine (WP-1.3/1.4)** | Consume host lifecycle and AI Runtime host rules; **do not** add Brain engines or change approved AI Runtime field locks without Review |
| **Application Architecture — Requirement Management** | Foundation package supports future Requirement Management module; **no** module product CRUD in this WP |
| **AI Reasoning — Stage 1** | Consumed as **future consumer** of foundation models; WP-3.1 does **not** implement Stage 1 |
| **Requirement Understanding Engine Spec** | Spec remains authority for AI understanding behaviour; WP-3.1 provides structural substrate only |
| **Knowledge Intake & Orchestration (ADR 0011)** | Intake/ARS designation **not owned** here; foundation may accept Source References as opaque inputs |
| **Domain Architecture** | Vocabulary compatible with Requirement / Requirement Object meaning; **no** Domain persistence or Approvals |
| **Security / Auth (WP-2.2)** | Host probes fail-closed when auth enabled; foundation is not an AuthZ engine |
| **Observability (WP-2.3)** | Correlation on invoke; allow-listed labels only; no PII dumps of requirement text into metrics |
| **Context (WP-2.4)** | Carry tenant/workspace on host invoke paths; no cross-tenant silent merge |
| **Blueprint** | No tenancy/persistence ADR required for in-memory foundation; still no migrations |

**Layering rule:** `@ati/*` package remains Nest-free; Nest wiring only in `apps/*`. No Domain package imports inside the foundation package.

---

## Proposed Components

### 1. Core Engine Package (proposed)

| Item | Proposal (lock in Architecture Review) |
|------|----------------------------------------|
| Package name | `@ati/requirement-intelligence` (or `@ati/requirements-engine`) under `packages/` |
| Public API | `src/index.ts` only |
| Responsibilities | Model types; pipeline contracts; engine lifecycle; parser/normalizer **ports**; in-memory run result |
| Non-responsibilities | LLM, DB, Nest, Intake designation, AuthZ decisions |

### 2. Requirement Model (technology-neutral)

| Type | Intent |
|------|--------|
| **Requirement** | Aggregate structural unit for a versioned understanding of a source (identity, sections, metadata, source refs) — **not** a persisted Domain aggregate in this WP |
| **RequirementSection** | Ordered logical section (title, kind, fragments) |
| **RequirementFragment** | Atomic textual/structural unit with stable local id and optional span hints |
| **Metadata** | Opaque/typed attributes (format hint, language, timestamps, confidence placeholders **unset** by default) |
| **Source Reference** | Pointer to originating Knowledge Input / document identity+version+locator — **no** binary storage |

Model remains **schema-technology-neutral** (TypeScript interfaces / Zod optional validation only). No Prisma models.

### 3. Parsing Pipeline (extension points only)

```
Source Reference + raw text payload (in-memory)
        ↓
[Format Detect / Select Parser Port]   ← registry; no real parsers required
        ↓
[Parse Port] → structural ParseResult
        ↓
[Normalize Port] → normalized fragments/sections (default no-op)
        ↓
[Assemble] → Requirement model
        ↓
EngineResult (success | structured failure)
```

| Format slot | WP-3.1 delivery |
|-------------|-----------------|
| Markdown | Port + registry key only |
| FDD | Port + registry key only |
| PRD | Port + registry key only |
| User Story | Port + registry key only |
| Future formats | Extension mechanism documented |

A **null/stub parser** may exist solely to exercise the pipeline in tests.

### 4. Engine Lifecycle

| Phase | Behaviour |
|-------|-----------|
| **Init** | Load config; register built-in stub ports |
| **Ready** | Engine may accept `runFoundationPipeline` |
| **Invoke** | Synchronous/in-process foundation run; correlation + context ids on result envelope |
| **Shutdown** | Clear registries; no durable state |

Does **not** block Platform LIVE/READY health.

### 5. Integration (hosts)

| Concern | Integration |
|---------|-------------|
| **Spine** | Optional registration as shared service / host-local service — **no** Spine ownership redesign |
| **Authentication** | Any HTTP probe behind WP-2.2 auth; public health unchanged |
| **Observability** | Accept/echo correlation; metrics names allow-listed if emitted |
| **Context** | Require/propagate tenant context on protected invoke per WP-2.4 policy |
| **Persistence** | **None** |

---

## Risks

| Type | Risk | Mitigation |
|------|------|------------|
| Governance | WP-3.1 ID collision with WBS *Intake Entry Workflow* | Architecture Review must lock ID/purpose; do not implement Intake under this plan without re-plan |
| Architectural | Drifting into Requirement Understanding (LLM) scope | Hard non-goals; Independent Review gate |
| Architectural | Treating foundation Requirement as Domain SoT / ARS | Document subordination to ARS; Source Reference only |
| Delivery | Implementing real parsers “while we’re here” | Out of scope; Deferred Register |
| Security | Logging full requirement bodies as metrics | Obs allow-list; redact; no body labels |
| Technical | Premature persistence | D5-style lock: zero migrations |
| Sequencing | Confusing Document Engine vs this foundation | Clarify: Document Engine prepares Intake bundles later; this WP owns structural requirement pipeline contracts only |

---

## Assumptions

1. Stable Development Baseline **v2.4** (Auth, Observability, Context) is the implementation substrate.  
2. Architecture Review will resolve the **WP-3.1 WBS title conflict** before Final Plan.  
3. No database or Redis is required for foundation acceptance.  
4. ARS designation remains future Intake/Orchestration work; foundation accepts opaque Source References.  
5. AI Runtime host types (WP-1.4 approved fields) are **not** expanded unless Architecture Review explicitly authorizes.  
6. Package naming and exact host probe surface are locked in Decision Resolution — not by implementers ad hoc.

---

## Deliverables

### Planning phase (this document)

| Artifact | Status |
|----------|--------|
| `WP-2.5_PRE_IMPLEMENTATION_PLAN.md` | **This document** (relocated historical RIE draft) |
| Architecture Review | Next |
| Decision Resolution + Final Plan | After Review |
| Implementation Authorization | Separate |

### Implementation phase (not started — unauthorized)

- Requirement Intelligence Engine package + tests  
- Thin host integration (if authorized)  
- `WP-3.1_IMPLEMENTATION_REPORT.md`  
- `WP-3.1_DEFERRED_CAPABILITY_REGISTER.md`  
- Closeout / Git readiness (later)

---

## Work Breakdown Structure

| Task | Purpose | Deliverables | Dependencies |
|------|---------|--------------|--------------|
| **T1** | Architecture decision lock | Resolve open decisions; Final Plan | Architecture Review |
| **T2** | Package scaffold | Approved package name; `index.ts` exports; lifecycle stub | T1 |
| **T3** | Requirement model | Types + validation helpers for Requirement / Section / Fragment / Metadata / Source Reference | T2 |
| **T4** | Pipeline contracts | Stage ports, registry, stub parser/normalizer, `EngineResult` | T2, T3 |
| **T5** | Engine facade | `runFoundationPipeline`; config load; error codes | T4 |
| **T6** | Host integration (thin) | Optional api/worker wiring with Auth + Obs + Context | T5, WP-2.2–2.4 |
| **T7** | Verification | Unit/contract tests; no persistence proof | T3–T6 |
| **T8** | Documentation | Implementation Report; Deferred Register | T7 |

**Execution order:** T1 → T2 → T3 ∥ T4 → T5 → T6 → T7 → T8.

### Open decisions (for Architecture Review)

1. Confirm **WP-3.1 identity** vs canonical WBS *Intake Entry Workflow*.  
2. Package name and ownership boundary (Foundation `@ati/*` vs module-local only).  
3. Whether a platform HTTP probe is in scope or in-process harness only.  
4. Relationship to future Document Engine / Intake bundles (consume vs ignore in WP-3.1).  
5. Whether AI Runtime envelope may carry requirement-run ids in this WP.  
6. Validation library choice (Zod vs types-only) inside the package.  
7. Default behaviour when no parser is registered for a format (fail-closed vs stub).

---

## Success Criteria

1. Nest-free engine package builds; public API via `index.ts` only.  
2. Technology-neutral Requirement model types exist and are validated in tests.  
3. Pipeline contracts support registering format ports without shipping real Markdown/FDD/PRD/User Story parsers.  
4. Foundation pipeline runs end-to-end with stub parser/normalizer.  
5. Host integration (if authorized) respects Auth, Observability correlation, and Context rules; health remains unaffected.  
6. **Zero** database migrations / persistence.  
7. **No** LLM, embeddings, search, scenario/test generation, or Intake designation features.  
8. Deferred Capability Register lists parsers, AI, Intake, persistence, and related product work.  
9. Architecture Review / Decision Resolution resolve WP ID alignment before Implementation Authorization.

---

## Exit Criteria

This Pre-Implementation Plan is complete as a planning artifact.

WP-3.1 may proceed to:

- **Architecture Review**

only after this plan is **approved**.

WP-3.1 may **not** proceed to implementation until a **Final Pre-Implementation Plan** is approved and implementation is separately authorized.

**No code. No architecture redesign. Planning only.**

---

## Final Verdict

**READY FOR ARCHITECTURE REVIEW**

---

## Planning Status

**WP-3.1 Pre-Implementation Plan Complete**

**Ready for Architecture Review** (upon plan approval)

---

*End of WP-3.1 Pre-Implementation Plan.*
