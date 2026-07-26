# WP-3.1_ARCHITECTURE_REVIEW.md
## Architecture Review — Requirement Intelligence Engine Foundation

**Work Package (as proposed):** WP-3.1 — Requirement Intelligence Engine Foundation  
**Role:** Independent Principal Enterprise Architect (Architecture Review)  
**Date:** 2026-07-26  
**Input:** [WP-3.1_PRE_IMPLEMENTATION_PLAN.md](./WP-3.1_PRE_IMPLEMENTATION_PLAN.md)  
**Platform baseline:** Stable Development Baseline **v2.4**  
**Implementation:** Not authorized  

**Independence:** Reviewer did not author the Pre-Implementation Plan.

---

## Executive Summary

The proposed **Requirement Intelligence Engine Foundation** is **architecturally sound** as a Nest-free, technology-neutral structural substrate: model types, pipeline ports, engine lifecycle, and thin coexistence with Auth / Observability / Context. Scope control correctly excludes AI/LLM, embeddings, parser implementations, scenario/test generation, and persistence. Alignment with Platform Spine and Shared Infrastructure packaging patterns is acceptable.

The mismatch with the canonical roadmap is **not a mere naming typo**. Canonical WBS **WP-3.1** is *Intake Entry Workflow* (Phase 3 Knowledge Intake). ATI architecture (ADR 0011; Blueprint build order) establishes **Knowledge Intake as the universal entry** before generation/analysis engines. Occupying the WP-3.1 slot with an RIE foundation without a formal WBS update would create a **sequencing / identity conflict**, not a Spine layering violation.

**Classification of the planning observation:** **Work package sequencing issue** (with a naming symptom). **Not** a genuine conflict with Spine/Auth/Obs/Context designs. **Not** resolvable by silently renaming the roadmap title alone while leaving Intake Entry without an ID.

**Final Verdict:** **APPROVED WITH OBSERVATIONS**

Technical design may proceed to Architecture Decision Resolution **only after** the WBS identity / sequencing observation is locked. Do not authorize implementation under an ambiguous WP-3.1 identity.

---

## 1. Architecture Assessment

| Concern | Assessment | Result |
|---------|------------|--------|
| **Platform Spine** | Plan consumes host lifecycle; does not redesign boot/READY; correctly avoids Brain engine registration in this WP | Pass |
| **Shared Packages** | Dedicated Nest-free `@ati/*` package pattern matches WP-2.x; public API via `index.ts` | Pass |
| **Authentication (WP-2.2)** | Foundation is not AuthZ; host probes would coexist with deny-by-default / exact public routes | Pass |
| **Observability (WP-2.3)** | Correlation carry-through; forbids requirement-body metric labels — correct | Pass |
| **Context (WP-2.4)** | Tenant/workspace propagation on invoke; no silent cross-tenant merge | Pass |
| **Layering** | Package Nest/Domain-persistence-free; Nest only in hosts | Pass |
| **ADR 0011 Intake ownership** | Plan correctly does **not** claim ARS designation; accepts opaque Source References | Pass |
| **Requirement Understanding Spec** | Plan positions itself as structural substrate, not Stage 1 AI engine | Pass |
| **Blueprint order** | Structural types before analysis are fine; claiming Phase-3.1 Intake slot is not | Observation (see Roadmap) |

**Engine architecture**

| Element | Review |
|---------|--------|
| Engine boundaries | Clear: ports + assemble + result; no LLM port — Pass |
| Public contracts | Facade + model exports — appropriate for foundation |
| Internal interfaces | Parse / Normalize / Assemble stages — technology-neutral — Pass |
| Requirement model | Requirement / Section / Fragment / Metadata / Source Reference — neutral; must not be treated as Domain SoT or ARS — Pass with observation |
| Pipeline extension points | Registry keys for Markdown/FDD/PRD/User Story without implementations — Pass |

**Technology neutrality:** Confirmed for the proposed model and ports (no Prisma, no provider SDKs, no vector stores).

**Layering violations:** None identified in the technical proposal.

---

## 2. Scope Assessment

| Required inclusion | Plan | Result |
|--------------------|------|--------|
| Engine foundation | Yes | Pass |
| Domain-compatible structural model (not Domain product) | Yes — technology-neutral types | Pass |
| Pipeline contracts / extension points | Yes | Pass |
| Lifecycle | Yes | Pass |

| Required exclusion | Plan | Result |
|--------------------|------|--------|
| AI / LLM | Explicitly out | Pass |
| Embeddings / vector DB / search | Explicitly out | Pass |
| Parsing implementations | Ports only | Pass |
| Scenario generation | Explicitly out | Pass |
| Test case generation | Explicitly out | Pass |
| Persistence / migrations | Explicitly out | Pass |
| Intake entry / ARS designation | Explicitly out | Pass |

**Hidden product features:** None detected. Scope discipline is strong.

**Observation:** Naming the aggregate type `Requirement` must remain subordinate to Approved Requirements Source and future Domain Requirement Object semantics — foundation scaffolding must not imply authority over product truth.

---

## 3. Dependency Assessment

