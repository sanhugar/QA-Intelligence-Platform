import {
  RequirementEngine,
  RequirementEngineErrorCodes,
  type EngineResult,
  type RequirementPipelineInput,
} from '@ati/requirement-engine';
import type { IntakeRequest } from './model';
import { IntakeStates } from './types';

export type EngineOutcomeMapping =
  | { terminalState: typeof IntakeStates.ACCEPTED; requirementId?: string; engine: EngineResult }
  | {
      terminalState: typeof IntakeStates.ACCEPTED_PENDING_PARSER;
      engine: EngineResult;
    }
  | {
      terminalState: typeof IntakeStates.FAILED;
      reason: string;
      message: string;
      engine?: EngineResult;
    };

/**
 * Map requirement-engine results to intake terminal states (D4 O1).
 */
export function mapEngineResultToIntake(result: EngineResult): EngineOutcomeMapping {
  if (result.status === 'completed') {
    return {
      terminalState: IntakeStates.ACCEPTED,
      requirementId: result.requirement.requirementId,
      engine: result,
    };
  }

  if (result.code === RequirementEngineErrorCodes.PARSER_NOT_REGISTERED) {
    return {
      terminalState: IntakeStates.ACCEPTED_PENDING_PARSER,
      engine: result,
    };
  }

  return {
    terminalState: IntakeStates.FAILED,
    reason: 'orchestration_error',
    message: result.message,
    engine: result,
  };
}

export function toPipelineInput(request: IntakeRequest): RequirementPipelineInput {
  return {
    format: request.source.declaredFormat,
    payload: request.payload,
    source: {
      sourceId: request.source.sourceIdentity,
      sourceVersion: request.source.sourceVersion,
      locator: request.source.locator,
      formatHint: request.source.declaredFormat,
    },
    correlationId: request.correlationId,
    tenantId: request.tenantId,
    workspaceId: request.workspaceId,
  };
}

export async function invokeRequirementEngine(
  engine: RequirementEngine,
  request: IntakeRequest,
): Promise<EngineResult> {
  return engine.runFoundationPipeline(toPipelineInput(request));
}
