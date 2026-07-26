import { Global, Module, type MiddlewareConsumer, type NestModule } from '@nestjs/common';
import { WorkerCorrelationMiddleware } from './correlation.middleware';
import { WorkerObservabilityRuntime } from './observability-runtime';

export const WORKER_OBSERVABILITY_RUNTIME = 'WORKER_OBSERVABILITY_RUNTIME';

@Global()
@Module({
  providers: [
    {
      provide: WORKER_OBSERVABILITY_RUNTIME,
      useFactory: () => WorkerObservabilityRuntime.create(),
    },
    {
      provide: WorkerObservabilityRuntime,
      useExisting: WORKER_OBSERVABILITY_RUNTIME,
    },
    WorkerCorrelationMiddleware,
  ],
  exports: [WorkerObservabilityRuntime, WORKER_OBSERVABILITY_RUNTIME],
})
export class WorkerObservabilityModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(WorkerCorrelationMiddleware).forRoutes('*');
  }
}
