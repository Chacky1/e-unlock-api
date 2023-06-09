import { Module } from '@nestjs/common';
import { CourseRepository } from './providers/repositories/course.repository';
import { SectionRepository } from './providers/repositories/section.repository';
import { LessonRepository } from './providers/repositories/lesson.repository';
import { CourseService } from './providers/services/course.service';
import { DatabaseModule } from '../config/database/database.module';
import { SectionService } from './providers/services/section.service';
import { LessonService } from './providers/services/lesson.service';
import { CourseController } from './controllers/course.controller';
import { SectionController } from './controllers/section.controller';
import { ErrorsInterceptor } from './providers/interceptors/errors.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LessonController } from './controllers/lesson.controller';
import { CloudModule } from '../config/cloud/cloud.module';

@Module({
  imports: [DatabaseModule, CloudModule],
  controllers: [CourseController, SectionController, LessonController],
  providers: [
    CourseRepository,
    SectionRepository,
    LessonRepository,
    CourseService,
    SectionService,
    LessonService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ErrorsInterceptor,
    },
  ],
})
export class CourseModule {}
