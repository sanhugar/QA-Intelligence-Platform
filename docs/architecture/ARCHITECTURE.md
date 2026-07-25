# AI QA Intelligence Platform (ATI v2) — Architecture Foundation

**Status:** Foundation architecture — **BASELINE FROZEN** (see [ARCHITECTURE_BASELINE_STATUS.md](./ARCHITECTURE_BASELINE_STATUS.md)); Implementation Authorized  
**Audience:** Engineering, Architecture, Platform, Security  
**Horizon:** Designed to scale for 5–10 years  
**Last updated:** 2026-07-25

---

## 1. Purpose and Scope

This document defines the **project foundation** for a greenfield enterprise product: an **Enterprise AI QA Knowledge Platform**. ATI starts with **Knowledge Intake** over multiple Knowledge Inputs. For requirement analysis, scenario generation, and test case generation, the **Approved Requirements Source** (FDD, PRD, SRS, or equivalent) is authoritative; other Knowledge Inputs support but never override or invent requirements. See [CANONICAL_TERMINOLOGY.md](./CANONICAL_TERMINOLOGY.md).

### In scope

- Technology stack recommendations and trade-offs
- Monorepo structure and ownership boundaries
- Backend Clean Architecture / DDD layering
- Frontend feature-based architecture
- Shared packages, database module layout, documentation layout
- Coding standards and delivery conventions

### Out of scope (explicitly deferred)

- Business logic, domain workflows, prompts, and runtime AI pipelines (see separate **AI Reasoning Architecture** for design-only brain blueprint)
- UI pages, REST/GraphQL APIs, database tables
- SharePoint, release management, and other future capability implementations

> **ATI Brain:** Reasoning pipeline, engines, Requirement Object, and confidence/review models are defined in [AI_REASONING_ARCHITECTURE.md](./AI_REASONING_ARCHITECTURE.md) (ADR 0004).  
> **ATI Knowledge:** Enterprise Knowledge Base domains, hierarchy, lifecycle, retrieval, learning, and SharePoint strategy are defined in [KNOWLEDGE_ARCHITECTURE.md](./KNOWLEDGE_ARCHITECTURE.md) (ADR 0005).  
> **ATI Domain:** Canonical business model (ubiquitous language, bounded contexts, invariants) is defined in [DOMAIN_ARCHITECTURE.md](./DOMAIN_ARCHITECTURE.md) (ADR 0006).  
> **ATI QA Intelligence:** Senior QA reasoning heuristics and test design model are defined in [QA_INTELLIGENCE_FRAMEWORK.md](./QA_INTELLIGENCE_FRAMEWORK.md) (ADR 0007).  
> **ATI Decision & Evidence:** Explainable, evidence-driven decision governance is defined in [AI_DECISION_AND_EVIDENCE_FRAMEWORK.md](./AI_DECISION_AND_EVIDENCE_FRAMEWORK.md) (ADR 0008).  
> **ATI EIM:** Technology-independent Enterprise Information Model is defined in [ENTERPRISE_DATA_ARCHITECTURE.md](./ENTERPRISE_DATA_ARCHITECTURE.md) (ADR 0009).  
> **Terminology:** Knowledge Intake vs Approved Requirements Source — [CANONICAL_TERMINOLOGY.md](./CANONICAL_TERMINOLOGY.md) (ADR 0010).  
> **Orchestration:** Knowledge Intake & workflows — [KNOWLEDGE_INTAKE_AND_WORKFLOW_ORCHESTRATION_ARCHITECTURE.md](./KNOWLEDGE_INTAKE_AND_WORKFLOW_ORCHESTRATION_ARCHITECTURE.md) (ADR 0011).  
> **Integrations:** External systems via contracts/adapters/connectors — [INTEGRATION_AND_EXTERNAL_SYSTEMS_ARCHITECTURE.md](./INTEGRATION_AND_EXTERNAL_SYSTEMS_ARCHITECTURE.md) (ADR 0012).  
> **Applications:** Logical apps, modules, workers, packages — [APPLICATION_ARCHITECTURE.md](./APPLICATION_ARCHITECTURE.md) (ADR 0013).  
> **Security & Governance:** Enterprise security, governance, compliance, AI accountability — [SECURITY_AND_GOVERNANCE_ARCHITECTURE.md](./SECURITY_AND_GOVERNANCE_ARCHITECTURE.md) (ADR 0014).  
> **Implementation Blueprint:** Readiness, sequencing, engineering governance — [IMPLEMENTATION_READINESS_AND_TECHNICAL_BLUEPRINT.md](./IMPLEMENTATION_READINESS_AND_TECHNICAL_BLUEPRINT.md) (ADR 0015).  
> **ARB Audit:** Consistency & gap analysis — [ARCHITECTURE_CONSISTENCY_AND_GAP_ANALYSIS.md](./ARCHITECTURE_CONSISTENCY_AND_GAP_ANALYSIS.md) (Ready for Implementation).  
> **Baseline Status:** [ARCHITECTURE_BASELINE_STATUS.md](./ARCHITECTURE_BASELINE_STATUS.md) — BASELINE FROZEN v1.0 (25-Jul-2026); **Implementation Authorized**. Architecture meaning remains frozen; implementation must conform and must not redesign.

