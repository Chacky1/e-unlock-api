import { HttpStatus, INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TestingModule, Test } from '@nestjs/testing';
import * as request from 'supertest';
import { CourseModule } from '../../../../../../src/modules/course/course.module';
import { UserModule } from '../../../../../../src/modules/user/user.module';
import { ScopeGuard } from '../../../../../../src/shared/auth/providers/guards/scope.guard';
import { JwtStrategy } from '../../../../../../src/shared/auth/providers/strategies/jwt.strategy';
import { fetchAccessToken } from '../../../../helpers/access-token.helper';
import { initNestApp } from '../../../../helpers/nest-app.helper';
import { createFakeActionDto } from '../../../../../factories/course/dto/create-course/create-action.dto.factory';
import { createFakeCategoryDto } from '../../../../../factories/course/dto/create-course/create-category.dto.factory';
import { createFakeCourseDto } from '../../../../../factories/course/dto/create-course/create-course.dto.factory';
import { createFakeLessonDto } from '../../../../../factories/course/dto/create-course/create-lesson.dto.factory';
import { createFakeSectionDto } from '../../../../../factories/course/dto/create-course/create-section.dto.factory';
import { createFakeUserDto } from '../../../../../factories/user/dto/create-user.dto.factory';

describe('Action Controller (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  let existingLessonId: number;
  const unknownActionId = 999;

  beforeAll(async () => {
    accessToken = await fetchAccessToken();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        CourseModule,
        UserModule,
      ],
      providers: [JwtStrategy, ScopeGuard],
    }).compile();

    app = module.createNestApplication();

    await initNestApp(app);

    const fakeCategory = createFakeCategoryDto();

    const categoryResponse = await request(app.getHttpServer())
      .post('/categories')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(fakeCategory);

    const existingCategoryId = categoryResponse.body.id;

    const fakeCourse = createFakeCourseDto({
      categoryId: existingCategoryId,
    });

    const courseResponse = await request(app.getHttpServer())
      .post('/courses')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(fakeCourse);

    const existingCourseId = courseResponse.body.id;

    const fakeSection = createFakeSectionDto({
      courseId: existingCourseId,
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

    existingLessonId = lessonResponse.body.id;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /actions', () => {
    it('should return 200 when actions are found.', async () => {
      await request(app.getHttpServer())
        .get('/actions')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(HttpStatus.OK);
    });

    it('should return 200 when actions are found with lessonId filter.', async () => {
      await request(app.getHttpServer())
        .get(`/actions?lessonId=${existingLessonId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(HttpStatus.OK);
    });

    it('should return 400 when lessonId is not a number.', async () => {
      await request(app.getHttpServer())
        .get('/actions?lessonId=abc')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe('POST /actions', () => {
    it('should return 201 when action is created.', async () => {
      const fakeAction = createFakeActionDto({
        lessonId: existingLessonId,
      });

      await request(app.getHttpServer())
        .post('/actions')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(fakeAction)
        .expect(HttpStatus.CREATED);
    });
  });

  describe('POST /actions/:actionId/feedback', () => {
    it('should return 201 when feedback is added to an action.', async () => {
      const fakeAction = createFakeActionDto({
        lessonId: existingLessonId,
      });

      const actionResponse = await request(app.getHttpServer())
        .post('/actions')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(fakeAction);

      const existingActionId = actionResponse.body.id;

      const fakeUser = createFakeUserDto();

      const userResponse = await request(app.getHttpServer())
        .post('/users')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(fakeUser);

      console.log('userResponse.body', userResponse.body);

      const existingUserId = userResponse.body.id;

      console.log('existingUserId', existingUserId);
      console.log('existingActionId', existingActionId);

      await request(app.getHttpServer())
        .post(`/users/${existingUserId}/actions/${existingActionId}/complete`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send();

      await request(app.getHttpServer())
        .post(`/actions/${existingActionId}/feedback`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ feedback: 'feedback', userId: existingUserId })
        .expect(HttpStatus.CREATED);
    });

    it('should return 400 when action is not found.', async () => {
      await request(app.getHttpServer())
        .post(`/actions/${unknownActionId}/feedback`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ feedback: 'feedback' })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should return 400 when feedback is not a string.', async () => {
      const fakeAction = createFakeActionDto({
        lessonId: existingLessonId,
      });

      const actionResponse = await request(app.getHttpServer())
        .post('/actions')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(fakeAction);

      const existingActionId = actionResponse.body.id;

      await request(app.getHttpServer())
        .post(`/actions/${existingActionId}/feedback`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ feedback: 123 })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should return 400 when actionId is not a number.', async () => {
      await request(app.getHttpServer())
        .post('/actions/abc/feedback')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ feedback: 'feedback' })
        .expect(HttpStatus.BAD_REQUEST);
    });
  });
});
