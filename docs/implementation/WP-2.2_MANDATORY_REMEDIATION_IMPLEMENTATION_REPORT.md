# WP-2.2_MANDATORY_REMEDIATION_IMPLEMENTATION_REPORT.md  
## Mandatory Remediation Implementation Report

**Work Package:** WP-2.2  
**Authorization:** Mandatory Remediation Implementation only  
**Date:** 2026-07-26  
**Role:** ATI Platform Lead Engineer  

---

## Remediation Summary

### Finding 1 — Public route matching

| Item | Detail |
|------|--------|
| **Files modified** | `packages/auth/src/load-auth-config.ts`, `packages/auth/src/index.ts`, `packages/auth/src/auth.spec.ts` |
| **Rationale** | `endsWith()` allowed suffix over-matches (e.g. `/api/health/live`) to be treated as public |
| **Approach** | Added `normalizeRequestPath` (strip query, leading slash, collapse `//`, trim trailing `/` except root). `isPublicRoute` uses **exact equality** of normalized paths only |

### Finding 2 — Worker service principal

| Item | Detail |
|------|--------|
| **Files modified** | `packages/auth/src/identity-context-factory.ts`, `packages/auth/src/auth.spec.ts`, `apps/worker/src/auth/auth.integration.spec.ts` |
| **Rationale** | `expectedPrincipalKind: 'service'` auto-granted / coerced `ati.service` without claim evidence |
| **Approach** | When service principal is expected, require mapped `ati.service`; otherwise throw `AUTH_FORBIDDEN`. Removed automatic service assignment and role coercion |

### Unchanged (intentionally)

- JWT validation, JWKS, middleware/guards structure, Foundation role catalog, package dependency graph, Platform Spine, `apps/web`, API probe wiring

---

## Test Summary

### New / updated tests

**Finding 1 (`@ati/auth`):** exact health allow; reject `/anything/health/live`, `/prefix/health/ready`, `/api/health/live`; query string + trailing slash normalization  

**Finding 2 (`@ati/auth` + worker):** service with explicit evidence; reject human-only; reject empty roles; reject missing subject; worker guard rejects human-only and empty roles  

### Totals (post-remediation, 26-Jul-2026)

| Scope | Tests | Result |
|-------|-------|--------|
| `@ati/auth` | 15 | Pass |
| `@ati/api` | 51 | Pass |
| `@ati/worker` | 50 | Pass |
| **Failures** | **0** | |

---

## Compliance Verification

| Item | Status |
|------|--------|
| Finding 1 resolved | **Yes** — exact normalized match; no `endsWith` |
| Finding 2 resolved | **Yes** — explicit `ati.service` required; human-only fail-closed |
| Architectural drift | **None** — remediation-only changes within `@ati/auth` (+ worker tests) |
| D3 / D5 / D6 | **Satisfied** for remediated behaviours |

---

## Repository Impact

| Area | Impact |
|------|--------|
| Packages | `@ati/auth` only (logic + exports `normalizeRequestPath`) |
| Applications | Worker tests only; runtime hosts consume fixed package behaviour |
| Public API | Additive export `normalizeRequestPath`; `isPublicRoute` semantics tightened (breaking for callers relying on suffix match — intended) |
| Backward compatibility | Allow-list suffix matching removed by design; service tokens without `ati.service` evidence now rejected |
| Spine / web | Unchanged |

---

## Final Statement

**Mandatory remediation is complete.**

Findings 1 and 2 are implemented with regression tests green. Ready for Delta Verification.

---

*End of WP-2.2_MANDATORY_REMEDIATION_IMPLEMENTATION_REPORT.md*
