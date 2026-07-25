# QA Intelligence Framework — Reasoning Heuristics & Test Design Model

**Document ID:** ATI-ARCH-QA-INTEL-001  
**Status:** Approved architecture (design only — no implementation)  
**Product:** AI QA Intelligence Platform (ATI v2)  
**Audience:** Principal AI & QA Architect, QA Leads, Chief Architect, Implementation Engineer  
**Depends on:** [DOMAIN_ARCHITECTURE.md](./DOMAIN_ARCHITECTURE.md), [CANONICAL_TERMINOLOGY.md](./CANONICAL_TERMINOLOGY.md), [AI_REASONING_ARCHITECTURE.md](./AI_REASONING_ARCHITECTURE.md), [KNOWLEDGE_ARCHITECTURE.md](./KNOWLEDGE_ARCHITECTURE.md), [AI_DEVELOPMENT_CHARTER.md](../standards/AI_DEVELOPMENT_CHARTER.md)  
**ADR:** [0007 — QA Intelligence Framework](../adr/0007-qa-intelligence-framework.md); terminology clarified by [ADR 0010](../adr/0010-knowledge-intake-terminology.md)  
**Last updated:** 2026-07-25

---

## 0. Purpose and Scope

This document defines **how ATI reasons like a Senior QA Engineer**.

It is the permanent **QA Intelligence Framework** used by every AI engine inside ATI when analyzing **Approved Requirements Sources** (FDD, PRD, SRS, or equivalent) after **Knowledge Intake**, and designing Scenarios and Test Cases.

### What this is

- A reusable, explainable, traceable, reviewable **reasoning model**
- A catalog of **heuristics**, **questions**, **coverage dimensions**, and **test design decisions**
- AI-provider independent, product independent, and domain extensible

### What this is not

- Prompt engineering or prompt text  
- Implementation, workflows-as-code, APIs, UI, schemas  
- LLM vendor selection  
- A license to invent product functionality  

### Foundational statements

1. ATI starts with **Knowledge Intake**; it **does not** jump from a raw Knowledge Input (including FDD) to test cases.  
2. For generation, the **Approved Requirements Source** is authoritative; supporting Knowledge Inputs never override or invent requirements.  
3. ATI **questions before it expands**, and **reviews before it finalizes**.  
4. Every Scenario and Test Case must remain **traceable** to Requirements (Domain Architecture).  
5. Heuristics **suggest what to investigate**; they do not create requirements.  
6. If evidence is missing, ATI records **Ambiguity** — it does not invent.  
7. Framework packs can extend domains (cloud, mobile, security…) without rewriting the core model.  

### Relationship to sibling architectures

| Document | Role |
|----------|------|
| Domain Architecture | *What* objects and invariants are |
| AI Reasoning Architecture | *Which engines/stages* run in the Brain pipeline |
| Knowledge Architecture | *What durable knowledge* may augment (never override Approved Requirements Source) |
| Canonical Terminology | Knowledge Intake vs Approved Requirements Source |
| **This Framework** | *How a Senior QA thinks* inside those engines |

---

## 1. QA Thinking Model

ATI follows the same cognitive sequence a Senior QA Engineer uses before writing durable test design.

```
Understand
  → Analyze
    → Question
      → Validate
        → Expand
          → Review
            → Measure Coverage
              → Generate
                → Self Review
                  → Finalize
```

**Hard rule:** `Generate` means producing reasoned Scenario/Test Case *design artifacts* after prior stages — never “ask a model for tests from a raw Knowledge Input” as the first act.

---

### 1.1 Understand

| Aspect | Definition |
|--------|------------|
| **Intent** | Build a faithful mental model of the Feature Version from the Approved Requirements Source (plus labeled supporting context). |
| **Senior QA behavior** | Read for purpose, actors, scope in/out, primary journeys, constraints. |
| **ATI outcome** | Structured understanding inputs toward the Requirement Object; evidence mapped. |
| **Stops if** | Document insufficient; critical sections unreadable. |
| **Must not** | Infer undocumented features to “complete” understanding. |

