import { Injectable } from '@nestjs/common';
import { LessonRepository } from '../repositories/lesson.repository';
import { CreateLessonDto } from '../../dto/create-lesson.dto';

@Injectable()
export class LessonService {
  public constructor(private readonly lessonRepository: LessonRepository) {}

  public async create(lesson: CreateLessonDto) {
    return await this.lessonRepository.create(lesson);
  }
}
