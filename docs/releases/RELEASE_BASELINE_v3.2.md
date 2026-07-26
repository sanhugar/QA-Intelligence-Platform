# ATI Platform Release Baseline v3.2

## Release Information

| Field | Value |
|-------|-------|
| **Release Name** | ATI Platform Baseline v3.2 |
| **Release Date** | 2026-07-26 |
| **Repository** | QA-Intelligence-Platform |
| **Branch** | `develop` |
| **Baseline Version** | v3.2 |
| **Extends** | Stable Development Baseline **v3.1** |
| **Included Work Package** | WP-3.2 — Classification & Designation |
| **Package** | **`@ati/classification`** |
| **Git Readiness** | [WP-3.2_GIT_READINESS_REVIEW.md](../implementation/WP-3.2_GIT_READINESS_REVIEW.md) — READY FOR COMMIT WITH OBSERVATIONS |
| **Final Verdict** | **RELEASE BASELINE APPROVED WITH OBSERVATIONS** |

---

## Executive Summary

**Purpose.** Establish the Stable Development Baseline for Phase 3 Business Intelligence metadata: **Classification & Designation** — deterministic, reusable classification over terminal Intake Entry outcomes.

**Capability.** Nest-free `@ati/classification` evaluates allow-listed intake/engine metadata through a deterministic rule engine and produces canonical **`ClassificationResult` schema v1.0** on three axes: category classification, processing designation, and `knowledgeRole` (Option A: `ars_candidate` | `supporting` | `unknown`). Thin api/worker harnesses expose in-process evaluate APIs without Domain HTTP product surfaces. No AI/ML, persistence, parsers, workflow orchestration, ARS product, HITL, or generation gating.

**Architecture.** ADR-0011 maintained — classification emits metadata only; `ars_candidate` does **not** grant Approved Requirements Source authority. Platform Spine boot/READY ownership unchanged. Shared Infrastructure boundaries preserved — consumes `@ati/intake` / `@ati/requirement-engine` via adapters; does not duplicate either.

**Outcome.** WP-3.2 completed the full governance lifecycle through Git Readiness with **no blocking findings** and **no implementation changes** since Git Readiness. This document is the permanent release baseline for WP-3.2.

**Identity lock:** WP-2.5 = Requirement Intelligence Engine Foundation · WP-3.1 = Intake Entry Workflow · WP-3.2 = Classification & Designation ([WP Identity Architecture Decision](../implementation/WP_IDENTITY_ARCHITECTURE_DECISION.md)).

---

## Included Work Package

| Field | Value |
|-------|-------|
| Work Package | **WP-3.2 — Classification & Designation** |
| Package | **`@ati/classification`** (`packages/classification`) |
| Implementation | **Complete** and governance-approved through Git Readiness |
| Prior baseline | [RELEASE_BASELINE_v3.1.md](./RELEASE_BASELINE_v3.1.md) (`@ati/intake`) |

---

## Delivered Capability

Release **v3.2** delivers:

| Capability | Status |
|------------|--------|
| `@ati/classification` (`packages/classification`) | Delivered |
| Deterministic rule engine (registry, first-match priority, provenance) | Delivered |
| Classification taxonomy (`functional`, `non_functional`, `business`, `technical`, `configuration`, `unknown`) | Delivered |
| Designation taxonomy (`feature`, `enhancement`, `defect`, `technical_debt`, `documentation`, `investigation`, `unknown`) | Delivered |
| `ClassificationResult` schema **v1.0** | Delivered |
| `knowledgeRole` Option A (`ars_candidate` \| `supporting` \| `unknown`) | Delivered |
| Confidence metadata + rule identifiers | Delivered |
| Unknown fail-safe handling | Delivered |
| Metadata allow-list inputs (D7 — no payload body inspection) | Delivered |
| Intake / optional engine structural adapters | Delivered |
| Thin API / Worker harnesses (no Domain HTTP controllers) | Delivered |
| In-memory sync evaluate API | Delivered |

Env: `ATI_CLASSIFICATION_ENABLED`.

---

## Governance Summary