| Future capability | Relationship to this foundation | Order implication |
|-------------------|---------------------------------|-------------------|
| **Knowledge Intake / ARS designation** | Produces Source References / bundles the foundation later consumes | Intake product remains required before generation authority; foundation types may exist earlier |
| **Requirement Understanding (Stage 1 AI)** | Consumer of structured model + evidence contracts | After foundation (+ Intake designation for real runs) |
| **Scenario Intelligence** | Depends on validated requirement understanding / baselines | Downstream of understanding/validation — **not** blocked incorrectly by foundation-first types |
| **Test Design** | Depends on scenarios / requirement baselines | Downstream |
| **Coverage Planner** | Depends on requirement–scenario–case traceability | Downstream |
| **Blueprint Intelligence** | Depends on governed design artifacts | Downstream |

**Conclusion:** As a **structural package**, RIE Foundation may precede Intake **technically**. As a **Phase 3 critical-path Work Package labeled WP-3.1**, it must not displace Intake Entry without explicit WBS resequencing. Downstream Scenario / Coverage / Blueprint / Test Design engines correctly remain later; this plan does not pull them forward.

---

## 4. Roadmap Assessment

| Item | Canonical | Proposed plan |
|------|-----------|---------------|
| **WP-3.1 title** | Intake Entry Workflow | Requirement Intelligence Engine Foundation |
| **Phase intent** | Phase 3 Knowledge Intake start | Shared structural substrate for later requirement analysis |
| **Architecture authority** | ADR 0011 — ATI begins with Knowledge Intake | Correctly excludes Intake ownership in scope, but reuses Intake’s WP ID |

### Determination

| Hypothesis | Finding |
|------------|---------|
| Roadmap **naming** issue only | **Insufficient** — titles describe different capabilities (Intake product vs RIE substrate) |
| Work package **sequencing** issue | **Yes — primary** — WP-3.1 slot is reserved for Intake Entry on the canonical WBS / Blueprint critical path |
| Genuine **architectural conflict** (Spine/Auth/Obs/Context) | **No** — proposed engine foundation does not conflict with closed WP-2.x designs |

### Recommendation (choose one — binding intent for Decision Resolution)

**Primary recommendation: Re-sequence work packages (update WBS IDs).**

Justification:

1. ADR 0011 and Blueprint place **Document Management + Knowledge Intake Coordination** before Requirement Management analysis / Brain engines.  
2. Canonical WBS already assigns **WP-3.1 = Intake Entry Workflow** with completion criteria (registerable inputs, audit/lineage primitives, no inventing ARS).  
3. RIE Foundation is valuable and architecturally welcome, but it is **not** a substitute for Intake Entry.  
4. Silently renaming WP-3.1 to RIE Foundation would orphan Intake Entry and falsify Phase 3 start conditions.  
5. Leaving the roadmap unchanged while implementing RIE under WP-3.1 would create dual conflicting meanings for the same ID.

**Preferred sequencing options (Decision Resolution must pick one):**

| Option | Action |
|--------|--------|
| **A (preferred)** | Assign RIE Foundation as **WP-2.5** (Shared Infrastructure extension after WP-2.4 Context). Keep **WP-3.1 = Intake Entry Workflow**. |
| **B** | Insert RIE Foundation as **WP-3.0** (or similar) immediately before Intake; shift nothing else if Intake remains WP-3.1. |
| **C (only with Product + Architect approval)** | Formally **re-sequence Phase 3**: WP-3.1 = RIE Foundation; move Intake Entry to **WP-3.2** (and cascade subsequent WP-3.x IDs). Update roadmap, WBS, and indexes in the same Decision Resolution. |

**Do not:** Leave roadmap unchanged.

**Rename-only** (change roadmap title of WP-3.1 to RIE Foundation without relocating Intake Entry) is **rejected**.

---

## 5. Observations

1. **WBS identity must be locked before Final Plan** — treat as governance-blocking for Authorization, not as an optional doc nit.  
2. **Model vocabulary** — align Final Plan language with Domain “Requirement Object” / ARS subordination without implementing Domain aggregates.  
3. **Package name** — `@ati/requirement-intelligence` vs `@ati/requirements-engine` remains open (non-blocking).  
4. **Host HTTP probe** — optional; prefer in-process harness if probe surface risks looking like Domain product API.  
5. **AI Runtime field expansion** — default deny unless Decision Resolution explicitly authorizes (preserve WP-1.4 locks).  
6. **Stub parser** — acceptable for tests; must not become a stealth Markdown/FDD implementation.

---

## 6. Recommendations

1. **Architecture Decision Resolution** must select Option A, B, or C above and rewrite the Work Package ID/title accordingly.  
2. Preserve Pre-Implementation Plan **technical scope** (foundation only; non-goals intact).  
3. Update `IMPLEMENTATION_ROADMAP_AND_WBS.md` / roadmap indexes in the same governance pass as Decision Resolution (documentation only).  
4. Keep Intake Entry as an authorized Phase 3 Work Package with ADR 0011 ownership — do not absorb it into RIE Foundation.  
5. Proceed to Final Pre-Implementation Plan only after ID/sequencing lock.

---

## 7. Final Verdict

**APPROVED WITH OBSERVATIONS**

The Requirement Intelligence Engine Foundation design is approved as a planning baseline for Decision Resolution. The WP-3.1 roadmap mismatch is a **sequencing issue** requiring formal WBS re-ID / re-sequence (**not** leave unchanged; **not** rename-only).

**No code. No architecture redesign of Spine/Auth/Obs/Context.**

---

## Review Status

**WP-3.1 Architecture Review Complete**

**Ready for Architecture Decision Resolution** (WBS identity mandatory)

---

*End of WP-3.1 Architecture Review.*
