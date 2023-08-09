import { Injectable } from '@nestjs/common';
import { Course } from '@prisma/client';
import { DatabaseService } from '../../../config/database/providers/services/database.service';
import { CreateCourseDto } from '../../dto/create-course.dto';
import { CourseSearch } from '../services/course.service';
import { ResourceNotFoundError } from '../../../../shared/error/types/resource-not-found.error';

@Injectable()
export class CourseRepository {
  public constructor(private readonly databaseService: DatabaseService) {}

  public async findAll(): Promise<Course[]> {
    const courses = await this.databaseService.course.findMany();

    return courses;
  }

  public async search(search: CourseSearch): Promise<Course[]> {
    if (search.categoryId) {
      const category = await this.databaseService.category.findUnique({
        where: {
          id: search.categoryId,
        },
      });

      if (!category) {
        throw new ResourceNotFoundError('CATEGORY', `${search.categoryId}`);
      }
    }

    const courses = await this.databaseService.course.findMany({
      where: {
        id: search.id ?? undefined,
        name: search.name ?? undefined,
        description: search.description ?? undefined,
        categoryId: search.categoryId ?? undefined,
      },
    });

    return courses;
  }

  public async findOne(id: number): Promise<Course> {
    const course = await this.databaseService.course.findUnique({
      where: {
        id,
      },
      include: {
        sections: {
          include: {
            lessons: true,
          },
        },
      },
    });

    return course;
  }

  public async create(createCourseDto: CreateCourseDto): Promise<Course> {
    const course = await this.databaseService.course.create({
      data: createCourseDto,
    });

    return course;
  }
}
