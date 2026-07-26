import { Global, Module } from '@nestjs/common';
import { WorkerRequirementEngineHarness } from './requirement-engine-harness';

export const WORKER_REQUIREMENT_ENGINE_HARNESS = 'WORKER_REQUIREMENT_ENGINE_HARNESS';

@Global()
@Module({
  providers: [
    {
      provide: WORKER_REQUIREMENT_ENGINE_HARNESS,
      useFactory: () => WorkerRequirementEngineHarness.create(),
    },
    {
      provide: WorkerRequirementEngineHarness,
      useExisting: WORKER_REQUIREMENT_ENGINE_HARNESS,
    },
  ],
  exports: [WorkerRequirementEngineHarness, WORKER_REQUIREMENT_ENGINE_HARNESS],
})
export class WorkerRequirementEngineModule {}
