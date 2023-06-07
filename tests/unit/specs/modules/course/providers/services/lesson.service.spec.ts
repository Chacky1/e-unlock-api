import { Test } from '@nestjs/testing';
import { LessonRepository } from '../../../../../../../src/modules/course/providers/repositories/lesson.repository';
import { LessonService } from '../../../../../../../src/modules/course/providers/services/lesson.service';
import { StorageService } from '../../../../../../../src/modules/config/cloud/providers/services/storage.service';
import { createFakeLessonDto } from '../../../../../../factories/course/dto/create-course/create-lesson.dto.factory';

describe('Lesson Service', () => {
  let service;
  let repository;

  const lessonRepositoryMock = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        LessonService,
        StorageService,
        {
          provide: LessonRepository,
          useValue: lessonRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<LessonService>(LessonService);
    repository = module.get<LessonRepository>(LessonRepository);
  });

  describe('createLesson', () => {
    it('should create a lesson when called.', async () => {
      const toCreateLesson = createFakeLessonDto();

      await service.create(toCreateLesson);

      expect(repository.create).toHaveBeenCalledWith(toCreateLesson);
    });
  });
});
