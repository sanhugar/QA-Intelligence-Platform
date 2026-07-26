import { Injectable } from '@nestjs/common';
import {
  IntakeWorkflow,
  type IntakeRecord,
  type IntakeWorkflowOptions,
} from '@ati/intake';
import { WorkerRequirementEngineHarness } from '../requirement-engine/requirement-engine-harness';

/**
 * Worker in-process Intake Entry harness (WP-3.1 D7).
 */
@Injectable()
export class IntakeHarness {
  private readonly workflow: IntakeWorkflow;

  constructor(workflow?: IntakeWorkflow) {
    this.workflow =
      workflow ??
      IntakeWorkflow.createReady({
        engine: WorkerRequirementEngineHarness.create().getEngine(),
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
