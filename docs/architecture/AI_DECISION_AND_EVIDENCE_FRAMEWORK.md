# AI Decision & Evidence Framework

**Document ID:** ATI-ARCH-DECISION-001  
**Status:** Approved architecture (design only — no implementation)  
**Product:** AI QA Intelligence Platform (ATI v2)  
**Audience:** Principal AI Platform Architect, QA Architects, Product Owner, Compliance, Implementation Engineer  
**Depends on:** [DOMAIN_ARCHITECTURE.md](./DOMAIN_ARCHITECTURE.md), [CANONICAL_TERMINOLOGY.md](./CANONICAL_TERMINOLOGY.md), [AI_REASONING_ARCHITECTURE.md](./AI_REASONING_ARCHITECTURE.md), [KNOWLEDGE_ARCHITECTURE.md](./KNOWLEDGE_ARCHITECTURE.md), [QA_INTELLIGENCE_FRAMEWORK.md](./QA_INTELLIGENCE_FRAMEWORK.md), [AI_DEVELOPMENT_CHARTER.md](../standards/AI_DEVELOPMENT_CHARTER.md)  
**ADR:** [0008 — AI Decision and Evidence Framework](../adr/0008-ai-decision-and-evidence-framework.md); terminology clarified by [ADR 0010](../adr/0010-knowledge-intake-terminology.md)  
**Last updated:** 2026-07-25

---

## 0. Purpose and Scope

This document defines how ATI **makes, explains, validates, and governs AI decisions**.

It ensures ATI never behaves as a black-box AI. Every recommendation, Scenario, Test Case, clarification request, coverage judgment, automation suggestion, and review finding must be:

- **Evidence-based**
- **Explainable** to QA Engineers
- **Traceable** to Requirements / Documents / Knowledge versions
- **Reviewable** by humans
- **Auditable** over time
- **Reproducible** from the same inputs and framework versions

### Explicitly out of scope

- Code, APIs, UI, prompts, database schemas  
- AI model / vendor selection  
- Mathematical confidence formulas  

### Design principles (normative)

1. Every AI decision must have supporting evidence.  
2. AI confidence is not certainty.  
3. Unknown information must remain unknown.  
4. Decisions must be explainable to QA Engineers.  
5. Every recommendation must be traceable.  
6. Human review always overrides AI.  
7. AI never silently changes approved artifacts.  
8. Confidence and evidence are independent concepts.  
9. Business evidence (Approved Requirements Source for generation) always has higher priority than supporting Knowledge Inputs and general AI knowledge.
10. Every decision should be reproducible from the same inputs (and recorded framework/pack versions).
11. Platform entry is Knowledge Intake; FDD is one Knowledge Input, not the sole assumed start. 

### Relationship to sibling architectures

| Document | Role relative to this framework |
|----------|----------------------------------|
| Domain Architecture | Objects that decisions act upon; Approval invariants |
| AI Reasoning Architecture | Engines/pipeline that *host* decisions |
| QA Intelligence Framework | Heuristics/questions that *motivate* many decisions |
| Knowledge Architecture | Evidence sources and authority hierarchy for knowledge |
| **This Framework** | Decision lifecycle, evidence, explainability, audit, HITL |

---

## 1. Decision Framework

An **AI Decision** is a discrete, recorded judgment ATI makes while reasoning or recommending. Decisions are first-class business facts — not ephemeral model tokens.

### 1.1 Decision lifecycle

```
Evidence Collection
  → Evidence Validation
    → Reasoning
      → Decision
        → Confidence Assessment
          → Human Review (when required)
            → Approval
              → Execution
                → Learning
```

---

### 1.2 Evidence Collection

| Aspect | Definition |
|--------|------------|
| **Purpose** | Gather candidate evidence relevant to the pending decision intent. |
| **Behavior** | Pull from Knowledge Intake / Approved Requirements Source, Requirement Object, Trace Links, eligible supporting Knowledge, standards, history — per Knowledge hierarchy and Retrieval Intents. |
| **Rules** | Prefer higher-authority business evidence; do not treat LLM parametric memory as collected evidence. |
| **Output** | Evidence Candidate Set with provisional provenance. |

---

### 1.3 Evidence Validation

