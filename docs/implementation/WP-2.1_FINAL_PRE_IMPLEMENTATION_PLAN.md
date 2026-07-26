# WP-2.1_FINAL_PRE_IMPLEMENTATION_PLAN.md  
## Final Pre-Implementation Plan — Shared Packages Extraction

**Work Package ID:** WP-2.1  
**Status:** **Archived** — approved Final Pre-Implementation Plan (audit record). Implementation authorized, delivered, Independent Architecture Review approved, and closed under WP-2.1.  
**Role:** ATI Platform Implementation Engineer (Architecture Consumer)  
**Archive note:** Persisted at Repository Closeout for auditability (Independent Review observation O1).

**Prerequisite tags:** `wp-1.1-complete` · `wp-1.2-complete` · `wp-1.3-complete` · `wp-1.4-complete`

---

## 1. Objective

Populate the Foundation `packages/*` baseline and extract only **pure, framework-independent reusable logic** from `apps/api` and `apps/worker` so both hosts consume `@ati/*` packages instead of duplicated helpers.

WP-2.1 is a **refactoring / extraction** work package. Preserve WP-1.x behaviour exactly. Introduce no new platform capabilities. Do not redesign Platform Spine ownership or boot semantics.

---

## 2. Architecture Consumed

| Order | Document |
|------:|----------|
| 1 | `ARCHITECTURE_BASELINE_STATUS.md` |
| 2 | `IMPLEMENTATION_ROADMAP_AND_WBS.md` (WP-2.1) |
| 3 | `ARCHITECTURE.md` §3, §6 (Foundation packages) |
| 4 | `APPLICATION_ARCHITECTURE.md` §4 (package roles; no Domain in packages) |
| 5 | `IMPLEMENTATION_READINESS_AND_TECHNICAL_BLUEPRINT.md` |
| 6 | `CODING_STANDARDS.md` |
| 7 | `IMPLEMENTATION_WORKFLOW.md` / `CURSOR_DEVELOPMENT_CONTRACT.md` |
| 8 | `PLATFORM_SPINE_ENGINEERING_SPECIFICATION.md` |
| 9 | WP-1.2–WP-1.4 deferred registers (packages deferred to WP-2.1) |
| 10 | Approved decisions **D1–D9** (this resolution) |

---

## 3. Scope

### In scope

| Item | Detail |
|------|--------|
| Foundation packages only (**D2**) | `@ati/shared-types`, `@ati/shared-constants`, `@ati/shared-utils`, `@ati/shared-validation`, `@ati/config`, `@ati/logger`, `@ati/errors` |
| Pure helper extraction (**D1**, **D9**) | Framework-free logic used by api+worker, or explicitly Foundation-defined |
| Host consumption (**D5**) | Wire `apps/api` and `apps/worker` only |
| Validation package (**D6**) | Minimal primitives, config schemas, shared helpers — no app-specific validation |
| Shared types (**D7**) | Stable cross-host types only; Spine runtime types stay host-local |
| Errors (**D8**) | `AppError`, shared codes, mapping helpers; host errors extend/wrap |
| Behaviour preservation (**D4**) | Identical boot, READY, registration, AI Runtime, public APIs, tests |
| Docs | Implementation report, deferred register, package README/usage updates, roadmap |

### Host-local (must remain under `apps/*/src/spine/`) — **D1**

- `PlatformHostBootstrap`
- Registration Coordinator / Platform Registry / extension catalogs
- AI Runtime Host + stub engine runtime
- Platform lifecycle / boot sequence management
- Host startup logic (`main.ts` orchestration)

### Out of package creation

Do **not** create `@ati/spine`, `@ati/runtime`, `@ati/bootstrap`, AI Contracts, Domain, Observability, Security, Integration, or Workflow packages.

### Web

Do **not** modify `apps/web` unless absolutely required for workspace compilation (**D5**).

---

## 4. Files to Create

### Per approved package (`packages/{shared-types|shared-constants|shared-utils|shared-validation|config|logger|errors}/`)

| Path | Purpose |
|------|---------|
| `package.json` | `@ati/{name}`, exports, scripts |
| `tsconfig.json` | Package TypeScript config |
| `src/index.ts` | Public API |
| `src/**/*.ts` | Extracted pure implementations |
| `src/**/*.spec.ts` | Package unit tests |
| `README.md` | Update stub → usage (implementation phase) |

### Documentation (implementation phase)

| Path | Purpose |
|------|---------|
| `docs/implementation/WP-2.1_IMPLEMENTATION_REPORT.md` | Report |
| `docs/implementation/WP-2.1_DEFERRED_CAPABILITY_REGISTER.md` | Deferred |

---

## 5. Files to Modify

