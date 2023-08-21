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

    const coursesWithAssets = await this.makeCoursesWithAssets(courses);

    return coursesWithAssets;
  }

  public async search(search: CourseSearch) {
    const courses = await this.courseRepository.search(search);

    if (!courses) {
      return undefined;
    }

    const coursesWithAssets = await this.makeCoursesWithAssets(courses);

    return coursesWithAssets;
  }

  public async findOne(id: number) {
    const course = await this.courseRepository.findOne(id);

    if (!course) {
      return undefined;
    }

    if (!course.imageUrl) {
      return course;
    }

    const courseWithAssets = await this.makeCourseWithAssets(course);

    return courseWithAssets;
  }

  public async create(
    course: CreateCourseDto,
    image?: Express.Multer.File,
    video?: Express.Multer.File,
  ) {
    let uploadedImage = null;

    if (image) {
      uploadedImage = await this.storageService.upload(
        CLOUD_STORAGE_BUCKET_NAME,
        CLOUD_STORAGE_COURSES_FOLDER,
        image,
      );
    }

    let uploadedVideo = null;

    if (video) {
      uploadedVideo = await this.storageService.upload(
        CLOUD_STORAGE_BUCKET_NAME,
        CLOUD_STORAGE_COURSES_FOLDER,
        video,
      );
    }

    return await this.courseRepository.create(
      course,
      uploadedImage?.path || undefined,
      uploadedVideo?.path || undefined,
    );
  }

  private async makeCoursesWithAssets(
    courses: PrismaCourse[],
  ): Promise<Course[]> {
    const coursesWithAssets: Course[] = [];

    for (const course of courses) {
      const courseWithAssets = await this.makeCourseWithAssets(course);
      coursesWithAssets.push(courseWithAssets);
    }

    return coursesWithAssets;
  }

  private async makeCourseWithAssets(course: PrismaCourse): Promise<Course> {
    if (!course.imageUrl && !course.videoUrl) {
      return course;
    }

    const courseWithAsset: Course = {
      ...course,
    };

    let courseImage = null;

    if (course.imageUrl) {
      [courseImage] = await this.storageService.resolveSignedUrl(
        CLOUD_STORAGE_BUCKET_NAME,
        course.imageUrl,
      );

      courseWithAsset.image = courseImage;
    }

    let courseVideo = null;

    if (course.videoUrl) {
      [courseVideo] = await this.storageService.resolveSignedUrl(
        CLOUD_STORAGE_BUCKET_NAME,
        course.videoUrl,
      );

      courseWithAsset.video = courseVideo;
    }

    return courseWithAsset;
  }
}

export interface CourseSearch {
  id?: number;
  name?: string;
  description?: string;
  categoryId?: number;
}
