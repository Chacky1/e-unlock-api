import { INestApplication, HttpStatus } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import * as request from 'supertest';
import { CourseModule } from '../../../../../../src/modules/course/course.module';
import { ScopeGuard } from '../../../../../../src/shared/auth/providers/guards/scope.guard';
import { JwtStrategy } from '../../../../../../src/shared/auth/providers/strategies/jwt.strategy';
import { fetchAccessToken } from '../../../../helpers/access-token.helper';
import { initNestApp } from '../../../../helpers/nest-app.helper';
import { createFakeCategoryDto } from '../../../../../factories/course/dto/create-course/create-category.dto.factory';

describe('Category Controller (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  let existingCategoryId: number;
  const unknownCategoryId = 999;

  beforeAll(async () => {
    accessToken = await fetchAccessToken();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CourseModule],
      providers: [JwtStrategy, ScopeGuard],
    }).compile();

    app = module.createNestApplication();

    await initNestApp(app);

    const fakeCategory = createFakeCategoryDto();

    const categoryResponse = await request(app.getHttpServer())
      .post('/categories')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(fakeCategory);

    existingCategoryId = categoryResponse.body.id;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /categories', () => {
    it('should return all categories when called.', async () => {
      await request(app.getHttpServer())
        .get('/categories')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(HttpStatus.OK);
    });
  });

  describe('GET /categories/:id', () => {
    it('should return a category when called.', async () => {
      await request(app.getHttpServer())
        .get(`/categories/${existingCategoryId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(HttpStatus.OK);
    });

    it('should return 404 when category does not exist.', async () => {
      await request(app.getHttpServer())
        .get(`/categories/${unknownCategoryId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(HttpStatus.NOT_FOUND);
    });
  });

  describe('POST /categories', () => {
    it('should create a category when called.', async () => {
      const fakeCategory = createFakeCategoryDto();

      await request(app.getHttpServer())
        .post('/categories')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(fakeCategory)
        .expect(HttpStatus.CREATED);
    });
  });
});
