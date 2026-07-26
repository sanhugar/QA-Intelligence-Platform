import { Global, Module, type MiddlewareConsumer, type NestModule } from '@nestjs/common';
import { WorkerContextRuntime } from './worker-context-runtime';
import { WorkerContextMiddleware } from './context.middleware';
import { WorkerContextProbeController } from './context-probe.controller';

export const WORKER_CONTEXT_RUNTIME = 'WORKER_CONTEXT_RUNTIME';

@Global()
@Module({
  controllers: [WorkerContextProbeController],
  providers: [
    {
      provide: WORKER_CONTEXT_RUNTIME,
      useFactory: () => WorkerContextRuntime.create(),
    },
    {
      provide: WorkerContextRuntime,
      useExisting: WORKER_CONTEXT_RUNTIME,
    },
    WorkerContextMiddleware,
  ],
  exports: [WorkerContextRuntime, WORKER_CONTEXT_RUNTIME],
})
export class WorkerContextModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(WorkerContextMiddleware).forRoutes('*');
  }
}