---

### 1.2 Analyze

| Aspect | Definition |
|--------|------------|
| **Intent** | Decompose the feature across QA lenses (functional, data, state, integration…). |
| **Senior QA behavior** | Apply heuristic packs (§2) that are **applicable** to evidenced content. |
| **ATI outcome** | Analysis notes: capabilities, rules, workflows, risks, implied QA dimensions. |
| **Must not** | Apply every heuristic blindly; applicability is evidence-driven. |

---

### 1.3 Question

| Aspect | Definition |
|--------|------------|
| **Intent** | Surface what a Senior QA would ask before trusting the design. |
| **Senior QA behavior** | Interrogate actors, failures, reversibility, audit, recovery, permissions. |
| **ATI outcome** | Questioning results: answered (evidenced), unanswered → Ambiguities / Clarification needs. |
| **Library** | §3 QA Question Library (conceptual questions — not prompts). |

---

### 1.4 Validate

| Aspect | Definition |
|--------|------------|
| **Intent** | Challenge consistency, testability, and honesty of understanding. |
| **Senior QA behavior** | Find contradictions, untestable statements, missing error paths where workflows imply them. |
| **ATI outcome** | Validation findings + gate (`pass` / `pass_with_warnings` / `fail`). |
| **Must not** | “Fix” the product by inventing missing behavior. |

---

### 1.5 Expand

| Aspect | Definition |
|--------|------------|
| **Intent** | Broaden design thinking across coverage dimensions without yet committing final cases. |
| **Senior QA behavior** | Consider negative, boundary, permission, integration, recovery, etc., where applicable. |
| **ATI outcome** | Expansion candidates tagged by dimension and linked to candidate Requirements. |
| **Must not** | Expand into dimensions with zero Approved Requirements Source signal unless Organization Standards mandate a checklist item (then record as standard-driven gap, not invented feature). |

---

### 1.6 Review (design critique)

| Aspect | Definition |
|--------|------------|
| **Intent** | Critique the expanded thinking for gaps, duplicates, and weak traceability *before* generation. |
| **Senior QA behavior** | Peer-review one’s own analysis notes. |
| **ATI outcome** | Pre-generation review findings; may rewind to Question/Validate/Expand. |

---

### 1.7 Measure Coverage

| Aspect | Definition |
|--------|------------|
| **Intent** | Evaluate which coverage dimensions (§4) are addressed vs open. |
| **Senior QA behavior** | Build a mental coverage matrix before writing the suite. |
| **ATI outcome** | Coverage plan / gap list that guides Generate. |
| **Rule** | Unknown ≠ covered. |

---

### 1.8 Generate

| Aspect | Definition |
|--------|------------|
| **Intent** | Materialize Scenarios, then Test Cases, using Test Design Strategy (§5) and Classification (§6). |
| **Senior QA behavior** | Write only what is justified; merge duplicates; keep atomicity. |
| **ATI outcome** | Scenario Set → Test Case Set with Trace Links and rationales. |
| **Must not** | Generate from raw intake skipping Understand→Validate; must not invent oracles. |

---

### 1.9 Self Review

| Aspect | Definition |
|--------|------------|
| **Intent** | Adversarial pass on generated design (§8). |
| **Senior QA behavior** | “What did I miss that a reviewer will catch?” |
| **ATI outcome** | Self-evaluation report; revise or proceed. |

---

### 1.10 Finalize

| Aspect | Definition |
|--------|------------|
| **Intent** | Package explainable, reviewable outputs for human Approval (Domain lifecycle). |
| **Senior QA behavior** | Hand over a clean, traced design with open questions listed honestly. |
| **ATI outcome** | Reasoning Package ready for AI Review / human Approval gates — not silent auto-approval. |

---

### 1.11 Mapping to Brain pipeline (alignment)

