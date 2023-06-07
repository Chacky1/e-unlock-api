import { INestApplication, HttpStatus } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import * as request from 'supertest';
import { CourseModule } from '../../../../../../src/modules/course/course.module';
import { CreateLessonDto } from '../../../../../../src/modules/course/dto/create-lesson.dto';
import { initNestApp } from '../../../../helpers/nest-app.helper';
import { createFakeLessonDto } from '../../../../../factories/course/dto/create-course/create-lesson.dto.factory';

describe('Lesson Controller', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CourseModule],
    }).compile();

    app = module.createNestApplication();

    await initNestApp(app);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST lessons', () => {
    it.each<{
      payload: CreateLessonDto;
      test: string;
      errorMessage: string;
    }>([
      {
        payload: createFakeLessonDto({ sectionId: 1 }, { name: '' }),
        test: 'should return 400 when name is empty.',
        errorMessage: 'name must be longer than or equal to 1 characters.',
      },
      {
        payload: createFakeLessonDto({ sectionId: 1 }, { textContent: '' }),
        test: 'should return 400 when text content is empty.',
        errorMessage:
          'textContent must be longer than or equal to 1 characters.',
      },
      {
        payload: createFakeLessonDto({ sectionId: 999 }),
        test: 'should return 400 when section id does not exist.',
        errorMessage: 'sectionId not found.',
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
      const toCreateLesson = createFakeLessonDto({ sectionId: 1 });

      await request(app.getHttpServer())
        .post('/lessons')
        .send(toCreateLesson)
        .expect(201);
    });

    it('should create a lesson when called with video.', async () => {
      const toCreateLesson = createFakeLessonDto({ sectionId: 1 });

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
