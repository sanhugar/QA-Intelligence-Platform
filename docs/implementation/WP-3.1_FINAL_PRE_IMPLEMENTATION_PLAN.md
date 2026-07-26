# WP-3.1_FINAL_PRE_IMPLEMENTATION_PLAN.md
## Final Pre-Implementation Plan — Intake Entry Workflow

**Work Package:** WP-3.1 — Intake Entry Workflow  
**Role:** ATI Platform Chief Architect  
**Date:** 2026-07-26  
**Status:** **Final** — authoritative implementation baseline (pending Implementation Authorization)  
**Implementation:** **Not authorized**

**Phase:** Phase 3 — Knowledge Intake (Business Capability)  
**Platform layer:** Orchestration-owned Entry workflow (ADR 0011)  
**Package:** **`@ati/intake`** (`packages/intake`)  
**Platform baseline:** Stable Development Baseline **v2.5**

**Governance predecessors**

| Stage | Artifact / result |
|-------|-------------------|
| Pre-Implementation Plan | [WP-3.1_PRE_IMPLEMENTATION_PLAN.md](./WP-3.1_PRE_IMPLEMENTATION_PLAN.md) — READY FOR ARCHITECTURE REVIEW |
| Architecture Review | [WP-3.1_ARCHITECTURE_REVIEW.md](./WP-3.1_ARCHITECTURE_REVIEW.md) — **APPROVED WITH OBSERVATIONS** |
| Identity Decision | [WP_IDENTITY_ARCHITECTURE_DECISION.md](./WP_IDENTITY_ARCHITECTURE_DECISION.md) — WP-3.1 = Intake Entry |

**Identity lock (binding):** WP-3.1 = **Intake Entry Workflow** · WP-2.5 = Requirement Intelligence Engine Foundation.

This document **supersedes** the draft Pre-Implementation Plan for implementation purposes. Architecture Review locks are absorbed below. **No unauthorized scope expansion. No architecture redesign.**

---

## Executive Summary

WP-3.1 delivers the **Intake Entry Workflow** as Nest-free **`@ati/intake`**: a thin orchestration layer that accepts requirement intake requests, validates request structure / supported document format registration / required metadata (**without inspecting document contents**), invokes **`@ati/requirement-engine`**, records intake lifecycle and audit metadata, and propagates Auth / Context / Observability signals.

Missing production parser capability is standardized as terminal status **`accepted_pending_parser`**. Successful structural pipeline completion (when a future production port exists) is **`accepted`**. Invalid input and unexpected faults terminate as **`failed`** with typed reasons.

WP-3.1 **does not** implement parsers, AI, persistence, classification, Feature Version productization, or ARS designation. It **must not** duplicate WP-2.5 model/ports/lifecycle. Execution is **synchronous only**.

**Final Verdict:** **APPROVED FOR IMPLEMENTATION AUTHORIZATION**

---

## Objectives

### Business

1. Establish Knowledge Intake **Entry** under Orchestration ownership (ADR 0011).  
2. Register requirement sources with identity, version, checksum, and declared format — without inventing ARS.  
3. Make deferred parser readiness **operably visible** via `accepted_pending_parser`.  
4. Preserve a clean handoff to WP-3.2 (classification/designation) and later parser WPs.

### Technical

1. Ship Nest-free `@ati/intake` with public API via `index.ts` only.  
2. Implement the approved workflow state model and engine orchestration contract.  
3. Enforce **O1** missing-parser mapping; forbid stub-as-product.  
4. Integrate thinly with Auth, Context, Observability, and `@ati/requirement-engine`.  
5. Prove behaviour with unit / workflow-state / orchestration contract / host integration tests.  
6. Record deferred capabilities explicitly (Deferred Capability Register at implementation).

---

## Approved Scope

