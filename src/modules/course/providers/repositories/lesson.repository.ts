import { Injectable } from '@nestjs/common';
import { Lesson } from '@prisma/client';
import { DatabaseService } from '../../../config/database/providers/services/database.service';
import { CreateLessonDto } from '../../dto/create-lesson.dto';
import { ResourceNotFoundError } from '../../../../shared/error/types/resource-not-found.error';

@Injectable()
export class LessonRepository {
  public constructor(private readonly databaseService: DatabaseService) {}

  public async findOne(id: number): Promise<Lesson> {
    const lesson = await this.databaseService.lesson.findUnique({
      where: {
        id,
      },
    });

    return lesson;
  }

  public async create(
    createLessonDto: CreateLessonDto,
    videoPath?: string,
  ): Promise<Lesson> {
    const section = await this.databaseService.section.findUnique({
      where: { id: createLessonDto.sectionId },
    });

    if (!section) {
      throw new ResourceNotFoundError(
        'SECTION',
        `${createLessonDto.sectionId}`,
      );
    }

    const lesson = await this.databaseService.lesson.create({
      data: {
        ...createLessonDto,
        videoUrl: videoPath,
      },
    });

    return lesson;
  }
}
