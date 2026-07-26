import { Injectable } from '@nestjs/common';
import {
  RequirementEngine,
  type EngineResult,
  type RequirementEngineOptions,
  type RequirementPipelineInput,
} from '@ati/requirement-engine';

/**
 * In-process Requirement Engine harness (WP-2.5 D6).
 * No HTTP Domain product surface — invoke only from host code/tests.
 * Carries correlation/context fields through pipeline options (Auth/Obs/Context coexistence).
 */
@Injectable()
export class RequirementEngineHarness {
  private readonly engine: RequirementEngine;

  constructor(engine?: RequirementEngine) {
    this.engine =
      engine ??
      RequirementEngine.createReady({
        config: { enabled: true, registerStubParser: false },
      });
  }

  static create(options?: RequirementEngineOptions): RequirementEngineHarness {
    return new RequirementEngineHarness(RequirementEngine.createReady(options));
  }

  getEngine(): RequirementEngine {
    return this.engine;
  }

  async run(input: RequirementPipelineInput): Promise<EngineResult> {
    return this.engine.runFoundationPipeline(input);
  }
}