### Non-negotiable design principles

| # | Principle | Architectural consequence |
|---|-----------|---------------------------|
| 1 | Knowledge Intake is the platform entry; Approved Requirements Source is generation authority | Intake accepts multiple Knowledge Inputs; Requirements/Scenarios/Cases cite the designated approved spec (FDD/PRD/SRS/equivalent) |
| 2 | AI must reason before generating | Application layer separates *analysis / reasoning* use cases from *generation* use cases |
| 3 | Every artifact is traceable | Immutable lineage: Knowledge Intake → Approved Requirements Source → analysis → scenario → test → review → automation prep |
| 4 | Modular architecture | Bounded contexts and deployable modules with clear contracts |
| 5 | AI provider independent | Ports/adapters for model providers; no SDK leakage into domain |
| 6 | Cloud independent | Infrastructure abstractions for storage, queue, identity, secrets |
| 7 | Extensible plugins | Capability plugins register via stable interfaces and events |
| 8 | Enterprise coding standards | Enforced lint, types, tests, ADRs, review gates |
| 9 | Clean Architecture | Dependencies point inward; domain has no framework imports |
| 10 | Domain Driven Design | Ubiquitous language, aggregates, domain events |
| 11 | SOLID | Interfaces at boundaries; single-responsibility modules |
| 12 | Event-driven where appropriate | Internal domain/integration events for async and decoupling |
| 13 | No business logic in UI | Frontend is presentation + orchestration of API contracts |
| 14 | Independently testable modules | Unit tests without I/O; integration tests at boundaries |

---

## 2. Recommended Technology Stack

### 2.1 Decision summary

| Concern | Recommendation | Rationale |
|---------|----------------|-----------|
| Frontend | React 19 + TypeScript + Vite | Mature ecosystem, excellent enterprise UI tooling, fast local DX |
| Backend | NestJS (Node.js LTS) + TypeScript | Modular DI, first-class Clean Architecture fit, shared language with frontend |
| Database | PostgreSQL 16+ | Relational integrity for traceability + JSONB for flexible artifact payloads |
| ORM / query | Prisma (schema + migrations) + selective SQL | Strong migrations story; escape hatch for complex reporting queries |
| Authentication | OpenID Connect / OAuth 2.0 (Microsoft Entra ID primary) | Enterprise SSO; SharePoint/Graph alignment later without rewriting identity |
| Queue | Redis + BullMQ | Reliable jobs, retries, visibility; NestJS ecosystem fit |
| Object storage | S3-compatible API (MinIO local; AWS S3 / Azure Blob / GCS via adapter) | Cloud-independent binary/document storage |
| Search | OpenSearch | Enterprise full-text + eventual vector/hybrid search for knowledge |
| Caching | Redis | Session/cache/rate-limit/job coordination on one operational surface |
| Logging | Pino + OpenTelemetry | Structured logs + distributed traces across API and workers |
| Configuration | 12-factor env + Zod-validated config packages | Fail-fast config; no scattered `process.env` reads |
| Unit/integration testing | Vitest (apps + packages), Testcontainers | Fast TS-native tests; real Postgres/Redis in integration |
| E2E testing | Playwright | Cross-browser UI contracts; CI-friendly |
| Build / monorepo | pnpm workspaces + Turborepo | Efficient installs, task caching, clear package graph |
| AI SDK | Provider-agnostic **AI Port** + thin adapters (official SDKs / Vercel AI SDK) | Swap OpenAI, Azure OpenAI, Anthropic, local models without domain changes |
| Deployment | Containerized services on Kubernetes (any cloud) | Portable scaling; local parity via Docker Compose |
| Containerization | Docker + Compose (dev) / OCI images (prod) | Standard enterprise delivery unit |
| CI/CD | GitHub Actions (or Azure DevOps later via same pipelines-as-code) | PR checks, security scans, staged deploy |

