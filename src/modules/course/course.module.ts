import { Module } from '@nestjs/common';
import { CourseRepository } from './repositories/course.repository';

@Module({
  imports: [],
  controllers: [],
  providers: [CourseRepository],
})
export class CourseModule {}