| Aspect | Definition |
|--------|------------|
| **Purpose** | Determine which candidates are eligible, current, non-conflicting, and appropriately authoritative. |
| **Behavior** | Apply Evidence Model (§3): freshness, approval status, scope match, Approved Requirements Source conflict checks, authority class. |
| **Rules** | Invalid/stale/unapproved/`candidate` supporting knowledge cannot support product-fact decisions. |
| **Output** | Validated Evidence Set + rejected candidates with reasons. |

---

### 1.4 Reasoning

| Aspect | Definition |
|--------|------------|
| **Purpose** | Apply QA Thinking / heuristics / question library / design strategy to validated evidence. |
| **Behavior** | Produce a Reasoning Trace: steps, heuristics applied, alternatives considered, unknowns found. |
| **Rules** | Reasoning may not invent evidence; gaps become Ambiguities or decision suppression. |
| **Output** | Reasoning Trace (explainability backbone). |

---

### 1.5 Decision

| Aspect | Definition |
|--------|------------|
| **Purpose** | Commit a typed decision outcome (§2) with links to evidence and affected artifacts. |
| **Behavior** | Emit Decision Record: type, outcome, targets, rationale summary, alternatives. |
| **Rules** | No decision without at least one validated evidence item **or** an explicit `insufficient_evidence` / `blocked` outcome. |
| **Output** | Decision Record (pending confidence + review). |

---

### 1.6 Confidence Assessment

| Aspect | Definition |
|--------|------------|
| **Purpose** | Attach a confidence assessment **independent** of whether evidence exists. |
| **Behavior** | Apply Confidence Framework (§4); record drivers and uncertainty. |
| **Rules** | High confidence never converts unknowns into knowns; low confidence does not erase strong evidence. |
| **Output** | Confidence Assessment on the Decision Record. |

---

### 1.7 Human Review (when required)

| Aspect | Definition |
|--------|------------|
| **Purpose** | Route decisions that meet HITL triggers (§7) to authorized humans. |
| **Behavior** | Present Explanation Packet (§5); capture accept / reject / modify / clarify. |
| **Rules** | Human disposition overrides AI outcome for governance. |
| **Output** | Review Record linked to Decision. |

---

### 1.8 Approval

| Aspect | Definition |
|--------|------------|
| **Purpose** | Authorize the decision’s effect on durable artifacts (Domain Approval semantics). |
| **Behavior** | Role-gated Approval transitions Scenarios/Cases/Packages/Knowledge promotions. |
| **Rules** | AI disposition alone cannot Approve product-fact or design artifacts that Domain marks as requiring human Approval. |
| **Output** | Approval Record (or rejection / return). |

---

### 1.9 Execution

| Aspect | Definition |
|--------|------------|
| **Purpose** | Apply the approved decision’s effect (create/link/suppress/recommend/flag). |
| **Behavior** | Mutate only allowed draft/generated artifacts; never silent mutation of Approved/Published items. |
| **Rules** | Execution is auditable; idempotent where re-applied. |
| **Output** | Artifact changes + Execution-of-Decision audit entry. |

---

### 1.10 Learning

| Aspect | Definition |
|--------|------------|
| **Purpose** | Capture signals from human dispositions and downstream outcomes for governed improvement. |
| **Behavior** | Create Learning Candidates only; promote via Knowledge/Learning governance. |
| **Rules** | Learning never auto-changes published knowledge or past Approved artifacts. |
| **Output** | Learning Candidate (+ eventual promotion audit if approved). |

---

### 1.11 Decision states (logical)

`collecting_evidence → evidence_validated → reasoned → decided → confidence_assigned → pending_review | auto_eligible → approved | rejected | returned | blocked → executed → learned_signal_captured`

Side states: `superseded`, `voided` (when upstream Feature Version supersedes).

---

## 2. Decision Categories

Each category is a **Decision Type** with a stable id. Engines must emit Decision Records using these types (or registered extensions §10).

---

### 2.1 Requirement Interpretation

| Field | Definition |
|-------|------------|
| **Purpose** | Interpret Approved Requirements Source statements into structured Requirement meaning. |
| **Inputs** | Approved Requirements Source Document (FDD/PRD/SRS/equivalent), parse structure, glossary; supporting inputs labeled non-authoritative |
| **Expected Outputs** | Interpretation decision + links to Requirement / Requirement Object facets + evidence spans |
| **Trigger** | Requirement Understanding stage |
| **Success Criteria** | Explicit claims evidenced; inferences labeled; no silent invention |
| **Failure Handling** | `blocked` / Ambiguity; do not invent |

