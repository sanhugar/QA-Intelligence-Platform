# AI Engine Specification Framework

**Document ID:** ATI-ENG-AI-ENGINE-001  
**Status:** Approved engineering specification (no implementation code)  
**Product:** AI QA Intelligence Platform (ATI v2)  
**Audience:** AI Platform Engineering, Backend Engineers, Implementation Engineer (Cursor), QA Architects  
**Phase:** Engineering Specification (post–Architecture approval)  
**Last updated:** 2026-07-25

---

## 0. Purpose and Scope

This document is the **canonical engineering specification** for every AI Engine in ATI.

It translates approved architecture into implementable engineering contracts so developers and AI coding assistants implement engines **consistently**, without redesigning architecture or inventing business concepts.

### This document is

- An engineering specification / implementation blueprint for AI engines  
- Provider-independent  
- Consuming of approved architecture  

### Companion implementation standard

Cross-engine **implementation practices** (lifecycle elaboration, quality, observability, governance, extensibility, compliance) are standardized in [AI_ENGINE_DEVELOPMENT_AND_IMPLEMENTATION_STANDARDS.md](./AI_ENGINE_DEVELOPMENT_AND_IMPLEMENTATION_STANDARDS.md). That document does **not** redefine this Framework’s catalog or contracts.

### This document is not

- An architecture redesign  
- An ADR  
- Application code, prompts, APIs, or database schemas  
- A redefinition of Domain, Knowledge, Decision, Orchestration, or Brain meaning  

### Normative stance

1. Architecture is the source of truth for *what* engines mean.  
2. This specification defines *how* engines are engineered to realize that meaning.  
3. Knowledge Intake entry and Approved Requirements Source **designation** remain owned by Orchestration (ADR 0011).  
4. Brain engines **consume** designated inputs and produce reasoned artifacts.  
5. Significant judgments are Decisions with Evidence (ADR 0008).  
6. QA heuristics come from the QA Intelligence Framework (ADR 0007) — not ad hoc prompting.

---

## 1. AI Engine Philosophy

ATI AI engines are **logical reasoning components** with a single responsibility. They operationalize the Brain, QA Intelligence, and Decision/Evidence architectures behind provider-agnostic ports.

| Principle | Engineering meaning |
|-----------|---------------------|
| **Engine independence** | Each engine has one cognitive duty; engines do not absorb sibling responsibilities |
| **Provider independence** | Engines call the AI Reasoning Port / Integration AI contracts only; no vendor SDK types in engine cores |
| **Explainability** | Every significant outcome must be explainable (why, evidence, assumptions, confidence) |
| **Evidence-driven processing** | Claims and artifacts cite evidence; LLM parametric recall is not evidence |
| **Deterministic orchestration** | Workflow Orchestrator owns stage order, modes, HITL pause/resume; engine internals may be non-deterministic but must satisfy contracts |
| **Human oversight** | HITL/Approval supremacy for governed dispositions; engines propose, humans dispose |
| **Reusability** | Engines are invocable from multiple workflows with the same contracts |
| **Extensibility** | New engines register via Engine Manifest without rewriting Core meaning |
| **Separation of concerns** | Cognition ≠ Intake ownership ≠ Domain invariants ≠ Integration transport ≠ UI |

**Hard engineering bans**

- Inventing product behavior absent from the Approved Requirements Source (or approved Clarification)  
- Promoting supporting knowledge to requirements  
- Auto-Approving Domain Approvals  
- Skipping reason-before-generate sequencing required by architecture  
- Binding engine logic to a single AI vendor  

---

## 2. AI Engine Catalog

Catalog entries realize approved architecture. Names in parentheses map alternate/user-facing labels to architectural engines.

**Status legend:** `Core` = Brain catalog; `Intake` = Orchestration-owned capability realized as an engine-shaped unit; `Extension` = reserved for later workflows (manifest-ready).

---

### 2.1 Intake Classification Engine (`Intake`)

| Aspect | Specification |
|--------|---------------|
| **Purpose** | Classify Knowledge Inputs for routing (type/signals) under Intake — does **not** designate Approved Requirements Source by itself |
| **Responsibilities** | Evidence-based classification; confidence for classification; escalate low confidence to HITL; never invent ARS status |
| **Primary inputs** | Intake Bundle content/metadata/source signals |
| **Expected outputs** | Classification labels, confidence, clarification needs |
| **Consumers** | Workflow Orchestrator; Intake Coordination module |
| **Dependencies** | Orchestration Architecture; Document preparation signals; Decision/Evidence for classification decisions |
| **Success criteria** | Classification present before generation workflows; low confidence triggers HITL; ARS designation remains a separate Intake stage |
| **Architecture source** | Knowledge Intake & Workflow Orchestration §2 |

