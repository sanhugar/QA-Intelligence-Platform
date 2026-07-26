# WP-3.1_ARCHITECTURE_REVIEW.md
## Architecture Review — Intake Entry Workflow

**Work Package:** WP-3.1 — Intake Entry Workflow  
**Role:** Independent ATI Platform Architecture Review Board  
**Date:** 2026-07-26  
**Input:** [WP-3.1_PRE_IMPLEMENTATION_PLAN.md](./WP-3.1_PRE_IMPLEMENTATION_PLAN.md)  
**Platform baseline:** Stable Development Baseline **v2.5** ([RELEASE_BASELINE_v2.5.md](../releases/RELEASE_BASELINE_v2.5.md))  
**Implementation:** **Not authorized**

**Independence:** Reviewer did not author the Pre-Implementation Plan.  
**Identity lock:** WP-3.1 = Intake Entry · WP-2.5 = RIE Foundation ([WP_IDENTITY_ARCHITECTURE_DECISION.md](./WP_IDENTITY_ARCHITECTURE_DECISION.md)).

**Historical note:** A prior file at this path reviewed RIE Foundation and was relocated to [WP-2.5_ARCHITECTURE_REVIEW.md](./WP-2.5_ARCHITECTURE_REVIEW.md).

---

## Executive Summary

The proposed **Intake Entry Workflow** is **architecturally sound** as a Phase 3 Orchestration-owned **Entry** capability: thin lifecycle orchestration over `@ati/requirement-engine`, format-catalog validation without parsing, source registration with identity/version/checksum, status tracking, and reuse of Auth / Context / Observability — without persistence, AI, ARS designation, or duplication of WP-2.5 model/ports.

ADR 0011 is respected by capping scope to the **Entry** slice of Knowledge Intake (not the full §4.1 classify → designate → route workflow). Platform Spine ownership is preserved. Shared Infrastructure boundaries are preserved: parsers remain on WP-2.5 ports for later format WPs; classification/ARS remain WP-3.2; Feature Version/lineage remain WP-3.3.

**Missing-parser behaviour:** Option **O1 — `accepted_pending_parser`** is **adopted as the architectural standard** for WP-3.1 (see § Missing Parser Decision).

Residual items (exact host HTTP surface, idempotency tuple literal, package README naming polish) belong in Final Pre-Implementation Plan / Authorization — they do **not** require architecture revision.

**Final Verdict:** **APPROVED WITH OBSERVATIONS**

---

## Architecture Assessment

| Dimension | Assessment |
|-----------|------------|
| Problem framing | **Sound** — first business capability on RIE foundation; Entry ≠ Understanding ≠ Designation |
| Orchestration vs engine split | **Sound** — intake owns request/status/audit; engine owns structure/ports/lifecycle |
| Scope control | **Strong** — parsers/AI/persistence/ARS/generation explicitly excluded |
| ADR 0011 Entry subset | **Sound** — correctly refuses full §4.1 absorption into WP-3.1 |
| Dependency on v2.5 | **Adequate** — Auth, Obs, Context, `@ati/requirement-engine` available |
| Premature productization risk | **Managed** — in-memory registry; harness/minimal surface preferred |
| Identity clarity | **Pass** — WP-3.1 no longer contested with RIE |

**Challenge — sequencing language in some external prompts:** Framing “parser framework as WP-3.2” or “normalization as WP-3.3” **conflicts** with the locked WBS (WP-3.2 = Classification & Designation; WP-3.3 = Feature Version & Lineage). This review **rejects** that remapping. Parser implementations remain **later format / Shared Infrastructure WPs** consuming WP-2.5 ports. Normalization port already exists in WP-2.5 as a contract (`NormalizePort`); WP-3.1 must not re-own it.

---

## Boundary Verification

| Requirement | Result | Notes |
|-------------|--------|-------|
| Orchestrates Requirement Engine | **Pass** | Invoke facade; map outcomes to intake status |
| Does not duplicate WP-2.5 functionality | **Pass** | No competing `Requirement*` aggregate or port reimplementation |
| Does not introduce parser logic | **Pass** | Format catalog membership only |
| Does not introduce AI | **Pass** | Explicit non-goal |
| Does not introduce persistence | **Pass** | In-memory intake records for this WP |
| Does not invent / designate ARS | **Pass** | Deferred to WP-3.2 |
| Does not use stub as product parser | **Pass** | Forbidden on product intake paths |

**Boundary residual risk:** Over-eager “engine orchestration” that embeds parse heuristics in intake validators. **Mitigation:** validators check declared format key + checksum/schema only; content inspection beyond length/encoding gates (if any) must not become a shadow parser — lock in Final Plan.

