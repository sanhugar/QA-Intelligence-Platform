# AI Benchmark and Golden Dataset Framework

**Document ID:** ATI-ENG-AI-BENCHMARK-001  
**Status:** Approved engineering quality specification (no implementation code)  
**Product:** AI QA Intelligence Platform (ATI v2)  
**Audience:** Principal Software Architect, Enterprise QA Architect, AI Platform Architect, AI Evaluation Engineer, Engineering Quality Lead, Implementation Engineer  
**Phase:** Permanent AI evaluation quality gate for all AI engines  
**Last updated:** 2026-07-25

---

## 0. Purpose and Scope

This document is the **canonical engineering quality specification** for the **ATI Golden Dataset & AI Benchmark Framework**.

It defines the permanent benchmark used to evaluate every AI engine throughout ATI’s lifetime — before an engine is considered production ready, and whenever engines or providers change.

### This document is

- An engineering quality specification  
- The official AI evaluation quality gate for ATI development  
- Provider-independent and architecture-conforming  

### This document is not

- Architecture redesign or an ADR  
- Code, prompts, APIs, UI, or database schemas  
- A product-specific test suite for a single customer feature  
- A replacement for unit/integration tests of non-AI platform code  

### Normative stance

1. Architecture Baseline remains frozen; this framework **evaluates** engines against approved meaning — it does not redefine Brain/Domain/Knowledge.  
2. Ground truth is approved expected outputs for known inputs — not subjective reviewer preference alone.  
3. Benchmark evolution is versioned and governed; published datasets do not silently change.  
4. Implementation must conform to architecture; benchmark failures are evidence for improvement or ARB-reviewed gaps — not excuses to invent requirements.

---

## 1. Purpose

ATI requires a permanent benchmark because AI engine quality cannot be proven by opinion, demo anecdotes, or one-off manual inspection.

The benchmark shall:

| Goal | Meaning |
|------|---------|
| **Validate AI quality** | Objective comparison of engine output to approved expected results |
| **Prevent regression** | Detect quality loss across engine, prompt-asset, policy, or provider changes |
| **Measure improvement** | Show whether a new version is better, worse, or equivalent on fixed suites |
| **Compare engine versions** | Side-by-side evaluation of version N vs N+1 on the same published dataset |
| **Support automated evaluation** | Suites runnable in CI/gated pipelines (tooling later — contract here) |
| **Support future AI providers** | Same golden inputs/expected outputs regardless of GPT, Claude, Gemini, Qwen, Llama, DeepSeek, Mistral, or successors |

This framework is a **permanent quality gate** for AI development under the frozen Architecture Baseline.

---

## 2. Engineering Principles

| Principle | Expectation |
|-----------|-------------|
| **Ground truth over opinion** | Pass/fail anchored to approved expected outputs and explicit tolerance rules |
| **Evidence-based evaluation** | Findings cite diffs, missing links, invent-ban violations, evidence gaps |
| **Repeatable benchmarking** | Same published dataset version + engine version → comparable results |
| **Version-controlled datasets** | Every golden set and expected package is versioned and immutable once published |
| **Provider-independent evaluation** | Suites evaluate engine contracts/outcomes, not vendor-specific text style alone |
| **Architecture-independent evaluation mechanics** | Evaluation process does not embed a single product’s Domain objects as the only truth shape — it consumes ATI artifact contracts |
| **No benchmark tied to one product** | Library spans multiple knowledge input types and domains; not a single FDD franchise |
| **Extensible benchmark library** | New categories, suites, and future engines added without rewriting the framework |
| **ARS primacy in generation suites** | Where generation is evaluated, Approved Requirements Source (or accepted Clarification) remains authority |
| **Non-invention as a first-class check** | Hallucinated requirements/scenarios/expected results are hard failures |
| **Human supremacy preserved** | Benchmarks do not auto-Approve Domain Approvals; HITL dispositions may be part of fixtures where required |

---

## 3. Golden Dataset Philosophy

### What a Golden Dataset is

A **Golden Dataset** is a governed collection of **known inputs** paired with **approved expected outputs** (and evaluation metadata) used as ground truth for AI engine evaluation.

For a given engine and suite item:

