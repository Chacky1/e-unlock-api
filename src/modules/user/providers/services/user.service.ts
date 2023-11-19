import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { CreateUserDto } from '../../dto/create-user.dto';
import { CourseService } from '../../../course/providers/services/course.service';
import { LessonService } from '../../../course/providers/services/lesson.service';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly courseService: CourseService,
    private readonly lessonService: LessonService,
  ) {}

  public async findOne(code: string) {
    const user = await this.userRepository.findOne(code);

    if (!user) {
      return undefined;
    }

    if (!user.courses.length) {
      return user;
    }

    const courses = [];
    for (const course of user.courses) {
      const courseDetails = await this.courseService.findOne(course.courseId);

      courses.push(courseDetails);
    }

    return {
      ...user,
      courses,
    };
  }

  public async create(user: CreateUserDto) {
    return await this.userRepository.create(user);
  }

  public async addCourse(userCode: string, courseId: number) {
    return await this.userRepository.addCourse(userCode, courseId);
  }

  public async validateLesson(userId: number, lessonId: number) {
    return await this.lessonService.validateLesson(userId, lessonId);
  }
}
