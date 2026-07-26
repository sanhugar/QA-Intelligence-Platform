# WP-3.1_PRE_IMPLEMENTATION_PLAN.md
## Pre-Implementation Plan — Intake Entry Workflow

**Work Package:** WP-3.1 — Intake Entry Workflow  
**Role:** ATI Platform Chief Architect  
**Date:** 2026-07-26  
**Status:** Draft — awaiting Architecture Review  
**Implementation:** **Not authorized**

**Phase:** Phase 3 — Knowledge Intake (Business Capability)  
**Platform layer:** Orchestration-owned workflow capability (ADR 0011)  
**Platform baseline:** Stable Development Baseline **v2.5** ([RELEASE_BASELINE_v2.5.md](../releases/RELEASE_BASELINE_v2.5.md))

**Identity lock (binding):** WP-3.1 = **Intake Entry Workflow** · WP-2.5 = Requirement Intelligence Engine Foundation ([WP_IDENTITY_ARCHITECTURE_DECISION.md](./WP_IDENTITY_ARCHITECTURE_DECISION.md)).

**Historical note:** An earlier file at this path described RIE Foundation and was relocated to [WP-2.5_PRE_IMPLEMENTATION_PLAN.md](./WP-2.5_PRE_IMPLEMENTATION_PLAN.md). The historical RIE Architecture Review was relocated to [WP-2.5_ARCHITECTURE_REVIEW.md](./WP-2.5_ARCHITECTURE_REVIEW.md). Intake Architecture Review: [WP-3.1_ARCHITECTURE_REVIEW.md](./WP-3.1_ARCHITECTURE_REVIEW.md).

**Next gate after approval of this plan:** Architecture Review (not implementation).

---

## Executive Summary

WP-3.1 designs the first **business capability** on top of the completed Requirement Intelligence Engine Foundation: the **Intake Entry Workflow**. It accepts requirement-oriented Knowledge Inputs into ATI, registers source identity/version/checksum metadata, validates **declared** document types against a supported format catalog, initializes a governed intake lifecycle, **orchestrates** `@ati/requirement-engine` without implementing parsers or AI, tracks intake status, propagates Auth/Context/Observability signals, and defines failure / retry / idempotency policies for future async execution.

This Work Package **does not** parse document content, extract requirements with LLMs, classify or designate Approved Requirements Source (ARS), persist to a database, or generate scenarios/tests. Classification and ARS designation remain **WP-3.2**. Feature Version / lineage productization remains **WP-3.3**. Real format parsers remain later Shared Infrastructure / format WPs consuming WP-2.5 ports.

The workflow is a **thin orchestration layer**: it owns intake request lifecycle and status; the engine owns structural model and pipeline **contracts**. No business logic that belongs in `@ati/requirement-engine` may be duplicated here.

**Planning Verdict:** **READY FOR ARCHITECTURE REVIEW**

---

## Objectives

### Business objectives

1. Establish Knowledge Intake **entry** for requirement documents under Orchestration ownership (ADR 0011 / ADR 0010 terminology).  
2. Make requirement sources **registerable** with identity, version, and checksum metadata without inventing ARS.  
3. Prepare accepted intakes for **future** parsing, classification, designation, and reasoning — without claiming those capabilities in WP-3.1.  
4. Provide auditable intake status and correlation so operators can track acceptance, deferred capability, and failure.

### Technical objectives

1. Define an Intake Entry workflow package/module with clear public interfaces and request/response models.  
2. Specify validation of **supported document types** (format membership only — no content parse).  
3. Specify orchestration of `@ati/requirement-engine` (invoke / map results / never reimplement ports).  
4. Define workflow state model, error taxonomy, idempotency keys, and **design-only** retry policy.  
5. Integrate thinly with Auth, Context, and Observability foundations; preserve Platform Spine boot/READY ownership.  
6. Leave extension points for future parsers and async/job-bus execution **without** architectural redesign.

---

## Scope

### In scope (planning / later implementation)

