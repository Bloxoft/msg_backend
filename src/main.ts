import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { APP_VERSION, CONNECTOR_PORT, PORT } from './config/env.config';
import helmet from 'helmet';
import * as compression from 'compression';
import { ExceptionsFilter } from './common/filters/all-exceptions.filter';
import { Transport } from '@nestjs/microservices';
import { logger } from './common/helpers/logger.lib';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true
  });

  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      port: CONNECTOR_PORT,
    },
  })


  app.enableCors({ origin: '*' })
  app.setGlobalPrefix(`api/${APP_VERSION}`);
  app.useGlobalPipes(new ValidationPipe(
    { whitelist: true }
  ));
  app.use(helmet());
  app.use(compression())

  app.startAllMicroservices()

  app
    .listen(PORT)
    .then(() => {
      logger.log(`Listening on port ${PORT}`);
    })
    .catch((error) => {
      logger.error(`Error listening on ${PORT} %o`, error);
    });

  app.useGlobalFilters(new ExceptionsFilter)
}

bootstrap();
