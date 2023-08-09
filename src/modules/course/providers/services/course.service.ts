import { Injectable } from '@nestjs/common';
import { CourseRepository } from '../repositories/course.repository';
import { CreateCourseDto } from '../../dto/create-course.dto';
import { StorageService } from '../../../config/cloud/providers/services/storage.service';
import { Course as PrismaCourse } from '@prisma/client';
import { Course } from '../../types/course.type';

const { CLOUD_STORAGE_BUCKET_NAME } = process.env;

const CLOUD_STORAGE_COURSES_FOLDER = 'courses';

@Injectable()
export class CourseService {
  public constructor(
    private readonly courseRepository: CourseRepository,
    private readonly storageService: StorageService,
  ) {}

  public async findAll() {
    const courses = await this.courseRepository.findAll();

    if (!courses) {
      return undefined;
    }

    const coursesWithImages = await this.makeCoursesWithImages(courses);

    return coursesWithImages;
  }

  public async search(search: CourseSearch) {
    const courses = await this.courseRepository.search(search);

    if (!courses) {
      return undefined;
    }

    const coursesWithImages = await this.makeCoursesWithImages(courses);

    return coursesWithImages;
  }

  public async findOne(id: number) {
    const course = await this.courseRepository.findOne(id);

    if (!course) {
      return undefined;
    }

    if (!course.imageUrl) {
      return course;
    }

    const courseWithImage = await this.makeCourseWithImage(course);

    return courseWithImage;
  }

  public async create(course: CreateCourseDto, image?: Express.Multer.File) {
    if (!image) {
      return await this.courseRepository.create(course);
    }

    const uploadedImage = await this.storageService.upload(
      CLOUD_STORAGE_BUCKET_NAME,
      CLOUD_STORAGE_COURSES_FOLDER,
      image,
    );

    return await this.courseRepository.create(course, uploadedImage.path);
  }

  private async makeCoursesWithImages(
    courses: PrismaCourse[],
  ): Promise<Course[]> {
    const coursesWithImages: Course[] = [];
    for (const course of courses) {
      if (!course.imageUrl) {
        coursesWithImages.push(course);
        continue;
      }

      const courseWithImage = await this.makeCourseWithImage(course);
      coursesWithImages.push(courseWithImage);
    }

    return coursesWithImages;
  }

  private async makeCourseWithImage(course: PrismaCourse): Promise<Course> {
    if (!course.imageUrl) {
      return course;
    }

    const [courseImage] = await this.storageService.resolveSignedUrl(
      CLOUD_STORAGE_BUCKET_NAME,
      course.imageUrl,
    );

    return {
      ...course,
      image: courseImage,
    };
  }
}

export interface CourseSearch {
  id?: number;
  name?: string;
  description?: string;
  categoryId?: number;
}
