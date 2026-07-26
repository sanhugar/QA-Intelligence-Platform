# ATI Platform Release Baseline v3.1

## Release Information

| Field | Value |
|-------|-------|
| **Release Name** | ATI Platform Baseline v3.1 |
| **Release Date** | 2026-07-26 |
| **Repository** | QA-Intelligence-Platform |
| **Branch** | `develop` |
| **Baseline Version** | v3.1 |
| **Extends** | Stable Development Baseline **v2.5** |
| **Included Work Package** | WP-3.1 — Intake Entry Workflow |
| **Package** | **`@ati/intake`** |
| **Git Readiness** | [WP-3.1_GIT_READINESS_REVIEW.md](../implementation/WP-3.1_GIT_READINESS_REVIEW.md) — READY FOR COMMIT WITH OBSERVATIONS |
| **Final Verdict** | **RELEASE BASELINE APPROVED WITH OBSERVATIONS** |

---

## Executive Summary

**Purpose.** Establish the Stable Development Baseline for the first Phase 3 business capability: **Intake Entry Workflow** — thin Orchestration-owned entry over the Requirement Intelligence Engine Foundation.

**Capability.** Nest-free `@ati/intake` accepts intake requests, validates structure / format catalog / required metadata (no content inspection), runs a five-state synchronous lifecycle, invokes `@ati/requirement-engine`, records correlation/audit metadata with in-memory idempotency, and exposes thin api/worker harnesses without Domain HTTP product APIs. Missing production parsers terminate as **`accepted_pending_parser`** (O1).

**Architecture.** ADR-0011 Entry slice only (no ARS designation/classification). Platform Spine boot/READY ownership unchanged. Shared Infrastructure boundaries preserved — orchestrates WP-2.5; does not duplicate it.

**Outcome.** WP-3.1 completed the full governance lifecycle through Git Readiness with **no blocking findings** and **no implementation changes** since Git Readiness. This document is the permanent release baseline for WP-3.1.

**Identity lock:** WP-2.5 = Requirement Intelligence Engine Foundation · WP-3.1 = Intake Entry Workflow ([WP Identity Architecture Decision](../implementation/WP_IDENTITY_ARCHITECTURE_DECISION.md)).

---

## Delivered Capability

Release **v3.1** delivers:

| Capability | Status |
|------------|--------|
| `@ati/intake` (`packages/intake`) | Delivered |
| Intake request workflow | Delivered |
| Five-state synchronous lifecycle (`received` → `validated` → `accepted` \| `accepted_pending_parser` \| `failed`) | Delivered |
| Validation layer (structure / catalog / metadata; no content inspection) | Delivered |
| Requirement Engine orchestration | Delivered |
| Correlation IDs | Delivered |
| Context propagation (invoke options / host coexistence) | Delivered |
| Observability hooks | Delivered |
| In-memory execution | Delivered |
| Idempotency support (D8 tuple) | Delivered |
| Thin API / Worker harnesses (no Domain HTTP controllers) | Delivered |

Env: `ATI_INTAKE_ENABLED`.

---

## Architecture Status

| Check | Result |
|-------|--------|
| ADR-0011 (thin Entry; no ARS invention) | **Maintained** |
| Platform Spine (LIVE/READY ownership) | **Preserved** |
| Shared Infrastructure boundaries | **Maintained** — orchestrates `@ati/requirement-engine` |
| Thin orchestration | **Maintained** |
| Technology-neutral Nest-free package core | **Maintained** |

---

## Scope Compliance

| Gate | Result |
|------|--------|
| Final Plan **D1–D8** | **Satisfied** |
| WBS **T1–T8** | **Completed** |
| Authorization **C1–C7** | **Satisfied** |
| Prohibited capabilities (parsers, AI/LLM, persistence, search/embeddings, classification, Feature Version, ARS, generation engines, Domain product HTTP) | **Not implemented** |

Governance timeline (verdicts):

