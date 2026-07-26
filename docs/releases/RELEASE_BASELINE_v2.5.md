# ATI Platform Release Baseline v2.5

## Release Information

| Field | Value |
|-------|-------|
| **Release Name** | ATI Platform Baseline v2.5 |
| **Release Date** | 2026-07-26 |
| **Repository** | QA-Intelligence-Platform |
| **Branch** | `develop` |
| **Baseline Version** | v2.5 |
| **Extends** | Stable Development Baseline v2.4 |
| **Included Work Package** | WP-2.5 — Requirement Intelligence Engine Foundation |
| **Git Readiness** | [WP-2.5_GIT_READINESS_REVIEW.md](../implementation/WP-2.5_GIT_READINESS_REVIEW.md) — READY FOR COMMIT WITH OBSERVATIONS |
| **Final Verdict** | **RELEASE BASELINE APPROVED WITH OBSERVATIONS** |

---

## Executive Summary

**Purpose.** Establish the Stable Development Baseline for the Requirement Intelligence Engine (RIE) Foundation as Shared Infrastructure — structural model, pipeline contracts, and engine lifecycle — without delivering Intake product behaviour, AI extraction, or production format parsers.

**Scope.** Nest-free `@ati/requirement-engine`; immutable validated requirement structural types; `ParsePort` / `NormalizePort` contracts with fail-closed missing parsers; engine lifecycle (init → ready → invoke → shutdown); configuration via shared env keys; authorized test-only stub parse port; thin in-process api/worker harnesses (no Domain HTTP APIs).

**Architecture.** Phase 2 Shared Infrastructure extension under the WP-2.5 identity lock. ADR-0011 preserved (Orchestration owns Intake / ARS; WP-2.5 does not claim Intake Entry). Platform Spine boot/READY ownership unchanged. Technology-neutral package boundary; structural `Requirement` is not Domain Requirement Object Source of Truth.

**Outcome.** WP-2.5 completed the full governance lifecycle through Git Readiness with **no blocking findings** and **no implementation changes** since Git Readiness. This document is the permanent release baseline for WP-2.5.

**Identity lock:** WP-2.5 = Requirement Intelligence Engine Foundation · WP-3.1 = Intake Entry Workflow ([WP Identity Architecture Decision](../implementation/WP_IDENTITY_ARCHITECTURE_DECISION.md)).

---

## Governance Timeline

| Stage | Artifact | Verdict |
|-------|----------|---------|
| Identity Architecture Decision | [WP_IDENTITY_ARCHITECTURE_DECISION.md](../implementation/WP_IDENTITY_ARCHITECTURE_DECISION.md) | Binding (WP-2.5 / WP-3.1) |
| Final Pre-Implementation Plan | [WP-2.5_FINAL_PRE_IMPLEMENTATION_PLAN.md](../implementation/WP-2.5_FINAL_PRE_IMPLEMENTATION_PLAN.md) | APPROVED FOR IMPLEMENTATION AUTHORIZATION |
| Implementation Authorization | [WP-2.5_IMPLEMENTATION_AUTHORIZATION.md](../implementation/WP-2.5_IMPLEMENTATION_AUTHORIZATION.md) | APPROVED WITH IMPLEMENTATION CONDITIONS (C1–C7) |
| Roadmap / WBS Synchronization | [WP-2.5_ROADMAP_SYNCHRONIZATION_REPORT.md](../implementation/WP-2.5_ROADMAP_SYNCHRONIZATION_REPORT.md) | Complete |
| Implementation | [WP-2.5_IMPLEMENTATION_REPORT.md](../implementation/WP-2.5_IMPLEMENTATION_REPORT.md) | IMPLEMENTATION COMPLETE WITH DEFERRED ITEMS |
| Deferred Capability Register | [WP-2.5_DEFERRED_CAPABILITY_REGISTER.md](../implementation/WP-2.5_DEFERRED_CAPABILITY_REGISTER.md) | Current |
| Self Review | [WP-2.5_SELF_REVIEW.md](../implementation/WP-2.5_SELF_REVIEW.md) | PASS WITH OBSERVATIONS |
| Independent Architecture Review | [WP-2.5_INDEPENDENT_ARCHITECTURE_REVIEW.md](../implementation/WP-2.5_INDEPENDENT_ARCHITECTURE_REVIEW.md) | APPROVED WITH OBSERVATIONS |
| Repository Closeout | [WP-2.5_REPOSITORY_CLOSEOUT.md](../implementation/WP-2.5_REPOSITORY_CLOSEOUT.md) | REPOSITORY CLOSED WITH OBSERVATIONS |
| Git Readiness Review | [WP-2.5_GIT_READINESS_REVIEW.md](../implementation/WP-2.5_GIT_READINESS_REVIEW.md) | READY FOR COMMIT WITH OBSERVATIONS |
| Release Baseline | This document | **RELEASE BASELINE APPROVED WITH OBSERVATIONS** |

