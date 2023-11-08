import { HttpStatus, INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TestingModule, Test } from '@nestjs/testing';
import * as request from 'supertest';
import { CourseModule } from '../../../../../../src/modules/course/course.module';
import { ScopeGuard } from '../../../../../../src/shared/auth/providers/guards/scope.guard';
import { JwtStrategy } from '../../../../../../src/shared/auth/providers/strategies/jwt.strategy';
import { CreateResourceDto } from '../../../../../../src/modules/course/dto/create-resource.dto';
import { fetchAccessToken } from '../../../../helpers/access-token.helper';
import { initNestApp } from '../../../../helpers/nest-app.helper';
import { createFakeCategoryDto } from '../../../../../factories/course/dto/create-course/create-category.dto.factory';
import { createFakeCourseDto } from '../../../../../factories/course/dto/create-course/create-course.dto.factory';
import { createFakeLessonDto } from '../../../../../factories/course/dto/create-course/create-lesson.dto.factory';
import { createFakeSectionDto } from '../../../../../factories/course/dto/create-course/create-section.dto.factory';
import { createFakeResourceDto } from '../../../../../factories/course/dto/create-course/create-resource.dto.factory';

describe('Resource Controller', () => {
  let app: INestApplication;
  let accessToken: string;
  let existingCourseId: number;
  let existingSectionId: number;
  let existingLessonId: number;
  let existingResourceId: number;
  const unknownLessonId = 999;

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

    const fakeResource = createFakeResourceDto({ lessonId: existingLessonId });

    const resourceResponse = await request(app.getHttpServer())
      .post('/resources')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(fakeResource);

    existingResourceId = resourceResponse.body.id;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET resources', () => {
    it('should return resources when called.', async () => {
      await request(app.getHttpServer())
        .get(`/resources`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(HttpStatus.OK);
    });

    it('should return a resource when called with an existing id.', async () => {
      await request(app.getHttpServer())
        .get(`/resources?id=${existingResourceId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(HttpStatus.OK);
    });

    it('should return 400 when resource does not exist.', async () => {
      await request(app.getHttpServer())
        .get(`/resources?lessonId=${unknownLessonId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(HttpStatus.OK);
    });
  });

  describe('POST lessons', () => {
    it.each<{
      payload: CreateResourceDto;
      test: string;
      errorMessage: string;
    }>([
      {
        payload: createFakeResourceDto(
          { lessonId: existingLessonId },
          { name: '' },
        ),
        test: 'should return 400 when name is empty.',
        errorMessage: 'name must be longer than or equal to 1 characters',
      },
      {
        payload: createFakeResourceDto({ lessonId: unknownLessonId }),
        test: 'should return 400 when lesson id does not exist.',
        errorMessage: 'Resource LESSON with id 999 not found.',
      },
    ])('$test', async ({ payload, errorMessage }) => {
      const response = await request(app.getHttpServer())
        .post('/resources')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(payload)
        .expect(HttpStatus.BAD_REQUEST);

      if (Array.isArray(response.body.message)) {
        expect(response.body.message[0]).toContain(errorMessage);
      } else {
        expect(response.body.message).toEqual(errorMessage);
      }
    });

    it('should create a resource when called without file.', async () => {
      const toCreateResource = createFakeResourceDto({
        lessonId: existingLessonId,
      });

      await request(app.getHttpServer())
        .post('/resources')
        .set('Authorization', `Bearer ${accessToken}`)
        .field('name', toCreateResource.name)
        .field('lessonId', toCreateResource.lessonId)
        .expect(HttpStatus.CREATED);
    });

    it('should create a resource when called with file.', async () => {
      const toCreateResource = createFakeResourceDto({
        lessonId: existingLessonId,
      });

      await request(app.getHttpServer())
        .post('/resources')
        .set('Authorization', `Bearer ${accessToken}`)
        .attach('file', `${process.cwd()}/tests/e2e/assets/test-image.png`)
        .field('name', toCreateResource.name)
        .field('lessonId', toCreateResource.lessonId)
        .expect(HttpStatus.CREATED);
    });
  });
});