---

### 2.2 Document Engine (`Core`)

| Aspect | Specification |
|--------|---------------|
| **Purpose** | Make already-intaken Knowledge Inputs machine-usable without changing meaning |
| **Responsibilities** | Normalize/parse; preserve version identity; carry forward Intake role labels; emit quality signals; do not own Intake entry or ARS designation |
| **Primary inputs** | Intake-registered content + metadata + Intake role designation when present |
| **Expected outputs** | Document Bundle(s) |
| **Consumers** | Understanding Engine; Orchestrator |
| **Dependencies** | Orchestration Intake; storage/parser ports via Integration |
| **Success criteria** | Integrity checks pass; generation paths refuse missing ARS designation; no invented content |
| **Architecture source** | AI Reasoning Architecture §2.2 |

---

### 2.3 Requirement Understanding Engine (`Core`)

| Aspect | Specification |
|--------|---------------|
| **Purpose** | Transform designated Approved Requirements Source into a structured Requirement Object |
| **Responsibilities** | Extract claims; map evidence; label explicit vs inferred; capture Ambiguities/Assumptions; never promote supporting inputs to requirements |
| **Primary inputs** | Document Bundle for ARS; optional supporting bundles; optional prior Requirement Object (delta) |
| **Expected outputs** | Draft Requirement Object; Evidence Map; Understanding Notes; confidence |
| **Consumers** | Validation Engine; RKG Engine; Orchestrator |
| **Dependencies** | Document Engine handoff; AI Port; optional Knowledge Engine (supporting only) |
| **Success criteria** | Explicit claims evidenced on ARS; inferences labeled; no silent invention |
| **Architecture source** | AI Reasoning Architecture Stage 1 / §2.3 |

---

### 2.4 Requirement Validation Engine (`Core`)

| Aspect | Specification |
|--------|---------------|
| **Purpose** | Challenge understanding for consistency, completeness, and testability before scenario reasoning |
| **Responsibilities** | Contradictions, untestable requirements, implied gaps; gate `pass` / `pass_with_warnings` / `fail`; never invent missing product behavior |
| **Primary inputs** | Draft Requirement Object; Evidence Map; optional supporting knowledge hits |
| **Expected outputs** | Validated Requirement Object; findings; clarification questions; gate; confidence |
| **Consumers** | RKG Engine; Orchestrator (HITL on fail) |
| **Dependencies** | Understanding Engine; optional Knowledge Engine (method patterns only) |
| **Success criteria** | Findings cite evidence or absence; fail blocks Scenario Reasoning |
| **Architecture source** | AI Reasoning Architecture Stage 2 / §2.4 |

---

### 2.5 Knowledge Resolution Engine (`Core` — architectural name: Knowledge Engine)

| Aspect | Specification |
|--------|---------------|
| **Purpose** | Retrieve **supporting** Knowledge Inputs / EKB items to improve reasoning without overriding ARS |
| **Responsibilities** | Intentional retrieval; label all hits `augmenting`; surface conflicts with ARS as findings; ARS wins |
| **Primary inputs** | Retrieval intent; scope; ACL/classification context |
| **Expected outputs** | Ranked supporting hits with provenance; conflict flags; availability status |
| **Consumers** | Understanding, Validation, Scenario, Review (read-only supporting) |
| **Dependencies** | Knowledge Architecture; Integration knowledge connectors; Orchestration degrade rules |
| **Success criteria** | Outage → ARS-only continue with lowered confidence; no silent ARS override |
| **Architecture source** | AI Reasoning Architecture §2.5; Knowledge Architecture |

---

### 2.6 Requirement Knowledge Graph Engine (`Core`)

| Aspect | Specification |
|--------|---------------|
| **Purpose** | Represent validated requirements as a graph for reasoning, coverage, and later impact analysis |
| **Responsibilities** | Build RKG nodes/edges from validated Requirement Object; preserve ARS evidence links; mark unknowns; never invent edges |
| **Primary inputs** | Validated Requirement Object; Evidence Map |
| **Expected outputs** | Requirement Knowledge Graph; graph confidence; unresolved nodes |
| **Consumers** | Scenario, Coverage, Impact (later), Final Package |
| **Dependencies** | Validation gate ≠ fail |
| **Success criteria** | Controlled edge vocabulary; integrity checks; no authoritative nodes contradicting ARS |
| **Architecture source** | AI Reasoning Architecture Stage 3 |