### 2.2 Frontend

**Stack**

- **React 19** + **TypeScript (strict)**
- **Vite** for bundling and HMR
- **TanStack Router** for type-safe routing
- **TanStack Query** for server state
- **Zustand** for lightweight client/UI state
- **Tailwind CSS** + **Radix UI** / **shadcn-style** primitives for accessible component composition
- **React Hook Form** + **Zod** for forms/validation
- **Vitest** + **Testing Library** + **Playwright**

**Why this combination**

- Internal enterprise SPA does not need SSR/SEO as a first constraint; Vite SPA keeps hosting simple behind auth.
- TanStack Query prevents ad-hoc fetch/cache logic and keeps UI free of business rules.
- Zustand avoids Redux ceremony for local UI state while remaining explicit and testable.

**Trade-offs**

| Option | Pros | Cons | Why not primary |
|--------|------|------|-----------------|
| Next.js App Router | SSR, file routing, Vercel DX | Extra complexity for auth-gated internal tool | Revisit if public/marketing or SEO surfaces appear |
| Angular | Strong enterprise conventions | Heavier stack, weaker AI-ecosystem JS sharing | Larger hiring/training cost for this product shape |
| MUI-only | Fast enterprise look | Heavier theming lock-in | Prefer headless primitives + design tokens |

### 2.3 Backend

**Stack**

- **Node.js LTS** + **NestJS** + **TypeScript (strict)**
- Clean Architecture folders inside `apps/api` (and future workers)
- **Zod** or class-validator at API boundary only (DTOs), never as domain core
- **BullMQ** processors in `apps/worker` (separate process, shared application use cases)

**Why NestJS**

- Module boundaries map cleanly to bounded contexts.
- Dependency injection makes ports/adapters natural.
- Same language as frontend enables shared contracts in `packages/*`.
- Mature interceptors/filters for cross-cutting enterprise concerns (authz, audit, correlation IDs).

**Trade-offs**

| Option | Pros | Cons | Decision |
|--------|------|------|----------|
| .NET 8 | Excellent Microsoft/SharePoint affinity | Dual-language monorepo; slower shared-type story | Keep as future adapter host if needed; not required for foundation |
| Java Spring Boot | Enterprise familiarity | Heavier ops and slower iteration for AI product teams | Rejected for greenfield velocity |
| Python FastAPI | Strong ML ecosystem | Weaker shared contracts with React; split brain | Optional later **AI worker** language, behind same ports |
| Pure Express | Minimal | Insufficient structure for 5–10 year enterprise platform | Rejected |

**AI language strategy:** TypeScript owns orchestration and policy. If specialized ML later requires Python, it runs as an isolated worker behind the same `AiProvider` / `KnowledgeIndexer` ports—never as a second source of domain truth.

### 2.4 Database, ORM, search, cache, queue

| Component | Choice | Notes |
|-----------|--------|-------|
| OLTP | PostgreSQL | Traceability graphs, ACID transactions, JSONB for artifact bodies |
| Migrations | Prisma Migrate | Versioned SQL under `database/migrations` (source of truth for DBA review) |
| Access | Repository adapters using Prisma client | Domain defines repository *interfaces*; infrastructure implements them |
| Cache / broker | Redis | Cache + BullMQ backing store |
| Search | OpenSearch | FDD/knowledge retrieval; vector fields added when knowledge module lands |
| Files | S3 API | FDD uploads, exports, report binaries |

**Trade-off — Prisma vs Drizzle vs TypeORM**

- **Prisma:** best schema/migration DX and onboarding; chosen for foundation.
- **Drizzle:** closer to SQL; consider for heavy analytical modules later.
- **TypeORM:** avoid for greenfield (decorator-heavy, weaker migration discipline).

