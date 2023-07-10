import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../../src/app.module';
import { initNestApp } from '../helpers/nest-app.helper';
import { fetchAccessToken } from '../helpers/access-token.helper';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;

  beforeAll(async () => {
    accessToken = await fetchAccessToken();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await initNestApp(app);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/ (GET)', () => {
    it('should return 204', () => {
      return request(app.getHttpServer()).get('/').expect(204);
    });
  });

  describe('/protected (GET)', () => {
    it('should return 204 when using correct access token with right scope', () => {
      return request(app.getHttpServer())
        .get('/protected')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(204);
    });
  });
});