---

### 2.7 Scenario Reasoning Engine (`Core`)

| Aspect | Specification |
|--------|---------------|
| **Purpose** | Reason about *what should be tested* as scenarios — not detailed test cases |
| **Responsibilities** | Derive scenarios from requirements/RKG only; enforce ≥1 requirement link; apply QA heuristic dimensions; no fabrication to force progress |
| **Primary inputs** | Validated Requirement Object; RKG; validation findings; optional supporting patterns |
| **Expected outputs** | Scenario Set; rationale; confidence; blocked areas |
| **Consumers** | Test Case Reasoning; QA Review; Coverage |
| **Dependencies** | Validation gate; QA Intelligence Framework |
| **Success criteria** | Every scenario maps to ≥1 requirement; rationale present; unknowns preserved |
| **Architecture source** | AI Reasoning Architecture Stage 4 / §2.6 |

---

### 2.8 Test Case Reasoning Engine (`Core`)

| Aspect | Specification |
|--------|---------------|
| **Purpose** | Reason about *how to verify* each scenario through logical test cases |
| **Responsibilities** | Expand approved scenarios; primary scenario link invariant; no invented expected results; preserve permission/validation/audit implications |
| **Primary inputs** | Approved Scenario Package; Requirement Object / Understanding; RKG; Validation Report; optional supporting patterns |
| **Expected outputs** | Test Case Package; confidence; blocked cases + questions |
| **Consumers** | Test Case Review; QA Review; Coverage; Automation Readiness (later) |
| **Dependencies** | Scenario Review disposition; Scenario Reasoning; QA Intelligence |
| **Success criteria** | Every case maps to a primary scenario; verifiability or explicit pending clarification |
| **Architecture source** | AI Reasoning Architecture Stage 5 / §2.7 |
| **Detailed eng spec** | [TEST_CASE_REASONING_ENGINE_SPECIFICATION.md](./TEST_CASE_REASONING_ENGINE_SPECIFICATION.md) |

---

### 2.8a Test Case Review Engine (`Core` — eng specialization of §7)

| Aspect | Specification |
|--------|---------------|
| **Purpose** | Independent quality review of the Test Case Package before Coverage / Final QA Review |
| **Responsibilities** | Structural/trace/coverage/duplicate/quality review; findings + recommendations only; no silent rewrite; HITL when required |
| **Primary inputs** | Test Case Package; Approved Scenario Package; RKG; Validation; ARS; Clarifications |
| **Expected outputs** | Test Case Review Report; gate `ready` / `revise` / `blocked`; Approved Test Case Package (disposition) |
| **Consumers** | Coverage Analysis; QA Review (Stage 6); Automation Readiness; Orchestrator HITL |
| **Dependencies** | Test Case Reasoning; Scenario Review disposition; QA Intelligence; Decision/Evidence |
| **Success criteria** | No orphan cases; findings explainable; confidence ≠ approval; Stage 6 still required later |
| **Architecture source** | AI Reasoning Architecture §7 specialization (not a new Brain stage inventing requirements) |
| **Detailed eng spec** | [TEST_CASE_REVIEW_ENGINE_SPECIFICATION.md](./TEST_CASE_REVIEW_ENGINE_SPECIFICATION.md) |

---

### 2.9 QA Review Engine (`Core` — eng name: Final QA Review Engine)

| Aspect | Specification |
|--------|---------------|
| **Purpose** | Independent full-chain critique of the reasoning pipeline against Senior QA standards before Brain release |
| **Responsibilities** | Execute Review Strategy dimensions; verify pipeline completeness/trace/coverage/evidence/governance; classify findings; propose earliest rewind stage; never silently rewrite requirements or override prior disposition history |
| **Primary inputs** | Understanding; Validation; Knowledge; RKG; Approved Scenario/Test Case Packages; Scenario/Test Case Review Reports; Coverage Assessment Package; Human review outcomes; ARS |
| **Expected outputs** | QA Readiness Package (readiness verdict; findings; summaries; confidence; release recommendation); gate `ready` / `revise` / `blocked` |
| **Consumers** | Stage 8 Final Output; Documentation / Automation Readiness / Release Planning / Reporting / Dashboard / Versioning (later); Orchestrator HITL |
| **Dependencies** | Upstream artifacts; Decision/Evidence; QA Intelligence; Coverage measurement; early Scenario/Test Case Review gates do not replace this engine |
| **Success criteria** | Findings linked to artifacts; blockers escalate; confidence ≠ Ready; no invented product requirements |
| **Architecture source** | AI Reasoning Architecture Stage 6 / §2.8 / §7 |
| **Detailed eng spec** | [FINAL_QA_REVIEW_ENGINE_SPECIFICATION.md](./FINAL_QA_REVIEW_ENGINE_SPECIFICATION.md) |

