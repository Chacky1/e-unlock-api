import { Injectable } from '@nestjs/common';
import { CourseRepository } from '../repositories/course.repository';
import { CreateCourseDto } from '../../dto/create-course.dto';

@Injectable()
export class CourseService {
  public constructor(private readonly courseRepository: CourseRepository) {}

  public async createCourse(course: CreateCourseDto) {
    return await this.courseRepository.createCourse(course);
  }
}
