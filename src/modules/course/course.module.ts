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
import { ErrorsInterceptor } from '../../shared/interceptors/errors.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LessonController } from './controllers/lesson.controller';
import { CloudModule } from '../config/cloud/cloud.module';
import { CategoryController } from './controllers/category.controller';
import { CategoryService } from './providers/services/category.service';
import { CategoryRepository } from './providers/repositories/category.repository';
import { ResourceController } from './controllers/resource.controller';
import { ResourceService } from './providers/services/resource.service';
import { ResourceRepository } from './providers/repositories/resource.repository';

@Module({
  imports: [DatabaseModule, CloudModule],
  controllers: [
    CourseController,
    SectionController,
    LessonController,
    CategoryController,
    ResourceController,
  ],
  providers: [
    CourseRepository,
    SectionRepository,
    LessonRepository,
    CategoryRepository,
    ResourceRepository,
    CourseService,
    SectionService,
    LessonService,
    CategoryService,
    ResourceService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ErrorsInterceptor,
    },
  ],
  exports: [LessonService],
})
export class CourseModule {}
