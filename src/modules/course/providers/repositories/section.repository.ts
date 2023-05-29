import { Injectable } from '@nestjs/common';
import { Section } from '@prisma/client';
import { DatabaseService } from '../../../../modules/config/database/providers/services/database.service';
import { CreateSectionDto } from '../../dto/create-section.dto';

@Injectable()
export class SectionRepository {
  public constructor(private readonly databaseService: DatabaseService) {}

  public async createSection(
    createSectionDto: CreateSectionDto,
  ): Promise<Section> {
    const section = await this.databaseService.section.create({
      data: createSectionDto,
    });

    return section;
  }
}
