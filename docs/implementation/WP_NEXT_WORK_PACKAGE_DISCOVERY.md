# WP_NEXT_WORK_PACKAGE_DISCOVERY.md
## Next Work Package Discovery — Post WP-2.2

**Role:** ATI Platform Governance Lead  
**Date:** 2026-07-26  
**Context:** WP-2.2 complete and Ready for Commit & Tag; discover next planned WP before / alongside WP-2.3 governance.

---

## Next Planned Work Package

| Field | Value |
|-------|-------|
| **Work Package ID** | **WP-2.3** |
| **Official Name** | **Observability Baseline** |
| **Purpose** | Logging, correlation, and basic metrics/traces for hosts and jobs |
| **Business Goal** | Enable operators to diagnose boot and runtime failures across `api` / `worker` using correlated operational signals, without Domain product features — completing the Shared Infrastructure (M2) observability slice after packages (WP-2.1) and identity (WP-2.2) |

**Roadmap / WBS status:** Defined in the Implementation Roadmap & WBS and referenced across product/implementation indexes. Status indexes mark WP-2.3 as **not started** (requires separate authorization). A draft Pre-Implementation Plan also exists in-repo (`WP-2.3_PRE_IMPLEMENTATION_PLAN.md`); it does not replace Architecture Review or implementation authorization.

---

## Scope

Canonical WBS entry does **not** enumerate a full in/out-of-scope list. The following is inferred from the WBS purpose/outcomes/completion criteria plus architecture baselines that WP-2.3 is expected to consume.

### In Scope (inferred from WBS + architecture)

- Structured logging baseline for platform hosts
- Correlation across `apps/api` and `apps/worker`
- Basic metrics and traces (OpenTelemetry-oriented, vendor-neutral exporters per Foundation Architecture)
- Failure-class visibility sufficient for boot/runtime diagnosis
- Host/job operational signals (not Domain/AI product observability meaning)

### Out of Scope (inferred / deferred elsewhere)

- Domain, Workflow, AI-engine, and Integration **product** observability semantics (later WPs / architectures)
- Tenancy / workspace context (WP-2.4)
- Decision/Evidence / security audit product stores (observability complements audit; does not replace)
- SIEM / APM / dashboards-as-product deployments
- AuthN/AuthZ redesign (WP-2.2 closed); auth OTel metrics called out as optional deferred carry-in from WP-2.2 register

---

## Dependencies

| Source | Dependencies stated |
|--------|---------------------|
| **WBS (authoritative)** | **WP-1.3**, **WP-2.1** |
| **Implied / adjacent** | Platform Spine logging/diagnostics shells; Foundation `@ati/logger` / shared types (e.g. `CorrelationId`); WP-2.2 closed for safe identity attributes and optional auth metrics (deferred register) — not listed as hard WBS deps |
| **Not required to start (WBS)** | WP-2.4, Phase 3 Intake, Phase 4 AI providers |

**Expected outcomes (WBS):** Correlated logs across api/worker; failure classes visible.  
**Completion criteria (WBS):** Ops can diagnose boot/runtime failures without Domain features.

---

## Related ADRs

No ADR is titled or numbered specifically for WP-2.3. Consumed / related ADRs and architecture:

| ADR / doc | Relevance |
|-----------|-----------|
| **ADR 0002** — Technology stack foundation | Pino + OpenTelemetry baseline |
| **ADR 0003** — Monorepo modular monolith | Host/package layout |
| **ADR 0013** — Application architecture | Observability as platform package role (API + Worker) |
| **ADR 0014** — Security and governance | Audit vs observability; no secret leakage |
| **ADR 0015** — Implementation readiness / blueprint | Cross-cutting spine includes observability |
| Foundation `ARCHITECTURE.md` §2.7 | Logs, traces/metrics standards |
| Platform Spine Engineering Spec §12 | Observability framework signal taxonomy |
| Security & Governance Architecture §11 | Audit & observability governance |

---

## Planned Deliverables