- **Input** — one or more Knowledge Inputs / packages / context fixtures  
- **Expected output** — the approved artifact(s) or structured expectations the engine should produce (or blocked/gap behaviours it should exhibit)  
- **Evaluation notes** — tolerances, mandatory facets, known intentional unknowns  

It represents the **approved expected output for a known input** — not “whatever the latest model said.”

### Multi-input philosophy

The benchmark **must support multiple Knowledge Input types**, not only FDDs. Examples of allowable golden **inputs** include:

| Input class | Examples |
|-------------|----------|
| Approved requirements-style | Feature Design Documents, PRD/SRS equivalents, requirement packs |
| Product & design knowledge | Product notes, design discussions, architecture documents, user documentation |
| Conversational / meeting | Meeting transcripts, clarification threads (as supporting or designated per fixture policy) |
| Release & change | Release notes, impact notes, change summaries |
| Verification assets | Existing manual test cases, automation assets (as reference/expected or supporting context) |
| Quality signals | Defect reports, production incidents (anonymized/sanitized) |
| Product knowledge | Curated knowledge articles designated for the suite |

Fixtures must label each input’s **Intake role** in the suite (`approved_requirements_source` vs `supporting`) so evaluation respects Orchestration designation rules. Supporting inputs must never be treated as authority to invent product behaviour.

### Expected outputs

Expected outputs are approved packages aligned to engine contracts (Understanding Package, Validation Report, RKG, Scenario Package, Test Case Package, Coverage Assessment, QA Readiness, etc.) — conceptual packages only; no schemas in this document.

---

## 4. Dataset Categories

Benchmark content is organized by **engine / capability category**. Every current and future AI engine maps to at least one category.

| Category | Evaluates |
|----------|-----------|
| **Requirement Understanding** | Understanding Package quality vs golden expectations |
| **Requirement Validation** | Validation findings/gates vs golden |
| **Knowledge Resolution** | Augmenting retrieval appropriateness; ARS primacy under conflict |
| **Requirement Knowledge Graph** | RKG structure/relations vs golden (run-scoped) |
| **Scenario Reasoning** | Scenario Package vs golden; link invariants |
| **Scenario Review** | Review findings/disposition quality vs golden |
| **Test Case Reasoning** | Test Case Package vs golden; primary-scenario invariant; non-invention of expected results |
| **Test Case Review** | Review findings/disposition quality vs golden |
| **Coverage Analysis** | Coverage Assessment / Trace Matrix states vs golden; unknowns ≠ covered |
| **Final QA Review** | QA Readiness verdict/findings vs golden |
| **Automation Readiness** | Automation candidacy assessments vs golden (when engine exists) |
| **Impact Analysis** | Impact reasoning vs golden (when engine exists) |
| **Release Planning** | Release-planning signals vs golden (when engine exists) |
| **Documentation** | Documentation enablement outputs vs golden (when engine exists) |
| **Reporting** | Reporting projections vs golden (when engine exists) |
| **Future AI engines** | Reserved category slots via Engine Manifest + suite registration |

Cross-cutting suites (e.g., end-to-end Brain chain) may compose multiple categories under a single scenario id without collapsing categories.

---

## 5. Benchmark Repository Structure

Conceptual layout only — **do not** treat as a mandate of exact filenames or storage technology:

```
benchmark/
  approved-requirements/
  meeting-transcripts/
  product-documents/
  release-documents/
  expected-understanding/
  expected-validation/
  expected-rkg/
  expected-scenarios/
  expected-testcases/
  expected-coverage/
  expected-review/
  expected-release/
  expected-documentation/
  regression-benchmarks/
  edge-cases/
  negative-cases/
  future-datasets/
```

### Structural expectations (conceptual)

