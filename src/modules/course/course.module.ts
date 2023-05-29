import { Module } from '@nestjs/common';
import { CourseRepository } from './providers/repositories/course.repository';
import { SectionRepository } from './providers/repositories/section.repository';
import { LessonRepository } from './providers/repositories/lesson.repository';
import { CourseService } from './providers/services/course.service';

@Module({
  imports: [],
  controllers: [],
  providers: [
    CourseRepository,
    SectionRepository,
    LessonRepository,
    CourseService,
  ],
})
export class CourseModule {}
