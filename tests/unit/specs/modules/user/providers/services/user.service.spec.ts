import { Test } from '@nestjs/testing';
import { CourseService } from '../../../../../../../src/modules/course/providers/services/course.service';
import { UserRepository } from '../../../../../../../src/modules/user/providers/repositories/user.repository';
import { UserService } from '../../../../../../../src/modules/user/providers/services/user.service';
import { CourseRepository } from '../../../../../../../src/modules/course/providers/repositories/course.repository';
import { StorageService } from '../../../../../../../src/modules/config/cloud/providers/services/storage.service';
import { DatabaseService } from '../../../../../../../src/modules/config/database/providers/services/database.service';
import { LessonService } from '../../../../../../../src/modules/course/providers/services/lesson.service';
import { LessonRepository } from '../../../../../../../src/modules/course/providers/repositories/lesson.repository';
import { ActionService } from '../../../../../../../src/modules/course/providers/services/action.service';
import { createFakeUserDto } from '../../../../../../factories/user/dto/create-user.dto.factory';

describe('UserService', () => {
  let userService;
  let lessonService;
  let actionService;
  let userRepository;

  const userRepositoryMock = {
    findOneWithId: jest.fn(),
    findOneWithCode: jest.fn(),
    create: jest.fn(),
    addCourse: jest.fn(),
  };

  const lessonServiceMock = {
    findUserLessons: jest.fn(),
    validateLesson: jest.fn(),
    invalidateLesson: jest.fn(),
  };

  const actionServiceMock = {
    complete: jest.fn(),
    uncomplete: jest.fn(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserService,
        CourseService,
        CourseRepository,
        LessonRepository,
        StorageService,
        DatabaseService,
        {
          provide: UserRepository,
          useValue: userRepositoryMock,
        },
        {
          provide: LessonService,
          useValue: lessonServiceMock,
        },
        {
          provide: ActionService,
          useValue: actionServiceMock,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    lessonService = module.get<LessonService>(LessonService);
    actionService = module.get<ActionService>(ActionService);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  describe('findOne', () => {
    it('should return a user when called.', async () => {
      const userCode = 'user_1';

      await userService.findOne(userCode);

      expect(userRepository.findOneWithCode).toHaveBeenCalledWith(userCode);
    });

    it('should return undefined if user does not exist.', async () => {
      const userCode = 'user_undefined';

      await expect(userService.findOne(userCode)).resolves.toBeUndefined();
    });
  });

  describe('createUser', () => {
    it('should create a user when called.', async () => {
      const toCreateUser = createFakeUserDto();

      await userService.create(toCreateUser);

      expect(userRepository.create).toHaveBeenCalledWith(toCreateUser);
    });
  });

  describe('addCourse', () => {
    it('should add a course to a user when called.', async () => {
      const userCode = 'user_1';
      const courseId = 1;

      await userService.addCourse(userCode, courseId);

      expect(userRepository.addCourse).toHaveBeenCalledWith(userCode, courseId);
    });
  });

  describe('findUserLessons', () => {
    it('should return user lessons when called.', async () => {
      const userId = 1;
      const fakeUser = createFakeUserDto();

      userRepository.findOneWithId.mockResolvedValue(fakeUser);

      await userService.findUserLessons(userId);

      expect(userRepository.findOneWithId).toHaveBeenCalledWith(userId);
      expect(lessonService.findUserLessons).toHaveBeenCalledWith(userId);
    });
  });

  describe('validateLesson', () => {
    it('should validate a lesson when called.', async () => {
      const userId = 1;
      const lessonId = 1;

      await userService.validateLesson(userId, lessonId);

      expect(lessonService.validateLesson).toHaveBeenCalledWith(
        userId,
        lessonId,
      );
    });
  });

  describe('invalidateLesson', () => {
    it('should invalidate a lesson when called.', async () => {
      const userId = 1;
      const lessonId = 1;

      await userService.invalidateLesson(userId, lessonId);

      expect(lessonService.invalidateLesson).toHaveBeenCalledWith(
        userId,
        lessonId,
      );
    });
  });

  describe('completeAction', () => {
    it('should complete an action when called.', async () => {
      const userId = 1;
      const actionId = 1;
      const answer = 'answer';
      const file = undefined;

      await userService.completeAction(userId, actionId, answer, file);

      expect(actionService.complete).toHaveBeenCalledWith(
        userId,
        actionId,
        answer,
        file,
      );
    });
  });

  describe('uncompleteAction', () => {
    it('should uncomplete an action when called.', async () => {
      const userId = 1;
      const actionId = 1;

      await userService.uncompleteAction(userId, actionId);

      expect(actionService.uncomplete).toHaveBeenCalledWith(userId, actionId);
    });
  });
});
