import { HttpStatus, INestApplication } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import * as request from 'supertest';
import { CourseModule } from '../../../../../../src/modules/course/course.module';
import { initNestApp } from '../../../../../e2e/helpers/nest-app.helper';
import { createFakeSectionDto } from '../../../../../factories/course/dto/create-course/create-section.dto.factory';
import { CreateSectionDto } from '../../../../../../src/modules/course/dto/create-section.dto';
import { createFakeCourseDto } from '../../../../../factories/course/dto/create-course/create-course.dto.factory';

describe('Section Controller', () => {
  let app: INestApplication;
  let existingCourseId: number;
  const unknownCourseId = 999;

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
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST sections', () => {
    it.each<{
      payload: CreateSectionDto;
      test: string;
      errorMessage: string;
    }>([
      {
        payload: createFakeSectionDto(
          { courseId: existingCourseId },
          { name: '' },
        ),
        test: 'should return 400 when name is empty.',
        errorMessage: 'name must be longer than or equal to 1 characters.',
      },
      {
        payload: createFakeSectionDto({ courseId: unknownCourseId }),
        test: 'should return 400 when course id does not exist.',
        errorMessage: 'course_id not found.',
      },
    ])('$test', async ({ payload, errorMessage }) => {
      const response = await request(app.getHttpServer())
        .post('/sections')
        .send(payload)
        .expect(HttpStatus.BAD_REQUEST);

      if (Array.isArray(response.body.message)) {
        expect(response.body.message).toContain(errorMessage);
      } else {
        expect(response.body.message).toEqual(errorMessage);
      }
    });

    it('should create a section when called.', async () => {
      const toCreateSection = createFakeSectionDto({
        courseId: existingCourseId,
      });

      await request(app.getHttpServer())
        .post('/sections')
        .send(toCreateSection)
        .expect(201);
    });
  });
});