| Area | Binding detail |
|------|----------------|
| **Package** | `packages/intake` → npm **`@ati/intake`**; Nest/React/Domain-persistence-free; public API via `index.ts` only (**D1**) |
| **Workflow** | Intake request lifecycle; sync orchestration; status transitions; validation; correlation; audit metadata; error handling (**D2**) |
| **Engine orchestration** | Invoke `@ati/requirement-engine` facade (`runFoundationPipeline` or equivalent); map outcomes per **D4**; never reimplement ports/model (**D3**) |
| **Validation** | Request structure + supported format catalog membership + required metadata only; **no content inspection** (**D5**) |
| **State model** | Exactly the approved states in § Workflow States (**D2**) |
| **Missing parser** | **`accepted_pending_parser`** standard (**D4**) |
| **Registry** | In-memory intake records only; process-local (**D6**) |
| **Host integration** | Thin in-process harness on `apps/api` and/or `apps/worker`; Auth/Obs/Context coexistence; **no Domain HTTP product APIs** by default (**D7**) |
| **Idempotency** | Key locked in Implementation Contract (**D8**) |
| **Tests + docs** | Unit, state-transition, orchestration contract, host integration; Implementation Report; Deferred Capability Register |

---

## Out of Scope

| Item | Status |
|------|--------|
| Markdown / FDD / PRD / User Story **parser implementations** | **Forbidden** |
| Classification (WP-3.2) | **Forbidden** |
| ARS designation (WP-3.2) | **Forbidden** |
| Feature Version / lineage product (WP-3.3) | **Forbidden** |
| AI / LLM / embeddings / vector DB / search | **Forbidden** |
| Scenario / coverage / blueprint / test generation | **Forbidden** |
| Persistence / Prisma / database / migrations | **Forbidden** |
| Asynchronous / job-bus execution | **Forbidden** in WP-3.1 (design hooks only — not implemented) |
| Dedicated “parser” workflow states | **Forbidden** |
| Duplicating `@ati/requirement-engine` types/ports/lifecycle | **Forbidden** |
| Production use of engine test stub as intake success path | **Forbidden** |
| Platform Spine / Auth / Obs / Context redesign | **Forbidden** |
| Full ADR §4.1 classify → designate → route | **Forbidden** (Entry only) |
| `apps/web` intake UX | Out |

---

## Workflow States

### Approved lifecycle (binding)

| State | Kind | Meaning |
|-------|------|---------|
| **`received`** | Transition | Intake request accepted into the workflow; correlation/audit initialized |
| **`validated`** | Transition | Request structure, format catalog membership, and required metadata passed |
| **`accepted`** | **Terminal** | Entry complete; engine structural pipeline succeeded with a **production** parse port |
| **`accepted_pending_parser`** | **Terminal** | Entry complete; format known/valid; engine missing-port / fail-closed mapped per **D4** |
| **`failed`** | **Terminal** | Validation failure, policy/auth/context failure, or unexpected orchestration/infrastructure fault |

### Transition rules (binding)

```
received
  → validated          (validation success)
  → failed             (validation / policy failure)

validated
  → accepted                 (engine success with production port)
  → accepted_pending_parser  (missing production parser / fail-closed mapped)
  → failed                   (unexpected orchestration / infra fault)

No other states. No async wait states. No parser-specific states.
```

### Mapping notes

| Condition | Terminal state |
|-----------|----------------|
| Unknown / unsupported format key | `failed` (reason: `unsupported_format`) |
| Missing required metadata / invalid request structure | `failed` (reason: `validation_error`) |
| Auth enabled and principal missing/invalid on exposed surface | `failed` (reason: `auth_failed`) |
| Engine missing production `ParsePort` for declared format | **`accepted_pending_parser`** |
| Engine fail-closed equivalent for missing parser | **`accepted_pending_parser`** |
| Engine structural success (production port) | **`accepted`** |
| Unexpected engine/host fault | `failed` (reason: `orchestration_error`) |
| Declared format `stub` on product intake path | `failed` (reason: `forbidden_format`) |