**All mandatory governance gates completed successfully.** Mandatory remediation: **None**.

Historical planning precursors retained as audit trail: `WP-3.1_PRE_IMPLEMENTATION_PLAN.md`, `WP-3.1_ARCHITECTURE_REVIEW.md` (content re-identified as WP-2.5).

---

## Scope Delivered

### `@ati/requirement-engine`

- Nest-free Shared Infrastructure package under `packages/requirement-engine`
- Dependencies limited to `@ati/shared-constants` and `zod`
- Public API via package `index` only

### Domain model

Immutable validated snapshots (`freezeRequirement`):

- `Requirement`, `RequirementSection`, `RequirementFragment`
- `RequirementMetadata`, `RequirementSourceReference`
- Zod validation + freeze semantics

### Pipeline contracts

- `ParsePort`, `NormalizePort`
- Format keys: `markdown`, `fdd`, `prd`, `user_story` (extension points only — **no real parsers**)
- Fail-closed behaviour when a parser is not registered
- `assembleRequirement`, `createNoOpNormalizePort`, `EngineResult` / pipeline input types

### Lifecycle

- Engine lifecycle: init → ready → invoke (`runFoundationPipeline`) → shutdown
- Runtime register / unregister of ports
- Host LIVE/READY semantics unaffected

### Configuration

- `loadRequirementEngineConfig` / `RequirementEngineConfig`
- Env keys: `ATI_REQUIREMENT_ENGINE_ENABLED`, `ATI_REQUIREMENT_ENGINE_REGISTER_STUB`

### Test-only stub parser

- `createStubParsePort` for format key `stub` only
- Authorized for pipeline verification; **not** a production format parser
- Stub registration default off on host harnesses

### Thin API / Worker harnesses

- `apps/api/src/requirement-engine/` — harness + Nest module (**no HTTP controller**)
- `apps/worker/src/requirement-engine/` — harness + Nest module (**no HTTP controller**)
- In-process invoke path only

---

## Architecture Compliance

| Check | Result |
|-------|--------|
| ADR-0011 (no Intake Entry / ARS ownership claimed by WP-2.5) | **Pass** |
| Shared Infrastructure boundaries (Nest-free package; thin hosts) | **Pass** |
| Platform Spine compatibility (boot/READY ownership unchanged) | **Pass** |
| Technology neutrality (structural substrate; no provider/AI coupling) | **Pass** |
| AI Runtime approved fields unchanged (D7) | **Pass** |
| Structural `Requirement` ≠ Domain Requirement Object SoT | **Pass** |
| Authorization conditions C1–C7 / Final Plan locks D1–D7 | **Pass** |

---

## Testing Evidence

Accepted evidence from [WP-2.5 Implementation Report](../implementation/WP-2.5_IMPLEMENTATION_REPORT.md) (not re-executed for this baseline; no code change since Git Readiness):

