import { Injectable } from '@nestjs/common';
import { Lesson } from '@prisma/client';
import { DatabaseService } from 'src/modules/config/database/providers/services/database.service';
import { CreateLessonDto } from '../../dto/create-lesson.dto';

@Injectable()
export class LessonRepository {
  public constructor(private readonly databaseService: DatabaseService) {}

  public async createLesson(createLessonDto: CreateLessonDto): Promise<Lesson> {
    const lesson = await this.databaseService.lesson.create({
      data: createLessonDto,
    });

    return lesson;
  }
}
