# ADR 0014: Security & Governance Architecture

- **Status:** Accepted
- **Date:** 2026-07-25
- **Decision makers:** Chief Information Security Architect, Enterprise Governance Architect, Principal AI Platform Architect (design), Product governance via charter

## Context

ATI has approved Foundation through Application Architectures (ADRs 0001–0013), including Decision/Evidence HITL, Knowledge lifecycle, Integration connector trust, and Application packaging. The platform still lacks a canonical enterprise security, governance, compliance, risk, audit, and AI-accountability posture that consumes those architectures without redefining them, and without prescribing code, APIs, schemas, UI, or prompts.

## Decision

Adopt `docs/architecture/SECURITY_AND_GOVERNANCE_ARCHITECTURE.md` as the canonical **Enterprise Security & Governance Architecture**, defining:

1. Enterprise security architecture (identity/trust boundaries, zones, ownership, data protection philosophy)  
2. Identity & access governance (AuthN/AuthZ, RBAC, future ABAC, tenant/admin/service/human/delegation)  
3. AI governance overlay (accountability, escalation, output ownership) referencing Decision & Evidence — not redefining it  
4. Knowledge and information governance overlays  
5. Integration and application security expectations  
6. Operational, compliance, risk, audit/observability, and continuity governance  
7. Extensibility for future security/compliance/AI governance standards  
8. Architecture governance rules  
9. Architectural Dependencies & Boundaries and dependency matrix  

**Hard bans:** no redefinition of Domain/Brain/Knowledge/Decision/EIM/Orchestration/Integration/Application meaning; no regulation-specific mandates; no implementation; human authority over AI; published knowledge truth must not silently change; externals never Requirements/Approval masters.

## Alternatives Considered

1. **Keep only SECURITY.md foundation bullets** — rejected (insufficient enterprise governance coverage).  
2. **Absorb into Decision & Evidence Framework** — rejected (covers AI decisions, not identity/ops/compliance/integration security posture).  
3. **Absorb into Integration Architecture** — rejected (connector security ≠ enterprise governance).  
4. **Defer until after Platform Spine code** — rejected (Architecture Before Implementation; controls must be designed first).

## Consequences

### Positive

- Clear ownership for security, AI accountability, knowledge/information governance, and compliance readiness  
- Consistent fail-secure / degrade / non-corruption posture with Integration and Decision Frameworks  
- Extensible compliance and IdP paths without Core redesign  

### Negative / Risks

- Risk of duplicating Decision/Knowledge rules if stewards rewrite instead of reference — mitigated by explicit boundaries  
- Multi-tenant and legal-hold details still require future specialized ADRs before implementation  

### Follow-ups

- Formal threat model when authenticated Platform Spine surfaces exist  
- Tenant model ADR before first persistence migration  
- Update `SECURITY.md` to point to this canonical document  
- Compliance mapping packs as customer/enterprise extensions  
