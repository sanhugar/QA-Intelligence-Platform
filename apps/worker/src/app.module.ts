import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { WorkerObservabilityModule } from './observability/observability.module';
import { WorkerAuthModule } from './auth/auth.module';
import { WorkerContextModule } from './context/context.module';

/**
 * Worker host root module.
 * Middleware order (WP-2.3 L3 + WP-2.4):
 * correlation mint → service auth → trusted context bind.
 */
@Module({
  imports: [HealthModule, WorkerObservabilityModule, WorkerAuthModule, WorkerContextModule],
})
export class AppModule {}