**Trade-off — OpenSearch vs Postgres full-text vs managed vector DB**

- Start with Postgres for structured queries; introduce OpenSearch when knowledge search quality/latency demands it.
- Avoid locking into a proprietary vector-only vendor at foundation time.

### 2.5 Authentication and authorization

- **Protocol:** OIDC + OAuth 2.0
- **IdP (recommended primary):** Microsoft Entra ID
- **Local/dev:** Auth emulator or secondary OIDC (e.g., Keycloak) via same abstraction
- **App model:** JWT/session validation at API edge; **RBAC + resource scopes** in application layer
- **Future:** SCIM provisioning hooks; SharePoint-delegated Graph tokens as a separate *integration credential* store (never mixed into user session casually)

**Principle:** Identity provider is an adapter. Domain speaks `UserId`, `Role`, `Permission`, not Entra-specific types.

### 2.6 AI SDK strategy (provider-independent)

```
Application Use Case
        │
        ▼
   AiReasoningPort / AiGenerationPort   ◄── interfaces (application/domain boundary)
        │
        ▼
   AiGateway (infrastructure)
        │
        ├── OpenAI adapter
        ├── Azure OpenAI adapter
        ├── Anthropic adapter
        └── Local/OpenAI-compatible adapter
```

- Prompts live in `prompts/` (versioned artifacts), not hard-coded in controllers.
- Model selection, temperature, retries, safety filters are infrastructure/policy concerns.
- **No provider SDK types** cross into `domain/` or frontend feature modules.

**Trade-off — LangChain vs thin adapters**

- Thin official SDK adapters are preferred for control, debuggability, and fewer breaking abstractions.
- Orchestration frameworks may be introduced later *inside* infrastructure only, never as the domain model.

### 2.7 Observability, configuration, testing, delivery

| Area | Standard |
|------|----------|
| Logs | Structured JSON (Pino), correlation ID per request/job |
| Traces/metrics | OpenTelemetry → vendor-neutral exporter (Grafana stack, Datadog, Azure Monitor, etc.) |
| Secrets | Env/Key vault adapters; never commit secrets |
| Config | `packages/config` + per-app schema validation at boot |
| Unit tests | Vitest; domain tests with zero I/O |
| Integration | Testcontainers (Postgres, Redis) |
| Contract tests | Shared DTO/schema packages consumed by FE and BE |
| E2E | Playwright against Compose stack |
| Containers | Multi-stage Dockerfiles per app |
| Orchestration | Kubernetes manifests/Helm under `infrastructure/k8s` |
| IaC | Terraform (cloud-neutral modules) under `infrastructure/terraform` |
| CI | lint → typecheck → unit → integration → build images → deploy staging |
| CD | Environment promotion with manual approval for production |

### 2.8 Deployment topology (logical)

```
                   ┌─────────────┐
                   │  Web (SPA)  │
                   └──────┬──────┘
                          │ HTTPS
                   ┌──────▼──────┐
                   │  API (Nest) │
                   └──────┬──────┘
           ┌──────────────┼──────────────┐
           ▼              ▼              ▼
      PostgreSQL        Redis       OpenSearch
                           │
                    ┌──────▼──────┐
                    │ Worker(s)   │  BullMQ consumers / AI jobs
                    └──────┬──────┘
                           ▼
                     Object Storage
```

Cloud independence means **this topology is portable**; only adapters change (Blob vs S3, Entra vs Keycloak, managed Redis vs self-hosted).

---

## 3. Repository Structure (Scalable Monorepo)

### 3.1 Top-level layout

