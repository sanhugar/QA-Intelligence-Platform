import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PlatformHostBootstrap } from './spine/services/platform-host-bootstrap';

async function bootstrap(): Promise<void> {
  const hostBootstrap = new PlatformHostBootstrap();
  const { port } = await hostBootstrap.start({ host: 'api' });

  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  await app.listen(port);
}

void bootstrap();
