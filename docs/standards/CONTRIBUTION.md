# Contribution Guide — AI QA Intelligence Platform (ATI v2)

Thank you for contributing. This repository is a greenfield enterprise platform. Quality of structure matters as much as features.

## Before You Start

1. Read [AI_DEVELOPMENT_CHARTER.md](./AI_DEVELOPMENT_CHARTER.md) (roles, gates, rules).
2. Read [CURSOR_DEVELOPMENT_CONTRACT.md](../development/CURSOR_DEVELOPMENT_CONTRACT.md) (mandatory for AI-assisted implementation).
3. Read [IMPLEMENTATION_WORKFLOW.md](../development/IMPLEMENTATION_WORKFLOW.md) (mandatory SOP for every Work Package).
4. Read [ARCHITECTURE_BASELINE_STATUS.md](../architecture/ARCHITECTURE_BASELINE_STATUS.md) and [ARCHITECTURE.md](../architecture/ARCHITECTURE.md).
5. Read [CODING_STANDARDS.md](./CODING_STANDARDS.md).
6. Check [IMPLEMENTATION_ROADMAP_AND_WBS.md](../implementation/IMPLEMENTATION_ROADMAP_AND_WBS.md) and [ROADMAP.md](../roadmap/ROADMAP.md) so work aligns with the current phase/WP.
7. For design changes, draft or update an ADR under `docs/adr/` and follow baseline freeze rules.
8. Do not implement major features without architecture design approval / authorized WP.

## Development Workflow

1. Create a branch from `main` using the naming rules in coding standards.
2. Make focused changes (one concern per PR when possible).
3. Add/update tests and docs with the change.
4. Ensure locally (once tooling exists): lint, typecheck, unit tests.
5. Open a pull request with:
   - Summary of *why*
   - Test plan
   - Linked ADR/ticket if applicable
   - Explicit note of any breaking changes

## Review Expectations

Reviewers check for:

- Clean Architecture / DDD boundary violations
- Business logic leaking into UI or controllers
- Missing traceability considerations for artifact-producing paths
- Secrets or environment-specific values in code
- Adequate tests for the layer touched
- Clear naming aligned to ubiquitous language

## What Not to Submit (Foundation Phase)

Until explicitly requested by product/architecture:

- Business workflows
- Prompts and AI pipelines
- UI pages for product modules
- Production APIs and database tables without ADR

## Reporting Issues

Include: environment, reproduction steps, expected vs actual, correlation IDs if available, and whether data/PII was involved (do not paste secrets or sensitive FDD content into tickets).
