import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { WorkerObservabilityModule } from './observability/observability.module';
import { WorkerAuthModule } from './auth/auth.module';
import { WorkerContextModule } from './context/context.module';
import { WorkerRequirementEngineModule } from './requirement-engine/requirement-engine.module';
import { WorkerIntakeModule } from './intake/intake.module';
import { WorkerClassificationModule } from './classification/classification.module';

/**
 * Worker host root module.
 * Middleware order (WP-2.3 L3 + WP-2.4):
 * correlation mint → service auth → trusted context bind.
 * WP-2.5: Requirement engine harness-only (no HTTP).
 * WP-3.1: Intake harness-only (no HTTP).
 * WP-3.2: Classification harness-only (no HTTP).
 */
@Module({
  imports: [
    HealthModule,
    WorkerObservabilityModule,
    WorkerAuthModule,
    WorkerContextModule,
    WorkerRequirementEngineModule,
    WorkerIntakeModule,
    WorkerClassificationModule,
  ],
})
export class AppModule {}
