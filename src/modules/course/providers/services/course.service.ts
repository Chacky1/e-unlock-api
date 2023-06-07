import { Injectable } from '@nestjs/common';
import { CourseRepository } from '../repositories/course.repository';
import { CreateCourseDto } from '../../dto/create-course.dto';

@Injectable()
export class CourseService {
  public constructor(private readonly courseRepository: CourseRepository) {}

  public async findAll() {
    return await this.courseRepository.findAll();
  }

  public async findOne(id: number) {
    return await this.courseRepository.findOne(id);
  }

  public async create(course: CreateCourseDto) {
    return await this.courseRepository.create(course);
  }
}