| Path | Change |
|------|--------|
| `apps/api/package.json`, `apps/worker/package.json` | Add `@ati/*` workspace dependencies |
| `apps/api` / `apps/worker` tsconfig as needed | Project references / resolution for workspace packages |
| `apps/*/src/spine/**` (helpers only) | Import from packages; remove duplicated pure logic |
| Host error classes | Extend/wrap `@ati/errors` (**D8**) |
| `turbo.json` / root scripts if needed | Package build/test in pipeline |
| Roadmap, Getting Started, indexes, package/app READMEs | Status after implementation |

**Do not modify:** `docs/architecture/**`, `apps/web/**` (except absolute workspace compile necessity).

---

## 6. Final Design Decisions (D1–D9)

| ID | Decision |
|----|----------|
| **D1** | Extract pure reusable logic only; Spine orchestration stays host-local; no `@ati/spine` / `@ati/runtime` / `@ati/bootstrap` |
| **D2** | Only the seven Foundation packages listed above |
| **D3** | Framework-independent packages — no Nest/React/Express/Fastify/Axios/infra frameworks |
| **D4** | Behaviour-preserving refactor only |
| **D5** | Migrate api + worker only; web untouched unless compile-required |
| **D6** | `@ati/shared-validation` minimal (primitives, config schemas, helpers) |
| **D7** | `@ati/shared-types` = stable cross-host types only; registration/AI Runtime/bootstrap models stay host-local |
| **D8** | `@ati/errors` = `AppError` + codes + mappers; host errors extend/wrap |
| **D9** | Package code only if used by ≥2 apps **or** explicitly Foundation-defined; avoid over-extraction |

---

## 7. Risks

| Risk | Mitigation |
|------|------------|
| Accidental Spine move into packages | **D1** hard stop list; review imports |
| Behaviour drift | **D4** — full WP-1.2–1.4 host suites must stay green |
| Over-extraction of single-host helpers | **D9** gate before each move |
| Framework leakage into packages | **D3** — dependency lint / review |
| Broadening `shared-types` into Spine ownership | **D7** — runtime models stay host-local |
| Pulling Auth/OTel/AI contracts | **D2** — out of scope |
| Web churn | **D5** — no web migration |

### Package dependency graph (approved)

```
@ati/shared-constants ──┐
@ati/shared-types ──────┼──► @ati/shared-utils
                        ├──► @ati/shared-validation
                        ├──► @ati/errors
@ati/config  ◄──────────┘   (may use errors, shared-types, shared-validation)
@ati/logger                 (may use shared-types / shared-utils; no Nest)
```

Apps → packages. Packages ↛ apps. No cycles.

---

## 8. Acceptance Criteria

1. Exactly the seven Foundation `@ati/*` packages exist as real workspace packages with explicit `exports`.  
2. Packages contain no Nest/React/Express/Fastify/Axios (or other infra framework) imports (**D3**).  
3. `apps/api` and `apps/worker` consume packages for extracted concerns; duplicated pure helpers removed where extraction applied.  
4. Spine orchestration remains under `apps/*/src/spine/` (**D1**).  
5. Host-specific errors still exist and extend/wrap `@ati/errors` (**D8**).  
6. Registration / AI Runtime / bootstrap runtime types remain host-local (**D7**).  
7. Boot sequence, Platform READY, registration, AI Runtime Host behaviour, and public HTTP APIs unchanged (**D4**).  
8. All existing `@ati/api` and `@ati/worker` tests pass; new package tests pass.  
9. `apps/web` unmodified unless forced by workspace compilation (**D5**).  
10. No Domain / AI / Observability / Security / Integration packages created (**D2**).  
11. Documentation + deferred register complete; architecture docs unmodified.  

---

## 9. Out of Scope

| Item | Deferred to |
|------|-------------|
| `@ati/spine` / runtime / bootstrap packages | Never in WP-2.1 (**D1**) |
| AI Contracts, Domain, Observability, Security, Integration, Workflow packages | Later WPs (**D2**) |
| OIDC / Auth | WP-2.2 |
| Metrics/traces product stack | WP-2.3 |
| Tenancy context | WP-2.4 |
| `apps/web` feature migration | Later (**D5**) |
| Behavioural / API changes | Forbidden (**D4**) |
| Redis/BullMQ/DB/providers/Orchestration | Later |

---

## 10. Architecture Compliance Checklist

| Check | Result |
|-------|--------|
| Baseline frozen / no redesign | Pass |
| Foundation package names only (**D2**) | Pass |
| Pure extraction; Spine host-local (**D1**) | Pass |
| Framework-independent packages (**D3**) | Pass |
| Behaviour preserved (**D4**) | Pass |
| api/worker only (**D5**) | Pass |
| Minimal validation (**D6**) | Pass |
| Shared-types not Spine-owned (**D7**) | Pass |
| Host errors wrap shared base (**D8**) | Pass |
| Stability rule / no over-extraction (**D9**) | Pass |
| No outstanding architectural ambiguities | Pass |