| Stage | Artifact | Verdict |
|-------|----------|---------|
| Implementation | [WP-3.1_IMPLEMENTATION_REPORT.md](../implementation/WP-3.1_IMPLEMENTATION_REPORT.md) | IMPLEMENTATION COMPLETE WITH DEFERRED ITEMS |
| Self Review | [WP-3.1_SELF_REVIEW.md](../implementation/WP-3.1_SELF_REVIEW.md) | PASS WITH OBSERVATIONS |
| Independent Architecture Review | [WP-3.1_INDEPENDENT_ARCHITECTURE_REVIEW.md](../implementation/WP-3.1_INDEPENDENT_ARCHITECTURE_REVIEW.md) | APPROVED WITH OBSERVATIONS |
| Repository Closeout | [WP-3.1_REPOSITORY_CLOSEOUT.md](../implementation/WP-3.1_REPOSITORY_CLOSEOUT.md) | REPOSITORY CLOSED WITH OBSERVATIONS |
| Git Readiness | [WP-3.1_GIT_READINESS_REVIEW.md](../implementation/WP-3.1_GIT_READINESS_REVIEW.md) | READY FOR COMMIT WITH OBSERVATIONS |
| Release Baseline | This document | **RELEASE BASELINE APPROVED WITH OBSERVATIONS** |

Mandatory remediation: **None**.

---

## Quality Summary

| Check | Status |
|-------|--------|
| Build (`@ati/intake`, api, worker) | PASS |
| `@ati/intake` unit/workflow tests | PASS (12) |
| API / Worker intake harness tests | PASS |
| Documentation complete | Yes |
| Deferred Capability Register | [WP-3.1_DEFERRED_CAPABILITY_REGISTER.md](../implementation/WP-3.1_DEFERRED_CAPABILITY_REGISTER.md) |

---

## Deferred Capability Summary

Unchanged from the authoritative register (no new deferred items introduced by this baseline):

- Real Markdown / FDD / PRD / User Story parsers  
- Content inspection / shadow parsing  
- Classification & ARS designation (**WP-3.2**)  
- Feature Version / lineage product (**WP-3.3**)  
- AI / LLM / embeddings / search  
- Persistence / Prisma / database  
- Asynchronous / job-bus execution  
- Domain HTTP product intake APIs  
- Scenario / coverage / blueprint / test generation  
- Full ADR §4.1 classify → designate → route  

Deferred items do **not** reopen WP-3.1 or block this baseline.

---

## Outstanding Observations (non-blocking)

| ID | Note |
|----|------|
| IR-OBS-1–5 | Early-fail audit nuance; thin Auth/Obs hooks; in-memory limits; payload logging hygiene; preserve O1 in future parser WPs |
| GR-OBS-1 | Commit/tag sequencing must respect prior baselines (v2.5 → v3.1) or an explicitly approved combined plan |
| GR-OBS-2 | At commit time exclude `node_modules/`, `dist/`, coverage, and secrets |

**Blocking observations:** None.

---

## Release Assessment

| Objective | Authorized? |
|-----------|-------------|
| Git Commit | **Yes** (this baseline approval) |
| Git Tag **`wp-3.1-complete`** | **Yes** |
| Git Push | **Yes** |

Prerequisite tags for prior baselines (if not already applied): `wp-2.2-complete`, `wp-2.3-complete`, `wp-2.4-complete`, `wp-2.5-complete`.

---

## Next Planned Work Package

| Order | Work Package | Status |
|-------|--------------|--------|
| **Next** | **WP-3.2 — Classification & Designation** | Not started (separate authorization) |

---

## Final Verdict

**RELEASE BASELINE APPROVED WITH OBSERVATIONS**

**Stable Development Baseline v3.1** is approved.

This baseline **authorizes**:

- **Git Commit**  
- **Git Tag:** `wp-3.1-complete`  
- **Git Push**  

Git operations are **not** executed by this document. Implementation code was **not** modified by this baseline issuance.

---

*End of Release Baseline v3.1.*