| Stage | Artifact | Verdict |
|-------|----------|---------|
| Pre-Implementation Plan | [WP-3.2_PRE_IMPLEMENTATION_PLAN.md](../implementation/WP-3.2_PRE_IMPLEMENTATION_PLAN.md) | READY FOR ARCHITECTURE REVIEW |
| Architecture Review | [WP-3.2_ARCHITECTURE_REVIEW.md](../implementation/WP-3.2_ARCHITECTURE_REVIEW.md) | APPROVED WITH OBSERVATIONS |
| Final Pre-Implementation Plan | [WP-3.2_FINAL_PRE_IMPLEMENTATION_PLAN.md](../implementation/WP-3.2_FINAL_PRE_IMPLEMENTATION_PLAN.md) | APPROVED FOR IMPLEMENTATION AUTHORIZATION |
| Implementation Authorization | [WP-3.2_IMPLEMENTATION_AUTHORIZATION.md](../implementation/WP-3.2_IMPLEMENTATION_AUTHORIZATION.md) | APPROVED WITH IMPLEMENTATION CONDITIONS (C1–C7) |
| Roadmap Synchronization | [WP-3.2_ROADMAP_SYNCHRONIZATION_REPORT.md](../implementation/WP-3.2_ROADMAP_SYNCHRONIZATION_REPORT.md) | Complete |
| Implementation | [WP-3.2_IMPLEMENTATION_REPORT.md](../implementation/WP-3.2_IMPLEMENTATION_REPORT.md) | IMPLEMENTATION COMPLETE WITH DEFERRED ITEMS |
| Self Review | [WP-3.2_SELF_REVIEW.md](../implementation/WP-3.2_SELF_REVIEW.md) | PASS WITH OBSERVATIONS |
| Independent Architecture Review | [WP-3.2_INDEPENDENT_ARCHITECTURE_REVIEW.md](../implementation/WP-3.2_INDEPENDENT_ARCHITECTURE_REVIEW.md) | APPROVED WITH OBSERVATIONS |
| Repository Closeout | [WP-3.2_REPOSITORY_CLOSEOUT.md](../implementation/WP-3.2_REPOSITORY_CLOSEOUT.md) | REPOSITORY CLOSED WITH OBSERVATIONS |
| Git Readiness | [WP-3.2_GIT_READINESS_REVIEW.md](../implementation/WP-3.2_GIT_READINESS_REVIEW.md) | READY FOR COMMIT WITH OBSERVATIONS |
| Release Baseline | This document | **RELEASE BASELINE APPROVED WITH OBSERVATIONS** |

| Check | Result |
|-------|--------|
| Final Plan **D1–D8** | **Satisfied** |
| WBS **T1–T8** | **Completed** |
| Authorization **C1–C7** | **Satisfied** |
| Mandatory remediation | **None** |
| Architectural drift | **None** |
| ADR-0011 | **Maintained** |
| Platform Spine (LIVE/READY) | **Preserved** |

---

## Quality Summary

| Check | Status |
|-------|--------|
| Build (`@ati/classification`, api, worker) | PASS |
| `@ati/classification` unit / rule / adapter tests | PASS (13) |
| API / Worker classification harness tests | PASS |
| Documentation complete | Yes |
| Deferred Capability Register | [WP-3.2_DEFERRED_CAPABILITY_REGISTER.md](../implementation/WP-3.2_DEFERRED_CAPABILITY_REGISTER.md) |

---

## Deferred Capabilities

Authoritative register: [WP-3.2_DEFERRED_CAPABILITY_REGISTER.md](../implementation/WP-3.2_DEFERRED_CAPABILITY_REGISTER.md).

Deferred items were **intentionally excluded** from this baseline, including:

- ARS **product** capability / authority grant  
- Generation gating / HITL  
- AI / LLM / embeddings / ML classification  
- Persistence / Prisma / database  
- Parser logic / content body inspection  
- Feature Version / lineage (**WP-3.3**)  
- Scenario / coverage / blueprint / test generation  
- Domain HTTP product classification APIs  
- Workflow / intake orchestration  
- External/env remote rule-pack registry  

Deferred items do **not** reopen WP-3.2 or block this baseline.

---

## Known Observations (non-blocking)

| ID | Note |
|----|------|
| SR-OBS / IR-OBS | Env/remote rule packs deferred; no separate confidence-threshold gate; thin Auth/Obs; minimal harness tests; `ars_candidate` ≠ ARS authority education; D7 notes/channel hygiene; `schemaVersion` additive consumer contract |
| GR-OBS-1 | Status indexes may lag (Self Review / Closeout / Git Readiness links) — sync as commit hygiene alongside this baseline |
| GR-OBS-2 | Commit/tag sequencing: Baseline **v3.1** → **v3.2**; tag `wp-3.2-complete` after commit |
| GR-OBS-3 | At commit time exclude `node_modules/`, `dist/`, coverage, and secrets |

**Blocking observations:** None.

---

## Release Assessment

| Objective | Authorized? |
|-----------|-------------|
| Git Commit | **Yes** (this baseline approval) |
| Git Tag **`wp-3.2-complete`** | **Yes** |
| Git Push | **Yes** |

Prerequisite: Stable Development Baseline **v3.1** (tag `wp-3.1-complete` if not already applied).

---

## Next Planned Work Package

| Order | Work Package | Status |
|-------|--------------|--------|
| **Next** | **WP-3.3 — Feature Version & Lineage** (`@ati/feature-version`) | **Repository Closed** — ready for Release Baseline v3.3 ([Git Readiness](../implementation/WP-3.3_GIT_READINESS_REVIEW.md)) |
| Prior | WP-3.2 — Classification & Designation | Released by this baseline (pending Git operations) |
| Prior | WP-3.1 — Intake Entry Workflow | Released — Baseline v3.1 |

---

## Final Verdict

**RELEASE BASELINE APPROVED WITH OBSERVATIONS**

**Stable Development Baseline v3.2** is approved.

This baseline **authorizes**:

- **Git Commit**  
- **Git Tag:** `wp-3.2-complete`  
- **Git Push**  

Git operations are **not** executed by this document. Implementation code was **not** modified by this baseline issuance.

---

*End of Release Baseline v3.2.*