```
QA-Intelligence-Platform/
├── apps/
│   ├── web/                      # React SPA
│   ├── api/                      # NestJS HTTP API
│   └── worker/                   # Background job processors
├── packages/
│   ├── shared-types/             # Cross-cutting TypeScript types/models
│   ├── shared-constants/         # Enums, limits, header names
│   ├── shared-utils/             # Pure utilities
│   ├── shared-validation/        # Zod/shared schemas for contracts
│   ├── config/                   # Config loading + schema helpers
│   ├── logger/                   # Logging facade
│   └── errors/                   # Error taxonomy + mappers
├── modules/
│   └── ai/                       # AI capability module boundaries (no prompts/workflows yet)
├── database/
│   ├── schemas/                  # Conceptual/logical schema docs + Prisma schema home
│   ├── migrations/               # Versioned migrations
│   ├── seeds/                    # Non-prod seed scripts
│   └── repositories/             # SQL/persistence notes; implementations live in apps via adapters
├── prompts/                      # Versioned prompt templates (empty until authorized)
├── docs/
│   ├── architecture/
│   ├── adr/
│   ├── api/
│   ├── development/
│   ├── standards/
│   ├── ai/
│   ├── database/
│   └── roadmap/
├── infrastructure/
│   ├── docker/
│   ├── k8s/
│   └── terraform/
├── tests/
│   ├── e2e/
│   ├── integration/
│   └── performance/
├── scripts/                      # Dev/release automation scripts
├── config/                       # Environment templates (no secrets)
├── .github/workflows/            # CI/CD pipelines
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
├── .gitignore
├── .editorconfig
└── README.md
```

### 3.2 Why each top-level folder exists

| Path | Purpose |
|------|---------|
| `apps/` | Deployable runtimes (web, api, worker). Keeps release units explicit. |
| `packages/` | Shared libraries with semver-within-monorepo discipline; prevent copy-paste types. |
| `modules/ai/` | Reserved for AI-facing module contracts and future plugin packs without dumping AI into `apps/api/src` root. |
| `database/` | Single home for schema evolution and DBA-visible artifacts. |
| `prompts/` | Treat prompts as versioned product assets, reviewable separately from code. |
| `docs/` | Durable engineering knowledge; ADRs capture decisions over time. |
| `infrastructure/` | How the system runs in environments—separated from product code. |
| `tests/` | Cross-app E2E/integration/performance that do not belong to a single package. |
| `scripts/` | Repeatable operator/developer automation. |
| `config/` | Checked-in templates (`.env.example`, composition defaults) without secrets. |

### 3.3 Monorepo tooling rules

1. **pnpm** for strict dependency isolation.
2. **Turborepo** pipelines: `build`, `lint`, `typecheck`, `test`, `test:integration`.
3. Public APIs of packages exported via explicit `package.json` `exports`.
4. No deep imports across apps (`apps/web` must not import from `apps/api/src/...`).
5. Shared contracts flow **only** through `packages/*`.

### 3.4 Future module growth (not implemented now)

When capabilities arrive, prefer **bounded context folders** under `apps/api/src/modules/` (or separate apps if scale demands):

- `requirement-analysis`, `requirement-validation`, `scenario-generation`, `test-case-generation`, `knowledge`, `ai-review`, `automation-prep`, `release-management`, `impact-analysis`, `documentation-generation`, `reporting`, `sharepoint-integration`

Each module owns: domain entities (or slices), application use cases, infrastructure adapters, API controllers, and tests.

---

## 4. Backend Architecture

### 4.1 Style: Clean Architecture + DDD + modular monolith (first), extract later

**Initial shape:** modular monolith (`apps/api` + `apps/worker`) for velocity and transactional consistency.  
**Extraction path:** modules already isolated by interfaces/events so workers or services can split without rewriting domain.

### 4.2 Layer dependency rule

```
API (controllers, guards, presenters)
        │ depends on
        ▼
Application (use cases, DTOs, ports, orchestrators)
        │ depends on
        ▼
Domain (entities, value objects, domain events, repository interfaces, domain services)
        ▲
        │ implemented by
Infrastructure (DB, queue, AI providers, storage, search, email, SharePoint adapters)
```

**Forbidden**

- Domain importing NestJS, Prisma, OpenAI SDK, Express types
- Controllers containing business rules
- UI-driven decision logic mirrored only in frontend

### 4.3 Folder map inside `apps/api`

