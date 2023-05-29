import { Module } from '@nestjs/common';
import { CourseRepository } from './repositories/course.repository';
import { SectionRepository } from './repositories/section.repository';

@Module({
  imports: [],
  controllers: [],
  providers: [CourseRepository, SectionRepository],
})
export class CourseModule {}
