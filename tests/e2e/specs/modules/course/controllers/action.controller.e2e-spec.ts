import { HttpStatus, INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TestingModule, Test } from '@nestjs/testing';
import * as request from 'supertest';
import { CourseModule } from '../../../../../../src/modules/course/course.module';
import { ScopeGuard } from '../../../../../../src/shared/auth/providers/guards/scope.guard';
import { JwtStrategy } from '../../../../../../src/shared/auth/providers/strategies/jwt.strategy';
import { fetchAccessToken } from '../../../../helpers/access-token.helper';
import { initNestApp } from '../../../../helpers/nest-app.helper';
import { createFakeActionDto } from '../../../../../factories/course/dto/create-course/create-action.dto.factory';
import { createFakeCategoryDto } from '../../../../../factories/course/dto/create-course/create-category.dto.factory';
import { createFakeCourseDto } from '../../../../../factories/course/dto/create-course/create-course.dto.factory';
import { createFakeLessonDto } from '../../../../../factories/course/dto/create-course/create-lesson.dto.factory';
import { createFakeSectionDto } from '../../../../../factories/course/dto/create-course/create-section.dto.factory';

describe('Action Controller (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  let existingLessonId: number;

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
});