---

### 2.2 Requirement Clarification

| Field | Definition |
|-------|------------|
| **Purpose** | Decide that human Clarification is required (or that a Clarification resolves an Ambiguity). |
| **Inputs** | Ambiguities, conflicting statements, unanswered Question Library items |
| **Expected Outputs** | Clarification Request decision or Clarification Acceptance mapping |
| **Trigger** | Unresolvable Question/Validate gaps; HITL rules |
| **Success Criteria** | Question is specific, evidenced, and blocking vs non-blocking classified |
| **Failure Handling** | If AI “answers” without evidence → invalid decision; discard |

---

### 2.3 Scenario Creation

| Field | Definition |
|-------|------------|
| **Purpose** | Create a Scenario from Requirements using Test Design Strategy. |
| **Inputs** | Validated Requirements, RKG, heuristics outcomes, coverage plan |
| **Expected Outputs** | Scenario Creation decision + Trace Links + rationale |
| **Trigger** | Scenario Reasoning after validation gate allows |
| **Success Criteria** | ≥1 Requirement link; category assigned; no invented behavior |
| **Failure Handling** | Suppress creation; raise Finding/Ambiguity |

---

### 2.4 Scenario Merge

| Field | Definition |
|-------|------------|
| **Purpose** | Merge duplicate/overlapping Scenarios that lack distinct defect-discovery value. |
| **Inputs** | Candidate Scenario set, Trace Links, classification |
| **Expected Outputs** | Merge decision identifying survivors and absorbed ids |
| **Trigger** | Duplicate detection during Expand/Review/Self Review |
| **Success Criteria** | Merged Scenario retains union of Requirement links; rationale recorded |
| **Failure Handling** | Keep separate if dimensions differ materially |

---

### 2.5 Scenario Suppression

| Field | Definition |
|-------|------------|
| **Purpose** | Decide not to create or to withdraw a Scenario candidate. |
| **Inputs** | Requirement status, Ambiguities, design strategy non-generation rules |
| **Expected Outputs** | Suppression decision with reason code (untestable, invent-risk, duplicate, out of scope) |
| **Trigger** | Pre-generation gates; Self Review |
| **Success Criteria** | Suppression reason explainable; not used to hide coverage gaps silently |
| **Failure Handling** | If suppression hides a mandatory standard-driven gap → escalate Finding |

---

### 2.6 Test Case Expansion

| Field | Definition |
|-------|------------|
| **Purpose** | Expand a Scenario into one or more Test Cases. |
| **Inputs** | Approved/Generated Scenario, rules/data variants, quality framework |
| **Expected Outputs** | Expansion decisions per Case + primary Scenario link |
| **Trigger** | Test Case Reasoning |
| **Success Criteria** | Atomic, measurable, traced; oracles evidenced or marked unknown |
| **Failure Handling** | Block cases needing Clarification; do not invent expected results |

---

### 2.7 Boundary Coverage

| Field | Definition |
|-------|------------|
| **Purpose** | Decide whether boundary Scenarios/Cases are warranted and which. |
| **Inputs** | Data limits/rules, Boundary heuristics, coverage dimension status |
| **Expected Outputs** | Boundary inclusion/exclusion decisions |
| **Trigger** | Expand / Measure Coverage |
| **Success Criteria** | Applicability evidenced or standard-driven; else N/A with rationale |
| **Failure Handling** | Missing limits → Ambiguity, not fabricated min/max |

---

### 2.8 Negative Coverage

| Field | Definition |
|-------|------------|
| **Purpose** | Decide negative-path coverage inclusions. |
| **Inputs** | Validations, permissions, dependency failure signals |
| **Expected Outputs** | Negative Scenario/Case decisions or explicit gap |
| **Trigger** | Expand / Self Review |
| **Success Criteria** | Tied to evidenced failure modes |
| **Failure Handling** | Unspecified error behavior → Clarification/Finding |

---

### 2.9 Permission Coverage

