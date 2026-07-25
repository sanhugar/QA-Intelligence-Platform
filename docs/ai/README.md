# AI Design

**Status:** Reasoning architecture approved (design only).

## Canonical blueprints

| Document | Role |
|----------|------|
| [DOMAIN_ARCHITECTURE.md](../architecture/DOMAIN_ARCHITECTURE.md) | What ATI is (business model) |
| [AI_REASONING_ARCHITECTURE.md](../architecture/AI_REASONING_ARCHITECTURE.md) | How ATI thinks (Brain pipeline) |
| [QA_INTELLIGENCE_FRAMEWORK.md](../architecture/QA_INTELLIGENCE_FRAMEWORK.md) | How ATI thinks like Senior QA |
| [AI_DECISION_AND_EVIDENCE_FRAMEWORK.md](../architecture/AI_DECISION_AND_EVIDENCE_FRAMEWORK.md) | How ATI decides, evidences, and audits |
| [KNOWLEDGE_ARCHITECTURE.md](../architecture/KNOWLEDGE_ARCHITECTURE.md) | How ATI remembers (EKB) |
| [ENTERPRISE_DATA_ARCHITECTURE.md](../architecture/ENTERPRISE_DATA_ARCHITECTURE.md) | What information ATI manages (EIM) |
| [CANONICAL_TERMINOLOGY.md](../architecture/CANONICAL_TERMINOLOGY.md) | Knowledge Intake / Approved Requirements Source |
| [KNOWLEDGE_INTAKE_AND_WORKFLOW_ORCHESTRATION_ARCHITECTURE.md](../architecture/KNOWLEDGE_INTAKE_AND_WORKFLOW_ORCHESTRATION_ARCHITECTURE.md) | How ATI intakes, routes, and orchestrates workflows |
| [INTEGRATION_AND_EXTERNAL_SYSTEMS_ARCHITECTURE.md](../architecture/INTEGRATION_AND_EXTERNAL_SYSTEMS_ARCHITECTURE.md) | How ATI integrates externally (vendor-neutral) |

## Principles (summary)

1. **Knowledge Intake first** — FDD is one Knowledge Input, not the sole entry.
2. **Approved Requirements Source primacy for generation** — supporting knowledge augments, never overrides or invents.
3. **Reason before generate** — never raw intake → test cases directly.
4. **Provider independence** — engines use ports; vendors are adapters; **LLMs are not memory**.
5. **Intentional retrieval** — no “retrieve everything.”
6. **Evidence-based decisions** — no black box; confidence ≠ certainty; human overrides AI.
7. **Traceability** — Requirement → Scenario → Test Case → Automation → Release → Execution → Defect.
8. **Unknown stays unknown** — no invented functionality.
9. **Self-review + coverage** before Final Output.
10. **Learning is governed** — candidates require approval; no silent mutation of published knowledge.
11. Prompt assets (when later authorized) are versioned under `/prompts` and are not the source of product truth.