| QA Thinking stage | Primary Brain stage / engine |
|-------------------|------------------------------|
| Understand | Requirement Understanding |
| Analyze / Question | Understanding + Knowledge (patterns) |
| Validate | Requirement Validation |
| Expand | Pre-scenario analysis / RKG enrichment |
| Review + Measure Coverage | Pre-gates + Coverage planning |
| Generate | Scenario Reasoning → Test Case Reasoning |
| Self Review | QA Review Engine |
| Finalize | Coverage Validation → Final Output |

The Thinking Model is the **cognitive standard**; the Brain pipeline is the **operational orchestration**.

---

## 2. QA Reasoning Heuristics

Heuristics are reusable investigation patterns. Each has: purpose, when applicable, what to look for, and what to emit (findings, ambiguities, expansion candidates — not invented requirements).

**Applicability rule:** Run a heuristic only when the Approved Requirements Source (or binding Org Standard) provides signal, or when the heuristic is explicitly marked `always_baseline` for the product type. Supporting Knowledge Inputs may inform applicability notes but cannot invent requirements.

---

### 2.1 Requirement Understanding Heuristics

| Heuristic | Focus |
|-----------|--------|
| **Purpose** | Why does this feature exist? What problem does it solve? |
| **Scope** | What is in scope / out of scope? What is explicitly deferred? |
| **Actors** | Who/what initiates, approves, observes, or is affected? |
| **Business Goal** | What business outcome defines success? |
| **Dependencies** | Upstream features, services, data, configuration prerequisites? |
| **Assumptions** | What is implied but not stated? Mark as Assumption, not fact. |
| **Missing Information** | What must be known to test but is absent? |
| **Ambiguity** | Where can two competent readers disagree? |

**Emit:** understanding claims + Ambiguities/Assumptions + evidence links.

---

### 2.2 Functional Analysis Heuristics

| Heuristic | Focus |
|-----------|--------|
| **Capabilities** | Discrete abilities the feature provides |
| **Workflow** | Ordered steps to achieve outcomes |
| **CRUD** | Create/Read/Update/Delete (or equivalent) operations and constraints |
| **Business Rules** | Conditional logic that must hold |
| **Validations** | Input/process checks and failure signaling |
| **Calculations** | Formulas, aggregations, rounding, currency/time rules |
| **Decision Points** | Branches that change outcomes |
| **State Transitions** | How entities move between states (see also State Analysis) |

**Emit:** functional decomposition mapped to Requirements / candidate Requirements.

---

### 2.3 Boundary Analysis Heuristics

| Heuristic | Focus |
|-----------|--------|
| **Minimum / Maximum** | Limits stated or implied by rules |
| **Empty** | Empty strings/collections/optional absences |
| **Null** | Null/absent fields where structure allows |
| **Special Characters** | Encoding, locale, injection-prone inputs *as quality risk* (security deep-dive separate) |
| **Large Data** | Bulk payloads, long text, wide tables |
| **Duplicate** | Re-submit, unique constraints, idempotency |
| **Overflow** | Beyond max, precision loss |
| **Unexpected Input** | Types/formats outside contract |

**Emit:** boundary expansion candidates only where data/rules exist or standards require.

---

### 2.4 Negative Analysis Heuristics

| Heuristic | Focus |
|-----------|--------|
| **Invalid Inputs** | Violations of stated validation |
| **Permission Failure** | Denied actions for unauthorized actors |
| **API Failure** | Downstream/upstream API errors |
| **Database Failure** | Persistence errors, constraint violations |
| **Timeout** | Slow/no response behaviors if reliability mentioned or critical path |
| **Concurrency** | Conflicting updates, race expectations if implied |
| **Service Unavailable** | Dependency down |
| **Configuration Errors** | Misconfig / missing config |

**Emit:** negative Scenario candidates tied to evidenced rules/dependencies; else Ambiguity (“error behavior unspecified”).

---

### 2.5 Permission Analysis Heuristics

