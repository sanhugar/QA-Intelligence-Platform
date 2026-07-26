# ATI Platform Release Baseline v2.4

## Release Information

| Field | Value |
|-------|-------|
| **Release Name** | ATI Platform Baseline v2.4 |
| **Release Date** | 2026-07-26 |
| **Repository** | QA-Intelligence-Platform |
| **Branch** | `develop` |
| **Baseline Version** | v2.4 |
| **Extends** | Stable Development Baseline v2.3 |

---

## Included Work Package

### WP-2.4 – Tenancy / Workspace Context Baseline

- Nest-free **`@ati/context`** Shared Infrastructure package
- Request/job **context lifecycle** (bind, clear, no silent cross-tenant merge)
- **API middleware** binding from host-validated claim map or auth-disabled scaffold
- **Worker trusted-envelope** propagation / harness
- **Context isolation** verification (no cross-tenant bleed; client headers not authoritative)
- **Observability** allow-list for opaque `tenantId` / `workspaceId` labels (non-PII)
- Governance completed; repository closed; Git Readiness approved with minor follow-ups

---

## Architecture Highlights

- Shared Infrastructure strengthened with a dedicated context package
- Tenant/workspace **context propagation** established across api and worker hosts
- Isolation **foundation** in place without claiming Domain tenancy product completeness
- **No persistence** and no Prisma / schema migrations introduced
- Platform Spine ownership and boot/READY semantics preserved
- Context remains a scope carrier — not an authorization engine or Source of Truth

---

## Quality Summary

| Check | Status |
|-------|--------|
| Build | PASS |
| Unit tests | PASS |
| Integration / isolation tests | PASS |
| Repository status | Closed (WP-2.4) |
| Git readiness | READY FOR COMMIT WITH MINOR FOLLOW-UPS |

---

## Governance Summary

WP-2.4 completed the full lifecycle:

Pre-Implementation Planning → Architecture Review → Architecture Decision Resolution → Final Pre-Implementation Planning → Implementation Authorization → Implementation → Self Review → Independent Architecture Review → Repository Closeout → Git Readiness Review.

**All mandatory governance gates completed successfully.**

---

## Deferred Capabilities

Outside this baseline (see [WP-2.4 Deferred Capability Register](../implementation/WP-2.4_DEFERRED_CAPABILITY_REGISTER.md)):

- Multi-tenant persistence
- Prisma / schema migrations
- Tenant administration
- Workspace administration
- Organization membership / Domain RBAC
- Domain tenancy product model
- Job-bus integration beyond harness

A dedicated **Tenancy ADR** remains mandatory before any persistence work package.

---

## Release Tag

Intended annotated tag:

- `wp-2.4-complete`

Prerequisite tags for prior baselines (if not already applied): `wp-2.2-complete`, `wp-2.3-complete` (see [RELEASE_BASELINE_v2.3.md](./RELEASE_BASELINE_v2.3.md)).

---

## Release Status

**Stable Development Baseline v2.4**

This baseline extends v2.3 with the Tenancy / Workspace Context Foundation while intentionally deferring persistence and product tenancy capabilities.

---

## Next Planned Work

Continue per the platform roadmap and [Implementation Roadmap & WBS](../implementation/IMPLEMENTATION_ROADMAP_AND_WBS.md). After Phase 2 Shared Infrastructure (WP-2.1–WP-2.4), the next planned critical-path package is **WP-3.1 — Intake Entry Workflow** (requires separate authorization).
