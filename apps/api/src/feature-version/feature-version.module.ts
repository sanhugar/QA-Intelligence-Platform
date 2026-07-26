import { Global, Module } from '@nestjs/common';
import { FeatureVersionHarness } from './feature-version-harness';

export const API_FEATURE_VERSION_HARNESS = 'API_FEATURE_VERSION_HARNESS';

/**
 * Thin host wiring for WP-3.3 — no HTTP controllers (C5 / D7).
 */
@Global()
@Module({
  providers: [
    {
      provide: API_FEATURE_VERSION_HARNESS,
      useFactory: () => FeatureVersionHarness.create(),
    },
    {
      provide: FeatureVersionHarness,
      useExisting: API_FEATURE_VERSION_HARNESS,
    },
  ],
  exports: [FeatureVersionHarness, API_FEATURE_VERSION_HARNESS],
})
export class FeatureVersionModule {}
