# Coding Standards — AI QA Intelligence Platform (ATI v2)

**Status:** Normative for all contributors  
**Related:** [CONTRIBUTION.md](./CONTRIBUTION.md), [ARCHITECTURE.md](../architecture/ARCHITECTURE.md)

---

## 1. General Principles

1. Prefer clarity over cleverness.
2. Business rules live in **domain/application**, never in UI or controllers.
3. Dependencies point **inward** (Clean Architecture).
4. Make illegal states unrepresentable with types where practical.
5. Optimize for long-term change: small modules, stable interfaces, ADRs for decisions.
6. Do not commit secrets, credentials, or production data.

---

## 2. Naming Conventions

| Kind | Convention | Examples |
|------|------------|----------|
| TypeScript types / interfaces / classes | `PascalCase` | `FeatureDesignDocument`, `AiGenerationPort` |
| Functions / methods / variables | `camelCase` | `registerFdd`, `correlationId` |
| Constants / enums members | `PascalCase` enum + `SCREAMING_SNAKE` or `PascalCase` members (pick one per package and stay consistent) | `ArtifactType.TestCase` |
| React components | `PascalCase` | `AppShellLayout` |
| Hooks | `use` prefix + `camelCase` | `useFddListQuery` |
| Domain events | past tense `PascalCase` | `FddRegistered` |
| Use cases | verb + noun | `RegisterFddUseCase`, `AnalyzeRequirementsUseCase` |
| Error codes | stable `UPPER_SNAKE` | `FDD_NOT_FOUND` |
| Env vars | `UPPER_SNAKE` with product prefix | `ATI_DATABASE_URL` |

### Ubiquitous language

Use product terms consistently: **Knowledge Intake**, **Knowledge Input**, **Approved Requirements Source** (FDD/PRD/SRS/equivalent), **artifact**, **lineage**, **reasoning**, **generation**, **knowledge**. Prefer Approved Requirements Source over assuming “FDD” is the only specification type. See [CANONICAL_TERMINOLOGY.md](../architecture/CANONICAL_TERMINOLOGY.md).

---

## 3. Folder Conventions

### Backend (`apps/api`, `apps/worker`)

- Organize by **bounded context / module**, then by layer (`domain`, `application`, `infrastructure`, `api`).
- Repository **interfaces** in domain; **implementations** in infrastructure.
- NestJS modules compose a context; they must not become dumping grounds for unrelated providers.

### Frontend (`apps/web`)

- Organize by **feature** under `features/`.
- Shared UI under `components/ui` and `components/patterns`.
- Route entrypoints under `pages/` remain thin.

### Packages

- One concern per package.
- Public export surface only via package `exports`.

---

## 4. File Naming

| Area | Pattern | Example |
|------|---------|---------|
| React components | `PascalCase.tsx` | `PageHeader.tsx` |
| React hooks | `useThing.ts` | `useTheme.ts` |
| Nest controllers | `*.controller.ts` | `health.controller.ts` |
| Nest modules | `*.module.ts` | `app.module.ts` |
| Use cases | `*.use-case.ts` | `register-fdd.use-case.ts` |
| Domain entities | `*.entity.ts` | `fdd.entity.ts` |
| Repo interfaces | `*.repository.ts` | `fdd.repository.ts` |
| Prisma/infra repos | `*.repository.prisma.ts` or `prisma-*.repository.ts` | `prisma-fdd.repository.ts` |
| DTOs | `*.dto.ts` | `register-fdd.dto.ts` |
| Tests | `*.spec.ts` / `*.test.ts` | `register-fdd.use-case.spec.ts` |
| Docs / markdown | `SCREAMING_SNAKE` or `kebab-case` for long guides | `GETTING_STARTED.md` |
| Prompts (future) | versioned path + `kebab-case` | `prompts/requirement-analysis/v1/system.md` |

---

## 5. TypeScript Rules

- `strict` enabled across apps and packages.
- Avoid `any`. Prefer `unknown` + narrowing.
- Prefer `readonly` for value objects and DTOs at rest.
- Do not disable eslint/ts rules without a linked justification comment and reviewer approval.
- Shared contracts belong in `packages/shared-types` / `packages/shared-validation`.

