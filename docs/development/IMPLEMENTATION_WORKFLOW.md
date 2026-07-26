# ATI Implementation Workflow

**Document ID:** ATI-DEV-IMPL-WORKFLOW-001  
**Status:** Accepted — permanent engineering Standard Operating Procedure (SOP)  
**Product:** AI QA Intelligence Platform (ATI v2)  
**Audience:** Developers, AI Coding Assistants, Technical Leads, Architects, Future Contributors  
**Last updated:** 2026-07-26

---

## 1. Purpose

This document is the **Standard Operating Procedure (SOP)** for implementing every Work Package in the ATI Platform.

It defines **how** Work Packages must be planned, approved, implemented, reviewed, recorded, and closed.

It does **not** define architecture, coding standards, or Git command syntax.

**Why it exists**

AI-assisted and human delivery can move faster than architectural discipline. Without a fixed workflow, Work Packages drift in scope, redesign frozen architecture, skip reviews, or leave undocumented gaps.

**Implementation discipline is more important than implementation speed.**  
A slower, compliant Work Package is successful. A fast, non-compliant Work Package is not.

Every future implementation performed by Cursor, ChatGPT, or a human engineer **must** follow this workflow.

Related (consumed, not replaced):

- [CURSOR_DEVELOPMENT_CONTRACT.md](./CURSOR_DEVELOPMENT_CONTRACT.md) — AI assistant authority boundaries  
- [ARCHITECTURE_BASELINE_STATUS.md](../architecture/ARCHITECTURE_BASELINE_STATUS.md) — frozen baseline  
- [IMPLEMENTATION_ROADMAP_AND_WBS.md](../implementation/IMPLEMENTATION_ROADMAP_AND_WBS.md) — Work Package definitions  
- [AI_DEVELOPMENT_CHARTER.md](../standards/AI_DEVELOPMENT_CHARTER.md) — roles and platform rules  
- [CODING_STANDARDS.md](../standards/CODING_STANDARDS.md) — how code is written (not this SOP)

---

## 2. Guiding Principles

| Principle | Meaning |
|-----------|---------|
| **Architecture First** | Read and consume approved architecture and engineering specifications before planning or coding |
| **Architecture Consumer Only** | Implementers do not redesign, rename Domain concepts, merge/split modules, or invent new architectural meaning |
| **No Scope Creep** | Only the authorized Work Package scope is implemented |
| **One Work Package at a Time** | Do not interleave multiple Work Packages in one delivery |
| **No Future Work** | Do not pull forward later Work Packages, placeholders for future phases, or speculative features |
| **Small Reviewable Changes** | Prefer focused, reviewable increments over large mixed diffs |
| **Documentation is Part of the Deliverable** | Code without required docs, Deferred Capability Register, or Implementation Report is incomplete |
| **Every Change Must Be Traceable** | Work must map to a Work Package ID, roadmap entry, and acceptance criteria |

---

## 3. Standard Work Package Lifecycle

Every Work Package follows this sequence:

```
Select Work Package
      ↓
Read Architecture Documents
      ↓
Generate Pre-Implementation Plan
      ↓
Architecture Review
      ↓
Approval Gate
      ↓
Implementation
      ↓
Self Review
      ↓
Implementation Report
      ↓
Independent Architecture Review
      ↓
Git Commit
      ↓
Git Tag
      ↓
Git Push
      ↓
Roadmap Update
      ↓
Next Work Package
```

### Step descriptions

| Step | Responsibility |
|------|----------------|
| **Select Work Package** | Choose exactly one Work Package from the Implementation Roadmap / WBS (or explicit authorization naming that WP ID) |
| **Read Architecture Documents** | Read mandatory documents for that WP in the order specified by authorization / eng specs (baseline, roadmap, contract, relevant eng specs, coding standards) |
| **Generate Pre-Implementation Plan** | Produce the plan (§4) — **no code yet** |
| **Architecture Review** | Reviewer checks the plan against frozen architecture and WP scope (§5) |
| **Approval Gate** | Explicit approval to implement; without it, implementation must not start |
| **Implementation** | Build only the approved scope; stop on ambiguity (§6) |
| **Self Review** | Implementer verifies DoD items before submission (§7) |
| **Implementation Report** | Formal report of what was delivered, compliance, tests, deferred items |
| **Independent Architecture Review** | Separate reviewer validates architecture/scope/docs/quality (§8) |
| **Git Commit** | Record the approved implementation in version control (§9) |
| **Git Tag** | Tag when appropriate (e.g., WP completion milestone) |
| **Git Push** | Publish commits/tags to the shared remote per team practice |
| **Roadmap Update** | Mark WP status / progress on the Implementation Roadmap |
| **Next Work Package** | Only then select the next WP; do not start early |

Skipping steps is non-compliant.

---

## 4. Pre-Implementation Planning

Every Work Package **must** begin with a **Pre-Implementation Plan**.

Implementation **must not begin** before the plan is approved at the Approval Gate.

### Mandatory plan contents

| Section | Content |
|---------|---------|
| **Objective** | What the WP will achieve |
| **Architecture Consumed** | Documents and sections that authorize the work |
| **Scope** | In-scope deliverables only |
| **Files to Create** | Planned new files/areas |
| **Files to Modify** | Planned edits |
| **Risks** | Delivery and compliance risks |
| **Acceptance Criteria** | Objective completion checks |
| **Out of Scope** | Explicit exclusions (especially later WPs) |
| **Ambiguities** | Questions requiring Product/Architect decision before coding |

If ambiguities remain unresolved, **stop** and wait — do not guess.

---

