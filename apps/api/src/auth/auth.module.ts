import { Global, Module, type MiddlewareConsumer, type NestModule } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ApiAuthRuntime } from './api-auth-runtime';
import { AuthMiddleware } from './auth.middleware';
import { AuthProbeController } from './auth-probe.controller';
import { JwtAuthGuard } from './jwt-auth.guard';

export const API_AUTH_RUNTIME = 'API_AUTH_RUNTIME';

@Global()
@Module({
  controllers: [AuthProbeController],
  providers: [
    {
      provide: API_AUTH_RUNTIME,
      useFactory: () => ApiAuthRuntime.create(),
    },
    {
      provide: ApiAuthRuntime,
      useExisting: API_AUTH_RUNTIME,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    AuthMiddleware,
  ],
  exports: [ApiAuthRuntime, API_AUTH_RUNTIME],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
