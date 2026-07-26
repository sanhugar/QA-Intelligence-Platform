import { Global, Module, type MiddlewareConsumer, type NestModule } from '@nestjs/common';
import { CorrelationMiddleware } from './correlation.middleware';
import { ObservabilityRuntime } from './observability-runtime';

export const API_OBSERVABILITY_RUNTIME = 'API_OBSERVABILITY_RUNTIME';

@Global()
@Module({
  providers: [
    {
      provide: API_OBSERVABILITY_RUNTIME,
      useFactory: () => ObservabilityRuntime.create({ host: 'api' }),
    },
    {
      provide: ObservabilityRuntime,
      useExisting: API_OBSERVABILITY_RUNTIME,
    },
    CorrelationMiddleware,
  ],
  exports: [ObservabilityRuntime, API_OBSERVABILITY_RUNTIME],
})
export class ObservabilityModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(CorrelationMiddleware).forRoutes('*');
  }
}