| Area | Intent |
|------|--------|
| **Intake request lifecycle** | Create, validate, initialize, transition, complete/fail intake requests |
| **Requirement source registration** | Register source identity, declared format, version, checksum, channel metadata |
| **Supported document type validation** | Allow-list check for Markdown, FDD, PRD, User Story, and extensible future keys |
| **Workflow initialization** | Correlation id, audit metadata, context bind, observability start |
| **Requirement Engine orchestration** | Construct engine inputs from registered source; invoke foundation pipeline facade; map outcomes to intake status |
| **Intake status tracking** | Explicit state machine for accepted / pending capability / failed / rejected |
| **Error handling** | Validation errors vs orchestration errors vs deferred-capability outcomes |
| **Context propagation** | Tenant/workspace/subject from WP-2.4 context; no silent cross-tenant merge |
| **Observability integration** | Correlation ids; status/outcome events; **no** raw document body as metric labels |
| **Audit metadata** | Who/when/source/checksum/correlation recorded on the intake record (in-memory for this WP) |
| **Retry policy (design)** | Document sync fail-fast vs future async retry/backoff — **design only** |
| **Tests (later)** | Unit, workflow-state, orchestration contract, host integration |
| **Documentation (later)** | Implementation Report, Deferred Capability Register, package README |

### Supported sources (validate format only)

| Declared format key | WP-3.1 behaviour |
|---------------------|------------------|
| `markdown` | Validate membership; **do not parse** |
| `fdd` | Validate membership; **do not parse** |
| `prd` | Validate membership; **do not parse** |
| `user_story` | Validate membership; **do not parse** |
| Future keys | Extensible catalog entry; unknown key → reject (fail-closed on catalog) |

Alignment: format keys match WP-2.5 `RequirementFormatKeys` where applicable so future parsers plug into the same vocabulary.

### Proposed deliverables (implementation phase — not this document)

- Intake workflow package/module (name locked in Architecture Review)  
- Workflow interfaces; request/response models; validation layer  
- Workflow state model  
- Thin api/worker host wiring (orchestration surfaces as authorized)  
- Unit + integration tests  
- Implementation documentation + Deferred Capability Register  

---

## Out of Scope

| Capability | Disposition |
|------------|-------------|
| Markdown / FDD / PRD / User Story **parsers** | Forbidden — WP-2.5 ports only; later parser WPs |
| AI extraction / LLM / embeddings / vector DB / search | Forbidden |
| Requirement classification | Deferred — **WP-3.2** |
| ARS designation | Deferred — **WP-3.2** (Orchestration-owned) |
| Scenario / coverage / blueprint / test generation | Forbidden |
| Persistence / Prisma / database / migrations | Forbidden in WP-3.1 |
| Inventing or claiming ARS | Forbidden (WBS / ADR 0011) |
| Duplicating `@ati/requirement-engine` model or ports | Forbidden |
| Expanding AI Runtime Brain registration | Forbidden |
| Redesigning Platform Spine / Auth / Obs / Context | Forbidden |
| Full Knowledge Intake Workflow outputs from ADR §4.1 (classify, structure, designate, route) | **Subset only** — WP-3.1 is **Entry**; later WPs complete the ADR workflow |
| Production use of WP-2.5 test stub as a product parser | Forbidden |

---

## Workflow Responsibilities

### Intake request lifecycle (conceptual)

```
create_request
    → validate_input (schema + format catalog + checksum presence)
    → register_source (identity / version / checksum / declared format)
    → initialize_workflow (correlation, audit, context, obs)
    → orchestrate_engine (invoke @ati/requirement-engine facade)
    → finalize_status (accepted | accepted_pending_parser | failed | rejected)
```

### Responsibility split (binding intent)

| Concern | Owner |
|---------|--------|
| Intake request id, status, audit metadata | **WP-3.1 Intake workflow** |
| Format catalog membership validation | **WP-3.1** |
| Source registration fields (identity/version/checksum) | **WP-3.1** |
| Structural `Requirement*` model, ports, engine lifecycle | **WP-2.5 `@ati/requirement-engine`** |
| Parse/normalize implementation | **Later parser WPs** (not WP-3.1) |
| ARS designation / classification | **WP-3.2** |
| Feature Version / lineage product | **WP-3.3** |

### Engine orchestration rules (for Architecture Review to lock)

