import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { createSwaggerDocument } from '../../../../../src/server/swagger/swagger';

describe('Swagger', () => {
  describe('createSwaggerDocument', () => {
    let documentBuilderSpy: {
      setTitle: jest.SpyInstance;
      setDescription: jest.SpyInstance;
      setVersion: jest.SpyInstance;
      build: jest.SpyInstance;
    };
    let createDocumentMock: jest.SpyInstance;
    let setupMock: jest.SpyInstance;

    beforeEach(() => {
      documentBuilderSpy = {
        setTitle: jest.spyOn(DocumentBuilder.prototype, 'setTitle'),
        setDescription: jest.spyOn(DocumentBuilder.prototype, 'setDescription'),
        setVersion: jest.spyOn(DocumentBuilder.prototype, 'setVersion'),
        build: jest.spyOn(DocumentBuilder.prototype, 'build'),
      };
      createDocumentMock = jest
        .spyOn(SwaggerModule, 'createDocument')
        .mockImplementation();
      setupMock = jest.spyOn(SwaggerModule, 'setup').mockImplementation();

      jest.clearAllMocks();
    });

    it('should call document builder methods', () => {
      const path = 'swagger';
      const app = {} as INestApplication;
      const expectedTitle = 'e-unlock API';
      const expectedDescription = 'API for e-unlock project';

      createSwaggerDocument(path, app);

      expect(documentBuilderSpy.setTitle).toHaveBeenCalledWith(expectedTitle);
      expect(documentBuilderSpy.setDescription).toHaveBeenCalledWith(
        expectedDescription,
      );
      expect(documentBuilderSpy.setVersion).toHaveBeenCalledTimes(1);
      expect(documentBuilderSpy.build).toHaveBeenCalledTimes(1);
    });

    it('should call createDocument and setup', () => {
      const path = 'swagger';
      const app = {} as INestApplication;

      createSwaggerDocument(path, app);

      expect(createDocumentMock).toHaveBeenCalledTimes(1);
      expect(setupMock).toHaveBeenCalledTimes(1);
      expect(setupMock).toHaveBeenCalledWith(path, app, undefined);
    });
  });
});