---

### 2.10 Coverage Analysis Engine (`Core` — architectural name: Coverage Engine)

| Aspect | Specification |
|--------|---------------|
| **Purpose** | Prove scenarios/cases cover requirement-graph dimensions that matter for confidence |
| **Responsibilities** | Build Trace Matrix; measure dimension coverage; distinguish intentional out-of-scope from missed; unknowns ≠ covered |
| **Primary inputs** | ARS; RKG; Approved Scenario Package; Approved Test Case Package; Scenario/Test Case Review Reports; Validation Report; coverage policy |
| **Expected outputs** | Coverage Assessment Package (Coverage Report; Trace Matrix; gaps; redundancies; gate; confidence) |
| **Consumers** | Final QA Review; Final Package; Release Planning / Reporting / Dashboard (later); HITL |
| **Dependencies** | Distinct from QA Review (qualitative vs structured measurement); Approved packages from review gates |
| **Success criteria** | No false “covered”; policy thresholds enforced or explicitly waived |
| **Architecture source** | AI Reasoning Architecture Stage 7 / §2.9 |
| **Detailed eng spec** | [COVERAGE_ANALYSIS_ENGINE_SPECIFICATION.md](./COVERAGE_ANALYSIS_ENGINE_SPECIFICATION.md) |

---

### 2.11 Learning Engine (`Core` — non-authoritative)

| Aspect | Specification |
|--------|---------------|
| **Purpose** | Propose future reasoning-quality improvements from validated feedback — never rewrite historical ARS truth |
| **Responsibilities** | Emit Learning Candidates only; require governed promotion; no silent publish into EKB product facts |
| **Primary inputs** | Final packages; human dispositions; later execution/defect signals |
| **Expected outputs** | Learning Candidates; audit of proposals |
| **Consumers** | Knowledge governance promotion path |
| **Dependencies** | Knowledge Architecture learning rules; Decision audit |
| **Success criteria** | No auto-mutation of sealed packages or ARS |
| **Architecture source** | AI Reasoning Architecture §2.10 |

---

### 2.12 Automation Readiness Engine (`Extension`)

| Aspect | Specification |
|--------|---------------|
| **Purpose** | Assess automation candidacy/readiness of governed Test Cases without choosing a vendor framework |
| **Responsibilities** | Recommend Automation Asset prep; flag non-automatable cases; never invent requirements |
| **Primary inputs** | Sealed Test Case Set; Trace Matrix; policy |
| **Expected outputs** | Automation Recommendations; readiness disposition; confidence |
| **Consumers** | Automation module; Orchestration Automation Preparation workflow |
| **Dependencies** | Integration Automation contracts (later); Decision/Evidence |
| **Success criteria** | Framework-neutral recommendations; sealed inputs only |
| **Architecture source** | Orchestration §4.12 Automation Preparation Workflow |

---

### 2.13 Impact Analysis Engine (`Extension`)

| Aspect | Specification |
|--------|---------------|
| **Purpose** | Reason about change impact / regression risk using RKG, historical knowledge, and scope — not invent new requirements |
| **Responsibilities** | Impact Analysis artifact; regression recommendations; ARS primacy preserved |
| **Primary inputs** | Feature Version/scope; RKG; historical supporting knowledge; prior packages |
| **Expected outputs** | Impact Analysis; recommended regression scenarios/cases (candidates) |
| **Consumers** | Release Planning; Test Design |
| **Dependencies** | Knowledge Resolution (contextual); Domain Release/Feature scope |
| **Success criteria** | Historical knowledge remains non-authoritative for live requirements |
| **Architecture source** | Orchestration §4.11 |

---

### 2.14 Release Planning Engine (`Extension`)

