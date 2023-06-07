import { Test } from '@nestjs/testing';
import { CourseRepository } from '../../../../../../../src/modules/course/providers/repositories/course.repository';
import { CourseService } from '../../../../../../../src/modules/course/providers/services/course.service';
import { createFakeCourseDto } from '../../../../../../factories/course/dto/create-course/create-course.dto.factory';

describe('Course Service', () => {
  let service;
  let repository;

  const courseRepositoryMock = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
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

  describe('findAll', () => {
    it('should return all courses when called.', async () => {
      await service.findAll();

      expect(repository.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a course when called.', async () => {
      const existingCourseId = 29;

      await service.findOne(existingCourseId);

      expect(repository.findOne).toHaveBeenCalledWith(existingCourseId);
    });

    it('should return undefined if course does not exist.', async () => {
      const unknownLessonId = 999;

      await expect(service.findOne(unknownLessonId)).resolves.toBeUndefined();
    });
  });

  describe('createCourse', () => {
    it('should create a course when called.', async () => {
      const toCreateCourse = createFakeCourseDto();

      await service.create(toCreateCourse);

      expect(repository.create).toHaveBeenCalledWith(toCreateCourse);
    });
  });
});
