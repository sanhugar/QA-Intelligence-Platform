import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { applicationModuleShells } from './modules/module-shell-catalog';
import { PlatformStartupCoordinator } from './spine/registration/platform-startup-coordinator';

async function bootstrap(): Promise<void> {
  const coordinator = new PlatformStartupCoordinator({
    host: 'worker',
    platformVersion: process.env.ATI_PLATFORM_VERSION ?? '0.0.0',
    moduleShells: applicationModuleShells,
  });

  await coordinator.start();

  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  const port = Number(process.env.ATI_WORKER_PORT ?? '3001');
  if (!Number.isFinite(port) || port <= 0) {
    throw new Error('Invalid ATI_WORKER_PORT');
  }

  await app.listen(port);
}

void bootstrap();
