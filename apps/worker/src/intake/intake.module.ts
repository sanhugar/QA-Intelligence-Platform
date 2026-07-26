import { Global, Module } from '@nestjs/common';
import { IntakeHarness } from './intake-harness';
import { WorkerRequirementEngineModule } from '../requirement-engine/requirement-engine.module';

export const WORKER_INTAKE_HARNESS = 'WORKER_INTAKE_HARNESS';

@Global()
@Module({
  imports: [WorkerRequirementEngineModule],
  providers: [
    {
      provide: WORKER_INTAKE_HARNESS,
      useFactory: () => IntakeHarness.create(),
    },
    {
      provide: IntakeHarness,
      useExisting: WORKER_INTAKE_HARNESS,
    },
  ],
  exports: [IntakeHarness, WORKER_INTAKE_HARNESS],
})
export class WorkerIntakeModule {}
