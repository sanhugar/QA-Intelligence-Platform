# ADR 0005: Knowledge Architecture

- **Status:** Accepted
- **Date:** 2026-07-25
- **Decision makers:** Chief Architect (design), Product governance via charter

## Context

ATI must remember and reuse organizational knowledge without depending on any LLM’s parametric memory. Uncontrolled retrieval (naive RAG over everything) risks cost explosion, invented functionality, stale SharePoint content overriding FDDs, and unauditable reasoning. Knowledge must be first-class, governed, versioned, and subordinate to the current Feature Design Document.

## Decision

Adopt `docs/architecture/KNOWLEDGE_ARCHITECTURE.md` as the permanent Knowledge Architecture for ATI, establishing:

1. An **Enterprise Knowledge Base (EKB)** distinct from the run-scoped Requirement Knowledge Graph (RKG).
2. Explicit **knowledge domains** with owners, sources, consumers, and version/update strategies.
3. A strict **knowledge hierarchy** with Current FDD at the top and general LLM knowledge at the bottom (never authoritative).
4. A full **lifecycle**: Creation → Validation → Approval → Versioning → Publication → Usage → Retirement → Archival.
5. A logical **metadata model** requiring provenance, version, approval, authority class, and evidence.
6. **Intentional retrieval** via Retrieval Intents, domain allow-lists, caps, and sufficiency stops.
7. **Use-time and publish-time validation**, including FDD conflict detection.
8. **Governed learning** — candidates never silently mutate published knowledge.
9. **SharePoint as a source adapter** with version awareness and permission boundaries — not the semantic system of record.
10. **Extensibility** via domain manifests, source adapters, and versioned retrieval policy packs.

**Hard bans:** supporting knowledge never overrides Approved Requirements Source; no LLM as system of record; no auto-approval of AI-generated product facts; no “retrieve everything.”

**Terminology note (ADR 0010):** Knowledge Intake is the multi-source entry point; FDD is one Knowledge Input. Hierarchy tier [0] is **Approved Requirements Source** for generation authority. Architectural intent unchanged.

## Alternatives Considered

1. **Prompt-only / chat-memory knowledge** — non-auditable; provider-locked; fails enterprise retention.
2. **Unbounded corpus RAG as architecture** — high cost; weak authority control; easy FDD contamination.
3. **SharePoint as system of record** — couples ATI semantics to external ACLs/drafts; weak reasoning contracts.
4. **Collapse EKB into RKG** — confuses durable org memory with per-run understanding.

## Consequences

### Positive

- Clear contracts for the Knowledge Engine and Learning Engine
- Audit-ready provenance and usage lineage
- Provider-independent memory
- Controlled path for SharePoint and future sources

### Negative / Risks

- Higher governance overhead than “just embed docs”
- Stewards required for product-fact domains
- Sync lag must be operationally managed

### Follow-ups

- Implementation only after explicit approval beyond this ADR
- Future ADRs for concrete search/index technology and retention duration defaults
- Policy pack defaults for stage domain allow-lists when engines are implemented
