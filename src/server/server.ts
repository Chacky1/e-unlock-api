import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from '../app.module';
import { createSwaggerDocument } from './swagger/swagger';
import { DatabaseService } from 'src/modules/config/database/providers/services/database.service';
import { validationPipeDefaultOptions } from '../shared/validation/constants/validation.constant';

const { PORT } = process.env;

const SWAGGER_PATH = 'swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { rawBody: true });
  app.useGlobalPipes(new ValidationPipe(validationPipeDefaultOptions));

  const databaseService = app.get(DatabaseService);
  await databaseService.enableShutdownHooks(app);

  createSwaggerDocument(SWAGGER_PATH, app);

  await app.listen(PORT);
}

export { bootstrap };
