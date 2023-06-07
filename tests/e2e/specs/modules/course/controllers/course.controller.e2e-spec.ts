import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { CourseModule } from '../../../../../../src/modules/course/course.module';
import { createFakeCourseDto } from '../../../../../factories/course/dto/create-course/create-course.dto.factory';
import { CreateCourseDto } from '../../../../../../src/modules/course/dto/create-course.dto';
import { initNestApp } from '../../../../../e2e/helpers/nest-app.helper';

describe('Course Controller (e2e)', () => {
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

  describe('GET /courses', () => {
    it('should return all courses when called.', async () => {
      await request(app.getHttpServer()).get('/courses').expect(HttpStatus.OK);
    });
  });

  describe('GET /courses/:id', () => {
    it('should return a course when called.', async () => {
      const existingCourseId = 1;

      await request(app.getHttpServer())
        .get(`/courses/${existingCourseId}`)
        .expect(HttpStatus.OK);
    });

    it('should return 404 when course does not exist.', async () => {
      const nonExistingCourseId = 999;

      await request(app.getHttpServer())
        .get(`/courses/${nonExistingCourseId}`)
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
        .send(payload)
        .expect(HttpStatus.BAD_REQUEST);

      if (Array.isArray(response.body.message)) {
        expect(response.body.message).toContain(errorMessage);
      } else {
        expect(response.body.message).toEqual(errorMessage);
      }
    });

    it('should create a course when called.', async () => {
      const toCreateCourse = createFakeCourseDto();

      await request(app.getHttpServer())
        .post('/courses')
        .send(toCreateCourse)
        .expect(201);
    });
  });
});