| Aspect | Specification |
|--------|---------------|
| **Purpose** | Assist release scope/readiness planning using coverage, impact, and execution signals |
| **Responsibilities** | Release plan recommendations; risk notes; never redefine Domain Release ownership |
| **Primary inputs** | Release scope links; Coverage Reports; Impact Analysis; Execution/Defect signals when available |
| **Expected outputs** | Release planning recommendations; confidence; HITL gates for readiness claims |
| **Consumers** | Release Management; Reporting |
| **Dependencies** | Lateral Release model (Domain/EIM); nested Impact/Coverage workflows |
| **Success criteria** | Release remains lateral capability — not inserted into Brain primary verification chain |
| **Architecture source** | Orchestration §4.10; Domain §4 lateral Release |

---

### 2.15 Documentation Generation Engine (`Extension`)

| Aspect | Specification |
|--------|---------------|
| **Purpose** | Compose documentation drafts from sealed sources and Decision Records |
| **Responsibilities** | Produce draft/publishable docs; cite sources; no inventing product behavior |
| **Primary inputs** | Sealed Reasoning Packages; approved Documents; Decision Records |
| **Expected outputs** | Draft/Published Document candidates with provenance |
| **Consumers** | Document Management; HITL publish |
| **Dependencies** | EIM Document identity; Knowledge publish governance |
| **Success criteria** | No silent publish; classification present |
| **Architecture source** | Orchestration §4.13 |

---

### 2.16 Report Generation Engine (`Extension`)

| Aspect | Specification |
|--------|---------------|
| **Purpose** | Generate Reports from domain/EIM state and sealed AI artifacts |
| **Responsibilities** | Coverage/readiness/defect/AI Review summaries; respect ACL/classification |
| **Primary inputs** | Report definition; sealed artifacts; Execution/Defect/Coverage data |
| **Expected outputs** | Report artifact; export intent (via Integration Export later) |
| **Consumers** | Reporting module; Release/Admin stakeholders |
| **Dependencies** | Domain Reporting; Security classification |
| **Success criteria** | No invention of Requirements; exports governed |
| **Architecture source** | Orchestration §4.14; Application Reporting |

---

### 2.17 Future engines (extension manifests)

Additional engines may be added only via **Engine Manifest** (§12) that:

1. Declares single responsibility and non-overlap with Core engines  
2. Declares consumed architectures and forbidden redefinitions  
3. Declares workflow attachment points under Orchestration  
4. Passes Security & Governance review when privileged  

No new business concepts may be introduced by an engine manifest alone — Domain/ADR first if meaning changes.

---

## 3. Standard AI Engine Lifecycle

Conceptual lifecycle for every engine invocation:

```
Receive Input
      ↓
Validate Input
      ↓
Resolve Context
      ↓
Gather Evidence
      ↓
Reason
      ↓
Validate Output
      ↓
Confidence Assessment
      ↓
Self Review
      ↓
Human Review (when required by Decision/Orchestration policy)
      ↓
Publish Output  (or return Blocked / Revise / Degraded result)
```

| Step | Engineering expectation |
|------|-------------------------|
| **Receive Input** | Accept only contract-shaped inputs from Orchestrator/Application |
| **Validate Input** | Structural + authority checks (e.g., ARS designated for generation engines) |
| **Resolve Context** | Tenant/workspace/feature scope, classification, execution mode |
| **Gather Evidence** | Cite ARS/knowledge/human artifacts per Evidence Model — not LLM memory |
| **Reason** | Produce candidate artifacts/decisions; apply QA heuristics where applicable |
| **Validate Output** | Schema/invariants/trace rules for that engine |
| **Confidence Assessment** | Band + drivers; confidence ≠ certainty |
| **Self Review** | Engine-local consistency checks; may emit findings |
| **Human Review** | Orchestrator pauses when HITL triggers fire |
| **Publish Output** | Emit versioned artifact + Decision/Evidence/Explanation as required; never silent seal bypass |

Engines may short-circuit to failure/degraded outcomes at any step without fabricating success.

---

## 4. Standard AI Engine Contract

Logical contract every engine implements. **Not an API.**

