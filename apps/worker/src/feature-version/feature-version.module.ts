import { Global, Module } from '@nestjs/common';
import { FeatureVersionHarness } from './feature-version-harness';

export const WORKER_FEATURE_VERSION_HARNESS = 'WORKER_FEATURE_VERSION_HARNESS';

/**
 * Thin worker host wiring for WP-3.3 — no HTTP controllers (C5 / D7).
 */
@Global()
@Module({
  providers: [
    {
      provide: WORKER_FEATURE_VERSION_HARNESS,
      useFactory: () => FeatureVersionHarness.create(),
    },
    {
      provide: FeatureVersionHarness,
      useExisting: WORKER_FEATURE_VERSION_HARNESS,
    },
  ],
  exports: [FeatureVersionHarness, WORKER_FEATURE_VERSION_HARNESS],
})
export class WorkerFeatureVersionModule {}