| Area | Responsibility |
|------|----------------|
| **Input libraries** | `approved-requirements/`, `meeting-transcripts/`, `product-documents/`, `release-documents/` — versioned golden inputs |
| **Expected libraries** | `expected-*` — approved expected packages per category |
| **regression-benchmarks/** | Frozen suites used for mandatory regression gates |
| **edge-cases/** | Boundary/ambiguous/incomplete fixtures |
| **negative-cases/** | Contradiction, invent-ban traps, unsupported behaviour |
| **future-datasets/** | Staging area before approval/publication |

Each published suite item conceptually carries: suite id, dataset version, engine category targets, input refs, expected refs, evaluation profile, publication status.

---

## 6. Dataset Lifecycle

| Stage | Responsibility |
|-------|----------------|
| **Collection** | Gather candidate inputs/expected outputs from real products, sanitized assets, curated synthetics |
| **Review** | QA Architect / AI Evaluation Engineer review for correctness, ARS role labeling, invent-ban safety, PII/secrets |
| **Approval** | Benchmark owner + Architect (and Product where product truth is asserted) approve for publication |
| **Versioning** | Immutable version id for published dataset/suite releases |
| **Publication** | Suite becomes eligible for automated/manual evaluation gates |
| **Retirement** | Suite marked retired with successor pointer; retained for historical comparison |
| **Archival** | Long-term retention of retired published versions |
| **Benchmark evolution** | New versions added; historical published versions never silently rewritten |

Draft/future datasets must not be used as production acceptance gates until published.

---

## 7. Evaluation Methodology

Conceptual evaluation flow for an engine (or composed pipeline slice):

```
Input (published golden)
      ↓
Engine Output (version under test)
      ↓
Expected Output (published golden)
      ↓
Difference Analysis
      ↓
Quality Assessment (dimensions §8)
      ↓
Pass / Fail (per acceptance profile)
      ↓
Improvement Report (vs prior engine version when applicable)
```

| Step | Expectation |
|------|-------------|
| **Input** | Frozen published fixture for the run |
| **Engine Output** | Actual package/status/findings/explainability from the engine version |
| **Expected Output** | Approved golden expectations for that fixture |
| **Difference Analysis** | Structural and semantic deltas relevant to the engine contract (not vanity wording diffs alone) |
| **Quality Assessment** | Score/rate dimensions conceptually; record evidence of each material miss |
| **Pass/Fail** | Against the suite’s acceptance profile (mandatory dimensions, invent-ban, gates) |
| **Improvement Report** | Delta vs previous engine/provider version on the **same** dataset version |

No algorithms or formulas are defined here. Orchestration may run single-engine or multi-stage evaluations; Final Output packaging is out of scope for the evaluation method itself.

---

## 8. Evaluation Dimensions

Every evaluation shall consider applicable dimensions (suite profiles select which are mandatory):

| Dimension | Intent |
|-----------|--------|
| **Correctness** | Output matches approved expected meaning |
| **Completeness** | Required facets/artifacts present or honestly unknown |
| **Coverage** | Applicable QA/coverage dimensions addressed or explicitly N/A |
| **Traceability** | Required links/lineage intact; no orphans |
| **Consistency** | Internal coherence; no contradictions with ARS in asserted facts |
| **Determinism** | Engineering determinism of contracts/gates; stable pass on golden under policy |
| **Readability** | Human-usable purpose/intent/findings |
| **Explainability** | Why/evidence/assumptions/limitations/confidence present |
| **Evidence usage** | Claims grounded; LLM recall not treated as evidence |
| **Confidence quality** | Confidence calibrated to unknowns; confidence ≠ approval |
| **Requirement adherence** | Respects designated ARS / accepted Clarification |
| **Non-invention** | No invented requirements, scenarios, expected results, or coverage |
| **Quality** | Aligns with engine eng-spec quality expectations (atomicity, etc.) |
| **Governance compliance** | HITL/disposition/invent-ban/ARS primacy rules respected |
| **Extensibility** | Suite/engine registration does not require framework redesign |

No scoring formulas in this document. Suites declare which dimensions are blockers vs informational.

---

## 9. Benchmark Categories (Suites)

Orthogonal to engine categories (§4), **suite types** exercise conditions:

| Suite type | Intent |
|------------|--------|
| **Happy Path** | Clear, complete ARS; expected successful packages |
| **Boundary** | Limits, edges, minimal sufficient inputs |
| **Negative** | Invalid/unauthorized/failure-oriented expectations |
| **Ambiguous** | Ambiguity must yield unknowns/Clarification — not invention |
| **Incomplete** | Missing sections; blocked/partial honest outcomes |
| **Contradictory** | Conflicts; ARS wins; conflicts surfaced |
| **Large Documents** | Scale/robustness of understanding without loss of primacy rules |
| **Cloud Features** | Cloud/infra-applicable dimensions when marked applicable |
| **Enterprise Features** | Multi-actor, permission, audit, compliance-oriented fixtures |
| **Security** | Security-relevant requirements/cases; no secret leakage in fixtures |
| **Performance** | Stated NFR fixtures where applicable (evaluation of reasoning about them — not load tests of the platform) |
| **Workflow** | Multi-step journey fixtures |
| **Integration** | Named external dependency fixtures |
| **Release** | Release-note / readiness oriented fixtures |
| **Historical Regression** | Frozen suites that must remain green across versions |
| **Future datasets** | Pre-publication candidates only |

A production acceptance profile typically requires Happy Path + Negative + Ambiguous/Incomplete + Historical Regression as a minimum for Core Brain engines.

---

## 10. Engine Acceptance Criteria

Before an AI engine implementation is considered **complete / production ready**, it must demonstrate on **published** benchmark suites for its category:

| Criterion | Expectation |
|-----------|-------------|
| **Correct outputs** | Pass mandatory correctness checks against golden expected packages |
| **Stable outputs** | Repeatable pass on regression suites across repeated runs under policy |
| **Architecture compliance** | No boundary/invent-ban/ownership violations in outputs |
| **Traceability** | Required lineage and link invariants held |
| **Evidence usage** | Significant claims evidenced or explicitly unknown |
| **Explainability** | Mandatory explanation facets present |
| **Non-invention** | Zero tolerance for invented product behaviour on generation suites |
| **Quality compliance** | Engine eng-spec + [AI Engine Development and Implementation Standards](./AI_ENGINE_DEVELOPMENT_AND_IMPLEMENTATION_STANDARDS.md) satisfied |

Passing benchmarks does **not** replace Domain Approval / HITL for governed product dispositions. It certifies **engine quality**, not product release sign-off.

---

## 11. Regression Benchmarking

### Philosophy

Every implementation change that can affect AI engine behaviour — including engine code, prompts/assets (when authorized), policies, models/providers, or retrieval that feeds reasoning — **must** be validated against the applicable **published regression benchmark** suites.

| Rule | Expectation |
|------|-------------|
| **Same dataset version** | Compare like-for-like; do not “fix” by editing golden expected outputs |
| **Fail closed** | Regression failures block promotion unless explicit waiver with evidence |
| **Scope suites to blast radius** | Changed engine’s category suites mandatory; E2E chain suites when contracts span stages |
| **Provider swaps** | Full Core regression profile on the target provider before production enablement |
| **No tooling mandate here** | CI/automation may execute suites later; the obligation is conceptual and permanent |

Regression testing proves **non-degradation** of quality; improvement reports (§7) prove **progress**.

---

## 12. Continuous Improvement

| Practice | Expectation |
|----------|-------------|
| **Evolve by new versions** | Improve golden sets via new dataset versions, not silent edits |
| **Preserve historical comparisons** | Prior published versions remain available for trend analysis |
| **Published datasets are immutable** | Corrections → new version + change record; never silent rewrite |
| **Add suites from production learning** | Defect escapes, HITL corrections, and ARB gaps become candidate fixtures |
| **Retire with lineage** | Retirement points to successor; historical gate evidence retained |
| **Separate draft from published** | `future-datasets/` cannot gate production |

Benchmark quality improves over time; **comparability** is preserved by immutability of published versions.

---

## 13. Governance

| Topic | Expectation |
|-------|-------------|
| **Benchmark ownership** | AI Evaluation Engineer (operational) · Enterprise QA Architect (quality authority) · Principal Software Architect (architecture compliance) |
| **Approval process** | Review → Approval → Version → Publication (§6); Product involved when asserting product truth |
| **Version history** | Every published suite/dataset version recorded with rationale and approvers |
| **Audit** | Evaluation runs retain dataset version, engine version, provider provenance, pass/fail, material diffs |
| **Review** | Periodic review of suite relevance, flakiness, and coverage of engine categories |
| **Retirement** | Formal retirement decision; no deletion of published history required for audit |
| **Change management** | Material framework changes follow Architecture Baseline change process if baseline-affecting; suite content changes follow §6 |
| **Secrets & privacy** | Fixtures sanitized; no credentials/PII in published benchmarks |
| **Waivers** | Explicit, time-bounded, evidence-backed; never silent |

---

## 14. Architecture Dependencies

This framework **consumes without redefining**:

| Dependency | Role |
|------------|------|
| [ARCHITECTURE_BASELINE_STATUS.md](../architecture/ARCHITECTURE_BASELINE_STATUS.md) | Frozen baseline; controlled evolution |
| [AI_REASONING_ARCHITECTURE.md](../architecture/AI_REASONING_ARCHITECTURE.md) | Brain stages/engines under evaluation |
| [KNOWLEDGE_ARCHITECTURE.md](../architecture/KNOWLEDGE_ARCHITECTURE.md) | Augmenting knowledge; multi-input types |
| [DOMAIN_ARCHITECTURE.md](../architecture/DOMAIN_ARCHITECTURE.md) | Domain language for artifacts |
| [ENTERPRISE_DATA_ARCHITECTURE.md](../architecture/ENTERPRISE_DATA_ARCHITECTURE.md) | Identity/version/immutability mindset for packages |
| [QA_INTELLIGENCE_FRAMEWORK.md](../architecture/QA_INTELLIGENCE_FRAMEWORK.md) | Coverage/quality dimensions |
| [AI_DECISION_AND_EVIDENCE_FRAMEWORK.md](../architecture/AI_DECISION_AND_EVIDENCE_FRAMEWORK.md) | Evidence, confidence, explainability, HITL |
| [KNOWLEDGE_INTAKE_AND_WORKFLOW_ORCHESTRATION_ARCHITECTURE.md](../architecture/KNOWLEDGE_INTAKE_AND_WORKFLOW_ORCHESTRATION_ARCHITECTURE.md) | Intake roles, designation, workflow evaluation context |
| [IMPLEMENTATION_ROADMAP_AND_WBS.md](../implementation/IMPLEMENTATION_ROADMAP_AND_WBS.md) | When engines become evaluable in delivery |
| [AI_ENGINE_SPECIFICATION_FRAMEWORK.md](./AI_ENGINE_SPECIFICATION_FRAMEWORK.md) | Engine catalog/contracts |
| [AI_ENGINE_DEVELOPMENT_AND_IMPLEMENTATION_STANDARDS.md](./AI_ENGINE_DEVELOPMENT_AND_IMPLEMENTATION_STANDARDS.md) | Implementation quality bar alongside benchmarks |
| Per-engine Engineering Specifications | Category-specific expected package meaning |

This document does **not** redefine any of the above.

---

## 15. Document Control

| Field | Value |
|-------|-------|
| **Version** | 1.0 |
| **Status** | Approved engineering quality specification (no code) |
| **Owner** | Enterprise QA Architect / AI Evaluation Engineer / AI Platform Architect / Engineering Quality Lead |
| **Dependencies** | Architecture Baseline; Brain; Knowledge; Domain; EIM; QA Intelligence; Decision & Evidence; Intake/Orchestration; Implementation Roadmap; Engine Framework; Implementation Standards; per-engine specs |
| **Related ADRs** | Consumes ADRs 0001–0015 — **creates no new ADR** |
| **Last updated** | 2026-07-25 |

### Change History

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-07-25 | Initial AI Benchmark and Golden Dataset Framework |

---

## Appendix A — Readiness Checklist (Framework Completeness)

| # | Check | Status |
|---|-------|--------|
| 1 | Purpose and permanent gate role defined (§1) | ☐ |
| 2 | Engineering principles defined (§2) | ☐ |
| 3 | Golden Dataset philosophy (multi-input) defined (§3) | ☐ |
| 4 | Dataset categories for engines defined (§4) | ☐ |
| 5 | Repository structure described conceptually (§5) | ☐ |
| 6 | Dataset lifecycle defined (§6) | ☐ |
| 7 | Evaluation methodology defined (§7) | ☐ |
| 8 | Evaluation dimensions defined (§8) | ☐ |
| 9 | Suite types defined (§9) | ☐ |
| 10 | Engine acceptance criteria defined (§10) | ☐ |
| 11 | Regression benchmarking defined (§11) | ☐ |
| 12 | Continuous improvement / immutability defined (§12) | ☐ |
| 13 | Governance defined (§13) | ☐ |

**Specification completeness:** Items 1–13 are defined by this document. Creating actual golden files and evaluation runners is implementation work under the Implementation Roadmap and remains out of scope here.

---

*End of AI Benchmark and Golden Dataset Framework.*