| Field | Definition |
|-------|------------|
| **Purpose** | Decide permission-matrix coverage for actors/actions. |
| **Inputs** | Actors, roles, auth statements |
| **Expected Outputs** | Permission Scenario decisions or Ambiguity if matrix missing |
| **Trigger** | Permission heuristics / coverage measurement |
| **Success Criteria** | Allow and deny paths considered where roles exist |
| **Failure Handling** | Unknown permissions → HITL Clarification; no invented roles |

---

### 2.10 Workflow Coverage

| Field | Definition |
|-------|------------|
| **Purpose** | Decide coverage of happy/alt/exception/cancel/retry/recovery flows. |
| **Inputs** | Workflows in Requirement Object / FDD |
| **Expected Outputs** | Workflow-typed Scenario decisions + gap list |
| **Trigger** | Workflow heuristics |
| **Success Criteria** | Primary journey covered; implied exception gaps flagged |
| **Failure Handling** | Incomplete flows → Findings, not invented steps |

---

### 2.11 Integration Coverage

| Field | Definition |
|-------|------------|
| **Purpose** | Decide coverage for integrations and dependency failures. |
| **Inputs** | APIs, queues, notifications, third parties |
| **Expected Outputs** | Integration Scenario decisions / gaps |
| **Trigger** | Integration heuristics |
| **Success Criteria** | Stated integrations addressed; failure contracts evidenced or Ambiguous |
| **Failure Handling** | Missing contracts → Clarification |

---

### 2.12 Cloud Knowledge Usage

| Field | Definition |
|-------|------------|
| **Purpose** | Decide whether/ how cloud Knowledge may augment reasoning. |
| **Inputs** | Product type, FDD cloud signals, Cloud Knowledge hits |
| **Expected Outputs** | Use / ignore / conflict-flag decisions per knowledge item |
| **Trigger** | Retrieval Intent for cloud pack |
| **Success Criteria** | Hierarchy respected; FDD conflicts surfaced |
| **Failure Handling** | On conflict, Approved Requirements Source wins; supporting knowledge not applied as fact |

---

### 2.13 Knowledge Retrieval

| Field | Definition |
|-------|------------|
| **Purpose** | Decide what to retrieve (domain, caps, sufficiency stop). |
| **Inputs** | Retrieval Intent, policy pack, active Feature Version scope |
| **Expected Outputs** | Retrieval plan decision + Context Packet citation list |
| **Trigger** | Engine requests augmentation |
| **Success Criteria** | Intentional, minimal, eligible-only |
| **Failure Handling** | Outage → proceed Approved Requirements Source–only with `knowledge_unavailable` |

---

### 2.14 Automation Recommendation

| Field | Definition |
|-------|------------|
| **Purpose** | Recommend automation candidacy / priority for Scenarios or Cases. |
| **Inputs** | Automation heuristics, case quality attributes, dependencies |
| **Expected Outputs** | Recommendation decision (candidate / not / deferred) + rationale |
| **Trigger** | Automation Analysis / Self Review |
| **Success Criteria** | Does not create Automation Assets; does not skip design Approval |
| **Failure Handling** | Insufficient feasibility signal → `deferred` with reasons |

---

### 2.15 Regression Recommendation

| Field | Definition |
|-------|------------|
| **Purpose** | Recommend regression focus areas from blast radius. |
| **Inputs** | Feature delta, Historical/Product Knowledge, Defect risk signals |
| **Expected Outputs** | Regression Scenario/Suite recommendations |
| **Trigger** | Regression heuristics; Release planning |
| **Success Criteria** | Historical behavior not resurrected as current Requirements |
| **Failure Handling** | Weak impact signal → low-confidence recommendation + HITL if release-critical |

---

### 2.16 Release Impact Recommendation

| Field | Definition |
|-------|------------|
| **Purpose** | Advise Release readiness risk from coverage/execution/defect signals. |
| **Inputs** | Release scope, Coverage Assessments, Executions, Defects, open Findings |
| **Expected Outputs** | Impact/risk recommendation decision for Release Managers |
| **Trigger** | Release Testing / readiness gates |
| **Success Criteria** | Evidence-cited; waivers explicit if claiming ready despite gaps |
| **Failure Handling** | Incomplete evidence → `insufficient_evidence` disposition |

---

### 2.17 AI Review Finding