| Heuristic | Focus |
|-----------|--------|
| **Roles** | Role matrix implied by FDD |
| **Authorization** | Allow/deny decisions per action/resource |
| **Authentication** | Identity required vs anonymous |
| **Ownership** | Resource owner vs others |
| **Visibility** | Who can see what |
| **Delegation** | Act-on-behalf / impersonation if stated |

**Emit:** permission Scenarios; missing matrix → Ambiguity/Finding — do not invent roles.

---

### 2.6 Workflow Analysis Heuristics

| Heuristic | Focus |
|-----------|--------|
| **Happy Path** | Primary success journey |
| **Alternative Flow** | Allowed variants |
| **Exception Flow** | Business exceptions |
| **Recovery Flow** | Return to consistency after failure |
| **Cancellation** | User/system cancel mid-flight |
| **Rollback** | Undo/compensate |
| **Retry** | Safe/unsafe retry |

**Emit:** workflow-typed Scenarios; missing exception paths where steps imply them → gaps.

---

### 2.7 Integration Analysis Heuristics

| Heuristic | Focus |
|-----------|--------|
| **APIs** | Sync contracts, errors, auth |
| **Database** | Read/write paths, consistency |
| **Message Queue** | Async events, ordering, DLQ if stated |
| **Scheduler** | Cron/batch triggers |
| **Notifications** | Email/push/in-app signals |
| **Third Party Systems** | External dependencies |
| **Cloud Services** | Managed services touched by the feature |
| **Storage** | Files/blobs/object storage |

**Emit:** integration Scenarios; unspecified failure contracts → Ambiguities.

---

### 2.8 Data Analysis Heuristics

| Heuristic | Focus |
|-----------|--------|
| **Input / Output Data** | Shapes, mandatory fields, sensitivity |
| **Persistence** | What is stored vs transient |
| **Migration** | Schema/data movement if in scope |
| **Import / Export** | Bulk movement, formats |
| **Transformation** | Mapping rules |
| **Integrity** | Referential/business integrity |

---

### 2.9 State Analysis Heuristics

| Heuristic | Focus |
|-----------|--------|
| **Object States** | Named states in FDD |
| **Transitions** | Legal moves |
| **Lifecycle** | End-to-end life |
| **Illegal Transitions** | Disallowed moves |
| **Recovery** | State repair after failure |

---

### 2.10 Security Analysis Heuristics

| Heuristic | Focus |
|-----------|--------|
| **Authentication / Authorization** | Access control correctness |
| **Session** | Session lifecycle, fixation/expiry if relevant |
| **Encryption** | Data in transit/at rest when claimed |
| **Secrets** | Key/token handling expectations |
| **Audit / Logging** | Security-relevant trails |
| **Least Privilege** | Over-broad permissions |

**Rule:** Security heuristics produce Scenarios/Findings from evidenced controls or mandatory Org Standards — not penetration fantasies disconnected from the Approved Requirements Source.

---

### 2.11 Performance Analysis Heuristics

| Heuristic | Focus |
|-----------|--------|
| **Volume / Concurrency** | Stated load expectations |
| **Latency** | Response objectives |
| **Scalability / Reliability** | Scale and failure tolerance claims |
| **Resource Usage** | Limits/quotas if stated |

**Rule:** Without NFRs, do not invent SLAs; record missing measurability.

---

### 2.12 Accessibility Analysis Heuristics

| Heuristic | Focus |
|-----------|--------|
| **Keyboard** | Operable without pointer if UI |
| **Screen Readers** | Semantics/labels if UI |
| **Contrast** | Visual requirements if stated/standards |
| **Localization** | i18n/L10n if in scope |
| **Usability** | Critical UX failure risks evidenced in FDD |

---

### 2.13 Automation Analysis Heuristics

| Heuristic | Focus |
|-----------|--------|
| **Automation Feasibility** | Determinism, UI stability, env needs |
| **Stable Locators** | Identification risk (UI) |
| **Test Data** | Data setup/teardown needs |
| **Dependencies** | External systems blocking isolation |
| **Execution Time** | Suitability for CI vs nightly |
| **Maintenance Risk** | Brittleness forecast |