| Contract facet | Expectation |
|----------------|-------------|
| **Input** | Typed logical payload; identity fields (`approvedRequirementsSourceId`/`Version`, `featureVersionId` when scoped); correlation/`reasoningRunId` |
| **Output** | Typed artifact(s); `validationStatus`; `confidence`; `unknowns[]`/`assumptions[]`; provenance |
| **Context** | Tenant/workspace scope; execution mode; policy thresholds; connector health signals (read-only) |
| **Evidence** | Evidence refs per Decision & Evidence Framework; no unattributed claims |
| **Validation** | Engine-specific validators + shared invariant checks (trace, ARS primacy) |
| **Confidence** | Band + drivers; aggregation rules for package rollups |
| **Explainability** | Explanation Packet (or equivalent facets) for significant decisions |
| **Traceability** | Parent artifact IDs; Trace Links where the engine creates design artifacts |
| **Error handling** | Normalized failure classes (insufficient input, contradiction, blocked, provider failure, unauthorized) |
| **Retry** | Idempotent retries for transient provider/integration failures; never retry by inventing data |
| **Completion** | Terminal states: `completed`, `completed_with_warnings`, `blocked`, `failed`, `awaiting_human` |

Cross-engine mandatory metadata (from Brain): `artifactId`, `artifactType`, `schemaVersion`, ARS identity fields, lineage parents, provenance (engineId/version, run id, provider/model ids when used).

---

## 5. Engine Interaction Model

| Mode | When | Rules |
|------|------|-------|
| **Sequential** | Default Brain pipeline Stages 1→8 | No later-stage consumption; gates enforced |
| **Parallel** | Independent supporting retrievals or non-conflicting analyses | Merge via Orchestrator; conflict → findings, not silent merge |
| **Shared context** | Feature Version / reasoning run context bag | Read-mostly; writes only through published artifacts |
| **Shared evidence** | Evidence store/refs for the run | Append-only for the run; no rewriting sealed evidence |
| **State transitions** | Artifact lifecycle + workflow checkpoints | Orchestrator owns workflow state; engines own artifact content |
| **Orchestration ownership** | Intake, designation, modes, HITL pause/resume, job continuation | [Orchestration Architecture](../architecture/KNOWLEDGE_INTAKE_AND_WORKFLOW_ORCHESTRATION_ARCHITECTURE.md) |
| **Brain sequencing** | Cognitive stage order inside a reasoning workflow | ReasoningOrchestrator sequences engines only; does not designate ARS |
| **Failure propagation** | Gate fail / blocked / provider outage | Orchestrator decides retry, rewind, degrade (ARS-only), or HITL — engines do not invent Requirements on failure |

---

## 6. Evidence Consumption Model

Engines consume evidence per [AI Decision & Evidence Framework](../architecture/AI_DECISION_AND_EVIDENCE_FRAMEWORK.md).

| Source | Engine usage |
|--------|--------------|
| **Approved Requirements Source** | Authoritative for product-behavior claims in Understanding→Test Case engines |
| **Enterprise Knowledge (published)** | Supporting patterns/facts; never above ARS |
| **Historical knowledge** | Context/impact/delta only; not live authority |
| **User clarification** | Becomes authorized input when accepted Clarification/Approval exists |
| **AI-generated artifacts** | Upstream sealed/validated artifacts are inputs; drafts are not product truth |
| **External cloud knowledge** | Via Integration + Intake; supporting; conflict → Finding |
| **Human decisions** | Highest for governance disposition (Accept/Override/Waive) |

**Precedence (product behavior):** ARS (+ approved Clarifications) → Human governance disposition → Validated Requirement Object (if consistent with ARS) → approved supporting knowledge tiers → historical/operational signals → **never** raw LLM parametric knowledge as evidence.

---

## 7. Confidence Behaviour

Consumes Brain §6 and Decision & Evidence §4.

| Behaviour | Engineering rule |
|-----------|------------------|
| **Inheritance** | Downstream confidence cannot ignore upstream blocking low bands |
| **Degradation** | Ambiguity, contradiction, knowledge outage, weak evidence, heavy inference → lower band |
| **Low-confidence handling** | Emit drivers; prefer Clarification/HITL over fabrication |
| **Human escalation** | Policy thresholds and Decision HITL triggers force `awaiting_human` |
| **Revalidation** | After Clarification or ARS change, rewind to earliest affected stage |
| **Propagation** | Package confidence ≤ blocking constituents; contradiction collapses High/Very High |
| **Independence** | Strong evidence of ambiguity can yield high confidence that Clarification is required |
| **Non-certainty** | Even Very High ≠ Approval |

---

## 8. Validation Behaviour

