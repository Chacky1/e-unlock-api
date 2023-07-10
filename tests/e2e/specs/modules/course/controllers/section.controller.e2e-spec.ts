import { HttpStatus, INestApplication } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import * as request from 'supertest';
import { CourseModule } from '../../../../../../src/modules/course/course.module';
import { initNestApp } from '../../../../../e2e/helpers/nest-app.helper';
import { createFakeSectionDto } from '../../../../../factories/course/dto/create-course/create-section.dto.factory';
import { CreateSectionDto } from '../../../../../../src/modules/course/dto/create-section.dto';
import { createFakeCourseDto } from '../../../../../factories/course/dto/create-course/create-course.dto.factory';
import { fetchAccessToken } from '../../../../helpers/access-token.helper';
import { ScopeGuard } from '../../../../../../src/shared/auth/providers/guards/scope.guard';
import { JwtStrategy } from '../../../../../../src/shared/auth/providers/strategies/jwt.strategy';

describe('Section Controller', () => {
  let app: INestApplication;
  let accessToken: string;
  let existingCourseId: number;
  const unknownCourseId = 999;

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

    const fakeCourse = createFakeCourseDto();

    const courseResponse = await request(app.getHttpServer())
      .post('/courses')
      .set('Authorization', `Bearer ${accessToken}`)
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
        errorMessage: 'Resource COURSE with id 999 not found.',
      },
    ])('$test', async ({ payload, errorMessage }) => {
      const response = await request(app.getHttpServer())
        .post('/sections')
        .set('Authorization', `Bearer ${accessToken}`)
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

      console.log('toCreateSection', toCreateSection);

      await request(app.getHttpServer())
        .post('/sections')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(toCreateSection)
        .expect(201);
    });
  });
});