```
apps/api/src/
├── main.ts
├── app.module.ts
├── domain/
│   ├── entities/
│   ├── value-objects/
│   ├── enums/
│   ├── events/                 # Domain events
│   ├── repositories/           # Interfaces only
│   ├── services/               # Pure domain services
│   └── exceptions/
├── application/
│   ├── use-cases/
│   ├── dto/
│   ├── mappers/
│   ├── ports/                  # AI, clock, id, file, search ports
│   ├── policies/               # Authorization/tenancy policies
│   └── event-handlers/         # Application handlers for domain events
├── infrastructure/
│   ├── persistence/            # Prisma repositories, unit of work
│   ├── messaging/              # BullMQ, outbox publisher
│   ├── storage/                # S3 adapters
│   ├── search/                 # OpenSearch adapters
│   ├── ai/                     # Provider adapters + gateway
│   ├── auth/                   # OIDC validation adapters
│   ├── config/
│   └── telemetry/
├── api/
│   ├── controllers/
│   ├── dto/                    # Transport DTOs (request/response)
│   ├── guards/
│   ├── interceptors/
│   ├── filters/
│   └── presenters/
├── modules/                    # Nest modules composing bounded contexts
│   └── <context>/
├── knowledge/                  # Knowledge context wiring (future)
├── jobs/                       # Job registration (API side publishers)
└── shared/                     # API-local utilities (not general packages)
```

`apps/worker` mirrors `application` + `infrastructure` + `jobs` consumers; it does **not** duplicate domain— it depends on the same domain/application packages or path aliases established by the monorepo.

### 4.4 DDD building blocks (foundation definitions)

| Building block | Responsibility |
|----------------|----------------|
| Entity | Identity + lifecycle (e.g., future `FeatureDesignDocument`, `TestArtifact`) |
| Value Object | Immutable correctness (version numbers, trace IDs, hashes) |
| Aggregate | Consistency boundary for writes |
| Domain Event | Something that happened (e.g., `FddRegistered`, later `ScenariosGenerated`) |
| Repository interface | Persistence contract for aggregates |
| Domain service | Cross-entity rules that are still pure domain |
| Application use case | One business operation; transaction script over domain |
| Port | Outbound dependency abstraction (AI, storage, clock) |
| Adapter | Infrastructure implementation of a port |
| DTO | Boundary data shape; not a domain entity |
| Job | Asynchronous unit of work with idempotency key |

### 4.5 Event-driven internal workflow

Use events when:

- Multiple modules must react to a state change
- Work is long-running (AI reasoning/generation)
- Side effects should be retryable/isolated

Pattern:

1. Use case mutates aggregate inside a transaction.
2. Domain events recorded on aggregate.
3. **Outbox** persisted in the same transaction.
4. Publisher dispatches to Redis/BullMQ or message bus.
5. Handlers execute with idempotency keys.

Avoid events for simple request/response reads.

### 4.6 Cross-cutting backend concerns

| Concern | Placement |
|---------|-----------|
| AuthN | API guards + infrastructure auth adapter |
| AuthZ | Application policies |
| Validation | API DTO validation → application command validation |
| Logging | logger package + interceptors |
| Correlation | Middleware propagates `x-correlation-id` |
| Audit | Application/infrastructure audit port |
| Idempotency | Application + persistence for jobs and POST mutations |
| Feature flags | Config port (provider-agnostic) |

### 4.7 Testing strategy by layer

| Layer | Test type | Doubles |
|-------|-----------|---------|
| Domain | Unit | None (pure) |
| Application | Unit | Mock ports/repositories |
| Infrastructure | Integration | Testcontainers |
| API | Contract / thin e2e | Test app module |
| Jobs | Integration | Redis testcontainer |

---

## 5. Frontend Architecture

### 5.1 Goals

- Feature-based organization that scales with product modules
- Reusable UI kit separate from feature logic
- Zero business rules beyond presentation and form UX validation
- Typed API client generated from shared contracts where possible

### 5.2 Proposed `apps/web` structure

```
apps/web/src/
├── app/
│   ├── router.tsx
│   ├── providers.tsx
│   └── App.tsx
├── layouts/
│   ├── AppShellLayout.tsx
│   ├── AuthLayout.tsx
│   └── BlankLayout.tsx
├── pages/                      # Route entrypoints only (compose features)
├── features/
│   └── <feature-name>/
│       ├── components/
│       ├── hooks/
│       ├── api/
│       ├── model/              # View-models / mappers (not domain rules)
│       ├── routes.tsx
│       └── index.ts
├── components/                 # Shared presentational components
│   ├── ui/                     # Primitives (button, dialog, table)
│   └── patterns/               # Composed patterns (page header, empty state)
├── hooks/                      # App-wide hooks
├── lib/
│   ├── api-client/             # HTTP client, auth token injection
│   ├── query-client.ts
│   └── utils.ts
├── store/                      # Zustand stores (UI/session only)
├── theme/
│   ├── tokens.css
│   ├── ThemeProvider.tsx
│   └── typography.css
├── types/                      # Web-only types (prefer shared packages)
└── styles/
```