| Suite | Result |
|-------|--------|
| Build (`shared-constants`, `requirement-engine`, `api`, `worker`) | PASS |
| Unit / contract / lifecycle (`@ati/requirement-engine`) | PASS (9 tests) |
| Host integration (`@ati/api`) | PASS |
| Host integration (`@ati/worker`) | PASS |
| Fail-closed unregistered formats | PASS |
| Stub pipeline + context carry | PASS |
| No real markdown parser in delivery | PASS |

| Quality gate | Status |
|--------------|--------|
| Repository status | Closed (WP-2.5) |
| Git readiness | READY FOR COMMIT WITH OBSERVATIONS |

---

## Deferred Capabilities

Authoritative register: [WP-2.5_DEFERRED_CAPABILITY_REGISTER.md](../implementation/WP-2.5_DEFERRED_CAPABILITY_REGISTER.md).

Confirmed still deferred / excluded from this baseline:

- Real Markdown / FDD / PRD / User Story parsers
- Document Intake Workflow (**WP-3.1**)
- ARS designation / classification
- LLM / AI extraction, embeddings, search / indexing
- Scenario / coverage / blueprint / test generation
- Persistence / Prisma / database
- Domain Approvals / HITL
- AI Runtime envelope expansion / Brain registration
- HTTP Domain / product requirement APIs
- Job-bus requirement continuity

Deferred items do **not** reopen WP-2.5 or block this baseline.

---

## Outstanding Observations

Non-blocking only (from Independent Architecture Review, Repository Closeout, and Git Readiness). Resolved documentation-index sync from Closeout was completed at Git Readiness and is **not** restated.

| ID | Observation | Severity |
|----|-------------|----------|
| IR-OBS-1 | Avoid logging full payload / requirement bodies as metrics or routine logs | Low |
| IR-OBS-2 | Keep stub enablement (`ATI_REQUIREMENT_ENGINE_REGISTER_STUB`) disabled outside tests | Low |
| IR-OBS-3 | Structural type name `Requirement` must not be confused with Domain Requirement Object SoT | Low |
| IR-OBS-4 | Future parser WPs must preserve fail-closed unknown formats; evolve `ParseResult` additively | Low |
| IR-OBS-5 | Jest open-handle force-exit on hosts — inherited informational | Informational |
| GR-OBS-2 | Commit/tag sequencing must respect prior baselines (v2.3 → v2.4 → v2.5) or an explicitly approved combined plan | Process |
| GR-OBS-4 | At commit time, exclude `node_modules/`, `dist/`, coverage, and secrets | Process |

**Blocking observations:** None.

---

## Release Decision

**WP-2.5 is approved as the official platform Stable Development Baseline v2.5.**

This baseline extends **v2.4** with the Requirement Intelligence Engine Foundation while intentionally deferring Intake product workflow, real parsers, AI, and persistence.

Intended annotated tag (when release execution performs Git operations):

- `wp-2.5-complete`

Prerequisite tags for prior baselines (if not already applied): `wp-2.2-complete`, `wp-2.3-complete`, `wp-2.4-complete`.

---

## Next Planned Work Package

Continue per the platform roadmap and [Implementation Roadmap & WBS](../implementation/IMPLEMENTATION_ROADMAP_AND_WBS.md).

| Order | Work Package | Status |
|-------|--------------|--------|
| **Next** | **WP-3.1 — Intake Entry Workflow** | Not started (Phase 3 Knowledge Intake; separate authorization) |

Identity lock remains binding: [WP Identity Architecture Decision](../implementation/WP_IDENTITY_ARCHITECTURE_DECISION.md).

---

## Release Status

**Stable Development Baseline v2.5**

**Final Verdict:** **RELEASE BASELINE APPROVED WITH OBSERVATIONS**

This document is the permanent release record for WP-2.5. Git operations and implementation code changes are outside the scope of this baseline issuance.

---

*End of Release Baseline v2.5.*
