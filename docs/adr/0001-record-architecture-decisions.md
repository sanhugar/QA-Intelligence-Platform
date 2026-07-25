# ADR 0001: Record Architecture Decisions

- **Status:** Accepted
- **Date:** 2026-07-25
- **Decision makers:** Platform Architecture

## Context

ATI v2 is a long-lived enterprise platform. Unwritten decisions will be rediscovered, contradicted, and silently reversed.

## Decision

Use Architecture Decision Records (ADRs) in `docs/adr/` for significant, durable decisions. Lightweight day-to-day choices do not require ADRs.

## Alternatives Considered

1. Wiki-only documentation — drifts from repository history.
2. Decisions only in PR descriptions — hard to discover later.

## Consequences

- Architecture history is versioned with code.
- Contributors have a clear place to propose changes.
- Small overhead on large changes; reduced long-term ambiguity.
