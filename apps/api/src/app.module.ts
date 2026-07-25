import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';

/**
 * API host root module — WP-1.1 bootstrap only.
 * No business, domain, AI, auth, or infrastructure modules.
 */
@Module({
  imports: [HealthModule],
})
export class AppModule {}