Typed failure **reason codes** are required on `failed` (and optional detail on pending) for tests and observability — they are **not** additional workflow states.

---

## Architecture Alignment

| Constraint | Binding |
|------------|---------|
| ADR 0011 | Thin Entry orchestrator only; no ARS invention; no full §4.1 absorption |
| Platform Spine | Consumption / thin host wiring; **must not** block `/health/live` or `/health/ready` |
| Shared Infrastructure | Orchestrates `@ati/requirement-engine`; does not absorb or fork it |
| Dependency inversion | `@ati/intake` → `@ati/requirement-engine`; engine **must not** depend on `@ati/intake` |
| Technology neutrality | Nest-free package core; hosts are thin adapters |
| Auth (WP-2.2) | Fail-closed when auth enabled on any exposed host surface |
| Observability (WP-3) | Correlation required; outcome/status events; **no** document-body metric labels |
| Context (WP-2.4) | Propagate bound tenant/workspace; client-supplied tenant headers are **not** authoritative |

---

## Dependencies

| Dependency | Use |
|------------|-----|
| `@ati/requirement-engine` | Engine facade invoke; format key vocabulary alignment |
| Authentication Foundation | Host surface fail-closed behaviour |
| Context Foundation | Tenant/workspace/subject propagation on invoke |
| Observability Foundation | Correlation + allow-listed outcome labels |
| `@ati/shared-constants` (as needed) | Shared env/key patterns |

**Must not add:** Prisma, AI Runtime Brain registration, new IdP/connector stacks, parser packages.

---

## Risks

| ID | Risk | Mitigation (in contract) |
|----|------|--------------------------|
| R1 | Workflow evolves into full Intake ADR §4.1 | Entry-only scope; Deferred Register; Authorization conditions |
| R2 | Parser logic leaks into validators | **D5** — no content inspection; catalog membership only |
| R3 | Missing parser confused with failure | **D4** — `accepted_pending_parser` mandatory mapping |
| R4 | Retry/async creep | Sync-only; retry design deferred; no async states |
| R5 | State proliferation | Approved five-state model only (**D2**) |
| R6 | Duplicate intakes | Idempotency tuple **D8** |
| R7 | Stub used as product success | Reject `stub` on product path |
| R8 | Coupling / overlap with WP-2.5 | Orchestrate only; no model/port reimplementation (**D3**) |

---

## Success Criteria

Implementation of WP-3.1 is complete when:

1. Workflow boundaries remain clean (Entry orchestration only).  
2. Engine orchestration is implemented against `@ati/requirement-engine`.  
3. **`accepted_pending_parser` behaviour is enforced** for missing production parsers.  
4. **No parser logic** exists in `@ati/intake` or host intake modules.  
5. **No overlap** with WP-2.5 (no duplicated model/ports/lifecycle).  
6. Approved state model is implemented and tested.  
7. Auth, Context, and Observability integration is thin and non-redesigning.  
8. Deferred Capability Register lists parsers, AI, persistence, ARS, classification, Feature Version, async execution.  
9. Build and targeted tests pass per Authorization / Implementation Report gates.

---

## Implementation Contract

### Locked decisions (D1–D8)

| ID | Lock |
|----|------|
| **D1** | Package **`@ati/intake`** at `packages/intake`; public API via `index.ts` only; Nest/React/Prisma-free |
| **D2** | Sync lifecycle only; states exactly: `received` → `validated` → (`accepted` \| `accepted_pending_parser` \| `failed`); plus `received`→`failed` |
| **D3** | Orchestrate `@ati/requirement-engine` only; **no** reimplementation of `Requirement*` model, `ParsePort`, `NormalizePort`, or engine lifecycle |
| **D4** | Missing production parser / engine fail-closed for missing port → terminal **`accepted_pending_parser`**; O2/O3 **rejected**; product path must **invoke** engine (not skip) before mapping |
| **D5** | Validate request structure, supported format registration (`markdown` \| `fdd` \| `prd` \| `user_story` + future catalog keys), and required metadata only; **do not** inspect document contents |
| **D6** | In-memory intake registry only; **no** persistence/migrations/Redis |
| **D7** | Host integration = Spine-compatible thin harness on api and/or worker; **no** Domain product HTTP APIs by default; optional zero-business probe only if Authorization explicitly allows — default **omit** |
| **D8** | Idempotency key = `tenantId` + `workspaceId` + `sourceIdentity` + `sourceVersion` + `checksum` (normalized string join); duplicate submit returns prior terminal record without re-executing side effects |

