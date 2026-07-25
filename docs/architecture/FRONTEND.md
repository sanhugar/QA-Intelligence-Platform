# Frontend Architecture (Deep Dive Index)

Canonical decisions live in [ARCHITECTURE.md](./ARCHITECTURE.md) §5.  
Logical frontend workspaces and boundaries: [APPLICATION_ARCHITECTURE.md](./APPLICATION_ARCHITECTURE.md) (ADR 0013).

## Rules of thumb

1. Features own their UI + hooks + API client functions.
2. Pages compose features; they do not embed business workflows.
3. Server state via TanStack Query; UI state via Zustand/local state.
4. Shared primitives under `components/ui`; patterns under `components/patterns`.
5. No direct provider SDK or domain rule re-implementation in the browser.
