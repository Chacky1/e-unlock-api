import { Test } from '@nestjs/testing';
import { LessonRepository } from '../../../../../../../src/modules/course/providers/repositories/lesson.repository';
import { LessonService } from '../../../../../../../src/modules/course/providers/services/lesson.service';
import { StorageService } from '../../../../../../../src/modules/config/cloud/providers/services/storage.service';
import { createFakeLessonDto } from '../../../../../../factories/course/dto/create-course/create-lesson.dto.factory';

describe('Lesson Service', () => {
  let service;
  let repository;

  const lessonRepositoryMock = {
    findOne: jest.fn(),
    create: jest.fn(),
    findUserLessons: jest.fn(),
    validateLesson: jest.fn(),
    invalidateLesson: jest.fn(),
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

  describe('findOne', () => {
    it('should return a lesson when called.', async () => {
      const existingLessonId = 57;

      await service.findOne(existingLessonId);

      expect(repository.findOne).toHaveBeenCalledWith(existingLessonId);
    });

    it('should return undefined if lesson does not exist.', async () => {
      const unknownLessonId = 999;

      await expect(service.findOne(unknownLessonId)).resolves.toBeUndefined();
    });
  });

  describe('createLesson', () => {
    it('should create a lesson when called.', async () => {
      const toCreateLesson = createFakeLessonDto();

      await service.create(toCreateLesson);

      expect(repository.create).toHaveBeenCalledWith(toCreateLesson);
    });
  });

  describe('findUserLessons', () => {
    it('should return user lessons when called.', async () => {
      const userId = 1;

      await service.findUserLessons(userId);

      expect(repository.findUserLessons).toHaveBeenCalledWith(userId);
    });
  });

  describe('validateLesson', () => {
    it('should validate a lesson when called.', async () => {
      const userId = 1;
      const lessonId = 2;

      await service.validateLesson(userId, lessonId);

      expect(repository.validateLesson).toHaveBeenCalledWith(userId, lessonId);
    });
  });

  describe('invalidateLesson', () => {
    it('should invalidate a lesson when called.', async () => {
      const userId = 1;
      const lessonId = 2;

      await service.invalidateLesson(userId, lessonId);

      expect(repository.invalidateLesson).toHaveBeenCalledWith(
        userId,
        lessonId,
      );
    });
  });
});
