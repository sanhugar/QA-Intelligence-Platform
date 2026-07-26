import { Global, Module, type MiddlewareConsumer, type NestModule } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ServiceAuthMiddleware } from './service-auth.middleware';
import { ServicePrincipalAuthGuard } from './service-principal-auth.guard';
import { WorkerAuthProbeController } from './worker-auth-probe.controller';
import { WorkerAuthRuntime } from './worker-auth-runtime';

export const WORKER_AUTH_RUNTIME = 'WORKER_AUTH_RUNTIME';

@Global()
@Module({
  controllers: [WorkerAuthProbeController],
  providers: [
    {
      provide: WORKER_AUTH_RUNTIME,
      useFactory: () => WorkerAuthRuntime.create(),
    },
    {
      provide: WorkerAuthRuntime,
      useExisting: WORKER_AUTH_RUNTIME,
    },
    {
      provide: APP_GUARD,
      useClass: ServicePrincipalAuthGuard,
    },
    ServiceAuthMiddleware,
  ],
  exports: [WorkerAuthRuntime, WORKER_AUTH_RUNTIME],
})
export class WorkerAuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(ServiceAuthMiddleware).forRoutes('*');
  }
}
