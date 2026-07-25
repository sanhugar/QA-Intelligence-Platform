# Security Architecture (Foundation Index)

Canonical enterprise security and governance live in:

**[SECURITY_AND_GOVERNANCE_ARCHITECTURE.md](./SECURITY_AND_GOVERNANCE_ARCHITECTURE.md)** (ADR 0014)

## Foundation baselines (still valid)

- OIDC SSO (Entra ID primary) — Foundation Architecture
- RBAC in application policies — Application + Security & Governance Architectures
- Secrets via environment / vault adapters (never git) — Foundation + Integration Architectures
- Structured audit logging port — Security & Governance + Decision & Evidence Frameworks
- Dependency and container scanning in CI — Foundation / Operational Governance
- Least-privilege cloud IAM — Security & Governance (conceptual) + future deployment gates

## Data handling

FDDs, Knowledge Inputs, and generated QA artifacts are enterprise-sensitive. Access, retention, residency, and export policies are governed by Security & Governance Architecture and EIM; specialized ADRs precede broad ingestion implementation.

## Threat modeling

A formal threat model remains a follow-up when the platform spine exposes authenticated surfaces; it must consume ADR 0014 rather than redefine it.
