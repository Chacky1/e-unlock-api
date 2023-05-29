import { Injectable } from '@nestjs/common';
import { LessonRepository } from '../repositories/lesson.repository';
import { CreateLessonDto } from '../../dto/create-lesson.dto';

@Injectable()
export class LessonService {
  public constructor(private readonly lessonRepository: LessonRepository) {}

  public async createLesson(lesson: CreateLessonDto) {
    return await this.lessonRepository.createLesson(lesson);
  }
}