| Field | Definition |
|-------|------------|
| **Purpose** | Raise a Finding from AI Review / Validation / Self Review. |
| **Inputs** | Package under review, checklist, conflicts |
| **Expected Outputs** | Finding decision with severity, target, rewind suggestion |
| **Trigger** | Review stages |
| **Success Criteria** | Finding cites artifacts/evidence or explicit absence |
| **Failure Handling** | Unsupported finding → invalid; omit or mark `unsupported` |

---

### 2.18 Duplicate Detection

| Field | Definition |
|-------|------------|
| **Purpose** | Detect duplicate Scenarios/Cases/decisions. |
| **Inputs** | Artifact set, Trace Links, classifications |
| **Expected Outputs** | Duplicate cluster decision → merge/suppress recommendations |
| **Trigger** | Review / Self Review / Generate post-pass |
| **Success Criteria** | Clusters explainable; false merges avoided when dimensions differ |
| **Failure Handling** | Uncertain duplicates → recommend human review |

---

### 2.19 Coverage Sufficiency

| Field | Definition |
|-------|------------|
| **Purpose** | Judge whether coverage is sufficient per policy for a Feature Version/Release. |
| **Inputs** | Coverage dimensions, Trace Matrix, policy pack, waivers |
| **Expected Outputs** | Sufficiency decision (`sufficient` / `partial` / `insufficient`) |
| **Trigger** | Measure Coverage / Coverage Validation |
| **Success Criteria** | Unknowns not counted covered; N/A rationalized |
| **Failure Handling** | Below threshold → revise directives; escalate if release-bound |

---

### 2.20 Risk Assessment

| Field | Definition |
|-------|------------|
| **Purpose** | Assess quality/delivery risk for Feature Version or Release. |
| **Inputs** | Ambiguities, Findings, Defect Knowledge, coverage gaps, NFR gaps |
| **Expected Outputs** | Risk band + drivers + recommended mitigations (test design focus) |
| **Trigger** | After Validate/Coverage; before Finalize/Release gates |
| **Success Criteria** | Drivers evidenced; not alarmist without signal |
| **Failure Handling** | Sparse inputs → `risk_unknown` rather than false precision |

---

### 2.21 Cross-cutting decision record fields (logical)

Every Decision Record includes (conceptually — not a schema):

- `decisionId`, `decisionType`, `decisionVersion`  
- `featureVersionId`, `approvedRequirementsSourceVersion`, `reasoningRunId`  
- `outcome`, `targets[]`  
- `evidenceRefs[]`, `requirementRefs[]`, `knowledgeRefs[]`  
- `assumptions[]`, `unknowns[]`  
- `alternativesConsidered[]`  
- `confidenceAssessment`  
- `reviewStatus`, `approvalStatus`  
- `frameworkVersions` (Decision Framework, QA pack, Knowledge policy)  
- `reproducibilityFingerprint` (inputs + versions identity)  

---

## 3. Evidence Model

### 3.1 What qualifies as evidence

Evidence is an attributable artifact or statement that can be cited. **LLM recollection is not evidence.**

| Evidence class | Examples | Typical reliability |
|----------------|----------|---------------------|
| **Primary business evidence** | Current Approved Requirements Source spans (FDD/PRD/SRS/equivalent); approved Clarifications | Highest for product behavior |
| **Structured interpretation** | Requirement Object (validated), Requirements, RKG nodes | High if consistent with Approved Requirements Source; defective if conflicting |
| **Approved organizational knowledge** | Published Knowledge Items (standards, product facts) | High within authority class; never above Approved Requirements Source |
| **Contextual history** | Historical Features/specs, prior Reasoning Packages, transcripts | Medium for impact; low as live authority |
| **Product / cloud documentation** | Approved cloud/platform docs mirrors | Medium; conflict → Finding |
| **Human Review / Approval** | Review Records, Approvals, Waivers | Highest for governance disposition |
| **Operational history** | Execution results, Automation results | High for runtime truth; does not redefine Requirements |
| **Defect history** | Curated Defect patterns | Medium risk signal; not specs |
| **Rejected / draft knowledge** | Proposed AI Generated Knowledge | Not eligible for product-fact support |

### 3.2 Evidence priority (descending for product behavior)

