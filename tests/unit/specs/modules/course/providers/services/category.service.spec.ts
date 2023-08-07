import { Test } from '@nestjs/testing';
import { CategoryRepository } from '../../../../../../../src/modules/course/providers/repositories/category.repository';
import { CategoryService } from '../../../../../../../src/modules/course/providers/services/category.service';
import { createFakeCategoryDto } from '../../../../../../factories/course/dto/create-course/create-category.dto.factory';

describe('Category Service', () => {
  let service;
  let repository;

  const categoryRepositoryMock = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        CategoryService,
        {
          provide: CategoryRepository,
          useValue: categoryRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
    repository = module.get<CategoryRepository>(CategoryRepository);
  });

  describe('findAll', () => {
    it('should return all categories when called.', async () => {
      await service.findAll();

      expect(repository.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a category when called.', async () => {
      const existingCategoryId = 29;

      await service.findOne(existingCategoryId);

      expect(repository.findOne).toHaveBeenCalledWith(existingCategoryId);
    });

    it('should return undefined if category does not exist.', async () => {
      const unknownCategoryId = 999;

      await expect(service.findOne(unknownCategoryId)).resolves.toBeUndefined();
    });
  });

  describe('createCategory', () => {
    it('should create a category when called.', async () => {
      const toCreateCategory = createFakeCategoryDto();

      await service.create(toCreateCategory);

      expect(repository.create).toHaveBeenCalledWith(toCreateCategory);
    });
  });
});
