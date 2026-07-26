import { Injectable } from '@nestjs/common';
import {
  RequirementEngine,
  type EngineResult,
  type RequirementEngineOptions,
  type RequirementPipelineInput,
} from '@ati/requirement-engine';

/**
 * Worker in-process Requirement Engine harness (WP-2.5 D6).
 * No HTTP Domain product surface.
 */
@Injectable()
export class WorkerRequirementEngineHarness {
  private readonly engine: RequirementEngine;

  constructor(engine?: RequirementEngine) {
    this.engine =
      engine ??
      RequirementEngine.createReady({
        config: { enabled: true, registerStubParser: false },
      });
  }

  static create(options?: RequirementEngineOptions): WorkerRequirementEngineHarness {
    return new WorkerRequirementEngineHarness(RequirementEngine.createReady(options));
  }

  getEngine(): RequirementEngine {
    return this.engine;
  }

  async run(input: RequirementPipelineInput): Promise<EngineResult> {
    return this.engine.runFoundationPipeline(input);
  }
}