**Emit:** automation candidacy flags on Scenarios/Cases — not Automation Assets themselves (Automation Management context).

---

### 2.14 Regression Analysis Heuristics

| Heuristic | Focus |
|-----------|--------|
| **Impacted Modules / Features** | Blast radius from change |
| **Automation Impact** | Existing assets likely invalidated |
| **Backward Compatibility** | Compatibility claims/risks |
| **Release Risk** | What threatens the Release if missed |

**Inputs:** current Feature Version + Historical/Product Knowledge (contextual only).

---

### 2.15 Cloud Analysis Heuristics (conditional pack)

Apply **only when applicable** (FDD or Product type indicates cloud/infra concern).

| Heuristic | Focus |
|-----------|--------|
| **AWS / Azure / GCP** | Provider-specific services mentioned |
| **Networking** | VPC, ingress/egress, DNS, private endpoints |
| **Storage** | Buckets, disks, tiers, lifecycle |
| **Identity** | Cloud IAM vs app roles |
| **Security** | Cloud control planes, secrets managers |
| **Infrastructure / Kubernetes** | Clusters, deployments, probes, scaling |

**Emit:** cloud-dimension Scenarios/Findings; never assume a provider not evidenced.

---

### 2.16 Heuristic execution contract (logical)

For each applied heuristic instance, ATI records:

- Heuristic id + pack version  
- Applicability rationale (evidence refs or standard ref)  
- Outcomes: claims / candidates / ambiguities / findings  
- Confidence contribution (conceptual)  
- Trace to Requirements when candidates advance to Scenarios  

---

## 3. QA Question Library

Conceptual questions ATI must try to **answer from evidence**. Unanswerable questions become Ambiguities or Clarification requests. **These are not prompts.**

### 3.1 Actor & permission questions

- Who performs this action?  
- Who cannot perform this action?  
- What role is required?  
- Does ownership change authorization?  
- What is visible to each actor?  
- Can the action be delegated?  
- What happens when the actor is unauthenticated?  

### 3.2 Goal & scope questions

- What business goal does this serve?  
- What is explicitly out of scope?  
- What related features are impacted?  
- What does success look like to the business?  

### 3.3 Validation & data questions

- What validations apply?  
- What happens if validation fails?  
- What are min/max/empty/null behaviors?  
- Which fields are mandatory?  
- Is input idempotent on retry?  
- What data is persisted vs transient?  
- What transformations occur?  
- What integrity constraints apply?  

### 3.4 Workflow & state questions

- What is the happy path?  
- What alternative flows exist?  
- What exception flows exist?  
- Can this action be cancelled mid-way?  
- Can this action be reversed or rolled back?  
- What state changes occur?  
- Which transitions are illegal?  
- What recovery returns the system to a valid state?  
- Is retry safe?  

### 3.5 Rule & decision questions

- What business rule applies?  
- What decision points change the outcome?  
- What calculations must be verified?  
- What timing/ordering constraints exist?  

### 3.6 Integration questions

- What integrations exist?  
- What happens if an API fails?  
- What happens if a dependency is unavailable?  
- Are interactions sync or async?  
- What notifications occur?  
- What messages are published/consumed?  
- What third parties are involved?  

### 3.7 Security & audit questions

- What authentication is required?  
- What authorization checks occur?  
- What secrets are involved?  
- What must be audited?  
- What logging is required for compliance?  
- Is least privilege evidenced?  

### 3.8 Non-functional questions

- Are there volume/concurrency expectations?  
- Are latency/reliability targets stated and measurable?  
- What accessibility expectations apply?  
- What localization expectations apply?  

### 3.9 Observability & operations questions

- How does an operator detect failure?  
- Are health/readiness concerns in scope?  
- What configuration can break the feature?  

### 3.10 Automation & regression questions

- Is this Scenario automation-feasible?  
- What test data dependencies exist?  
- What existing Features/modules are in the blast radius?  
- What backward compatibility promises exist?  

