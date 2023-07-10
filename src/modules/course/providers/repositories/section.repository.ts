import { Injectable } from '@nestjs/common';
import { Section } from '@prisma/client';
import { DatabaseService } from '../../../../modules/config/database/providers/services/database.service';
import { CreateSectionDto } from '../../dto/create-section.dto';
import { ResourceNotFoundError } from '../../../../shared/error/types/resource-not-found.error';

@Injectable()
export class SectionRepository {
  public constructor(private readonly databaseService: DatabaseService) {}

  public async create(createSectionDto: CreateSectionDto): Promise<Section> {
    const course = await this.databaseService.course.findUnique({
      where: { id: createSectionDto.courseId },
    });

    if (!course) {
      throw new ResourceNotFoundError('COURSE', `${createSectionDto.courseId}`);
    }

    const section = await this.databaseService.section.create({
      data: createSectionDto,
    });

    return section;
  }
}