## 5. Architecture Review Gate

Implementation **cannot begin** until Architecture Review of the Pre-Implementation Plan is **approved**.

### The review must verify

- **Architecture compliance** — plan consumes approved architecture and eng specs  
- **No redesign** — no new architectural styles or boundary changes  
- **No renamed modules** — ubiquitous language and Application module names preserved  
- **No new concepts** — no invented Domain/Brain/Spine meaning  
- **No scope creep** — plan matches the authorized Work Package only  

A rejected plan returns to Pre-Implementation Planning. Coding during an unapproved gate is a process defect.

---

## 6. Implementation Rules

During Implementation:

1. Implement **only** the approved Pre-Implementation Plan scope.  
2. **Never** implement future Work Packages.  
3. **Never** pull work forward “while we are here.”  
4. **Never** redesign architecture or silently resolve architectural gaps.  
5. Keep changes **small** and reviewable.  
6. Prefer **deterministic** behaviour for platform/Spine concerns.  
7. On uncovered decisions: **STOP** → explain → evidence → options → wait for approval.  
8. Obey the [Cursor Development Contract](./CURSOR_DEVELOPMENT_CONTRACT.md) when AI-assisted.  
9. Obey [Coding Standards](../standards/CODING_STANDARDS.md) for code shape (this SOP does not redefine them).  

---

## 7. Self Review

Every implementation must be reviewed by the **implementer** before submission for Independent Review.

### Verify

- Required **tests pass**  
- **Documentation** updated for what the WP delivers  
- **Deferred capabilities** documented (Deferred Capability Register when applicable)  
- **Definition of Done** (§11) satisfied from the implementer’s perspective  
- No unauthorized files, modules, or behaviours  

Self Review does **not** replace Independent Architecture Review.

---

## 8. Independent Review

An **independent** architecture-oriented review must occur before the Work Package is accepted for merge / closure.

### The review verifies

- **Architecture compliance** — frozen baseline respected  
- **Code quality** — maintainable, testable, within standards  
- **Scope compliance** — only WP scope; no future work  
- **Documentation completeness** — roadmap, READMEs, registers, report as required  

Findings return to the implementer for correction. Approval is a human authority decision (Tech Lead / Architect as applicable).

---

## 9. Git Workflow

Version control closes the Work Package delivery loop. This section describes **process only** (no Git commands).

```
Implementation
      ↓
Commit
      ↓
Tag (when appropriate)
      ↓
Push
      ↓
Roadmap Update
      ↓
Next Work Package
```

| Step | Expectation |
|------|-------------|
| **Commit** | After Self Review and with Independent Review disposition per team practice; commit message traces to Work Package ID |
| **Tag** | Use when marking a completed WP or milestone release point, per team tagging policy |
| **Push** | Publish to the shared remote so others can review and continue |
| **Roadmap Update** | Record WP completion/progress in the Implementation Roadmap |
| **Next Work Package** | Begin the lifecycle again only after the current WP is closed |

Detailed branching/command conventions belong in future Git Workflow / Contribution docs — not here.

---

## 10. Documentation Requirements

Every completed Work Package must update, **as applicable**:

| Artifact | When |
|----------|------|
| **Implementation Roadmap** | Always — WP status/progress |
| **Relevant README** | When host/package/developer run instructions change |
| **Deferred Capability Register** | When the WP intentionally excludes capabilities |
| **Implementation Report** | Always for platform WPs under this SOP |
| **Getting Started / Local Environment** | When local run/bootstrap behaviour changes |

Document **only what the Work Package delivers**. Do not document speculative future work as if implemented.

---

## 11. Definition of Done

A Work Package is **complete** only when all of the following are true:

| # | Criterion |
|---|-----------|
| 1 | Implementation completed per approved plan |
| 2 | Required tests pass |
| 3 | Documentation updated (§10) |
| 4 | Self Review completed |
| 5 | Independent Architecture Review completed (approved) |
| 6 | Architecture compliant (no redesign / no invent) |
| 7 | Changes committed in Git |
| 8 | Roadmap updated |

“Code exists” is not completion.

---

## 12. Work Package Deliverables

Mandatory deliverables for each Work Package (unless a human authority explicitly waives an item in writing for that WP):

| Deliverable | Required |
|-------------|----------|
| Pre-Implementation Plan | Yes |
| Approval Gate record (explicit approval) | Yes |
| Implementation (code/config as scoped) | Yes |
| Tests | Yes (per WP acceptance criteria) |
| Documentation updates | Yes (as applicable) |
| Deferred Capability Register | When exclusions exist |
| Implementation Report | Yes |
| Independent Review disposition | Yes |
| Git commit (and tag when appropriate) | Yes |
| Roadmap update | Yes |

---

## 13. Future Enhancements

Future governance documents may include:

- Code Review Checklist  
- Architecture Review Checklist  
- Release Workflow  
- Git Workflow (commands and branching detail)  
- CI/CD Workflow  

Those documents are **outside the scope** of this SOP. This document defines the **implementation workflow** only.

---

## Document Control

| Field | Value |
|-------|-------|
| **Version** | 1.0 |
| **Status** | Accepted — permanent implementation SOP |
| **Owner** | Technical Lead / Principal Software Architect / Engineering Manager |
| **Dependencies** | Architecture Baseline; Cursor Development Contract; Implementation Roadmap; Charter; Coding Standards |
| **Related ADRs** | Consumes approved ADRs — **creates no new ADR** |
| **Last updated** | 2026-07-26 |

### Change History

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-07-26 | Initial Implementation Workflow SOP |

---

*End of ATI Implementation Workflow.*
