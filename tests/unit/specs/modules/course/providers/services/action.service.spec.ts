import { TestingModule, Test } from '@nestjs/testing';
import { ActionRepository } from '../../../../../../../src/modules/course/providers/repositories/action.repository';
import { ActionService } from '../../../../../../../src/modules/course/providers/services/action.service';
import { createFakeActionDto } from '../../../../../../factories/course/dto/create-course/create-action.dto.factory';

describe('ActionService', () => {
  let service: ActionService;
  let repository: ActionRepository;

  const actionRepositoryMock = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ActionService,
        {
          provide: ActionRepository,
          useValue: actionRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<ActionService>(ActionService);
    repository = module.get<ActionRepository>(ActionRepository);
  });

  describe('create', () => {
    it('should create an action when called.', async () => {
      const toCreateAction = createFakeActionDto();

      await service.create(toCreateAction);

      expect(repository.create).toHaveBeenCalledWith(toCreateAction);
    });
  });
});
