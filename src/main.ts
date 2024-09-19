import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { PORT } from './config/env.config';

async function bootstrap() {


  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: '*' })
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidationPipe(
    { whitelist: true }
  ));
  await app.listen(PORT);
}
bootstrap();