---

## Layering Verification

| Constraint | Result |
|------------|--------|
| ADR 0011 (thin orchestrator; Knowledge Intake entry) | **Pass** — Entry slice only |
| Platform Spine (no boot/READY ownership change) | **Pass** |
| Shared Infrastructure boundaries | **Pass** — consumes `@ati/requirement-engine`; does not absorb it |
| Phase 3 Business Capability responsibilities | **Pass** — first Orchestration workflow capability |
| Dependency inversion (workflow → engine, not reverse) | **Pass** |
| Technology neutrality | **Pass** — Nest-free workflow core preferred |

### Package placement (locked recommendation)

| Decision | Lock |
|----------|------|
| Package | **`packages/intake` → `@ati/intake`** (Nest-free workflow core) |
| Hosts | Thin `apps/api` and/or `apps/worker` wiring only |
| HTTP Domain product APIs | **Not required** for WP-3.1; default **harness / internal invoke**; any probe must not invent ARS or parse |

Final Plan may refine module filenames; package identity **`@ati/intake`** is the Architecture Review preference and should be treated as the default lock unless Authorization records an equivalent rename with rationale.

---

## Workflow Design Assessment

| Area | Assessment |
|------|------------|
| Intake lifecycle | **Appropriate** — create → validate → register → initialize → orchestrate → finalize |
| Validation flow | **Appropriate** — schema + format catalog + checksum presence; fail-closed unknown formats |
| Engine invocation | **Appropriate under O1** — invoke foundation pipeline; map missing-port/fail-closed to `accepted_pending_parser` |
| Status model | **Appropriate** — distinguishes `rejected`, `failed`, `accepted`, `accepted_pending_parser` |
| Context propagation | **Appropriate** — WP-2.4 bind; client tenant headers non-authoritative |
| Error handling | **Appropriate** — typed taxonomy required in Final Plan |
| Retry strategy | **Appropriate as design-only** — sync fail-fast; async retries only for transient infra later |

**Responsibility assignment:** Correct. No finding that intake should own structural assembly or that the engine should own intake status.

**Observation:** Intermediate statuses (`draft`, `validating`, `registered`, `engine_invoked`) are useful for observability; Final Plan should mark which are durable terminal vs ephemeral transition states for tests.

---

## Missing Parser Decision

### Options reviewed

| Option | Behaviour | UX | Extensibility | Failure semantics | Ops visibility | Consistency |
|--------|-----------|----|---------------|-------------------|----------------|--------------|
| **O1** | Invoke engine; map missing parser → **`accepted_pending_parser`** | Entry succeeds; capability gap explicit | Parsers later flip status without redesign | Not conflated with `rejected`/`failed` | Engine path + deferred reason observable | Aligns Entry ≠ Parser-ready |
| **O2** | Skip invoke; `registered_awaiting_engine` | Similar | Weaker proof that orchestration wiring works | Clean but hides engine contract | Lower | Diverges from “orchestrate engine” objective |
| **O3** | Hard-fail intake on missing parser | Poor until all parsers ship | Couples Entry to parser roadmap | Conflates validation with capability readiness | Noisy failures | Rejects ADR Entry-first posture |

### Decision (locked)

**`accepted_pending_parser` (O1) is the architectural standard for WP-3.1.**

**Binding rules:**

1. Declared format **in catalog** + valid registration metadata → intake may complete Entry successfully even when no production `ParsePort` is registered.  
2. WP-3.1 **shall invoke** the engine facade (not skip) so missing-port / fail-closed is observed and mapped to **`accepted_pending_parser`**.  
3. **`rejected`** is reserved for invalid input, unknown format keys, auth/context policy failures.  
4. **`failed`** is reserved for unexpected infrastructure / orchestration faults.  
5. **`accepted`** is reserved for successful structural pipeline completion when a real production port exists (future).  
6. Test stub format / stub registration **must not** be used to force `accepted` on product intake paths.  
7. Future parser WPs register ports on `@ati/requirement-engine`; intake architecture **must not** require redesign to advance `accepted_pending_parser` → `accepted`.

**O2** and **O3** are **rejected** for WP-3.1.

---

## Dependency Review

| Dependency | Use | Unnecessary new platform dependency? |
|------------|-----|--------------------------------------|
| `@ati/requirement-engine` | Orchestration target | **No** — required |
| Authentication Foundation (WP-2.2) | Fail-closed host surfaces | **No** |
| Context Foundation (WP-2.4) | Tenant/workspace propagation | **No** |
| Observability Foundation (WP-2.3) | Correlation / outcome events | **No** |
| Shared constants / logging | Config keys, shared patterns | **No** |
| Prisma / new data stores | — | **Must not introduce** |
| AI Runtime / Brain engines | — | **Must not introduce** |
| New IdP / connector stacks | — | **Must not introduce** |

