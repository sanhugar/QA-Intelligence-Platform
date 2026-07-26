import { Injectable } from '@nestjs/common';
import {
  ClassificationService,
  type ClassificationInput,
  type ClassificationResult,
  type ClassificationServiceOptions,
  type EngineSummary,
} from '@ati/classification';
import type { IntakeRecord } from '@ati/intake';

/**
 * In-process Classification harness (WP-3.2 D8 / C5).
 * No HTTP Domain product surface — invoke only from host code/tests.
 */
@Injectable()
export class ClassificationHarness {
  private readonly service: ClassificationService;

  constructor(service?: ClassificationService) {
    this.service = service ?? ClassificationService.createReady();
  }

  static create(options?: ClassificationServiceOptions): ClassificationHarness {
    return new ClassificationHarness(ClassificationService.createReady(options));
  }

  getService(): ClassificationService {
    return this.service;
  }

  classify(input: ClassificationInput): ClassificationResult {
    return this.service.classify(input);
  }

  classifyIntakeRecord(
    record: IntakeRecord,
    engineSummary?: EngineSummary,
  ): ClassificationResult {
    return this.service.classifyIntakeRecord(record, engineSummary);
  }
}
