import { Global, Module } from '@nestjs/common';
import { ClassificationHarness } from './classification-harness';

export const API_CLASSIFICATION_HARNESS = 'API_CLASSIFICATION_HARNESS';

/**
 * Thin host wiring for WP-3.2 — no HTTP controllers (C5 / D8).
 */
@Global()
@Module({
  providers: [
    {
      provide: API_CLASSIFICATION_HARNESS,
      useFactory: () => ClassificationHarness.create(),
    },
    {
      provide: ClassificationHarness,
      useExisting: API_CLASSIFICATION_HARNESS,
    },
  ],
  exports: [ClassificationHarness, API_CLASSIFICATION_HARNESS],
})
export class ClassificationModule {}