```
1. Current Approved Requirements Source (+ approved Clarifications)
2. Human Approval / Waiver / Review disposition (governance)
3. Validated Requirement Object / Requirements (if consistent with Approved Requirements Source)
4. Approved Product / Feature Knowledge (supporting; non-conflicting)
5. Organizational Standards / Compliance (mandate dimensions; not invent features)
6. Architecture / Integration / Cloud approved knowledge (supporting)
7. Testing method patterns (methods only)
8. Release / Defect / Execution / Automation history (risk & feasibility)
9. Historical specs / Feature knowledge / transcripts (context)
10. User documentation (wording aid)
11. Public/vendor mirrors (attributed, lowest internal trust)
12. General AI parametric knowledge (NOT evidence)
```

### 3.3 Evidence reliability attributes (conceptual)

Each evidence item carries: `authorityTier`, `freshness`, `approvalState`, `scopeFit`, `conflictFlags`, `completeness`, `sourceTrust`.

Reliability may be strong while confidence in a *decision* remains low (e.g., strong FDD text that is still ambiguous for testing).

### 3.4 Minimum evidence rules

| Decision kind | Minimum evidence |
|---------------|------------------|
| Product-behavior Scenario/Case creation | ≥1 current Approved Requirements Source or Requirement evidence ref |
| Knowledge usage as fact | Published Knowledge + non-conflict with Approved Requirements Source |
| Suppression for invent-risk | Citation of missing evidence / Ambiguity |
| Coverage sufficiency | Trace Matrix + dimension statuses |
| Release impact | Scope + coverage/execution/defect evidence set |

---

## 4. Confidence Framework (Conceptual)

Confidence expresses **how much ATI trusts the decision outcome**, not whether evidence exists, and not whether humans should Accept.

### 4.1 Confidence levels (bands)

| Band | Meaning |
|------|---------|
| **Very Low** | Speculative or severely under-evidenced; unsafe to Approve without human |
| **Low** | Weak/partial evidence or high ambiguity |
| **Medium** | Plausible with material uncertainties |
| **High** | Well-supported; residual uncertainty limited |
| **Very High** | Strong multi-factor support; still not certainty |

**Certainty is never claimed.** Even Very High requires human Approval where Domain demands it.

### 4.2 Confidence factors (drivers)

| Factor | Effect |
|--------|--------|
| **Evidence Strength** | Strong primary evidence raises; weak paraphrase lowers |
| **Evidence Completeness** | Missing inputs lower |
| **Ambiguity Impact** | Blocking Ambiguities collapse band |
| **Missing Information** | Unknowns lower; may force HITL |
| **Contradictory Evidence** | Conflicts collapse band; may block |
| **Authority Fit** | Using low-tier evidence for product facts lowers heavily |
| **Heuristic Applicability Clarity** | Weak applicability rationale lowers |
| **Alternative Tension** | Strong competing alternatives lower |
| **Human Overrides** | Human reject/modify becomes new governance truth; AI confidence on old decision becomes historical |

### 4.3 Independence rule

- Evidence answers: “What supports this?”  
- Confidence answers: “How much should we trust the judgment given that support and uncertainty?”  

A decision can have **strong evidence of ambiguity** and **high confidence that Clarification is required**.

### 4.4 Aggregation principles (non-formula)

1. Blocking contradiction ⇒ overall band cannot be High/Very High.  
2. Package-level confidence cannot exceed blocking constituent decisions.  
3. Human Approval does not rewrite AI confidence history; it adds governance state.  
4. Knowledge outage lowers confidence for knowledge-dependent decisions; Approved Requirements Source–only path continues.  

---

## 5. Explainability Model

Every significant AI output must be expressible as an **Explanation Packet** consumable by QA Engineers.

### 5.1 Mandatory explanation questions

| Question | Answered by |
|----------|-------------|
| What decision was made? | Decision type + outcome |
| Why was it made? | Rationale + Reasoning Trace summary |
| Which evidence supported it? | Validated Evidence refs |
| Which requirements contributed? | Requirement / Feature Version links |
| Which knowledge sources were consulted? | Knowledge refs + retrieval decision (including none) |
| What assumptions were made? | Assumption list (never hidden) |
| What uncertainties remain? | Unknowns / Ambiguities |
| What confidence level applies? | Confidence band + drivers |
| What alternative decisions were considered? | Alternatives + why rejected |

### 5.2 Explanation grades

