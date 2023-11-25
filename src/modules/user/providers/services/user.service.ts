import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { CreateUserDto } from '../../dto/create-user.dto';
import { CourseService } from '../../../course/providers/services/course.service';
import { LessonService } from '../../../course/providers/services/lesson.service';
import { ActionService } from '../../../course/providers/services/action.service';
import { ResourceNotFoundError } from '../../../../shared/error/types/resource-not-found.error';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly courseService: CourseService,
    private readonly lessonService: LessonService,
    private readonly actionService: ActionService,
  ) {}

  public async findOne(code: string) {
    const user = await this.userRepository.findOneWithCode(code);

    if (!user) {
      return undefined;
    }

    if (!user.userCourses.length) {
      return user;
    }

    const courses = [];
    for (const course of user.userCourses) {
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

  public async findUserLessons(userId: number) {
    const user = await this.userRepository.findOneWithId(userId);

    if (!user) {
      throw new ResourceNotFoundError('USER', `${userId}`);
    }

    return await this.lessonService.findUserLessons(userId);
  }

  public async validateLesson(userId: number, lessonId: number) {
    return await this.lessonService.validateLesson(userId, lessonId);
  }

  public async invalidateLesson(userId: number, lessonId: number) {
    return await this.lessonService.invalidateLesson(userId, lessonId);
  }

  public async completeAction(
    userId: number,
    actionId: number,
    answer?: string,
    file?: Express.Multer.File,
  ) {
    return await this.actionService.complete(userId, actionId, answer, file);
  }
}
