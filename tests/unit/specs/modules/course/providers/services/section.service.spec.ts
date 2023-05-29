import { Test } from '@nestjs/testing';
import { SectionRepository } from '../../../../../../../src/modules/course/providers/repositories/section.repository';
import { SectionService } from '../../../../../../../src/modules/course/providers/services/section.service';
import { createFakeSectionDto } from '../../../../../../factories/course/dto/create-course/create-section.dto.factory';

describe('Section Service', () => {
  let service;
  let repository;

  const sectionRepositoryMock = {
    createSection: jest.fn(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        SectionService,
        {
          provide: SectionRepository,
          useValue: sectionRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<SectionService>(SectionService);
    repository = module.get<SectionRepository>(SectionRepository);
  });

  describe('createSection', () => {
    it('should create a section when called.', async () => {
      const toCreateSection = createFakeSectionDto();

      await service.createSection(toCreateSection);

      expect(repository.createSection).toHaveBeenCalledWith(toCreateSection);
    });
  });
});
