# WP-2.5_FINAL_PRE_IMPLEMENTATION_PLAN.md
## Final Pre-Implementation Plan — Requirement Intelligence Engine Foundation

**Work Package:** WP-2.5 — Requirement Intelligence Engine Foundation  
**Role:** ATI Platform Chief Architect  
**Date:** 2026-07-26  
**Status:** **Final** — authoritative implementation baseline (pending Implementation Authorization)  
**Implementation:** **Not authorized**

**Phase:** Phase 2 — Shared Infrastructure  
**Platform baseline:** Stable Development Baseline **v2.4**

**Governance predecessors**

| Stage | Artifact / result |
|-------|-------------------|
| Pre-Implementation Plan | [WP-2.5_PRE_IMPLEMENTATION_PLAN.md](./WP-2.5_PRE_IMPLEMENTATION_PLAN.md) (historical draft; formerly filed as WP-3.1_*) |
| Architecture Review | [WP-2.5_ARCHITECTURE_REVIEW.md](./WP-2.5_ARCHITECTURE_REVIEW.md) — APPROVED WITH OBSERVATIONS (historical RIE review) |
| WP Identity Decision | [WP_IDENTITY_ARCHITECTURE_DECISION.md](./WP_IDENTITY_ARCHITECTURE_DECISION.md) — **WP-2.5 APPROVED** |

**Identity lock (binding):** WP-2.5 = Requirement Intelligence Engine Foundation · WP-3.1 = Intake Entry Workflow (unchanged).

This document **supersedes** the draft Pre-Implementation Plan for implementation purposes. Technical scope is unchanged aside from locked decisions below. **No unauthorized scope expansion.**

---

## Executive Summary

WP-2.5 delivers the **Requirement Intelligence Engine Foundation**: Nest-free **`@ati/requirement-engine`** (`packages/requirement-engine`) providing a technology-neutral requirement structural model, deterministic pipeline **contracts** (parse/normalize/assemble ports), engine lifecycle, configuration/validation/runtime registration, and **thin** host coexistence with Platform Spine, Auth, Observability, and Context.

The engine is a **Shared Infrastructure substrate** — not Knowledge Intake, not Domain SoT, not an AI engine, not a parser product. LIVE/READY remain unaffected. **Zero** persistence/migrations. **Zero** LLM/embeddings/search. **Zero** format parser implementations (stub port for tests only).

**Final Verdict:** **APPROVED FOR IMPLEMENTATION AUTHORIZATION**

---

## Objectives

### Business

1. Establish a reusable structural foundation for future Requirement Intelligence capabilities.  
2. Keep ARS / Intake ownership with Orchestration (ADR 0011 / WP-3.1+).  
3. Prevent ad hoc requirement types from proliferating across later engines.

### Technical

1. Ship Nest-free `@ati/requirement-engine` with public API via `index.ts` only.  
2. Complete the technology-neutral model and pipeline extension contracts.  
3. Prove lifecycle + stub pipeline with unit/contract/lifecycle tests.  
4. Integrate thinly with Spine / Auth / Observability / Context without business logic.  
5. Record deferred parsers, AI, Intake, and persistence explicitly.

---

## Approved Scope

| Area | Binding detail |
|------|----------------|
| **Package** | `packages/requirement-engine` → npm **`@ati/requirement-engine`**; Nest/React/Domain-persistence-free; `index.ts` only (**D1**) |
| **Engine lifecycle** | Init → Ready → Invoke (`runFoundationPipeline`) → Shutdown; does not block LIVE/READY (**D2**) |
| **Public API** | Engine facade, model types, pipeline ports, config load, runtime registration, result/error types |
| **Model** | `Requirement`, `RequirementSection`, `RequirementFragment`, `RequirementMetadata`, `RequirementSourceReference` — format-independent (**D3**) |
| **Pipeline contracts** | Registry + ports for Markdown, FDD, PRD, User Story, future formats — **interfaces only** (**D4**) |
| **Normalization** | `NormalizePort` with default no-op normalizer |
| **Stub only** | Single test/stub parser key allowed to exercise pipeline — not a real Markdown/FDD/PRD/User Story parser (**D4**) |
| **Configuration** | In-memory / env-backed engine config + validation (Zod); runtime port registration (**D5**) |
| **Platform integration** | Thin host-local service + **in-process harness** on `apps/api` and/or `apps/worker`; Auth/Obs/Context coexistence; **no Domain HTTP product APIs** (**D6**) |
| **Tests + docs** | Unit, contract, lifecycle tests; Implementation Report; Deferred Capability Register; WBS/index consistency updates |