### 3.11 Final honesty questions

- What do we still not know?  
- Which unknowns are blocking vs non-blocking?  
- Did we invent anything not evidenced?  

---

## 4. Coverage Dimensions

ATI evaluates design sufficiency across dimensions. Each dimension may be `applicable`, `not_applicable` (with rationale), `covered`, `partial`, or `gap`.

| Dimension | Meaning |
|-----------|---------|
| **Functional** | Core capabilities and stated behaviors are exercised |
| **Business Rules** | Conditional rules and calculations are verified |
| **Positive** | Intended success outcomes are covered |
| **Negative** | Invalid/unauthorized/failure paths are covered where implied |
| **Boundary** | Limits and edge inputs are covered where data/rules exist |
| **Permissions** | Authz/authn/visibility matrix coverage |
| **Workflow** | Happy/alternate/exception/cancel/retry paths |
| **Integration** | External/internal system interactions |
| **Data** | Persistence, transform, import/export, integrity |
| **State** | States, legal/illegal transitions |
| **Recovery** | Return to consistency after failure |
| **Regression** | Blast radius and compatibility risks |
| **Automation** | Feasibility/candidacy for automation considered |
| **Cloud** | Cloud/infra concerns when applicable |
| **Security** | Security controls evidenced or mandated |
| **Performance** | Stated NFRs are testable/covered |
| **Accessibility** | A11y expectations when UI/standards apply |
| **Audit** | Audit/logging obligations covered |
| **Compliance** | Regulatory/org policy obligations |
| **Reliability** | Timeout/unavailable/retry/failover where implied |

### Coverage rules

1. Marking `not_applicable` requires rationale.  
2. Org Standards may force a dimension to `applicable` even if FDD is silent — then gaps are “standard-driven,” not invented features.  
3. Coverage feeds Brain Coverage Engine and Self Review.  

---

## 5. Test Design Strategy

Decision principles only (no algorithms-as-code).

### 5.1 When one Requirement → one Scenario

Prefer **1:1** when the Requirement describes a single coherent behavior with one primary actor journey and one acceptance intent.

### 5.2 When multiple Requirements → one Scenario

Merge into one Scenario when:

- Requirements are inseparable steps of one user/system journey  
- Separating them would create non-executable fragments  
- Business meaning is the composed flow, not isolated clauses  

**Rule:** The Scenario must Trace Link **all** composed Requirements.

### 5.3 When one Scenario → many Test Cases

Split cases when different:

- Data boundaries, rule variants, role variants, or integration failure modes  
- Require distinct expected results  
- Would violate atomicity if combined  

Keep one primary Scenario link; use secondary links if a case also touches related Scenarios sparingly.

### 5.4 When a Requirement should NOT generate a Scenario

Do **not** generate when:

- Requirement is `Blocked` / non-testable pending Clarification  
- Requirement is pure documentation/non-behavioral with no verifiable outcome  
- Requirement is superseded/deprecated  
- Validation gate is `fail` for the Feature Version  
- The only way to scenarize it is by inventing missing behavior  

Instead: record Ambiguity/Finding; wait for Clarification.

### 5.5 When duplicate Scenarios should be merged

Merge when two Scenarios share:

- Same actor + same intent + same main flow + same Requirement set (or one is strict subset without added defect-discovery value)  

Do **not** merge merely similar wording if dimensions differ (e.g., permission-denied vs validation-failed).

### 5.6 Quality-over-volume principle

Prefer fewer well-traced, high defect-discovery Scenarios/Cases over exhaustive combinatorial explosion without rationale.

### 5.7 Ordering principle

Always: Requirements stable enough → Scenarios → Test Cases. Never Cases first.

---

## 6. Scenario Classification Model

Categories tag Scenarios for planning, Suites, and coverage. A Scenario may have one **primary** category and optional secondary tags.

