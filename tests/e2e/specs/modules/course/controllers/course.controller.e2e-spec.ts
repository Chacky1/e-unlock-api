import { HttpStatus, INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { CourseModule } from '../../../../../../src/modules/course/course.module';
import { createFakeCourseDto } from '../../../../../factories/course/dto/create-course/create-course.dto.factory';
import { createFakeCategoryDto } from '../../../../../factories/course/dto/create-course/create-category.dto.factory';
import { CreateCourseDto } from '../../../../../../src/modules/course/dto/create-course.dto';
import { initNestApp } from '../../../../helpers/nest-app.helper';
import { fetchAccessToken } from '../../../../helpers/access-token.helper';
import { ScopeGuard } from '../../../../../../src/shared/auth/providers/guards/scope.guard';
import { JwtStrategy } from '../../../../../../src/shared/auth/providers/strategies/jwt.strategy';

describe('Course Controller (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  let existingCategoryId: number;
  let existingCourseId: number;
  const unknownCourseId = 999;

  beforeAll(async () => {
    accessToken = await fetchAccessToken();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ isGlobal: true }), CourseModule],
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

    const fakeCourse = createFakeCourseDto({
      categoryId: existingCategoryId,
    });

    const courseResponse = await request(app.getHttpServer())
      .post('/courses')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(fakeCourse);

    existingCourseId = courseResponse.body.id;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /courses', () => {
    it('should return all courses when called.', async () => {
      await request(app.getHttpServer())
        .get('/courses')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(HttpStatus.OK);
    });
  });

  describe('GET /courses/:id', () => {
    it('should return a course when called.', async () => {
      await request(app.getHttpServer())
        .get(`/courses/${existingCourseId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(HttpStatus.OK);
    });

    it('should return 404 when course does not exist.', async () => {
      await request(app.getHttpServer())
        .get(`/courses/${unknownCourseId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(HttpStatus.NOT_FOUND);
    });
  });

  describe('POST /courses', () => {
    it.each<{ payload: CreateCourseDto; test: string; errorMessage: string }>([
      {
        payload: createFakeCourseDto({}, { name: '' }),
        test: 'should return 400 when name is empty.',
        errorMessage: 'name must be longer than or equal to 1 characters',
      },
    ])('$test', async ({ payload, errorMessage }) => {
      const response = await request(app.getHttpServer())
        .post('/courses')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(payload)
        .expect(HttpStatus.BAD_REQUEST);

      if (Array.isArray(response.body.message)) {
        expect(response.body.message).toContain(errorMessage);
      } else {
        expect(response.body.message).toEqual(errorMessage);
      }
    });

    it('should create a course when called with an image.', async () => {
      const toCreateCourse = createFakeCourseDto({
        categoryId: existingCategoryId,
      });

      await request(app.getHttpServer())
        .post('/courses')
        .set('Authorization', `Bearer ${accessToken}`)
        .attach('image', `${process.cwd()}/tests/e2e/assets/test-image.png`)
        .attach('video', `${process.cwd()}/tests/e2e/assets/test-video.mp4`)
        .field('name', toCreateCourse.name)
        .field('description', toCreateCourse.description)
        .field('categoryId', toCreateCourse.categoryId)
        .field('price', toCreateCourse.price)
        .field('issue', toCreateCourse.issue)
        .field('solution', toCreateCourse.solution)
        .expect(HttpStatus.CREATED);
    });
  });
});
