/** Well-known format keys for parser port registration (WP-2.5 D4). */
export const RequirementFormatKeys = {
  MARKDOWN: 'markdown',
  FDD: 'fdd',
  PRD: 'prd',
  USER_STORY: 'user_story',
  /** Test-only stub — not a production format parser. */
  STUB: 'stub',
} as const;

export type RequirementFormatKey =
  | (typeof RequirementFormatKeys)[keyof typeof RequirementFormatKeys]
  | (string & {});

export class RequirementEngineError extends Error {
  constructor(
    message: string,
    readonly code: string,
  ) {
    super(message);
    this.name = 'RequirementEngineError';
  }
}

export const RequirementEngineErrorCodes = {
  NOT_READY: 'REQUIREMENT_ENGINE_NOT_READY',
  INVALID_CONFIG: 'REQUIREMENT_ENGINE_INVALID_CONFIG',
  INVALID_MODEL: 'REQUIREMENT_ENGINE_INVALID_MODEL',
  PARSER_NOT_REGISTERED: 'REQUIREMENT_ENGINE_PARSER_NOT_REGISTERED',
  PARSE_FAILED: 'REQUIREMENT_ENGINE_PARSE_FAILED',
  SHUTDOWN: 'REQUIREMENT_ENGINE_SHUTDOWN',
} as const;

export type RequirementEngineLifecycleState =
  | 'created'
  | 'initialized'
  | 'ready'
  | 'shutdown';
