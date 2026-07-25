# Canonical Terminology — Knowledge Intake Alignment

**Document ID:** ATI-ARCH-TERM-001  
**Status:** Normative terminology (consistency refactor; no redesign)  
**ADR:** [0010 — Knowledge Intake Terminology](../adr/0010-knowledge-intake-terminology.md)  
**Last updated:** 2026-07-25

This note aligns vocabulary across approved architecture documents. It does **not** change architectural intent, engines, invariants, or gates.

---

## Canonical Principle

**ATI does not start with a Feature Design Document (FDD).**

**ATI starts with a Knowledge Intake.**

An FDD is one supported **Knowledge Input**, not the only one and not the assumed sole entry point.

ATI is an **Enterprise AI QA Knowledge Platform** capable of understanding and reasoning over multiple knowledge sources.

---

## Normative terms

| Term | Meaning |
|------|---------|
| **Knowledge Intake** | The canonical platform entry point: accepting one or more Knowledge Inputs into ATI for registration, understanding, and reasoning. |
| **Knowledge Input** | Any governed source accepted through Knowledge Intake. Examples: FDD, PRD, SRS (or equivalent approved specification), historical documents, meeting transcripts, cloud references, product documentation, architecture docs, standards, AI-derived candidates (pre-approval). |
| **Approved Requirements Source** | The current approved requirements specification designated for a Feature Version — commonly an **FDD**, or equivalently a **PRD**, **SRS**, or other approved specification. This is the **authoritative source of truth** when ATI performs requirement analysis, scenario generation, and test case generation. |
| **Supporting Knowledge Input** | Any Knowledge Input that is **not** the Approved Requirements Source for the active generation scope. It may augment reasoning and must never override or invent requirements. |
| **FDD (Feature Design Document)** | A supported Knowledge Input type and a common form of Approved Requirements Source. Where older text says “FDD primacy” in a *generation* context, read **Approved Requirements Source primacy** (FDD/PRD/SRS/equivalent). |

---

## Authority rules (unchanged intent)

1. **Platform entry:** Knowledge Intake (multi-source).  
2. **Requirement / Scenario / Test Case generation:** Approved Requirements Source is authoritative.  
3. **Supporting Knowledge Inputs** (historical docs, transcripts, cloud refs, product docs, AI-derived knowledge, etc.) are supporting context only — never override or invent requirements.  
4. **Unknown remains unknown.** Invention of functionality remains forbidden.  

---

## Document alignment guide

When reading or updating architecture docs:

| If the text said… | Prefer… |
|-------------------|---------|
| “ATI starts with an FDD” | “ATI starts with Knowledge Intake” |
| “FDD is the only input” | “FDD is one Knowledge Input; Approved Requirements Source is required for generation authority” |
| “FDD is always the primary source of truth” (platform-wide) | Split: Intake = multi-source; **generation** = Approved Requirements Source primacy |
| “FDD-only fallback” | “Approved Requirements Source–only fallback” (supporting knowledge unavailable) |
| Pipeline first box = FDD | First box = Knowledge Intake → Knowledge Inputs (incl. Approved Requirements Source when designated) |

---

## ADR validity

ADRs 0001–0009 remain **valid**. Their intent (reason-before-generate, traceability, knowledge augment-not-override, decision evidence, EIM) is unchanged. ADR 0010 records this terminology clarification.

**Operational architecture:** How Knowledge Intake runs as workflows is defined in [KNOWLEDGE_INTAKE_AND_WORKFLOW_ORCHESTRATION_ARCHITECTURE.md](./KNOWLEDGE_INTAKE_AND_WORKFLOW_ORCHESTRATION_ARCHITECTURE.md) (ADR 0011).
