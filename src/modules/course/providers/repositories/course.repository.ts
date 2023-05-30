import { Injectable } from '@nestjs/common';
import { Course } from '@prisma/client';
import { DatabaseService } from '../../../config/database/providers/services/database.service';
import { CreateCourseDto } from '../../dto/create-course.dto';

@Injectable()
export class CourseRepository {
  public constructor(private readonly databaseService: DatabaseService) {}

  public async create(createCourseDto: CreateCourseDto): Promise<Course> {
    const course = await this.databaseService.course.create({
      data: createCourseDto,
    });

    return course;
  }
}