---

## Out of Scope

| Item | Status |
|------|--------|
| Document Intake Workflow (WP-3.1) | **Forbidden** |
| Parsing implementations (Markdown/FDD/PRD/User Story) | **Forbidden** |
| LLM / AI extraction / embeddings / vector DB | **Forbidden** |
| Scenario / coverage / blueprint / test case generation | **Forbidden** |
| Persistence / Prisma / database / search / indexing | **Forbidden** |
| Domain Approvals / HITL product | Out |
| AI Runtime approved-field expansion (WP-1.4) | **Forbidden** unless future ADR/WP |
| Spine / Auth / Observability / Context redesign | Out |
| `apps/web` requirement UX | Out |

---

## Architecture Alignment

| Constraint | Binding |
|------------|---------|
| Platform Spine | Consumption only — shared-service style registration; no boot/READY ownership change |
| ADR 0011 | No Intake entry / ARS designation; opaque `RequirementSourceReference` only |
| Shared Infrastructure | Phase 2 package after WP-2.4; Nest-free core |
| Package independence | No Nest/React; no Domain packages; no Prisma |
| Dependency inversion | Hosts depend on `@ati/requirement-engine`; engine does not depend on hosts |
| Context propagation | Invoke options may carry tenant/workspace/correlation ids; no silent cross-tenant merge |
| Observability | Correlation on results; **no** requirement-body metric labels / PII |
| Auth | Any future probe fail-closed when auth enabled; foundation is not AuthZ |

---

## Implementation Contract

### Locked decisions (D1–D7)

| ID | Lock |
|----|------|
| **D1** | Package **`@ati/requirement-engine`** at `packages/requirement-engine`; public API via `index.ts` only |
| **D2** | Lifecycle Init/Ready/Invoke/Shutdown; **must not** block `/health/live` or `/health/ready` |
| **D3** | Model types exactly as named; technology- and format-neutral; not Domain persistence aggregates; subordinate to future ARS (not SoT) |
| **D4** | Format ports registered by key (`markdown`, `fdd`, `prd`, `user_story`, extensible); **no real parsers**; missing registered parser for requested format → **fail-closed**; stub parser allowed for tests only |
| **D5** | Config via validated schema (Zod) + env keys under `ATI_REQUIREMENT_ENGINE_*`; runtime registration in-memory only; **no** DB/Redis |
| **D6** | Host integration = Spine-compatible host-local wiring + **in-process harness**; **no** Domain product routes; HTTP platform probe **not required** (optional only if zero new business surface — default **omit**) |
| **D7** | **No** AI Runtime envelope field changes; **no** Brain engine registration |

### Pipeline (contract shape)

```
RequirementSourceReference + in-memory payload
        → select ParsePort by format key
        → ParsePort → ParseResult
        → NormalizePort (default no-op)
        → Assemble → Requirement
        → EngineResult (success | structured failure)
```

### Model (contract intent)

| Type | Intent |
|------|--------|
| `Requirement` | Structural aggregate (id, sections, metadata, source refs) |
| `RequirementSection` | Ordered section (id, title/kind, fragments) |
| `RequirementFragment` | Atomic unit (id, text/structure hints, optional span) |
| `RequirementMetadata` | Non-format-specific attributes (timestamps, language hint, unset confidence defaults) |
| `RequirementSourceReference` | Opaque identity/version/locator — no binary storage |

### Integration matrix

| Concern | WP-2.5 behaviour |
|---------|------------------|
| Spine | Optional host-local service registration; no ownership redesign |
| Auth | Harness respects existing principal/middleware order; no AuthZ engine |
| Observability | Pass/return correlation id; allow-listed labels only if emitted |
| Context | Accept/propagate execution context on invoke options when provided |
| Persistence | None |

---

## Work Breakdown Structure