**Explicitly named in WBS for WP-2.3:** none beyond purpose / outcomes / completion criteria.

**Implied deliverables** (from architecture + prior WP pattern + deferred registers):

- Observability / telemetry baseline (logging + correlation + basic metrics/traces / OTel bindings)
- Host wiring on `apps/api` and `apps/worker`
- Package-level facade(s) consistent with Application Architecture (“Observability” logical package) and existing `@ati/logger`
- Implementation Report + Deferred Capability Register (standard WP delivery pattern)
- Contribution toward **Milestone M2 — Shared Infrastructure baseline** (shared packages, identity, observability, context propagation)

---

## Repository References

Documents that define or reference WP-2.3:

| Document | How it defines / references WP-2.3 |
|----------|-----------------------------------|
| `docs/implementation/IMPLEMENTATION_ROADMAP_AND_WBS.md` | **Canonical definition** — ID, name, purpose, dependencies, outcomes, completion criteria; Phase 2 Shared Infrastructure; Milestone M2 |
| `docs/roadmap/ROADMAP.md` | Points to WBS; status “WP-2.3 not started”; Phase 1b checklist notes Observability baseline as later |
| `docs/implementation/README.md` | Lists WP-2.3 Observability Baseline as not started |
| `README.md` (root) | Status: WP-2.3 not started |
| `docs/development/GETTING_STARTED.md` | Status: WP-2.3 not started |
| `docs/implementation/WP-2.2_REPOSITORY_CLOSEOUT.md` | Next WP = WP-2.3 Observability Baseline |
| `docs/implementation/WP-2.2_GIT_READINESS_REVIEW.md` | Next WP = WP-2.3 |
| `docs/implementation/WP-2.2_IMPLEMENTATION_REPORT.md` | Do not begin WP-2.3 without authorization |
| `docs/implementation/WP-2.2_DEFERRED_CAPABILITY_REGISTER.md` | Defers Observability / OTel auth metrics to WP-2.3 |
| `docs/implementation/WP-2.1_DEFERRED_CAPABILITY_REGISTER.md` | Defers observability stack to WP-2.3 |
| `docs/implementation/WP-2.1_CLOSEOUT_REPORT.md` | Same deferral |
| `docs/implementation/WP-2.1_FINAL_PRE_IMPLEMENTATION_PLAN.md` | Metrics/traces stack → WP-2.3 |
| `docs/implementation/WP-1.4_*` / `WP-1.3_*` / `WP-1.2_*` / `WP-1.1_*` deferred registers & closeouts | Historical deferral of observability stack to WP-2.3 |
| `docs/architecture/ARCHITECTURE.md` | Observability standards (consumed, not WP-numbered) |
| `docs/architecture/APPLICATION_ARCHITECTURE.md` | Observability package role |
| `docs/architecture/SECURITY_AND_GOVERNANCE_ARCHITECTURE.md` | Observability governance |
| `docs/architecture/IMPLEMENTATION_READINESS_AND_TECHNICAL_BLUEPRINT.md` | Build-order cross-cutting observability |
| `docs/engineering/PLATFORM_SPINE_ENGINEERING_SPECIFICATION.md` | §12 Observability Framework |
| `docs/implementation/WP-2.3_PRE_IMPLEMENTATION_PLAN.md` | Draft planning elaboration (not a substitute for WBS; pending Architecture Review) |

**Not found:** dedicated Architecture Roadmap WP-2.3 entry, Release Plan WP entry, or WP-2.3-specific ADR.

---

## Recommendation

**WP-2.3 is partially defined and requires planning.**

Rationale: The Implementation Roadmap & WBS officially names WP-2.3 (**Observability Baseline**) with purpose, dependencies, outcomes, and completion criteria, and architecture documents supply the observability baseline. Full in/out scope, package boundaries, open design decisions, acceptance elaboration, and WBS task breakdown are not fully specified in the canonical WBS entry alone and must be completed through the planning / Architecture Review path before implementation authorization.
