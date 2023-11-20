import { INestApplication, HttpStatus } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TestingModule, Test } from '@nestjs/testing';
import * as request from 'supertest';
import { UserModule } from '../../../../../../src/modules/user/user.module';
import { CourseModule } from '../../../../../../src/modules/course/course.module';
import { ScopeGuard } from '../../../../../../src/shared/auth/providers/guards/scope.guard';
import { JwtStrategy } from '../../../../../../src/shared/auth/providers/strategies/jwt.strategy';
import { fetchAccessToken } from '../../../../helpers/access-token.helper';
import { initNestApp } from '../../../../helpers/nest-app.helper';
import { createFakeCourseDto } from '../../../../../factories/course/dto/create-course/create-course.dto.factory';
import { createFakeUserDto } from '../../../../../factories/user/dto/create-user.dto.factory';
import { createFakeCategoryDto } from '../../../../../factories/course/dto/create-course/create-category.dto.factory';
import { createFakeSectionDto } from '../../../../../factories/course/dto/create-course/create-section.dto.factory';
import { createFakeLessonDto } from '../../../../../factories/course/dto/create-course/create-lesson.dto.factory';

describe('User Controller', () => {
  let app: INestApplication;
  let accessToken: string;
  let existingUserCode: string;
  const unknownUserCode = 'unknown_user_code';
  let existingUserId: number;
  const unknownUserId = 999;
  const unknownLessonId = 999;

  beforeAll(async () => {
    accessToken = await fetchAccessToken();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        UserModule,
        CourseModule,
      ],
      providers: [JwtStrategy, ScopeGuard],
    }).compile();

    app = module.createNestApplication();

    await initNestApp(app);

    const fakeUser = createFakeUserDto();

    const userResponse = await request(app.getHttpServer())
      .post('/users')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(fakeUser);

    existingUserId = userResponse.body.id;
    existingUserCode = userResponse.body.code;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /users/:code', () => {
    it('should return a user when called.', async () => {
      await request(app.getHttpServer())
        .get(`/users/${existingUserCode}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(HttpStatus.OK);
    });

    it('should return 404 when called with an unknown id.', async () => {
      await request(app.getHttpServer())
        .get(`/users/${unknownUserCode}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(HttpStatus.NOT_FOUND);
    });
  });

  describe('POST /users', () => {
    it('should create a user when called with valid data.', async () => {
      const fakeUser = createFakeUserDto();

      await request(app.getHttpServer())
        .post('/users')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(fakeUser)
        .expect(HttpStatus.CREATED);
    });
  });

  describe('POST /users/:id/courses/:courseId', () => {
    it('should add a course to a user when called with valid data.', async () => {
      const fakeCategory = createFakeCategoryDto();

      const categoryResponse = await request(app.getHttpServer())
        .post('/categories')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(fakeCategory);

      const fakeCourse = createFakeCourseDto({
        categoryId: categoryResponse.body.id,
      });

      const courseResponse = await request(app.getHttpServer())
        .post('/courses')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(fakeCourse);

      await request(app.getHttpServer())
        .post(`/users/${existingUserCode}/courses/${courseResponse.body.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send()
        .expect(HttpStatus.NO_CONTENT);
    });
  });

  describe('GET /users/:id/lessons', () => {
    it('should return user lessons when called.', async () => {
      await request(app.getHttpServer())
        .get(`/users/${existingUserId}/lessons`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(HttpStatus.OK);
    });

    it('should return 404 when called with an unknown id.', async () => {
      await request(app.getHttpServer())
        .get(`/users/${unknownUserId}/lessons`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(HttpStatus.NOT_FOUND);
    });
  });

  describe('POST /users/:id/lessons/:lessonId/validate', () => {
    it('should validate a lesson when called.', async () => {
      const fakeCategory = createFakeCategoryDto();

      const categoryResponse = await request(app.getHttpServer())
        .post('/categories')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(fakeCategory);

      const fakeCourse = createFakeCourseDto({
        categoryId: categoryResponse.body.id,
      });

      const courseResponse = await request(app.getHttpServer())
        .post('/courses')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(fakeCourse);

      const fakeSection = createFakeSectionDto({
        courseId: courseResponse.body.id,
      });

      const sectionResponse = await request(app.getHttpServer())
        .post('/sections')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(fakeSection);

      const fakeLesson = createFakeLessonDto({
        sectionId: sectionResponse.body.id,
      });

      const lessonResponse = await request(app.getHttpServer())
        .post('/lessons')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(fakeLesson);

      const lessonId = lessonResponse.body.id;

      await request(app.getHttpServer())
        .post(`/users/${existingUserId}/lessons/${lessonId}/validate`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send()
        .expect(HttpStatus.NO_CONTENT);
    });

    it('should return 400 when called with an unknown user id.', async () => {
      const fakeCategory = createFakeCategoryDto();

      const categoryResponse = await request(app.getHttpServer())
        .post('/categories')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(fakeCategory);

      const fakeCourse = createFakeCourseDto({
        categoryId: categoryResponse.body.id,
      });

      const courseResponse = await request(app.getHttpServer())
        .post('/courses')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(fakeCourse);

      const fakeSection = createFakeSectionDto({
        courseId: courseResponse.body.id,
      });

      const sectionResponse = await request(app.getHttpServer())
        .post('/sections')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(fakeSection);

      const fakeLesson = createFakeLessonDto({
        sectionId: sectionResponse.body.id,
      });

      const lessonResponse = await request(app.getHttpServer())
        .post('/lessons')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(fakeLesson);

      const lessonId = lessonResponse.body.id;

      await request(app.getHttpServer())
        .post(`/users/${unknownUserId}/lessons/${lessonId}/validate`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send()
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should return 400 when called with an unknown lesson id.', async () => {
      await request(app.getHttpServer())
        .post(`/users/${existingUserId}/lessons/${unknownUserId}/validate`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send()
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe('POST /users/:id/lessons/:lessonId/invalidate', () => {
    it('should invalidate a lesson when called on a validated lesson.', async () => {
      const fakeCategory = createFakeCategoryDto();

      const categoryResponse = await request(app.getHttpServer())
        .post('/categories')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(fakeCategory);

      const fakeCourse = createFakeCourseDto({
        categoryId: categoryResponse.body.id,
      });

      const courseResponse = await request(app.getHttpServer())
        .post('/courses')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(fakeCourse);

      const fakeSection = createFakeSectionDto({
        courseId: courseResponse.body.id,
      });

      const sectionResponse = await request(app.getHttpServer())
        .post('/sections')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(fakeSection);

      const fakeLesson = createFakeLessonDto({
        sectionId: sectionResponse.body.id,
      });

      const lessonResponse = await request(app.getHttpServer())
        .post('/lessons')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(fakeLesson);

      const lessonId = lessonResponse.body.id;

      await request(app.getHttpServer())
        .post(`/users/${existingUserId}/lessons/${lessonId}/validate`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send();

      await request(app.getHttpServer())
        .post(`/users/${existingUserId}/lessons/${lessonId}/invalidate`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send()
        .expect(HttpStatus.NO_CONTENT);
    });

    it('should return 400 when called with an unknown user id.', async () => {
      const fakeCategory = createFakeCategoryDto();

      const categoryResponse = await request(app.getHttpServer())
        .post('/categories')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(fakeCategory);

      const fakeCourse = createFakeCourseDto({
        categoryId: categoryResponse.body.id,
      });

      const courseResponse = await request(app.getHttpServer())
        .post('/courses')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(fakeCourse);

      const fakeSection = createFakeSectionDto({
        courseId: courseResponse.body.id,
      });

      const sectionResponse = await request(app.getHttpServer())
        .post('/sections')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(fakeSection);

      const fakeLesson = createFakeLessonDto({
        sectionId: sectionResponse.body.id,
      });

      const lessonResponse = await request(app.getHttpServer())
        .post('/lessons')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(fakeLesson);

      const lessonId = lessonResponse.body.id;

      await request(app.getHttpServer())
        .post(`/users/${unknownUserId}/lessons/${lessonId}/invalidate`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send()
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should return 400 when called with an unknown lesson id.', async () => {
      await request(app.getHttpServer())
        .post(`/users/${existingUserId}/lessons/${unknownLessonId}/invalidate`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send()
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should return 400 when called on a non-validated lesson.', async () => {
      const fakeCategory = createFakeCategoryDto();

      const categoryResponse = await request(app.getHttpServer())
        .post('/categories')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(fakeCategory);

      const fakeCourse = createFakeCourseDto({
        categoryId: categoryResponse.body.id,
      });

      const courseResponse = await request(app.getHttpServer())
        .post('/courses')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(fakeCourse);

      const fakeSection = createFakeSectionDto({
        courseId: courseResponse.body.id,
      });

      const sectionResponse = await request(app.getHttpServer())
        .post('/sections')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(fakeSection);

      const fakeLesson = createFakeLessonDto({
        sectionId: sectionResponse.body.id,
      });

      const lessonResponse = await request(app.getHttpServer())
        .post('/lessons')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(fakeLesson);

      const lessonId = lessonResponse.body.id;

      await request(app.getHttpServer())
        .post(`/users/${existingUserId}/lessons/${lessonId}/invalidate`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send()
        .expect(HttpStatus.BAD_REQUEST);
    });
  });
});
