import { Global, Module } from '@nestjs/common';
import { IntakeHarness } from './intake-harness';
import { RequirementEngineModule } from '../requirement-engine/requirement-engine.module';

export const API_INTAKE_HARNESS = 'API_INTAKE_HARNESS';

/**
 * Thin host wiring for WP-3.1 — no HTTP controllers (C5 / D7).
 */
@Global()
@Module({
  imports: [RequirementEngineModule],
  providers: [
    {
      provide: API_INTAKE_HARNESS,
      useFactory: () => IntakeHarness.create(),
    },
    {
      provide: IntakeHarness,
      useExisting: API_INTAKE_HARNESS,
    },
  ],
  exports: [IntakeHarness, API_INTAKE_HARNESS],
})
export class IntakeModule {}
