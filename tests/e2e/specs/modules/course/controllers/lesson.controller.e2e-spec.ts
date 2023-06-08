import { INestApplication, HttpStatus } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import * as request from 'supertest';
import { CourseModule } from '../../../../../../src/modules/course/course.module';
import { CreateLessonDto } from '../../../../../../src/modules/course/dto/create-lesson.dto';
import { initNestApp } from '../../../../helpers/nest-app.helper';
import { createFakeLessonDto } from '../../../../../factories/course/dto/create-course/create-lesson.dto.factory';
import { createFakeSectionDto } from '../../../../../factories/course/dto/create-course/create-section.dto.factory';
import { createFakeCourseDto } from '../../../../../factories/course/dto/create-course/create-course.dto.factory';

describe('Lesson Controller', () => {
  let app: INestApplication;
  let existingCourseId: number;
  let existingSectionId: number;
  let existingLessonId: number;
  const unknownSectionId = 999;
  const unknownLessonId = 999;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CourseModule],
    }).compile();

    app = module.createNestApplication();

    await initNestApp(app);

    const fakeCourse = createFakeCourseDto();

    const courseResponse = await request(app.getHttpServer())
      .post('/courses')
      .send(fakeCourse);

    existingCourseId = courseResponse.body.id;

    const fakeSection = createFakeSectionDto({ courseId: existingCourseId });

    const sectionResponse = await request(app.getHttpServer())
      .post('/sections')
      .send(fakeSection);

    existingSectionId = sectionResponse.body.id;

    const fakeLesson = createFakeLessonDto({ sectionId: existingSectionId });

    const lessonResponse = await request(app.getHttpServer())
      .post('/lessons')
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
        .expect(HttpStatus.OK);
    });

    it('should return 404 when lesson does not exist.', async () => {
      await request(app.getHttpServer())
        .get(`/lessons/${unknownLessonId}`)
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
        errorMessage: 'section_id not found.',
      },
    ])('$test', async ({ payload, errorMessage }) => {
      const response = await request(app.getHttpServer())
        .post('/lessons')
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
        .send(toCreateLesson)
        .expect(201);
    });

    it('should create a lesson when called with video.', async () => {
      const toCreateLesson = createFakeLessonDto({
        sectionId: existingSectionId,
      });

      await request(app.getHttpServer())
        .post('/lessons')
        .attach('video', `${process.cwd()}/tests/e2e/assets/test-video.mp4`)
        .field('name', toCreateLesson.name)
        .field('textContent', toCreateLesson.textContent)
        .field('sectionId', toCreateLesson.sectionId)
        .field('sectionOrder', toCreateLesson.sectionOrder)
        .expect(201);
    });
  });
});
