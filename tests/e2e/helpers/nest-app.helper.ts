import { INestApplication, ValidationPipe } from '@nestjs/common';
import { validationPipeDefaultOptions } from '../../../src/shared/validation/constants/validation.constant';

async function initNestApp(app: INestApplication): Promise<void> {
  app.useGlobalPipes(new ValidationPipe(validationPipeDefaultOptions));
  await app.init();
}

export { initNestApp };
