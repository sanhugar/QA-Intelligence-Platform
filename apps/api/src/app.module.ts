import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { ObservabilityModule } from './observability/observability.module';
import { AuthModule } from './auth/auth.module';
import { ContextModule } from './context/context.module';

/**
 * API host root module.
 * Middleware registration order (WP-2.3 L3 + WP-2.4):
 * Observability (correlation) → Auth → Context.
 */
@Module({
  imports: [HealthModule, ObservabilityModule, AuthModule, ContextModule],
})
export class AppModule {}
