# `@ati/context`

Framework-independent tenant/workspace execution context for ATI hosts (WP-2.4).

## Responsibilities

- Opaque `tenantId` (Organization) / optional `workspaceId` types
- Validation and resolution helpers
- Trusted job-envelope helpers
- Scaffold / claim-map config loading

## Non-responsibilities

- Authorization decisions (WP-2.2 `@ati/auth`)
- Domain membership / admin
- Persistence / migrations
- Nest/React wiring (lives in `apps/*`)

## Rules

- Raw client headers are never authoritative
- Workers accept trusted envelopes only
- Context is a scope carrier, not an AuthZ engine or Source of Truth
