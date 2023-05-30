import { Injectable } from '@nestjs/common';
import { CreateSectionDto } from '../../dto/create-section.dto';
import { SectionRepository } from '../repositories/section.repository';

@Injectable()
export class SectionService {
  public constructor(private readonly sectionRepository: SectionRepository) {}

  public async create(section: CreateSectionDto) {
    return await this.sectionRepository.create(section);
  }
}
