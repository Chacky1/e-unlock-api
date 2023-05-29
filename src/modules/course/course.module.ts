import { Module } from '@nestjs/common';
import { CourseRepository } from './repositories/course.repository';
import { SectionRepository } from './repositories/section.repository';
import { LessonRepository } from './repositories/lesson.repository';

@Module({
  imports: [],
  controllers: [],
  providers: [CourseRepository, SectionRepository, LessonRepository],
})
export class CourseModule {}