| Category | When to create |
|----------|----------------|
| **Positive** | Evidenced success path for a capability/rule |
| **Negative** | Evidenced invalid/unauthorized/failure outcome |
| **Boundary** | Limit/edge conditions evidenced or mandated |
| **Validation** | Focused on validation rules and messages/behaviors |
| **Workflow** | Multi-step journey emphasis (incl. alt/exception) |
| **Permission** | Role/ownership/visibility focus |
| **Integration** | Cross-system interaction focus |
| **Recovery** | Failure→restore consistency focus |
| **Security** | Security control verification focus |
| **Regression** | Protects against impact on related Features/modules |
| **Cloud** | Cloud/infra-specific behavior when applicable |
| **Automation Candidate** | Tag when feasible/high value for automation (orthogonal tag) |
| **Smoke** | Minimal critical path proving feature “alive” |
| **Sanity** | Narrow check after small change |
| **End-to-End** | Cross-component business journey spanning integrations |
| **Exploratory Candidate** | High uncertainty areas better suited to guided exploration than scripted cases |
| **Risk Based** | Prioritized by Defect Knowledge / Release risk / severity |

### Classification rules

1. Primary category must match the main defect-discovery intent.  
2. `Exploratory Candidate` does not exempt Ambiguity recording.  
3. `Smoke`/`Sanity` are suite-oriented tags derived from criticality, not substitutes for Requirements.  

---

## 7. Test Case Quality Framework

Enterprise-quality Test Cases exhibit:

| Characteristic | Meaning |
|----------------|---------|
| **Readable** | A competent QA can understand intent without tribal knowledge |
| **Atomic** | One primary objective; not a mini regression dump |
| **Repeatable** | Same inputs/preconditions yield same expectations |
| **Independent** | Minimal hidden coupling to other cases’ side effects |
| **Traceable** | Primary Scenario (+ Requirements via Scenario) always present |
| **Measurable** | Expected results are observable/verifiable |
| **Deterministic** | Avoids flaky timing/order assumptions unless explicitly testing concurrency |
| **Maintainable** | Stable against irrelevant UI churn where possible; clear data needs |
| **Automation Friendly** | Feasible oracles, locators/data strategy considered |
| **Reviewable** | Rationale and evidence links allow Approval/AI Review |

### Anti-patterns (reject / rewrite)

- Untraced cases  
- Invented expected results  
- Multi-feature “kitchen sink” cases without E2E justification  
- Duplicates that add no new dimension  
- Cases that require unresolved blocking Ambiguities to execute  

---

## 8. AI Self-Evaluation

Before returning design output, ATI performs a conceptual self-evaluation (aligns with QA Review + Coverage in the Brain).

### 8.1 Mandatory checklist

| Check | Question |
|-------|----------|
| **Coverage** | Are applicable dimensions addressed or explicitly N/A? |
| **Completeness** | Are primary workflows and rules represented? |
| **Duplicates** | Are redundant Scenarios/Cases merged or justified? |
| **Ambiguity** | Are unknowns listed rather than filled? |
| **Missing Validation** | Validation rules without cases/scenarios? |
| **Missing Permissions** | Actors/actions without permission coverage? |
| **Missing Workflow** | Alt/exception/cancel/retry gaps where implied? |
| **Missing Integration** | Integrations without interaction/failure coverage? |
| **Missing Recovery** | Failure without recovery where consistency matters? |
| **Missing Boundary** | Limits without boundary coverage? |
| **Missing Negative** | Only happy paths where negatives are implied? |
| **Missing Business Rules** | Rules without verification? |
| **Missing Traceability** | Any Scenario/Case violating link invariants? |
| **Missing Automation Opportunities** | High-value deterministic paths untagged? |

### 8.2 Self-evaluation outcomes

- `proceed` — finalize package for human/AI Assurance gates  
- `revise` — rewind to earliest deficient Thinking stage  
- `block` — blocking Ambiguities/invariant breaks; do not present as complete design  

### 8.3 Explainability requirement

Every major Scenario/Case must answer: **why it exists**, **what Requirements it serves**, **which heuristics/dimensions motivated it**.

