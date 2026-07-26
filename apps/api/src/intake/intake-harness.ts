import { Injectable } from '@nestjs/common';
import {
  IntakeWorkflow,
  type IntakeRecord,
  type IntakeWorkflowOptions,
} from '@ati/intake';
import { RequirementEngineHarness } from '../requirement-engine/requirement-engine-harness';

/**
 * In-process Intake Entry harness (WP-3.1 D7).
 * No HTTP Domain product surface — invoke only from host code/tests.
 */
@Injectable()
export class IntakeHarness {
  private readonly workflow: IntakeWorkflow;

  constructor(workflow?: IntakeWorkflow) {
    this.workflow =
      workflow ??
      IntakeWorkflow.createReady({
        engine: RequirementEngineHarness.create().getEngine(),
      });
  }

  static create(options?: IntakeWorkflowOptions): IntakeHarness {
    return new IntakeHarness(IntakeWorkflow.createReady(options));
  }

  getWorkflow(): IntakeWorkflow {
    return this.workflow;
  }

  async submit(input: unknown): Promise<IntakeRecord> {
    return this.workflow.submit(input);
  }
}