---

## 11. Implementation Sequence

1. Scaffold all seven packages (`package.json`, tsconfig, exports, empty public API).  
2. Implement `@ati/errors` (`AppError`, codes, mappers).  
3. Implement `@ati/shared-types` / `@ati/shared-constants` / `@ati/shared-utils` (stable cross-host only).  
4. Implement `@ati/shared-validation` (minimal primitives + config schemas).  
5. Implement `@ati/config` helpers from pure ConfigurationService logic.  
6. Implement `@ati/logger` facade/redaction/level helpers from pure LoggerService logic.  
7. Update host errors to extend/wrap `@ati/errors`.  
8. Point `apps/api` then `apps/worker` at packages; delete extracted duplicates.  
9. Keep Spine orchestration files host-local; only change imports for helpers.  
10. Run package tests + full api/worker regression.  
11. Docs, deferred register, Self Review.  

---

## 12. Testing Strategy

| Suite | Cases |
|-------|--------|
| Package unit tests | Config parse helpers, redact/level, AppError/codes, utils, validation primitives |
| Host regression | All WP-1.2 registration, WP-1.3 shared services, WP-1.4 AI Runtime tests green |
| Bootstrap | Boot order and Platform READY unchanged |
| Boundary | Packages must not import forbidden frameworks |
| Web | No behavioural tests; only fix compile if workspace forces it |

---

## 13. Dependencies

| Dependency | Status |
|------------|--------|
| WP-1.1–WP-1.4 | Complete |
| Existing `packages/*` README shells | Present — to be made real packages |
| WP-2.2 Auth | Not required |
| WP-2.3 Observability | Not required |
| Validation library for `@ati/shared-validation` | Use architecture-standard approach (**D6**); keep minimal |

---

## 14. Migration Strategy

1. **Inventory** pure helpers duplicated across api/worker (config parse, feature-flag parse, redact, log-level normalize, shared error base patterns, stable constants/types).  
2. **Apply D9 gate** — move only if used by both hosts or Foundation-defined.  
3. **Lift** into the matching Foundation package with unit tests.  
4. **Adapt** host Spine services to import packages (wrappers remain).  
5. **Extend/wrap** host errors via `@ati/errors` (**D8**).  
6. **Delete** host copies of extracted pure logic.  
7. **Verify** identical behaviour via existing host test suites (**D4**).  

**Backward compatibility:** `/health/*`, boot READY semantics, registration order, AI Runtime Host test-harness behaviour unchanged. Internal import paths change only inside api/worker.

---

## 15. Components to Extract

| Candidate (today) | Target package | Notes |
|-------------------|----------------|-------|
| Env/port/feature-flag **parse helpers** | `@ati/config` | `ConfigurationService` stays host-local wrapper |
| Log level normalize + **redact** helpers | `@ati/logger` | `LoggerService` stays host-local wrapper/sink binding |
| Shared error base / codes / mappers | `@ati/errors` | `SharedServiceError`, `AiRuntimeError`, etc. extend/wrap |
| Stable ID/result/correlation **type aliases** (if truly cross-host & non-Spine-runtime) | `@ati/shared-types` | Per **D7** — no registration/AI Runtime/bootstrap models |
| `ATI_*` key name constants / shared limits | `@ati/shared-constants` | Constants only |
| Pure string/date/result helpers used by both hosts | `@ati/shared-utils` | Deterministic only |
| Config-related schemas + validation primitives | `@ati/shared-validation` | Minimal; no app-specific rules (**D6**) |

### Explicitly NOT extracted (remain host-local)

| Component | Location |
|-----------|----------|
| `PlatformHostBootstrap` | `apps/*/src/spine/services/` |
| Registration coordinator, registry, catalogs, validators, order resolver | `apps/*/src/spine/registration/` |
| `AiRuntimeHost`, manifests runtime wiring, `platform-noop` engine class | `apps/*/src/spine/ai-runtime/` |
| Registration / AI Runtime / bootstrap **runtime models** | Host-local (**D7**) |
| `main.ts` host startup | `apps/*/src/main.ts` |

---

## 16. Planning Verdict

All prior ambiguities (**Q1–Q6**) are resolved by approved decisions **D1–D9**.

**No outstanding architectural ambiguities.**  
**No implementation blockers remain.**

WP-2.1 Final Pre-Implementation Plan is **complete and implementation-ready** pending separate **Implementation Authorization**.

**Stop.** No code. No repository modifications. Do not begin implementation until authorized. Do not begin WP-2.2+.

---

*End of WP-2.1_FINAL_PRE_IMPLEMENTATION_PLAN.md*