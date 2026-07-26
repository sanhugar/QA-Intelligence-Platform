import { Injectable } from '@nestjs/common';
import type { ClassificationResult } from '@ati/classification';
import type { IntakeRecord } from '@ati/intake';
import {
  FeatureVersionService,
  type EngineSummary,
  type FeatureVersionInput,
  type FeatureVersionResult,
  type FeatureVersionServiceOptions,
} from '@ati/feature-version';

/**
 * In-process Feature Version harness (WP-3.3 D7 / C5).
 * No HTTP Domain product surface.
 */
@Injectable()
export class FeatureVersionHarness {
  private readonly service: FeatureVersionService;

  constructor(service?: FeatureVersionService) {
    this.service = service ?? FeatureVersionService.createReady();
  }

  static create(options?: FeatureVersionServiceOptions): FeatureVersionHarness {
    return new FeatureVersionHarness(FeatureVersionService.createReady(options));
  }

  getService(): FeatureVersionService {
    return this.service;
  }

  resolveFeatureVersion(input: FeatureVersionInput): FeatureVersionResult {
    return this.service.resolveFeatureVersion(input);
  }

  resolveFromIntake(
    record: IntakeRecord,
    classification: ClassificationResult,
    engineSummary?: EngineSummary,
  ): FeatureVersionResult {
    return this.service.resolveFromIntake(record, classification, engineSummary);
  }
}
