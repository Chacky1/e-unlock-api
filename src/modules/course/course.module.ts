import { Module } from '@nestjs/common';
import { CourseRepository } from './providers/repositories/course.repository';
import { SectionRepository } from './providers/repositories/section.repository';
import { LessonRepository } from './providers/repositories/lesson.repository';
import { CourseService } from './providers/services/course.service';
import { DatabaseModule } from '../config/database/database.module';
import { SectionService } from './providers/services/section.service';
import { LessonService } from './providers/services/lesson.service';

@Module({
  imports: [DatabaseModule],
  controllers: [],
  providers: [
    CourseRepository,
    SectionRepository,
    LessonRepository,
    CourseService,
    SectionService,
    LessonService,
  ],
})
export class CourseModule {}
