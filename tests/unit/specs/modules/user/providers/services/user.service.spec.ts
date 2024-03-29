import { Test } from '@nestjs/testing';
import { CourseService } from '../../../../../../../src/modules/course/providers/services/course.service';
import { UserRepository } from '../../../../../../../src/modules/user/providers/repositories/user.repository';
import { UserService } from '../../../../../../../src/modules/user/providers/services/user.service';
import { CourseRepository } from '../../../../../../../src/modules/course/providers/repositories/course.repository';
import { StorageService } from '../../../../../../../src/modules/config/cloud/providers/services/storage.service';
import { DatabaseService } from '../../../../../../../src/modules/config/database/providers/services/database.service';
import { createFakeUserDto } from '../../../../../../factories/user/dto/create-user.dto.factory';

describe('UserService', () => {
  let service;
  let repository;

  const userRepositoryMock = {
    findOne: jest.fn(),
    create: jest.fn(),
    addCourse: jest.fn(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserService,
        CourseService,
        CourseRepository,
        StorageService,
        DatabaseService,
        {
          provide: UserRepository,
          useValue: userRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<UserRepository>(UserRepository);
  });

  describe('findOne', () => {
    it('should return a user when called.', async () => {
      const userCode = 'user_1';

      await service.findOne(userCode);

      expect(repository.findOne).toHaveBeenCalledWith(userCode);
    });

    it('should return undefined if user does not exist.', async () => {
      const userCode = 'user_undefined';

      await expect(service.findOne(userCode)).resolves.toBeUndefined();
    });
  });

  describe('createUser', () => {
    it('should create a user when called.', async () => {
      const toCreateUser = createFakeUserDto();

      await service.create(toCreateUser);

      expect(repository.create).toHaveBeenCalledWith(toCreateUser);
    });
  });

  describe('addCourse', () => {
    it('should add a course to a user when called.', async () => {
      const userCode = 'user_1';
      const courseId = 1;

      await service.addCourse(userCode, courseId);

      expect(repository.addCourse).toHaveBeenCalledWith(userCode, courseId);
    });
  });
});