1. Intake **must not** reimplement `ParsePort` / `NormalizePort` or assemble competing requirement types.  
2. Intake **may** call `runFoundationPipeline` (or successor facade) with registered source + in-memory payload reference.  
3. When no production parser is registered for the declared format, intake **must not** ship a real parser. Mapping options for Architecture Review:  
   - **O1 (preferred planning default):** Treat engine fail-closed / missing-port as intake status **`accepted_pending_parser`** (deferred capability — not a platform crash).  
   - **O2:** Skip engine invoke until a port exists; record **`registered_awaiting_engine`**.  
   - **O3:** Hard-fail intake on missing parser (discouraged — conflates entry with parser readiness).  
4. Test stub (`stub` format / `ATI_REQUIREMENT_ENGINE_REGISTER_STUB`) remains test/dev only — not a product intake path.  
5. Successful structural assembly (when a future parser exists) yields **`accepted`** with engine result correlation — still **not** ARS designation.

### Status management (illustrative — finalize in Architecture Review)

| Status | Meaning |
|--------|---------|
| `draft` | Request created, not validated |
| `validating` | Schema / catalog / checksum checks |
| `registered` | Source metadata accepted |
| `engine_invoked` | Orchestration in progress |
| `accepted` | Entry complete; structural path succeeded (when applicable) |
| `accepted_pending_parser` | Entry complete; format known; parser capability deferred |
| `rejected` | Invalid input / unsupported format / policy reject |
| `failed` | Unexpected orchestration / infrastructure failure |

### Cross-cutting

| Concern | WP-3.1 expectation |
|---------|-------------------|
| **Correlation IDs** | Required on every intake; propagate to engine invoke options and obs |
| **Audit metadata** | Actor (subject), timestamp, source id, version, checksum, format, terminal status |
| **Failure handling** | Typed errors; no silent swallow; fail-closed on unknown formats |
| **Retry policy** | Design-only: sync path fail-fast; async future may retry **transient** infra errors, never retry deterministic validation rejects without new input |
| **Idempotency** | Design key = tenant/workspace + source identity + version + checksum (Architecture Review locks exact tuple) |
| **Context** | Bind from WP-2.4; intake must not accept client-supplied tenant as authoritative |
| **Auth** | Fail-closed when auth enabled for any exposed host surface |
| **Observability** | Outcome/status counters and correlation; no document-body labels |

---

## Architecture Alignment

| Constraint | Binding |
|------------|---------|
| **ADR 0011** | Knowledge Intake is universal entry; orchestrator stays **thin**; WP-3.1 owns **Entry** slice only — not full §4.1 classify/designate/route |
| **ADR 0010** | Terminology: Knowledge Intake; do not invent ARS in this WP |
| **Platform Spine** | Consumption / thin host registration only; no boot/READY ownership change |
| **Dependency inversion** | Workflow depends on `@ati/requirement-engine` ports/facade; engine must not depend on intake |
| **Technology neutrality** | Workflow core Nest-free preferred; hosts remain thin adapters |
| **Shared Infrastructure boundaries** | Do not move parser/AI/persistence into intake; do not absorb engine model into intake |
| **WP-2.5 reuse** | Orchestrate existing package; zero duplication of model/ports/lifecycle |
| **WP-2.2 / 2.3 / 2.4** | Auth, Observability, Context reused — not redesigned |

### Proposed package placement (open — Architecture Review)

| Option | Sketch | Notes |
|--------|--------|-------|
| **A (preferred sketch)** | `packages/intake` → `@ati/intake` Nest-free workflow core + thin `apps/api` / `apps/worker` wiring | Matches Shared Infrastructure package pattern; keeps orchestration testable without Nest |
| **B** | Host-local module only under `apps/api` | Faster, weaker reuse for worker/async |
| **C** | `modules/knowledge-intake` | Only if module boundary conventions require it |

Architecture Review must lock package name, public API surface, and whether any HTTP Domain route is authorized (default planning stance: **minimal harness or internal API**; avoid premature product UX).

---

## Dependencies

### Must reuse (do not duplicate)

| Dependency | Baseline |
|------------|----------|
| `@ati/requirement-engine` | WP-2.5 / Release Baseline v2.5 |
| Authentication Foundation | WP-2.2 |
| Observability Foundation | WP-2.3 |
| Context Foundation | WP-2.4 |
| Shared packages (`@ati/shared-constants`, logging patterns, etc.) | WP-2.1+ |

### Must not depend on