---

## 9. QA Intelligence Maturity Model

Maturity describes organizational/platform capability — not a marketing score.

| Level | Name | Capability |
|-------|------|------------|
| **L1** | Requirement Extraction | Pulls structured statements from Documents with evidence |
| **L2** | Requirement Understanding | Builds Requirement Object; Ambiguities/Assumptions honest |
| **L3** | Scenario Reasoning | Applies heuristics + questions; produces traced Scenarios |
| **L4** | Test Design Reasoning | Expands Scenarios into quality Test Cases with strategy rules |
| **L5** | Self Review | Systematic self-evaluation + Coverage dimensions before handoff |
| **L6** | Release Intelligence | Uses design + Execution/Defect/Release signals for readiness insight |
| **L7** | Continuous Learning | Governed promotion of patterns from feedback without silent drift |

### Maturity rules

1. A deployment must not claim Ln while failing Ln−1 invariants.  
2. Learning (L7) cannot weaken Approved Requirements Source primacy for generation or Approval rules.  
3. Product types may enable different heuristic packs without changing level definitions.  

---

## 10. Extensibility

### 10.1 Heuristic packs

Future packs register without altering core Thinking Model:

| Pack examples | Purpose |
|---------------|---------|
| AI Security Pack | Threat-informed but FDD/standard-grounded security depth |
| AI Performance Pack | Advanced NFR/perf scenario patterns |
| AI Compliance Pack | Regulated-industry checklists |
| AI Privacy Pack | Data minimization, consent, retention testing angles |
| AI Chaos / Resilience Pack | Controlled failure injection design (where in scope) |
| AI Accessibility Pack | Deeper WCAG-oriented design questions |
| Domain packs | Telecom, payments, healthcare, etc. |

**Pack manifest (logical):** id, version, applicable product types, heuristics list, question additions, coverage dimensions contributed, default applicability mode (`signal_driven` | `standard_driven`).

### 10.2 Extension rules

Allowed without framework redesign:

- New heuristic packs  
- New questions in the library  
- New Scenario secondary tags  
- New coverage dimensions (versioned)  

Require ADR:

- Skipping Understand→Validate before Generate  
- Allowing heuristics to invent Requirements  
- Making exploratory volume replace traceability  
- Auto-approving design from Self Review alone  

### 10.3 Product-type profiles

Profiles (Cloud Platform, SaaS, Desktop, API, Mobile, Infrastructure, Automation, Security, DevOps) select default pack sets and dimension baselines — they do not fork the Thinking Model.

---

## 11. Governance of the Framework

| Concern | Rule |
|---------|------|
| Ownership | Principal QA Architect owns framework; packs have stewards |
| Versioning | Framework and each pack are versioned; Reasoning Packages record versions used |
| Audit | Applicability rationales and self-eval outcomes retained with packages |
| Review | Framework changes via ADR; pack additions via manifest review |
| Traceability | Heuristic→Scenario/Case rationale preserved |

---

## 12. Architectural Risks and Mitigations

| Risk | Mitigation |
|------|------------|
| Heuristic explosion / noise | Applicability rules; quality-over-volume |
| Prompt leakage into “questions” | Questions remain conceptual; prompts live elsewhere when authorized |
| Invented NFRs/security | Evidence or Org Standard required |
| Checkbox theater | Self Review + Coverage gates + human Approval |
| Pack conflicts | Pack precedence + Finding on contradiction; FDD wins |

---

## 13. Implementation Readiness (Not Authorization)

This document authorizes the **QA reasoning standard only**.

When engines are later implemented, they must:

1. Execute Thinking stages in order  
2. Apply heuristic packs via manifests  
3. Use Question Library for Ambiguity detection  
4. Enforce Test Design Strategy and Quality Framework  
5. Record explainability metadata for review  

No prompts, APIs, or schemas are defined here.

---

## 14. Document Control

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-07-25 | Initial QA Intelligence Framework |

---

*End of QA Intelligence Framework.*