| Validation class | Typical owners |
|------------------|----------------|
| **Structural** | Every engine — schemaVersion, required fields, provenance |
| **Requirement** | Understanding + Validation engines — ARS evidence, no invention |
| **Traceability** | Scenario, Test Case, Coverage — link invariants |
| **Coverage** | Coverage Analysis Engine — matrix + dimensions |
| **Knowledge** | Knowledge Resolution + Knowledge publish path — authority class, ACL, non-conflict |
| **Decision** | All significant judgments — Decision Record + Evidence + Explanation completeness |
| **Intake** | Intake Classification + Orchestrator — classification/designation present before generation |
| **Security** | All engines — tenant scope, classification, no secret leakage in logs/explanations |

Validation failures produce typed findings and terminal/gate states — not silent fixes that invent truth.

---

## 9. Explainability Requirements

For significant engine outcomes, explanations must cover:

| Facet | Question answered |
|-------|-------------------|
| **Why** | Why this conclusion/artifact? |
| **Evidence** | Based on what attributable evidence? |
| **Assumptions** | What was assumed and labeled? |
| **Constraints** | What policy/mode/classification constrained the result? |
| **Confidence** | What band and drivers? |
| **Alternatives** | What alternatives were considered/rejected (when material)? |
| **Escalations** | What was blocked or sent to HITL and why? |
| **Human intervention** | What human disposition changed governance state? |

Minimal mechanical suppressions still require auditable reason codes. Opaque “model said so” is non-conformant.

---

## 10. Failure Handling

| Failure | Conceptual handling |
|---------|---------------------|
| **Missing information** | Ambiguities; partial artifacts with `blocked`; Clarification questions; no invention |
| **Contradictory evidence** | Findings; ARS wins for product behavior; gate fail/blocked as policy requires |
| **Low confidence** | Drivers + HITL/threshold policy; continue only if policy allows with warnings |
| **Knowledge gaps / outage** | Degrade to ARS-only; lower confidence; do not fabricate knowledge |
| **Invalid inputs** | Reject with structural errors; do not “repair” by guessing |
| **Unsupported content** | `DOCUMENT_INSUFFICIENT` / unsupported format; alternate adapter retry once if policy allows |
| **AI provider failures** | Integration fallback/retry; normalized errors; no Core corruption; optional multi-provider only behind ports |
| **User interruptions / HITL pause** | Orchestrator checkpoint; resume with human disposition as input |

---

## 11. Engine Quality Standards

| Standard | Expectation |
|----------|-------------|
| **Deterministic orchestration** | Same workflow inputs + same sealed evidence ⇒ same gate path; LLM variance confined behind contracts |
| **Explainability** | §9 satisfied for significant outcomes |
| **Traceability** | Lineage and Trace Links preserved |
| **Readability** | Artifacts use Domain ubiquitous language / Canonical Terminology |
| **Consistency** | No engine invents parallel vocabularies or authority rules |
| **Reliability** | Idempotent retries; checkpoint-friendly; non-corruption on failure |
| **Extensibility** | Manifest-based addition without Core rewrite |
| **Testability** | Engines testable with fake AI Port and fixture evidence; no vendor required for unit tests |

---

## 12. Extensibility

### 12.1 Registration

New engines register an **Engine Manifest** (logical) including:

- `engineId`, `engineVersion`, `schemaVersion`  
- Purpose / single responsibility  
- Input/output artifact types  
- Pipeline/workflow attachment points  
- Required ports (AI, Knowledge, Storage, etc.)  
- HITL triggers participated in  
- Forbidden ownership claims (must not claim Intake designation, Domain Approvals, etc.)  

### 12.2 Responsibilities & dependencies

Manifest must list consumed architectures and declare non-redefinition of Domain/Brain/Knowledge/Decision/Orchestration meaning.

### 12.3 Versioning

Breaking contract changes require coordinated version bumps and architecture/ADR review if meaning changes. Additive optional fields preferred.

### 12.4 Lifecycle compatibility

New engines must implement the standard lifecycle (§3) and contract facets (§4).

### 12.5 Governance

Security & Governance review for privileged engines; Orchestration catalog update for new workflows; no production enablement without stewardship.

---

## 13. Engineering Guidelines

### 13.1 Engineers must implement

