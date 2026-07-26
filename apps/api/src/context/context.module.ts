import { Global, Module, type MiddlewareConsumer, type NestModule } from '@nestjs/common';
import { ApiContextRuntime } from './api-context-runtime';
import { ContextMiddleware } from './context.middleware';
import { ContextProbeController } from './context-probe.controller';

export const API_CONTEXT_RUNTIME = 'API_CONTEXT_RUNTIME';

@Global()
@Module({
  controllers: [ContextProbeController],
  providers: [
    {
      provide: API_CONTEXT_RUNTIME,
      useFactory: () => ApiContextRuntime.create(),
    },
    {
      provide: ApiContextRuntime,
      useExisting: API_CONTEXT_RUNTIME,
    },
    ContextMiddleware,
  ],
  exports: [ApiContextRuntime, API_CONTEXT_RUNTIME],
})
export class ContextModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(ContextMiddleware).forRoutes('*');
  }
}