| Item | Reason |
|------|--------|
| Real format parsers | Not implemented |
| Prisma / DB | Deferred |
| AI Runtime Brain engines | Out of scope |
| WP-3.2 / WP-3.3 packages | Not started; WP-3.1 must not require them |

### Sequencing

- **Prerequisite:** Release Baseline **v2.5** complete (satisfied).  
- **Successor:** WP-3.2 Classification & Designation consumes intake outputs; must not be partially implemented inside WP-3.1.

---

## Risks

| ID | Risk | Impact | Mitigation |
|----|------|--------|------------|
| R1 | Workflow absorbs engine/parser logic | High | Explicit responsibility split; Architecture Review gate; Deferred Register |
| R2 | Future parser integration requires redesign | High | Reuse WP-2.5 format keys + ports; intake only maps status |
| R3 | Long-running processing assumed sync | Medium | Design async/retry/checkpoint hooks now; implement sync path only in WP-3.1 |
| R4 | Error recovery unclear (missing parser vs bad input) | Medium | Distinct statuses (`rejected` vs `accepted_pending_parser` vs `failed`); lock O1/O2/O3 |
| R5 | Idempotency gaps cause duplicate intakes | Medium | Checksum + identity + version idempotency key in design |
| R6 | Premature persistence / ARS claims | High | Explicit non-goals; WBS completion criteria “without inventing ARS” |
| R7 | Stub parser used as production intake | Medium | Forbid stub format on product intake paths |
| R8 | Over-scoping to full ADR §4.1 Intake Workflow | High | Cap WP-3.1 at **Entry**; defer classify/designate/route |
| R9 | Observability leaks document bodies | Medium | Allow-list labels only; carry IR hygiene from WP-2.5 |

---

## Success Criteria

WP-3.1 planning (and later implementation) succeeds when:

1. **Workflow boundaries** are clearly defined (Entry only; not full Knowledge Intake ADR §4.1).  
2. **Engine orchestration** is specified without duplicating WP-2.5 model/ports.  
3. **Responsibilities** are separated: Intake owns request/status/audit; Engine owns structure/pipeline contracts.  
4. **No business logic overlap** with `@ati/requirement-engine` (no parsers, no competing requirement aggregate).  
5. **Future parser integration** can register WP-2.5 ports and advance `accepted_pending_parser` → `accepted` **without** redesigning intake architecture.  
6. Supported formats are **validated**, never parsed, in this WP.  
7. Auth, Context, and Observability are integrated without Spine redesign.  
8. Persistence, AI, classification, ARS designation, and generation engines remain deferred.

---

## Readiness Assessment

| Check | Result |
|-------|--------|
| Platform baseline adequate (v2.5 + Auth/Obs/Context/RIE) | **Yes** |
| Identity unambiguous (WP-3.1 = Intake Entry) | **Yes** |
| ADR 0011 alignment (thin Entry slice) | **Yes** |
| Non-goals explicit (parsers/AI/persistence/ARS) | **Yes** |
| Engine reuse vs duplication specified | **Yes** |
| Open decisions deferred to Architecture Review (package name, O1/O2/O3, HTTP surface) | **Yes** — appropriate for this gate |
| Implementation authorized | **No** — plan only |
| Blocking planning gaps | **None** identified |

**Open items for Architecture Review (non-blocking for this plan gate):**

1. Lock package identity (`@ati/intake` vs alternatives).  
2. Lock missing-parser outcome (**O1** preferred).  
3. Lock idempotency tuple and in-memory registry semantics.  
4. Lock host surface (harness-only vs minimal internal API).  
5. Confirm WP-3.1 completion criteria vs ADR §4.1 full workflow (Entry subset).

---

## Final Verdict

**READY FOR ARCHITECTURE REVIEW**

This Pre-Implementation Plan is sufficient to proceed to Architecture Review. **No implementation** is authorized by this document. **No architecture redesign** is proposed — only a Phase 3 Entry workflow plan consuming existing foundations.

---

## Document Status

| Field | Value |
|-------|--------|
| Plan complete | Yes |
| Verdict | READY FOR ARCHITECTURE REVIEW |
| Next stage | Architecture Review |
| Code / implementation | None |
| Architecture Review produced | No |

---

*End of WP-3.1 Pre-Implementation Plan — Intake Entry Workflow.*