No new foundational platform dependency is justified beyond `@ati/intake` itself as the workflow package.

---

## Future Extensibility (without scope expansion)

| Future concern | Readiness under this design |
|----------------|----------------------------|
| Parser implementations (later format WPs — **not** WP-3.2) | **Ready** — WP-2.5 ports + O1 status transition |
| WP-3.2 Classification & Designation | **Ready** — consumes registered intake identity; Entry does not invent ARS |
| WP-3.3 Feature Version & Lineage | **Ready** — checksum/identity/version metadata on intake supports lineage hooks |
| Async / job-bus execution | **Hooked** — retry/idempotency design-only; sync path in WP-3.1 |
| Event-driven processing | **Compatible** — terminal statuses are event-emit candidates later; not implemented now |

**Correction to mis-sequenced assumptions:** Do **not** treat WP-3.2 as “parser framework” or WP-3.3 as “requirement normalization product.” Those titles are locked elsewhere.

---

## Risk Assessment

| ID | Class | Risk | Severity | Mitigation (no scope expansion) |
|----|-------|------|----------|----------------------------------|
| AR-R1 | Architectural | Intake grows into full ADR §4.1 workflow | High | Entry-only gate in Final Plan / Authorization; Deferred Register |
| AR-R2 | Coupling | Intake embeds parse/normalize logic | High | Depend only on engine facade; forbid content-structure inference |
| AR-R3 | Workflow | Missing-parser confused with failure | Medium | **O1 locked**; distinct statuses + ops docs |
| AR-R4 | Operational | Document bodies in logs/metrics | Medium | Obs allow-list; no payload labels (carry WP-2.5 hygiene) |
| AR-R5 | Operational | In-memory registry loss after process restart | Low (accepted) | Explicit non-persistence; document limitation |
| AR-R6 | Workflow | Idempotency tuple underspecified | Medium | Final Plan must lock exact key fields |
| AR-R7 | Coupling | Stub enabled in non-test deploys | Medium | Product path rejects `stub`; env default off |
| AR-R8 | Architectural | Premature Domain HTTP / UX | Medium | Harness-first; Authorization condition |

---

## Recommendations

| Priority | Recommendation |
|----------|----------------|
| **Mandatory before implementation** | Carry **O1 `accepted_pending_parser`** into Final Plan / Authorization as a locked decision |
| **Mandatory before implementation** | Keep parsers/AI/persistence/ARS out of WP-3.1 Deferred Capability Register |
| **Recommended** | Default package **`@ati/intake`**; thin host harness; omit Domain product routes unless Authorization explicitly adds a zero-business probe |
| **Recommended** | Final Plan lock idempotency tuple and terminal vs transition statuses |
| **Recommended** | Architecture Decision Resolution only if package name or host surface disputes arise — otherwise Final Plan may absorb locks |
| **Do not** | Remap WP-3.2/WP-3.3 titles to parser/normalization |
| **Do not** | Authorize implementation from this review alone |

---

## Final Verdict

**APPROVED WITH OBSERVATIONS**

WP-3.1 Intake Entry Workflow may proceed to **Final Pre-Implementation Plan** / Implementation Authorization path.

### Locked by this Architecture Review

| Lock | Value |
|------|--------|
| Missing-parser standard | **`accepted_pending_parser` (O1)** — **adopted** |
| O2 / O3 | Rejected |
| Package default | `@ati/intake` at `packages/intake` |
| Scope | Entry orchestration only; no parsers/AI/persistence/ARS |
| Engine relationship | Orchestrate `@ati/requirement-engine`; do not duplicate |

### Observations (non-blocking)

1. Exact HTTP/host surface and idempotency tuple remain for Final Plan.  
2. Ephemeral vs terminal status set needs test-facing precision in Final Plan.  
3. External “WP-3.2 = parsers” framing is incorrect under locked WBS — do not carry forward.  
4. In-memory registry operational limits must remain explicit in Deferred Register / Known Limitations.

**Implementation is not authorized by this document.**

---

## Review Status

| Field | Value |
|-------|--------|
| Architecture Review complete | Yes |
| Final Verdict | APPROVED WITH OBSERVATIONS |
| `accepted_pending_parser` adopted as WP-3.1 standard | **Yes** |
| Next stage | Final Pre-Implementation Plan (not produced here) |
| Code / implementation | None |

---

*End of WP-3.1 Architecture Review — Intake Entry Workflow.*