- Engine cores behind Application AI Reasoning module / AI Processing workers  
- AI Port abstractions and Integration AI connectors (no vendor in Domain)  
- Decision/Evidence/Explanation emission for significant judgments  
- Traceability and ARS identity fields on artifacts  
- Gate and HITL cooperation with Workflow Orchestrator  
- Structured logging with correlation/`reasoningRunId` (no secrets/raw sensitive dumps)  
- Observability: stage timing, gate outcomes, provider provenance, confidence bands  
- Tests with fakes/fixtures proving invariants (no invention, ARS primacy, link rules)  

### 13.2 Engineers must not implement

- Architecture redesign or silent ADR changes  
- Prompts as hidden business rules without authorization/`prompts/` governance  
- APIs/schemas invented as substitutes for Domain/EIM meaning  
- Vendor SDKs inside engine domain logic  
- UI-only “approvals” that skip Domain Approval / Decision audit  
- FDD-only identity fields (`fddId`) — use Approved Requirements Source identity  
- Intake designation inside Brain engines  

### 13.3 Compliance checklist (per engine PR)

- [ ] Maps to catalog entry / manifest  
- [ ] Consumes Orchestration for Intake/HITL  
- [ ] Evidence precedence honored  
- [ ] Confidence ≠ Approval  
- [ ] Provider-agnostic  
- [ ] Explainability facets present  
- [ ] Failure modes do not corrupt sealed artifacts  

---

## 14. Architecture Dependencies

This specification **realizes** approved architecture; it does not redefine it.

| Architecture | How this specification realizes it |
|--------------|------------------------------------|
| [AI Reasoning Architecture](../architecture/AI_REASONING_ARCHITECTURE.md) (ADR 0004) | Catalog Core engines, lifecycle, contracts, Brain sequencing vs Orchestration ownership |
| [Knowledge Architecture](../architecture/KNOWLEDGE_ARCHITECTURE.md) (ADR 0005) | Knowledge Resolution Engine supporting-only retrieval and conflict rules |
| [QA Intelligence Framework](../architecture/QA_INTELLIGENCE_FRAMEWORK.md) (ADR 0007) | Heuristics/dimensions applied inside Scenario/Test Case/Review engines |
| [AI Decision & Evidence Framework](../architecture/AI_DECISION_AND_EVIDENCE_FRAMEWORK.md) (ADR 0008) | Evidence consumption, confidence behaviour, explainability, HITL |
| [Enterprise Data Architecture (EIM)](../architecture/ENTERPRISE_DATA_ARCHITECTURE.md) (ADR 0009) | Identity/version/seal expectations on published artifacts |
| [Knowledge Intake & Workflow Orchestration](../architecture/KNOWLEDGE_INTAKE_AND_WORKFLOW_ORCHESTRATION_ARCHITECTURE.md) (ADR 0011) | Intake Classification; orchestration ownership; extension workflow engines |
| [Application Architecture](../architecture/APPLICATION_ARCHITECTURE.md) (ADR 0013) | Placement in AI Reasoning module / AI Processing workers |
| [Security & Governance](../architecture/SECURITY_AND_GOVERNANCE_ARCHITECTURE.md) (ADR 0014) | AI accountability, audit, classification, least privilege |
| [Implementation Readiness Blueprint](../architecture/IMPLEMENTATION_READINESS_AND_TECHNICAL_BLUEPRINT.md) (ADR 0015) | Build order guidance; AI-assisted development governance |
| [Canonical Terminology](../architecture/CANONICAL_TERMINOLOGY.md) (ADR 0010) | Intake / ARS naming in all engine I/O |
| [Domain Architecture](../architecture/DOMAIN_ARCHITECTURE.md) (ADR 0006) | Artifact language and invariants engines must not violate |
| [Integration Architecture](../architecture/INTEGRATION_AND_EXTERNAL_SYSTEMS_ARCHITECTURE.md) (ADR 0012) | Provider/knowledge/storage access only via contracts |

---

## 15. Document Control

| Field | Value |
|-------|-------|
| **Version** | 1.0 |
| **Status** | Approved engineering specification (no code) |
| **Owner** | Chief AI Systems Architect / AI Platform Engineering Lead |
| **Dependencies** | ADRs 0004–0015 and architecture documents in §14 |
| **Related ADRs** | Consumes 0004, 0005, 0006, 0007, 0008, 0009, 0010, 0011, 0012, 0013, 0014, 0015 — **creates no new ADR** |
| **Last updated** | 2026-07-25 |

### Change History

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-07-25 | Initial AI Engine Specification Framework (Engineering Specification phase) |

---

*End of AI Engine Specification Framework.*
