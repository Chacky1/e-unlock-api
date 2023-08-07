import { INestApplication, HttpStatus } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import * as request from 'supertest';
import { CourseModule } from '../../../../../../src/modules/course/course.module';
import { CreateLessonDto } from '../../../../../../src/modules/course/dto/create-lesson.dto';
import { initNestApp } from '../../../../helpers/nest-app.helper';
import { createFakeCategoryDto } from '../../../../../factories/course/dto/create-course/create-category.dto.factory';
import { createFakeLessonDto } from '../../../../../factories/course/dto/create-course/create-lesson.dto.factory';
import { createFakeSectionDto } from '../../../../../factories/course/dto/create-course/create-section.dto.factory';
import { createFakeCourseDto } from '../../../../../factories/course/dto/create-course/create-course.dto.factory';
import { fetchAccessToken } from '../../../../helpers/access-token.helper';
import { ScopeGuard } from '../../../../../../src/shared/auth/providers/guards/scope.guard';
import { JwtStrategy } from '../../../../../../src/shared/auth/providers/strategies/jwt.strategy';

describe('Lesson Controller', () => {
  let app: INestApplication;
  let accessToken: string;
  let existingCourseId: number;
  let existingSectionId: number;
  let existingLessonId: number;
  const unknownSectionId = 999;
  const unknownLessonId = 999;

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

    const fakeCourse = createFakeCourseDto({
      categoryId: categoryResponse.body.id,
    });

    const courseResponse = await request(app.getHttpServer())
      .post('/courses')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(fakeCourse);

    existingCourseId = courseResponse.body.id;

    const fakeSection = createFakeSectionDto({ courseId: existingCourseId });

    const sectionResponse = await request(app.getHttpServer())
      .post('/sections')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(fakeSection);

    existingSectionId = sectionResponse.body.id;

    const fakeLesson = createFakeLessonDto({ sectionId: existingSectionId });

    const lessonResponse = await request(app.getHttpServer())
      .post('/lessons')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(fakeLesson);

    existingLessonId = lessonResponse.body.id;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET lessons/:id', () => {
    it('should return a lesson when called.', async () => {
      await request(app.getHttpServer())
        .get(`/lessons/${existingLessonId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(HttpStatus.OK);
    });

    it('should return 404 when lesson does not exist.', async () => {
      await request(app.getHttpServer())
        .get(`/lessons/${unknownLessonId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(HttpStatus.NOT_FOUND);
    });
  });

  describe('POST lessons', () => {
    it.each<{
      payload: CreateLessonDto;
      test: string;
      errorMessage: string;
    }>([
      {
        payload: createFakeLessonDto(
          { sectionId: existingLessonId },
          { name: '' },
        ),
        test: 'should return 400 when name is empty.',
        errorMessage: 'name must be longer than or equal to 1 characters.',
      },
      {
        payload: createFakeLessonDto(
          { sectionId: existingLessonId },
          { textContent: '' },
        ),
        test: 'should return 400 when text content is empty.',
        errorMessage:
          'textContent must be longer than or equal to 1 characters.',
      },
      {
        payload: createFakeLessonDto({ sectionId: unknownSectionId }),
        test: 'should return 400 when section id does not exist.',
        errorMessage: 'Resource SECTION with id 999 not found.',
      },
    ])('$test', async ({ payload, errorMessage }) => {
      const response = await request(app.getHttpServer())
        .post('/lessons')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(payload)
        .expect(HttpStatus.BAD_REQUEST);

      if (Array.isArray(response.body.message)) {
        expect(response.body.message).toContain(errorMessage);
      } else {
        expect(response.body.message).toEqual(errorMessage);
      }
    });

    it('should create a lesson when called without video.', async () => {
      const toCreateLesson = createFakeLessonDto({
        sectionId: existingSectionId,
      });

      await request(app.getHttpServer())
        .post('/lessons')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(toCreateLesson)
        .expect(201);
    });

    it('should create a lesson when called with video.', async () => {
      const toCreateLesson = createFakeLessonDto({
        sectionId: existingSectionId,
      });

      await request(app.getHttpServer())
        .post('/lessons')
        .set('Authorization', `Bearer ${accessToken}`)
        .attach('video', `${process.cwd()}/tests/e2e/assets/test-video.mp4`)
        .field('name', toCreateLesson.name)
        .field('textContent', toCreateLesson.textContent)
        .field('sectionId', toCreateLesson.sectionId)
        .field('sectionOrder', toCreateLesson.sectionOrder)
        .expect(201);
    });
  });
});