| Grade | Applies to |
|-------|------------|
| **Full** | Scenario/Case creation, coverage sufficiency, release impact, merges affecting Approved drafts |
| **Standard** | Heuristic applicability, retrieval plans, automation recommendations |
| **Minimal** | Purely mechanical suppressions with standard reason codes (still auditable) |

### 5.3 Audience rule

Explanations use Domain ubiquitous language — not model logits, vendor jargon, or hidden chain-of-thought dumps as the system of record.

### 5.4 Reproducibility

Given the same: Knowledge Intake identity, Approved Requirements Source version, Requirement Object revision, Knowledge versions cited, framework/pack versions, and policy packs — ATI must be able to regenerate an equivalent Decision Record lineage (allowing non-deterministic wording only where explicitly marked non-semantic). Semantic outcome + links + evidence must align.

---

## 6. Decision Review Strategy

ATI validates its own decisions before presentation/finalization.

### 6.1 Review checks

| Check | Intent |
|-------|--------|
| **Conflicting evidence** | Unresolved conflicts used as if settled |
| **Duplicate decisions** | Same outcome emitted repeatedly without merge |
| **Missing evidence** | Decision lacks required evidence class |
| **Low confidence** | Below policy threshold for auto-eligibility |
| **Unsupported recommendations** | Outcome not entailed by evidence/heuristics |
| **Missing traceability** | Scenario/Case decisions without required links |
| **Ambiguous requirements** | Proceeded as if clear |
| **Incomplete coverage** | Sufficiency claimed despite open applicable gaps |
| **Authority violation** | Low-tier knowledge used as product fact |
| **Silent approve risk** | Attempt to alter Approved artifacts |

### 6.2 Escalation rules

| Condition | Escalation |
|-----------|------------|
| Missing evidence for product-behavior decision | Block decision; create Clarification or Finding |
| Conflicting statements inside Approved Requirements Source | HITL Clarification; Validation Finding |
| Supporting knowledge vs Approved Requirements Source | Approved Requirements Source wins; Finding on knowledge; do not apply as fact |
| Low confidence + release-critical | Mandatory Human Review |
| Duplicate uncertainty | Human Review recommendation |
| Attempt to modify Approved artifact | Hard fail; audit security/governance event |
| Coverage insufficient near Release | Escalate to Release Manager + QA Lead |

### 6.3 Outcomes

`pass` · `pass_with_warnings` · `revise` · `escalate_human` · `block`

---

## 7. Human-in-the-Loop Framework

### 7.1 Mandatory clarification / human request triggers

ATI **must not assume** and must request human input when:

- Missing business rules required for oracles  
- Conflicting requirements / FDD contradictions  
- Unknown permissions / roles for stated actions  
- Undefined workflows where multi-step behavior is implied  
- Missing integration failure contracts for critical paths  
- Multiple valid interpretations with different test implications  
- Standard-driven mandatory dimension cannot be grounded  
- Waiver requested against coverage/review gates  
- Learning promotion to product-fact knowledge  

### 7.2 Review checkpoints

| Checkpoint | When | Typical reviewers |
|------------|------|-------------------|
| **CP-Understand** | After Requirement Object draft | QA Lead / Feature Owner |
| **CP-Validate** | Validation gate warnings/fail | QA Architect / Product Owner |
| **CP-Design** | Before Scenario/Case Approval | QA Lead |
| **CP-AI-Review** | After AI Review disposition `revise`/`blocked` | QA Architect |
| **CP-Coverage** | Coverage insufficient | QA Lead / Release Manager |
| **CP-Release** | Release impact / readiness | Release Manager + Product Owner |
| **CP-Knowledge** | Product-fact knowledge publish | Domain Steward / Product Owner |
| **CP-Override** | Any human override of AI decision | Acting Role + audit |

### 7.3 Human override rules

1. Human override always wins for governance state.  
2. Override reason is mandatory.  
3. Override does not delete AI Decision history; it supersedes effect.  
4. AI must not re-apply a rejected decision automatically in the same run without new evidence.  

---

## 8. Decision Audit Framework

### 8.1 Governed audit facets

| Facet | Meaning |
|-------|---------|
| **Decision History** | Append-only sequence of Decision Records and state transitions |
| **Evidence Trace** | Exact evidence versions cited at decision time |
| **Review Status** | Pending/completed human or self-review dispositions |
| **Approval Status** | Domain Approval linkage |
| **Version Awareness** | Knowledge Intake / Approved Requirements Source / Feature Version / Requirement Object / Knowledge / framework pack versions |
| **Decision Lineage** | Parent/child decisions (e.g., retrieval → scenario creation → case expansion) |
| **Auditability** | Who/what/when for reviews, approvals, overrides, executions |

