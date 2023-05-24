import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const createSwaggerDocument = (path: string, app: INestApplication) => {
  const title = 'e-unlock API';
  const description = 'API for e-unlock project';
  const options = new DocumentBuilder()
    .setTitle(title)
    .setDescription(description)
    .setVersion('0.0.1')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(path, app, document);
};
