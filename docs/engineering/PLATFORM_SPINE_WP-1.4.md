# Platform Spine — WP-1.4 Delivery Note

**Status:** Implementation note (not an architecture redesign)  
**Work Package:** WP-1.4 — Platform AI Runtime Host Shell  
**Last updated:** 2026-07-26

## What WP-1.4 delivers

Host-local Platform AI Runtime Host in `apps/api` and `apps/worker` under `src/spine/ai-runtime/`:

- Engine Manifest validation and registration into the existing `ai-engine` extension catalog
- `platform-noop` stub engine (`0.0.0`, `platformStub: true`) — not Brain
- Invocation envelope for **test harness only** (no REST, no boot-time invoke)
- Minimal lifecycle: validate envelope → `completed`
- Execution context limited to `reasoningRunId`, `correlationId`, `engineId`
- Boot step **Platform AI Runtime Host** immediately before **Platform READY**

Worker remains execution-primary; both hosts carry the shell.

## Mandatory boot order

Configuration → Logger → Module Registration → Shared Service Registry → Diagnostics → Feature Flags → Audit Support → Event Publisher → Scheduler → **Platform AI Runtime Host** → Platform READY

## What WP-1.4 does not deliver

Brain engines, AI providers/ports, Orchestration, workflow runtime, Auth/tenancy, Redis/BullMQ, shared packages, REST execute APIs, evidence/HITL. See [WP-1.4_DEFERRED_CAPABILITY_REGISTER.md](../implementation/WP-1.4_DEFERRED_CAPABILITY_REGISTER.md).

## Related

- [PLATFORM_SPINE_ENGINEERING_SPECIFICATION.md](./PLATFORM_SPINE_ENGINEERING_SPECIFICATION.md)
- [AI_ENGINE_SPECIFICATION_FRAMEWORK.md](./AI_ENGINE_SPECIFICATION_FRAMEWORK.md)
- [WP-1.4_IMPLEMENTATION_REPORT.md](../implementation/WP-1.4_IMPLEMENTATION_REPORT.md)
