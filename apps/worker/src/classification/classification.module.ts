import { Global, Module } from '@nestjs/common';
import { ClassificationHarness } from './classification-harness';

export const WORKER_CLASSIFICATION_HARNESS = 'WORKER_CLASSIFICATION_HARNESS';

/**
 * Thin worker host wiring for WP-3.2 — no HTTP controllers (C5 / D8).
 */
@Global()
@Module({
  providers: [
    {
      provide: WORKER_CLASSIFICATION_HARNESS,
      useFactory: () => ClassificationHarness.create(),
    },
    {
      provide: ClassificationHarness,
      useExisting: WORKER_CLASSIFICATION_HARNESS,
    },
  ],
  exports: [ClassificationHarness, WORKER_CLASSIFICATION_HARNESS],
})
export class WorkerClassificationModule {}
