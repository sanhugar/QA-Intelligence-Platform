# Platform Registration Dependency Matrix

**Document ID:** ATI-ENG-SPINE-REG-DEPS-001  
**Status:** Approved engineering clarification (WP-1.2)  
**Product:** AI QA Intelligence Platform (ATI v2)  
**Last updated:** 2026-07-26

---

## 1. Purpose

This document defines **bootstrap / registration dependencies** only — the hard `dependencies[]` used by the Platform Spine during module discovery, validation, ordering, and registration at host startup.

It enables a **deterministic, acyclic (DAG)** registration order for empty Application Module shells.

---

## 2. Normative distinction (no redesign)

| Concern | Source of truth |
|---------|-----------------|
| Business / runtime relationships | [APPLICATION_ARCHITECTURE.md](../architecture/APPLICATION_ARCHITECTURE.md) — unchanged |
| Bootstrap / registration dependencies | **This matrix** |

Application Architecture “Dependencies” describe **business and runtime** relationships.  
They **must not** be inferred as registration edges for WP-1.2.

This document does **not** redefine Application Architecture, create an ADR, rename modules, or change Domain meaning.

---

## 3. Rules

1. Include only dependencies required **before** a module may be registered.  
2. Ignore runtime communication.  
3. Ignore workflow participation.  
4. Ignore service consumption.  
5. Ignore downstream / consumer relationships.  
6. Ignore optional dependencies.  
7. Registration dependencies **must form a DAG**.  
8. If no bootstrap dependency exists, `dependencies = []`.  
9. `registrationPriority` (integer, lower first) resolves ties among modules with no mutual registration dependency — **never** overrides a hard dependency edge.  
10. Canonical `moduleId` / names match Application Architecture §2 backend modules (no invent/omit/rename).

---

## 4. Registration dependency matrix

For WP-1.2 **empty module shells**, no module requires another module to be registered first (shells carry metadata and no-op lifecycle only). Therefore every hard registration dependency list is empty. Deterministic order uses `registrationPriority` aligned to Application Architecture §2 section order.

| moduleId | moduleName (canonical) | dependencies | registrationPriority |
|----------|------------------------|--------------|----------------------|
| `administration` | Administration | `[]` | 10 |
| `access` | User & Access Management | `[]` | 20 |
| `configuration` | Configuration | `[]` | 30 |
| `document-management` | Document Management | `[]` | 40 |
| `knowledge-intake-coordination` | Knowledge Intake Coordination | `[]` | 50 |
| `requirement-management` | Requirement Management | `[]` | 60 |
| `knowledge-management` | Knowledge Management | `[]` | 70 |
| `test-design` | Test Design | `[]` | 80 |
| `ai-reasoning` | AI Reasoning (application module) | `[]` | 90 |
| `ai-review` | AI Review | `[]` | 100 |
| `automation` | Automation | `[]` | 110 |
| `execution-management` | Execution & Defects | `[]` | 120 |
| `release-management` | Release Management | `[]` | 130 |
| `reporting` | Reporting | `[]` | 140 |
| `notification` | Notification | `[]` | 150 |
| `workflow-orchestration` | Workflow Orchestration (application module) | `[]` | 160 |
| `integration-facade` | Integration Facade | `[]` | 170 |

---

## 5. Graph validation

| Check | Result |
|-------|--------|
| All Application Architecture §2 backend modules present | Yes (17) |
| No invented modules | Yes |
| No renamed modules | Yes |
| Hard edges | None |
| Cycles | None (vacuously a DAG) |
| Deterministic order | By ascending `registrationPriority`, then `moduleId` lexicographic tie-break |

Expected registration order (priority, then `moduleId`):

1. administration  
2. access  
3. configuration  
4. document-management  
5. knowledge-intake-coordination  
6. requirement-management  
7. knowledge-management  
8. test-design  
9. ai-reasoning  
10. ai-review  
11. automation  
12. execution-management  
13. release-management  
14. reporting  
15. notification  
16. workflow-orchestration  
17. integration-facade  

---

## 6. Evolution

Future Work Packages may add **bootstrap** edges to this matrix when a module shell truly cannot register until another shell is registered (still a DAG). Such changes are engineering clarifications to **this** document — not silent edits to Application Architecture business dependencies.

---

## Document Control

| Field | Value |
|-------|-------|
| **Version** | 1.0 |
| **Status** | Approved for WP-1.2 implementation |
| **Owner** | Principal Software Architect / Platform Engineering |
| **Related** | Platform Spine Eng Spec; Application Architecture (consumed, not redefined); WP-1.2 |

### Change History

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-07-26 | Initial bootstrap registration dependency matrix (all `[]`; priority by §2 order) |

---

*End of Platform Registration Dependency Matrix.*
