import { Test } from '@nestjs/testing';
import { StorageService } from '../../../../../../../src/modules/config/cloud/providers/services/storage.service';
import { ResourceRepository } from '../../../../../../../src/modules/course/providers/repositories/resource.repository';
import { ResourceService } from '../../../../../../../src/modules/course/providers/services/resource.service';
import { createFakeResourceDto } from '../../../../../../factories/course/dto/create-course/create-resource.dto.factory';

describe('Resource Service', () => {
  let service;
  let repository;

  const resourceRepositoryMock = {
    search: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ResourceService,
        StorageService,
        {
          provide: ResourceRepository,
          useValue: resourceRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<ResourceService>(ResourceService);
    repository = module.get<ResourceRepository>(ResourceRepository);
  });

  describe('search', () => {
    it('should return a list of resources when called.', async () => {
      const resourceQuerySearch = {
        id: 1,
        name: 'Resource name',
        lessonId: 1,
      };

      await service.search(resourceQuerySearch);

      expect(repository.search).toHaveBeenCalledWith(resourceQuerySearch);
    });
  });

  describe('create', () => {
    it('should create a resource when called.', async () => {
      const toCreateResource = createFakeResourceDto();

      await service.create(toCreateResource);

      expect(repository.create).toHaveBeenCalledWith(toCreateResource);
    });
  });
});