| Task | Objective | Deliverables | Dependencies |
|------|-----------|--------------|--------------|
| **T1** | Decision lock / scaffold prep | Confirm D1–D7; package skeleton | This Final Plan |
| **T2** | Package scaffold | `packages/requirement-engine`, build/test scripts, README, `index.ts` | T1 |
| **T3** | Domain model | Types + validation for Requirement / Section / Fragment / Metadata / SourceReference | T2 |
| **T4** | Pipeline contracts | ParsePort, NormalizePort, registry, Assemble, EngineResult, format keys | T2, T3 |
| **T5** | Engine lifecycle + facade | Config load, init/ready/shutdown, `runFoundationPipeline`, fail-closed missing parser | T4 |
| **T6** | Runtime registration | Register/unregister ports; stub parser for tests | T5 |
| **T7** | Platform integration (thin) | Host-local wiring + in-process harness (api and/or worker) with Auth/Obs/Context coexistence | T5, WP-2.2–2.4 |
| **T8** | Tests | Unit + contract + lifecycle; stub pipeline only — **no** parser/AI tests | T3–T7 |
| **T9** | Documentation | Implementation Report; Deferred Register; WBS/roadmap identity consistency | T8 |

**Execution order:** T1 → T2 → T3 ∥ T4 → T5 → T6 → T7 → T8 → T9.

---

## Deliverables

| Deliverable | Required |
|-------------|----------|
| `packages/requirement-engine` (`@ati/requirement-engine`) | Yes |
| Public contracts (engine, model, pipeline, config, registration) | Yes |
| Unit / contract / lifecycle tests | Yes |
| Thin host harness wiring | Yes |
| `WP-2.5_IMPLEMENTATION_REPORT.md` | Yes |
| `WP-2.5_DEFERRED_CAPABILITY_REGISTER.md` | Yes |
| Architecture consistency updates (WBS/indexes cite WP-2.5) | Yes |
| Real format parsers | **No** |
| AI / Intake / DB | **No** |

---

## Risks

| Risk | Mitigation (no scope expansion) |
|------|----------------------------------|
| Future parser evolution pressure | Ports + registry only; real parsers deferred; Independent Review rejects stealth parsers |
| Domain model expansion into SoT / Approvals | Model documented as structural only; Deferred Register for Domain/Approval |
| Premature AI integration points | No AI ports in package; D7 forbids AI Runtime field expansion |
| Pipeline extensibility breakage | Stable format-key registry + fail-closed missing port; additive future keys only |
| Confusion with WP-3.1 Intake | Identity Decision binding; Deferred Register lists Intake Entry separately |
| Requirement body logged as metrics | Obs policy: no body labels; correlation only |

---

## Success Criteria

1. `@ati/requirement-engine` exists, builds, Nest-free, public API via `index.ts`.  
2. Domain model types complete and validated in unit tests.  
3. Pipeline contracts and format extension points exist; **no** real Markdown/FDD/PRD/User Story parsers.  
4. Engine lifecycle works; stub pipeline run succeeds in tests; missing parser fail-closed.  
5. Thin platform integration complete (harness + Auth/Obs/Context coexistence); health unaffected.  
6. Unit, contract, and lifecycle tests pass.  
7. **No** persistence, Prisma, database, AI, LLM, embeddings, search, or Intake workflow.  
8. Implementation Report + Deferred Capability Register complete; WP-2.5 identity used consistently.

---

## Final Readiness Assessment

| Check | Status |
|-------|--------|
| WP identity locked (WP-2.5 / WP-3.1) | Complete |
| Architecture Review observations addressed | Complete (ID via Identity Decision; technical locks D1–D7) |
| Scope frozen / non-goals explicit | Complete |
| WBS T1–T9 sufficient | Complete |
| Dependencies on v2.4 (Auth/Obs/Context/Spine) | Satisfied for planning |
| Implementation Authorization | **Not yet issued** — next gate |

---

## Exit Criteria

This Final Pre-Implementation Plan is the **authoritative implementation baseline** for WP-2.5.

WP-2.5 may proceed to:

**Implementation Authorization**

**only if** this Final Pre-Implementation Plan is **approved**.

Until Implementation Authorization is explicitly granted: do **not** implement code for WP-2.5.

---

## Final Verdict

**APPROVED FOR IMPLEMENTATION AUTHORIZATION**

---

## Planning Status

**WP-2.5 Final Pre-Implementation Plan Complete**

**Ready for Implementation Authorization**

---

*End of WP-2.5 Final Pre-Implementation Plan.*
