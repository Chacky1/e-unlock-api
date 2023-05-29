import { Test } from '@nestjs/testing';
import { CourseRepository } from '../../../../../../../src/modules/course/providers/repositories/course.repository';
import { CourseService } from '../../../../../../../src/modules/course/providers/services/course.service';
import { createFakeCourseDto } from '../../../../../../factories/course/dto/create-course/create-course.dto.factory';

describe('Course Service', () => {
  let service;
  let repository;

  const courseRepositoryMock = {
    createCourse: jest.fn(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        CourseService,
        {
          provide: CourseRepository,
          useValue: courseRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<CourseService>(CourseService);
    repository = module.get<CourseRepository>(CourseRepository);
  });

  describe('createCourse', () => {
    it('should create a course when called.', async () => {
      const toCreateCourse = createFakeCourseDto();

      await service.createCourse(toCreateCourse);

      expect(repository.createCourse).toHaveBeenCalledWith(toCreateCourse);
    });
  });
});
