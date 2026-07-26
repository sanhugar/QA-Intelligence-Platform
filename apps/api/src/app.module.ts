import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { ObservabilityModule } from './observability/observability.module';
import { AuthModule } from './auth/auth.module';
import { ContextModule } from './context/context.module';
import { RequirementEngineModule } from './requirement-engine/requirement-engine.module';
import { IntakeModule } from './intake/intake.module';
import { ClassificationModule } from './classification/classification.module';
import { FeatureVersionModule } from './feature-version/feature-version.module';

/**
 * API host root module.
 * Middleware registration order (WP-2.3 L3 + WP-2.4):
 * Observability (correlation) → Auth → Context.
 * WP-2.5: RequirementEngineModule is harness-only (no HTTP middleware).
 * WP-3.1: IntakeModule is harness-only (no HTTP controllers).
 * WP-3.2: ClassificationModule is harness-only (no HTTP controllers).
 * WP-3.3: FeatureVersionModule is harness-only (no HTTP controllers).
 */
@Module({
  imports: [
    HealthModule,
    ObservabilityModule,
    AuthModule,
    ContextModule,
    RequirementEngineModule,
    IntakeModule,
    ClassificationModule,
    FeatureVersionModule,
  ],
})
export class AppModule {}
