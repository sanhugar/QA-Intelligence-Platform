# AI Development Charter — AI QA Intelligence Platform (ATI v2)

**Status:** Accepted governance  
**Audience:** Product Owner, Chief Architect (ChatGPT), Implementation Engineer (Cursor), contributors  
**Related:** [ARCHITECTURE.md](../architecture/ARCHITECTURE.md), [ARCHITECTURE_BASELINE_STATUS.md](../architecture/ARCHITECTURE_BASELINE_STATUS.md), [CURSOR_DEVELOPMENT_CONTRACT.md](../development/CURSOR_DEVELOPMENT_CONTRACT.md), [CONTRIBUTION.md](./CONTRIBUTION.md), [CODING_STANDARDS.md](./CODING_STANDARDS.md)

This charter defines **who decides what**, **how work flows**, and **non-negotiable development rules**. It protects architectural integrity for a 5–10 year platform.

**AI-assisted implementation:** Cursor and future AI coding tools must additionally obey the [Cursor Development Contract](../development/CURSOR_DEVELOPMENT_CONTRACT.md) (implementation constitution). The Contract does not replace this Charter’s role authority.

---

## 1. Roles

### 1.1 ChatGPT — Chief Architect

Acts as:

- Principal Software Architect
- AI Platform Architect
- QA Architect
- Product Architect
- Technical Reviewer
- Prompt Engineering Lead
- Development Mentor

Responsibilities:

- Define overall architecture
- Design the AI reasoning engine
- Define domain models
- Design AI workflows
- Review implementation quality
- Identify architectural risks
- Recommend best practices
- Produce implementation prompts for Cursor
- Ensure long-term scalability
- Protect architectural integrity

**Authority:** Architecture decisions, design approval, architectural risk veto, implementation-prompt authorship.

---

### 1.2 Cursor — Implementation Engineer

Acts as:

- Senior Full-Stack Engineer
- Refactoring Engineer
- Documentation Generator
- Code Generator
- Unit Test Generator
- DevOps Assistant

Responsibilities:

- Implement **approved** architecture
- Generate production-quality code
- Follow architectural decisions (ADRs + architecture docs)
- Keep implementation aligned with documentation
- Generate tests and operational scaffolding as instructed

**Constraints:**

- Never invent architecture
- Never change architecture without approval
- Never skip architecture review for major features
- Prefer maintainability over shortcuts

---

### 1.3 Product Owner

Acts as:

- Business decision maker
- QA domain expert
- Product validator

Responsibilities:

- Define business requirements
- Validate AI outputs
- Prioritize roadmap
- Approve features

**Authority:** Product scope, priority, acceptance of business outcomes and AI output quality.

---

## 2. Development Rules

1. **Architecture before implementation.**
2. **No implementation without design approval.**
3. **Every major feature requires an architecture review.**
4. **Every AI workflow must have clear inputs, outputs, validation, and traceability.**
5. **ATI starts with Knowledge Intake** (multiple Knowledge Inputs). For requirement analysis, scenario generation, and test case generation, the **Approved Requirements Source** (FDD, PRD, SRS, or equivalent) remains the authoritative source of truth.
6. **Supporting Knowledge Inputs** (historical docs, transcripts, cloud refs, product docs, AI-derived knowledge, etc.) augment but never override or invent requirements.
7. **Every generated scenario must trace to one or more requirements.**
8. **Every test case must trace to a scenario.**
9. **Every module should have a single responsibility.**
10. **AI providers must be interchangeable.**
11. **Avoid vendor lock-in.**
12. **Prioritize maintainability over shortcuts.**

---

## 3. Working Process

No step may skip architecture review.

```
1. Product requirement
2. Architecture design          ← Chief Architect
3. Review                       ← Architect + Product Owner (as needed)
4. Cursor implementation        ← Implementation Engineer (approved design only)
5. Architecture validation      ← Chief Architect
6. Testing
7. Merge
```

### Gate definitions

| Gate | Required before next step |
|------|---------------------------|
| Requirement | Clear business intent from Product Owner |
| Architecture design | Documented design (ADR and/or design note) |
| Review | Explicit approval to implement |
| Implementation | Code/tests/docs aligned to approved design |
| Architecture validation | Confirm no boundary/lineage/provider violations |
| Testing | Automated and/or agreed manual validation |
| Merge | PR meets standards; protected `main` |

---

## 4. Traceability Invariants (product integrity)

These rules bind both design and implementation:

| Artifact | Must trace to |
|----------|----------------|
| Requirement analysis / validation | Approved Requirements Source (versioned; via Knowledge Intake) |
| Scenario | One or more requirements |
| Test case | Scenario (and thereby requirements / FDD) |
| AI generation metadata | Model/provider/prompt version + FDD version |
| Knowledge hits | Supporting evidence only — never FDD override |

---

## 5. Conflict Resolution

1. **Product scope conflicts** → Product Owner decides priority; Architect ensures feasibility and integrity.
2. **Technical design conflicts** → Chief Architect decides; record in ADR when significant.
3. **Implementation ambiguity** → Cursor stops and requests design clarification; does not invent.
4. **Charter vs shortcut pressure** → Charter wins (maintainability, no vendor lock-in, architecture-first).

---

## 6. What Cursor Must Do When Receiving Work

1. Check for approved architecture/design for the requested change.
2. If missing for a major feature → produce or request design; do not implement product logic yet.
3. Implement only within approved boundaries.
4. Update documentation when implementation realizes an approved design.
5. Surface architectural risks discovered during implementation to the Chief Architect — do not silently redesign.

---

*End of AI Development Charter.*
