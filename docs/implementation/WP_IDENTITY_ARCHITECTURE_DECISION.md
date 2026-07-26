# WP_IDENTITY_ARCHITECTURE_DECISION.md
## Architecture Decision — Work Package Identity (Requirement Intelligence Engine Foundation)

**Decision ID:** ATI-WP-IDENTITY-001  
**Role:** ATI Platform Chief Architect  
**Date:** 2026-07-26  
**Inputs:** [WP-3.1_PRE_IMPLEMENTATION_PLAN.md](./WP-3.1_PRE_IMPLEMENTATION_PLAN.md) · [WP-3.1_ARCHITECTURE_REVIEW.md](./WP-3.1_ARCHITECTURE_REVIEW.md)  
**Platform baseline:** Stable Development Baseline **v2.4**  
**Implementation:** Not authorized  

**Authority:** This decision is **binding** for all subsequent governance documents for the Requirement Intelligence Engine Foundation and for Phase 3 Knowledge Intake numbering.

---

## Executive Summary

Architecture Review classified the WP-3.1 title mismatch as a **sequencing issue**, not a Spine/Auth/Obs/Context conflict. Two options were evaluated for placing **Requirement Intelligence Engine Foundation** on the roadmap.

**Decision:** Adopt **Option A**.

| Lock | Value |
|------|--------|
| **Work Package ID** | **WP-2.5** |
| **Work Package title** | **Requirement Intelligence Engine Foundation** |
| **Phase** | Phase 2 — Shared Infrastructure |
| **WP-3.1** | Remains **Intake Entry Workflow** (unchanged) |

Planning artifacts previously labeled “WP-3.1 — Requirement Intelligence Engine Foundation” are hereby **re-identified** as **WP-2.5**. Technical scope from the Pre-Implementation Plan and Architecture Review remains valid under the new ID.

**Final Verdict:** **WP-2.5 APPROVED**

---

## Alternatives Considered

### Option A — Insert WP-2.5 (selected)

- Add **WP-2.5 – Requirement Intelligence Engine Foundation** after WP-2.4 Context.  
- Keep **WP-3.1 – Intake Entry Workflow**.  
- Leave WP-3.2 / WP-3.3 (and later Phase 3 IDs) unchanged.

### Option B — Resequence entire Phase 3

- Make **WP-3.1** = Requirement Intelligence Engine Foundation.  
- Renumber Intake Entry and all subsequent Phase 3 work packages (cascade).

*(Architecture Review Option C is equivalent to this Option B for decision purposes.)*

---

## Evaluation Matrix

| Criterion | Option A (WP-2.5) | Option B (Phase 3 resequence) |
|-----------|-------------------|-------------------------------|
| **Architectural dependency order** | **Strong** — structural Nest-free package after Auth/Obs/Context; before Intake product | Weak — places structural shared substrate inside Knowledge Intake phase numbering |
| **Platform layering** | **Strong** — Shared Infrastructure (Phase 2) matches Foundation `@ati/*` pattern | Mixed — Phase 3 implies Intake/Orchestration product start (ADR 0011) |
| **Governance consistency** | **Strong** — preserves published meaning of WP-3.1 Intake Entry | Weak — breaks existing WBS/ADR-aligned WP-3.1 identity |
| **Documentation impact** | **Low** — add WP-2.5; retitle existing RIE plan/review docs; no Phase 3 cascade | **High** — renumber WP-3.1→3.n across roadmap, WBS, indexes, future citations |
| **Roadmap stability** | **Strong** — Phase 3 IDs stable | Weak — churn on every Phase 3 reference |
| **Future extensibility** | **Strong** — Intake (3.1), designation (3.2), lineage (3.3) stay clear; RIE parsers/AI remain later WPs consuming WP-2.5 | Acceptable technically, but confuses “Phase 3 = Intake” narrative |
| **ADR 0011 (“ATI begins with Knowledge Intake”)** | **Preserved** — Intake remains Phase 3 start for product entry | At risk of misreading — WP-3.1 would no longer be Intake |

**Score preference:** Option A on all primary criteria.

---

## Final Decision

**Option A is selected and locked.**

1. **WP-2.5 – Requirement Intelligence Engine Foundation** is the authoritative Work Package identity for the approved technical scope (engine foundation, technology-neutral model, pipeline contracts, lifecycle; no AI/parsers/persistence/Intake product).  
2. **WP-3.1 – Intake Entry Workflow** remains the authoritative Phase 3 Knowledge Intake start Work Package.  
3. Option B (Phase 3 resequencing) is **rejected**.  
4. Rename-only of WP-3.1 without relocating Intake Entry remains **rejected** (per Architecture Review).

---

## Architectural Justification

