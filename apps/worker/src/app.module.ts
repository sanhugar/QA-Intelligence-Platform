import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';

/**
 * Worker host root module — WP-1.1 bootstrap only.
 * No job processors, queues, Redis, or business modules.
 */
@Module({
  imports: [HealthModule],
})
export class AppModule {}
