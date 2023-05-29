import { Module } from '@nestjs/common';
import { CourseRepository } from './providers/repositories/course.repository';
import { SectionRepository } from './providers/repositories/section.repository';
import { LessonRepository } from './providers/repositories/lesson.repository';

@Module({
  imports: [],
  controllers: [],
  providers: [CourseRepository, SectionRepository, LessonRepository],
})
export class CourseModule {}