### Required metadata (minimum)

| Field | Rule |
|-------|------|
| `sourceIdentity` | Required opaque string |
| `sourceVersion` | Required opaque string |
| `checksum` | Required non-empty string (algorithm label optional; if present must be allow-listed) |
| `declaredFormat` | Required; must be in supported catalog |
| `correlationId` | Required (generate if host does not supply) |
| Payload reference | In-memory bytes/text handle for engine invoke — **not** persisted; **not** content-parsed by intake |

### Engine orchestration contract

```
validated intake
  → build RequirementSourceReference + payload handle from registered metadata
  → invoke requirement-engine foundation pipeline (with context + correlation)
  → map:
        production success     → accepted
        missing port/fail-closed → accepted_pending_parser
        unexpected fault       → failed(orchestration_error)
```

### Audit metadata (minimum on record)

Actor/subject (when available), timestamps (`receivedAt`, `terminalAt`), source identity/version/checksum/format, correlation id, terminal state, failure reason code (if `failed`), engine outcome correlation (if invoked).

### Integration matrix

| Concern | WP-3.1 behaviour |
|---------|------------------|
| Spine | Optional host-local registration; no ownership redesign; no LIVE/READY block |
| Auth | Harness respects existing middleware; fail-closed when auth enabled |
| Observability | Emit/propagate correlation; status/outcome allow-list labels only |
| Context | Propagate bound context to engine invoke options |
| Persistence | None |
| Retry | Sync fail-fast; no automatic retries in WP-3.1 |

### Configuration (indicative)

Env keys under `ATI_INTAKE_*` (exact set locked at Authorization/implementation): enable flag for host harness; **must not** enable product stub-parser success paths.

### Work breakdown (implementation phase)

| ID | Item |
|----|------|
| T1 | Scaffold `packages/intake` (`@ati/intake`) |
| T2 | Request/response models + Zod (or equivalent) validation |
| T3 | State model + transitions + in-memory registry + idempotency |
| T4 | Engine orchestration adapter + O1 mapping |
| T5 | Audit + correlation + context/obs hooks |
| T6 | Thin api/worker harness modules |
| T7 | Unit / state / contract / integration tests |
| T8 | Implementation Report + Deferred Capability Register + index sync |

---

## Final Readiness Assessment

| Check | Result |
|-------|--------|
| Architecture Review observations absorbed | **Yes** (package, O1, harness-first, idempotency, five-state model) |
| Implementation contract complete (D1–D8) | **Yes** |
| Scope / non-goals unambiguous | **Yes** |
| Engine vs intake boundaries clean | **Yes** |
| ADR 0011 / Spine / Shared Infrastructure | **Aligned** |
| Blocking open architecture items | **None** |
| Implementation authorized | **No** — requires Implementation Authorization |

---

## Final Verdict

**APPROVED FOR IMPLEMENTATION AUTHORIZATION**

WP-3.1 may proceed to **Implementation Authorization**. This document is the binding implementation contract until Authorization adds conditions. **No code** is authorized by this plan alone.

---

## Document Status

| Field | Value |
|-------|--------|
| Final Plan complete | Yes |
| Verdict | APPROVED FOR IMPLEMENTATION AUTHORIZATION |
| Next stage | Implementation Authorization (not produced here) |
| Code / implementation | None |

---

*End of WP-3.1 Final Pre-Implementation Plan — Intake Entry Workflow.*