### 5.3 State management rules

| State kind | Tool | Examples |
|------------|------|----------|
| Server state | TanStack Query | FDD lists, artifact details |
| UI state | Zustand / local React state | sidebar open, table selection |
| Form state | React Hook Form | create/edit forms |
| Auth session | Dedicated auth module + http-only cookie or secure token storage strategy | user profile, tokens |

**Do not** store derived business decisions in client stores that the API already owns.

### 5.4 API layer

- `lib/api-client` wraps fetch with correlation ID, auth, error normalization.
- Feature `api/` folders expose query/mutation functions and TanStack Query keys.
- Transport errors map through `packages/errors` codes for consistent toasts/pages.
- No raw `fetch` inside random components.

### 5.5 Routing and layouts

- Route tree owned by TanStack Router.
- `pages/` remain thin: load layout + feature route modules.
- Auth-gated shell vs public/auth layouts are layout-level concerns.

### 5.6 Theming

- Design tokens in CSS variables under `theme/`.
- Components consume tokens, not hard-coded palette values.
- Dark/light support is optional; token architecture should allow it later.

### 5.7 Frontend testing

- Component tests: Testing Library
- Hook/API tests: Vitest with MSW
- E2E: Playwright in `tests/e2e`

---

## 6. Shared Packages

| Package | Contents | Rules |
|---------|----------|-------|
| `shared-types` | IDs, enums, public model shapes shared FE/BE | No runtime side effects; no Nest/React imports |
| `shared-constants` | Header names, limits, topic names | Constants only |
| `shared-utils` | Pure helpers (date, id formatting, result types) | Deterministic, tested |
| `shared-validation` | Zod schemas for cross-boundary contracts | Single source for request/response validation |
| `config` | Env parsing utilities and base schemas | Apps extend base schema |
| `logger` | Logger facade + bindings | Adapters inject pino/OTel |
| `errors` | `AppError`, codes, HTTP mapping helpers | Stable error code catalog |

### Design rules for shared packages

1. Prefer **small, composable packages** over a single `shared` junk drawer.
2. Version mindset: breaking changes require ADR + coordinated bumps.
3. Never put secrets, environment-specific URLs, or UI components in shared backend packages.
4. Validation schemas that define API contracts live in `shared-validation`, not duplicated in FE and BE.

---

## 7. Database Module Design (No Tables Yet)

### 7.1 Layout

```
database/
├── README.md
├── schemas/
│   ├── README.md               # Logical model notes (FDD-centric, lineage)
│   └── prisma/
│       └── schema.prisma       # Added when first persistence story starts
├── migrations/
│   └── README.md               # Migration rules; empty until first migration
├── seeds/
│   └── README.md               # Dev/demo seeds only
└── repositories/
    └── README.md               # Naming + ownership guidance for adapters
```

### 7.2 Principles deferred to implementation phase

- **Requirements-source lineage:** every generated artifact references the Approved Requirements Source identity/version (and Knowledge Intake provenance).
- **Soft delete / audit columns** where compliance requires.
- **Outbox table** for reliable events.
- **Idempotency keys** for jobs and webhook-like intakes.
- **Tenancy** prepared (tenant_id) even if single-tenant initially—decide via ADR before first migration.

### 7.3 Where repository *code* lives

- Interfaces: `apps/api/src/domain/repositories`
- Implementations: `apps/api/src/infrastructure/persistence`
- `database/repositories` holds standards, query notes, and review checklists—not a second ORM layer

---

## 8. Documentation Structure