### 8.2 Retention & immutability

- Executed Decision Records are immutable.  
- Corrections create superseding decisions, not edits in place.  
- When Feature Version is superseded, related decisions become historically retained and marked `stale_context` for new work.  

### 8.3 Audit questions the platform must answer

- Why was Scenario X created?  
- What evidence supported Case Y’s expected result?  
- Which knowledge versions influenced Review Finding Z?  
- Who overrode decision D and why?  
- Can we replay the decision inputs?  

Failure to answer for significant decisions is a **governance defect**.

---

## 9. Learning from Decisions

### 9.1 Learning signals

| Signal | Use |
|--------|-----|
| Approved AI Reviews / accepted Findings | Strengthen review heuristics (method patterns) |
| User Corrections to Scenarios/Cases | Design strategy / classification improvements |
| Clarification Responses | Feature Knowledge candidates (with Approved Requirements Source anchors) |
| Test Case Modifications pre-Approval | Quality anti-patterns |
| Execution Outcomes | Automation feasibility & flaky signals |
| Regression Results | Regression recommendation tuning |
| Rejected AI decisions | Negative training for similar contexts |

### 9.2 Learning flow (aligned to Knowledge Architecture)

```
Signal → Learning Candidate (proposed)
  → Validation → Human/governed Approval
    → Publish into allowed domain/authority class
      → Audit
```

### 9.3 Non-negotiable learning rules

1. No automatic change to published Knowledge.  
2. No automatic change to Approved Requirements/Scenarios/Cases/Packages.  
3. No learning that invents product functionality.  
4. Past Decision Records remain immutable.  
5. Promoted learnings become new evidence only after Publication eligibility rules.  

---

## 10. Extensibility

### 10.1 Decision type packs

New decision types register via **Decision Type Manifest**:

- `decisionTypeId`, version  
- purpose, allowed stages/engines  
- required evidence classes  
- HITL triggers  
- explanation grade  
- confidence profile ref  
- ownership steward  

Examples of future packs:

- Security Decisions  
- Privacy Decisions  
- Performance Decisions  
- Compliance Decisions  
- Chaos Engineering Decisions  
- Accessibility Decisions  
- Domain-specific Decision Packs  

### 10.2 Compatibility guarantees

Allowed without redesign:

- New decision types/packs  
- New evidence classes (with hierarchy tier)  
- New HITL checkpoints  
- New review checks  

Require ADR:

- Allowing decisions without evidence  
- Treating LLM memory as evidence  
- Letting supporting Knowledge Inputs override Approved Requirements Source  
- Treating platform entry as FDD-only (rejects Knowledge Intake)  
- Letting AI Approval replace human Approval for product facts  
- Silent mutation of Approved artifacts  
- Collapsing confidence and evidence into one opaque score without drivers  

---

## 11. Architectural Risks and Mitigations

| Risk | Mitigation |
|------|------------|
| Black-box answers | Mandatory Explanation Packets + Decision Records |
| Confidence theater | Independent evidence; drivers required; no certainty claims |
| Evidence laundering via knowledge | Hierarchy + conflict checks |
| Review fatigue | Graded explanations; escalate only on triggers |
| Non-reproducibility | Version fingerprints; immutable records |
| Learning drift | Candidate/approval path; no silent publish |

---

## 12. Implementation Readiness (Not Authorization)

This document authorizes the **decision governance architecture only**.

Future implementation must:

1. Emit Decision Records for significant engine judgments  
2. Attach Evidence Traces and Explanation Packets  
3. Enforce HITL triggers and human override supremacy  
4. Persist immutable audit lineage  
5. Route learning only through governed promotion  

No code, APIs, schemas, or prompts are defined here.

---

## 13. Document Control

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-07-25 | Initial AI Decision & Evidence Framework |
| 1.1 | 2026-07-25 | ARB harmonization (F-04): `approvedRequirementsSourceVersion` replaces `fddVersion` shorthand (no ADR decision change) |

---

*End of AI Decision & Evidence Framework.*
