import { Injectable } from '@nestjs/common';
import { User, UserCourse } from '@prisma/client';
import { CreateUserDto } from '../../dto/create-user.dto';
import { DatabaseService } from '../../../config/database/providers/services/database.service';
import { ResourceNotFoundError } from '../../../../shared/error/types/resource-not-found.error';

@Injectable()
export class UserRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  public async findOneWithId(id: number): Promise<User> {
    const user = await this.databaseService.user.findUnique({
      where: {
        id,
      },
    });

    return user;
  }

  public async findOneWithCode(code: string): Promise<
    User & {
      userCourses: UserCourse[];
    }
  > {
    const user = await this.databaseService.user.findUnique({
      where: {
        code,
      },
      include: {
        userCourses: true,
      },
    });

    return user;
  }

  public async create(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.databaseService.user.create({
      data: {
        ...createUserDto,
      },
    });

    return user;
  }

  public async addCourse(
    userCode: string,
    courseId: number,
  ): Promise<UserCourse> {
    const user = await this.databaseService.user.findUnique({
      where: {
        code: userCode,
      },
    });

    if (!user) {
      throw new ResourceNotFoundError('USER', `${userCode}`);
    }

    const course = await this.databaseService.course.findUnique({
      where: {
        id: courseId,
      },
    });

    if (!course) {
      throw new ResourceNotFoundError('COURSE', `${courseId}`);
    }

    const userCourse = await this.databaseService.userCourse.create({
      data: {
        userId: user.id,
        courseId,
      },
    });

    return userCourse;
  }
}
