import { Global, Module } from '@nestjs/common';
import { RequirementEngineHarness } from './requirement-engine-harness';

export const API_REQUIREMENT_ENGINE_HARNESS = 'API_REQUIREMENT_ENGINE_HARNESS';

/**
 * Thin host wiring for WP-2.5 — no HTTP controllers (C5 / D6).
 */
@Global()
@Module({
  providers: [
    {
      provide: API_REQUIREMENT_ENGINE_HARNESS,
      useFactory: () => RequirementEngineHarness.create(),
    },
    {
      provide: RequirementEngineHarness,
      useExisting: API_REQUIREMENT_ENGINE_HARNESS,
    },
  ],
  exports: [RequirementEngineHarness, API_REQUIREMENT_ENGINE_HARNESS],
})
export class RequirementEngineModule {}
