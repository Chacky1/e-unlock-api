import { TestingModule, Test } from '@nestjs/testing';
import { ActionRepository } from '../../../../../../../src/modules/course/providers/repositories/action.repository';
import { ActionService } from '../../../../../../../src/modules/course/providers/services/action.service';
import { StorageService } from '../../../../../../../src/modules/config/cloud/providers/services/storage.service';
import { createFakeActionDto } from '../../../../../../factories/course/dto/create-course/create-action.dto.factory';

describe('ActionService', () => {
  let service: ActionService;
  let repository: ActionRepository;

  const actionRepositoryMock = {
    create: jest.fn(),
    complete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ActionService,
        StorageService,
        {
          provide: ActionRepository,
          useValue: actionRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<ActionService>(ActionService);
    repository = module.get<ActionRepository>(ActionRepository);
  });

  describe('search', () => {
    it('should return an array of actions when called.', async () => {
      const toSearchAction = {
        lessonId: 1,
      };
      const expectedActions = [createFakeActionDto()];

      repository.search = jest.fn().mockResolvedValue(expectedActions);

      await service.search(toSearchAction);

      expect(repository.search).toHaveBeenCalledWith(toSearchAction);
    });
  });

  describe('create', () => {
    it('should create an action when called.', async () => {
      const toCreateAction = createFakeActionDto();

      repository.create = jest.fn().mockResolvedValue(toCreateAction);

      await service.create(toCreateAction);

      expect(repository.create).toHaveBeenCalledWith(toCreateAction);
    });
  });

  describe('complete', () => {
    it('should complete an action when called.', async () => {
      const userId = 1;
      const actionId = 1;
      const answer = 'answer';
      const file = undefined;

      await service.complete(userId, actionId, answer, file);

      expect(repository.complete).toHaveBeenCalledWith(
        userId,
        actionId,
        answer,
      );
    });
  });
});
