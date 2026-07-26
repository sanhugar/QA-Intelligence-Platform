/** Deployable host kind shared by api/worker configuration. */
export type HostKind = 'api' | 'worker';

/** Opaque correlation identifier for cross-runtime log/event linking. */
export type CorrelationId = string;

/** Opaque reasoning run identifier (AI Runtime context field). */
export type ReasoningRunId = string;
