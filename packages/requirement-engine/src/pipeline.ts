import type { Requirement, RequirementFragment, RequirementSection } from './model';
import type { RequirementFormatKey } from './types';

/** In-memory payload for foundation pipeline (no storage). */
export interface RequirementPipelineInput {
  format: RequirementFormatKey;
  /** Raw text or opaque payload string — not persisted by the engine. */
  payload: string;
  source: {
    sourceId: string;
    sourceVersion?: string;
    locator?: string;
    formatHint?: string;
  };
  /** Optional correlation / context carry-through (diagnostic/scope only). */
  correlationId?: string;
  tenantId?: string;
  workspaceId?: string;
}

export interface ParseResult {
  sections: RequirementSection[];
  fragments?: RequirementFragment[];
  notes?: string[];
}

/**
 * Parser extension port — implementations live in future WPs.
 * WP-2.5 ships contracts + test stub only.
 */
export interface ParsePort {
  readonly format: RequirementFormatKey;
  parse(input: RequirementPipelineInput): ParseResult | Promise<ParseResult>;
}

/**
 * Normalize extension port — default is identity/no-op.
 */
export interface NormalizePort {
  normalize(parsed: ParseResult, input: RequirementPipelineInput): ParseResult | Promise<ParseResult>;
}

export type EngineResultStatus = 'completed' | 'failed';

export interface EngineResultSuccess {
  status: 'completed';
  requirement: Requirement;
  correlationId?: string;
  tenantId?: string;
  workspaceId?: string;
}

export interface EngineResultFailure {
  status: 'failed';
  code: string;
  message: string;
  correlationId?: string;
  tenantId?: string;
  workspaceId?: string;
}

export type EngineResult = EngineResultSuccess | EngineResultFailure;

export function createNoOpNormalizePort(): NormalizePort {
  return {
    normalize(parsed) {
      return parsed;
    },
  };
}

/** Assemble ParseResult + source into a Requirement-shaped object (pre-validation). */
export function assembleRequirement(
  input: RequirementPipelineInput,
  parsed: ParseResult,
  requirementId: string,
): unknown {
  const sections =
    parsed.sections.length > 0
      ? parsed.sections
      : [
          {
            sectionId: `${requirementId}-section-1`,
            title: 'default',
            fragments: parsed.fragments ?? [],
          },
        ];

  return {
    requirementId,
    sections,
    metadata: {
      attributes: {},
      languageHint: undefined,
      confidence: undefined,
    },
    sourceReferences: [
      {
        sourceId: input.source.sourceId,
        sourceVersion: input.source.sourceVersion,
        locator: input.source.locator,
        formatHint: input.source.formatHint ?? String(input.format),
      },
    ],
  };
}