1. **Blueprint build order** places shared packages and cross-cutting spine (Auth, observability, tenancy hooks) before Document Management + Knowledge Intake Coordination. A Nest-free requirement structural package is Shared Infrastructure, not Intake product.  
2. **ADR 0011** establishes Knowledge Intake as the universal **entry** for content. That product workflow is WP-3.1. RIE Foundation does not own entry or ARS designation; it must not occupy the Intake WP ID.  
3. **Dependency honesty:** Downstream Scenario Intelligence, Test Design, Coverage Planner, and Blueprint Intelligence depend on Intake designation + understanding paths. They do **not** require Phase 3 renumbering to consume a Phase 2 structural package.  
4. **Layering:** WP-2.5 continues the WP-2.1–WP-2.4 package pattern (`@ati/*`, host wiring thin, no Domain persistence).  
5. **Stability:** Avoids cascading renumber of WP-3.2 Classification & Designation, WP-3.3 Feature Version & Lineage, and all future Phase 3 citations.

---

## Benefits

- Clear separation: **Shared Infrastructure (WP-2.5)** vs **Knowledge Intake (WP-3.1+)**.  
- Preserves governance meaning of existing WP-3.1 / WP-3.2 / WP-3.3 definitions.  
- Minimal documentation churn relative to Option B.  
- Allows RIE Foundation to land on baseline v2.4 substrate immediately after Context without blocking or renaming Intake.  
- Future parser/AI WPs can depend on **WP-2.5** explicitly.

---

## Risks

| Risk | Mitigation |
|------|------------|
| Historical chat/docs still say “WP-3.1 RIE” | Decision Resolution + subsequent plans must use **WP-2.5** only; mark prior filenames as superseded where needed |
| Perception that Phase 2 is “reopened” after v2.4 | Document WP-2.5 as intentional Shared Infrastructure extension, not a v2.4 rewrite |
| Confusion with Requirement Understanding Engine (AI) | Keep WP-2.5 non-goals: no LLM; Understanding remains later WP |

Residual risk of Option B (mass renumber errors) is avoided by rejection.

---

## Roadmap Updates

**Required (documentation governance — not code):**

| Artifact | Required change |
|----------|-----------------|
| `docs/implementation/IMPLEMENTATION_ROADMAP_AND_WBS.md` | Insert **WP-2.5 Requirement Intelligence Engine Foundation** under Phase 2 after WP-2.4; leave WP-3.1–3.3 titles/IDs unchanged |
| `docs/roadmap/ROADMAP.md` (and related indexes) | Reflect WP-2.5; do not retitle WP-3.1 to RIE |
| Pre-Implementation Plan / Architecture Review for RIE | Treat content as **WP-2.5**; next Final Plan / Authorization must be titled **WP-2.5_*** |
| Release / baseline notes | Future baseline that includes RIE Foundation cites **WP-2.5**, not WP-3.1 |

**Explicit non-changes:**

- WP-3.1 remains **Intake Entry Workflow**  
- WP-3.2 remains **Classification & Designation**  
- WP-3.3 remains **Feature Version & Lineage Primitives**  
- No Phase 3 ID cascade

### Locked Phase 2 tail (authoritative)

| ID | Title |
|----|--------|
| WP-2.1 | Shared Packages Baseline |
| WP-2.2 | Authentication & Authorization Foundation |
| WP-2.3 | Observability Baseline |
| WP-2.4 | Tenancy / Workspace Context Baseline |
| **WP-2.5** | **Requirement Intelligence Engine Foundation** |

### Locked Phase 3 head (authoritative — unchanged)

| ID | Title |
|----|--------|
| **WP-3.1** | **Intake Entry Workflow** |
| WP-3.2 | Classification & Designation |
| WP-3.3 | Feature Version & Lineage Primitives |

---

## Governance Impact

| Item | Impact |
|------|--------|
| Next planning artifact | **WP-2.5 Final Pre-Implementation Plan** (and WP-2.5 Decision Resolution for technical open items: package name, probe vs harness, etc.) |
| Implementation Authorization | Must reference **WP-2.5**, not WP-3.1 |
| Prior “WP-3.1_*” RIE filenames | Superseded in identity; content reusable; do not authorize implementation under WP-3.1 for RIE |
| WP-3.1 Intake Entry | Remains available for its own future Pre-Implementation Plan when Phase 3 starts |
| Architecture Review observations | WBS identity observation **resolved** by this decision |

**This decision becomes authoritative for all future governance documents.**

---

## Final Verdict

**WP-2.5 APPROVED**

- Work package locked: **WP-2.5 – Requirement Intelligence Engine Foundation**  
- **WP-3.1** remains **Intake Entry Workflow**  
- Phase 3 resequencing (**Option B**) is **not** approved  

**No code. No architecture redesign.**

---

## Decision Status

**WP Identity Architecture Decision Complete**

**Ready for WP-2.5 Architecture Decision Resolution (technical open items) / Final Pre-Implementation Plan**

---

*End of WP Identity Architecture Decision.*
