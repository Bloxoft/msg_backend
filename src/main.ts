import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { APP_VERSION, PORT } from './config/env.config';
import helmet from 'helmet';
import * as compression from 'compression';
import { ExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
  const logger = new Logger('NestApplication');

  const app = await NestFactory.create(AppModule);

  app.enableCors({ origin: '*' })
  app.setGlobalPrefix(`api/${APP_VERSION}`);
  app.useGlobalPipes(new ValidationPipe(
    { whitelist: true }
  ));
  app.use(helmet());
  app.use(compression())

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
