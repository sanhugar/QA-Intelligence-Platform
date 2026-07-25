# Architecture Decision Records (ADRs)

ADRs capture **significant** decisions that are expensive to reverse.

## When to Write an ADR

- New technology choice or replacement
- Tenancy, security, or data-retention model changes
- Module extraction / service boundary changes
- AI provider strategy changes
- Breaking contract changes across packages

## Process

1. Copy `template.md` to `NNNN-short-title.md` (increment number).
2. Fill Context, Decision, Alternatives, Consequences.
3. Set status: `Proposed` → `Accepted` → (`Deprecated` / `Superseded`).
4. Link the ADR from the PR that implements it.

## Index

| ADR | Title | Status |
|-----|-------|--------|
| [0001](./0001-record-architecture-decisions.md) | Record architecture decisions | Accepted |
| [0002](./0002-technology-stack-foundation.md) | Technology stack foundation | Accepted |
| [0003](./0003-monorepo-modular-monolith.md) | Monorepo + modular monolith | Accepted |
| [0004](./0004-ai-reasoning-architecture.md) | AI Reasoning Architecture (ATI Brain) | Accepted |
| [0005](./0005-knowledge-architecture.md) | Knowledge Architecture | Accepted |
| [0006](./0006-domain-architecture.md) | Domain Architecture (Business Model) | Accepted |
| [0007](./0007-qa-intelligence-framework.md) | QA Intelligence Framework | Accepted |
| [0008](./0008-ai-decision-and-evidence-framework.md) | AI Decision and Evidence Framework | Accepted |
| [0009](./0009-enterprise-data-architecture.md) | Enterprise Data Architecture (EIM) | Accepted |
| [0010](./0010-knowledge-intake-terminology.md) | Knowledge Intake terminology consistency | Accepted |
| [0011](./0011-knowledge-intake-and-workflow-orchestration.md) | Knowledge Intake & Workflow Orchestration | Accepted |
| [0012](./0012-integration-and-external-systems-architecture.md) | Integration & External Systems Architecture | Accepted |
| [0013](./0013-application-architecture.md) | Enterprise Application Architecture | Accepted |
| [0014](./0014-security-and-governance-architecture.md) | Security & Governance Architecture | Accepted |
| [0015](./0015-implementation-readiness-and-technical-blueprint.md) | Implementation Readiness & Technical Blueprint | Accepted |