---

## 6. Error Handling

1. Throw or return typed errors from `packages/errors` (`AppError` or equivalent).
2. Every error has: `code`, safe `message`, optional `details`, optional `cause`.
3. Map errors to HTTP only in the API layer.
4. Never expose internal exception messages or stack traces to clients in production.
5. Log failures with correlation ID and error code; include stack only in logs.
6. Prefer Result-style returns for expected domain failures where it improves clarity; reserve exceptions for unexpected faults—be consistent within a module.

---

## 7. Logging

- Use `packages/logger` facade only (no ad-hoc `console.log` in committed code).
- Structured JSON fields: `correlationId`, `userId` (if safe), `tenantId`, `module`, `operation`.
- **Never log:** passwords, tokens, raw secrets, full PII payloads, raw prompt secrets, entire FDD bodies unless redaction policy allows.
- Log levels: `debug` / `info` / `warn` / `error` / `fatal` with intentional meaning.
- Workers must log `jobId`, `jobName`, attempt count.

---

## 8. Testing Standards

| Layer | Required for changes |
|-------|----------------------|
| Domain logic | Unit tests mandatory |
| Application use cases | Unit tests with mocked ports |
| Infrastructure adapters | Integration tests for non-trivial adapters |
| API transport | Contract or controller tests for new endpoints |
| UI features | Component tests for meaningful interaction |
| Critical user journeys | Playwright e2e |

Rules:

- Tests name behavior: `returns lineage when FDD version exists`.
- No flaky sleep-based tests; use fakes/clock ports.
- Test data builders preferred over opaque fixtures.
- Coverage is a guide, not a vanity metric—critical lineage paths must be covered.

---

## 9. Documentation Standards

- Public packages and apps require a short `README.md` (purpose, how to run, ownership).
- Architecture-affecting changes require an **ADR**.
- Code comments explain non-obvious *why*.
- Do not leave `TODO` without owner/ticket reference.
- Keep docs next to the decision (`docs/adr`) or the module README.

---

## 10. Comments and Code Review

- Prefer self-explanatory names over narrating comments.
- Complex algorithms and security controls deserve comments.
- Reviewers enforce: layering, naming, tests, no secrets, no business logic in UI.

---

## 11. Git Branch Strategy

| Branch | Purpose |
|--------|---------|
| `main` | Stable, releasable; protected |
| `feature/<ticket>-short-name` | New capability |
| `fix/<ticket>-short-name` | Bug fix |
| `chore/<short-name>` | Tooling/maintenance |
| `docs/<short-name>` | Documentation only |
| `hotfix/<ticket>-short-name` | Urgent production fix (if releases demand) |

Rules:

- Branch from latest `main`.
- Open PRs early; keep PRs reviewably small.
- No direct commits to `main`.
- Rebase or merge per team policy (document in CONTRIBUTING); prefer linear history if tooling allows.

---

## 12. Commit Message Format

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(optional-scope): <short imperative summary>

[optional body]

[optional footer]
```

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`.

**Examples**

```
docs(architecture): add foundation architecture document
chore(repo): scaffold monorepo folders
feat(api): add health module skeleton
fix(web): correct query key for artifact list
```

**Footer conventions**

- `BREAKING CHANGE:` for incompatible API/package changes
- `Refs: #123` or `Closes: #123` for ticket linkage

---

## 13. Security and Compliance Hygiene

- Depend on official SDKs via lockfile; run vulnerability scans in CI.
- Validate all external input at boundaries.
- Least privilege for cloud roles and DB users.
- Treat uploaded FDDs and generated artifacts as sensitive enterprise content.

---

## 14. AI-Specific Engineering Rules (Foundation)

- No provider SDK usage outside infrastructure AI adapters.
- Prompts are versioned assets under `prompts/` when introduced.
- Record model/provider/prompt version in lineage metadata for every generation (when implemented).
- Deterministic unit tests must not call live model APIs; use ports/fakes.
