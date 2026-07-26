# ATI Platform Release Baseline v2.3

## Release Information

| Field | Value |
|-------|-------|
| **Release Name** | ATI Platform Baseline v2.3 |
| **Release Date** | 2026-07-26 |
| **Repository** | QA-Intelligence-Platform |
| **Branch** | `develop` (from WP-2.1 HEAD `c2420a3`; WP-2.2 + WP-2.3 pending commit per release plan) |
| **Baseline Version** | v2.3 |

---

## Included Work Packages

### WP-2.2 – Authentication & Authorization Foundation

- Exact public-route matching for health allow-list
- JWT validation foundation (`@ati/auth`)
- Worker service-principal authorization with explicit `ati.service` evidence
- Deny-by-default authorization model
- Mandatory security remediation completed
- Governance completed and repository closed

### WP-2.3 – Observability Baseline

- Structured logging with Pino (single write path)
- `x-correlation-id` propagation (API accept/echo; worker trusted-envelope / mint)
- OpenTelemetry host soft-integration with READY degradation
- Coarse authentication outcome metrics
- Worker trusted-envelope correlation harness
- Governance completed and repository closed

---

## Architecture Highlights

- Authentication & authorization foundation established at the Application boundary
- Observability foundation established (`@ati/observability` + host adapters)
- Platform Spine ownership and boot semantics preserved
- Package boundaries strengthened (Nest-free foundation packages; host wiring only)
- Security posture improved (redaction, fail-closed auth when enabled, diagnostic-only correlation)

---

## Quality Summary

| Check | Status |
|-------|--------|
| Build | PASS |
| Unit tests | PASS |
| Integration tests | PASS |
| Repository status | Closed (WP-2.2, WP-2.3) |
| Git readiness | Approved (ready for commit & tag) |

---

## Governance Summary

Both WP-2.2 and WP-2.3 completed the full lifecycle:

Pre-Implementation Planning → Architecture Review → Architecture Decision Resolution → Final Pre-Implementation Planning → Implementation Authorization → Implementation → Self Review → Independent Architecture Review → Repository Closeout → Git Readiness Review.

**All mandatory governance gates completed successfully.**

---

## Deferred Capabilities

High-level items remain outside this baseline (see deferred registers):

- Advanced OpenTelemetry / full OTLP SDK hardening
- SIEM integration and dashboards-as-product
- Job-bus correlation continuity
- Tenancy / workspace context (WP-2.4+)
- Advanced Domain / AI / workflow observability

---

## Release Tags

Intended tags (per `RELEASE_BASELINE_PLAN.md`; combined commit recommended):

- `wp-2.2-complete`
- `wp-2.3-complete`

---

## Release Status

**Status:** Stable Development Baseline

This baseline represents successful completion of **WP-2.2** and **WP-2.3** and provides the foundation for subsequent ATI Platform work packages.

---

## Next Planned Work

Future development begins with **WP-2.4** (requires separate authorization).
