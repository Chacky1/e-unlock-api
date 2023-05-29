import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { CourseModule } from '../../../../../../src/modules/course/course.module';
import { createFakeCourseDto } from '../../../../../factories/course/dto/create-course/create-course.dto.factory';

describe('Course Controller (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [CourseModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /courses', () => {
    it('should create a course when called.', async () => {
      const toCreateCourse = createFakeCourseDto();

      await request(app.getHttpServer())
        .post('/courses')
        .send(toCreateCourse)
        .expect(201);
    });
  });
});
