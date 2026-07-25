# Migrations

Versioned database migrations only.

Rules (when migrations begin):

- Forward-only in production
- Expand/contract for breaking changes
- Review SQL for locks and data backfills
- Never edit applied migrations; add a new one
