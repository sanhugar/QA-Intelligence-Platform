import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  const port = Number(process.env.ATI_API_PORT ?? '3000');
  if (!Number.isFinite(port) || port <= 0) {
    throw new Error('Invalid ATI_API_PORT');
  }

  await app.listen(port);
}

void bootstrap();