```
docs/
├── architecture/
│   ├── ARCHITECTURE.md          # This document
│   ├── APPLICATION_ARCHITECTURE.md  # Logical apps/modules/workers (ADR 0013)
│   ├── SECURITY_AND_GOVERNANCE_ARCHITECTURE.md  # Security & governance (ADR 0014)
│   ├── IMPLEMENTATION_READINESS_AND_TECHNICAL_BLUEPRINT.md  # Gate 9 blueprint (ADR 0015)
│   ├── BACKEND.md               # Deep-dive (to be expanded)
│   ├── FRONTEND.md              # Deep-dive (to be expanded)
│   └── SECURITY.md              # Foundation security index
├── adr/
│   ├── README.md                # ADR process
│   └── 0001-record-architecture-decisions.md
├── api/
│   └── README.md                # OpenAPI publishing conventions
├── development/
│   ├── GETTING_STARTED.md
│   ├── LOCAL_ENVIRONMENT.md
│   └── TROUBLESHOOTING.md
├── standards/
│   ├── CODING_STANDARDS.md
│   └── CONTRIBUTION.md
├── ai/
│   └── README.md                # AI design principles (no prompts yet)
├── database/
│   └── README.md                # Data architecture principles
└── roadmap/
    └── ROADMAP.md               # Capability phases
```

Documentation is part of the product engineering system: decisions not written down will be rediscovered expensively.

---

## 9. Coding Standards (Summary)

Full normative rules live in [`docs/standards/CODING_STANDARDS.md`](../standards/CODING_STANDARDS.md) and [`docs/standards/CONTRIBUTION.md`](../standards/CONTRIBUTION.md).

Highlights:

- **Naming:** `PascalCase` types/classes, `camelCase` functions/variables, `kebab-case` files in web, Nest-style suffixed files in API (`*.controller.ts`).
- **Folders:** feature/bounded-context first; technical layer second inside backend modules.
- **Errors:** typed `AppError` with stable codes; never leak stack traces to clients.
- **Logging:** structured fields; no PII/secrets; always correlation ID.
- **Testing:** domain coverage mandatory for new domain logic; adapters need integration tests.
- **Comments:** explain *why*, not *what*; public packages require concise README.
- **Branches:** `main` protected; `feature/*`, `fix/*`, `chore/*`, `docs/*`.
- **Commits:** Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`).

---

## 10. Cross-Cutting Architecture Decisions

### 10.1 Modular monolith first

**Decision:** Start with modular monolith + worker.  
**Why:** Strong consistency for traceability; fewer distributed failure modes while the domain language is forming.  
**Trade-off:** Requires discipline to avoid a “big ball of mud.” Mitigate with module boundaries, lint/import rules, and ADRs.

### 10.2 Traceability as a platform invariant

Every generation path must be able to answer:

- Which Approved Requirements Source version produced this artifact?
- Which reasoning output justified it?
- Which model/provider/prompt version was used?
- Who/what approved or rejected it?

Even before tables exist, APIs and UI must not be designed in ways that make lineage optional.

### 10.3 Plugin architecture (extensibility)

Future capabilities register as plugins with:

- Manifest (name, version, capabilities)
- Ports implemented (e.g., `ImpactAnalyzer`, `DocExporter`)
- Event subscriptions
- Optional UI feature module loaded by capability flag

Core platform provides registry + lifecycle; plugins do not patch core internals.

### 10.4 Security baseline (foundation)

- OIDC SSO
- Least-privilege RBAC
- Secrets outside git
- Audit logging port
- Dependency scanning in CI
- Encrypted storage for sensitive artifacts at rest (provider-managed keys)

---

## 11. Phased Roadmap (Documentation Only)

See [`docs/roadmap/ROADMAP.md`](../roadmap/ROADMAP.md). Foundation → platform spine (identity, Knowledge Intake, lineage) → reasoning/generation modules → knowledge/search → integrations (SharePoint) → release/impact/reporting.

---

## 12. What We Deliberately Did Not Build Yet

- No business use cases
- No prompts or model workflows
- No UI pages
- No HTTP API endpoints
- No database tables
- No vendor lock-in to a single cloud or AI provider

This foundation exists so those features can be added **without rewriting the platform**.

---

## 13. Next Recommended Architecture Steps (When Instructed)

1. Accept/amend this ADR set and stack choices.
2. Initialize monorepo tooling (pnpm/turbo) and empty apps.
3. Add first ADR for tenancy model before any migration.
4. Define Knowledge Intake + Approved Requirements Source / Feature Version lineage vocabulary in domain (still no UI/AI).
5. Introduce OpenAPI and CI quality gates.

---

*End of architecture foundation document.*
