import { Injectable } from '@nestjs/common';
import { Lesson } from '@prisma/client';
import { DatabaseService } from '../../../config/database/providers/services/database.service';
import { CreateLessonDto } from '../../dto/create-lesson.dto';
import { ResourceNotFoundError } from '../../../../shared/error/types/resource-not-found.error';

@Injectable()
export class LessonRepository {
  public constructor(private readonly databaseService: DatabaseService) {}

  public async findOne(id: number): Promise<Lesson> {
    const lesson = await this.databaseService.lesson.findUnique({
      where: {
        id,
      },
    });

    return lesson;
  }

  public async create(
    createLessonDto: CreateLessonDto,
    videoPath?: string,
  ): Promise<Lesson> {
    const section = await this.databaseService.section.findUnique({
      where: { id: createLessonDto.sectionId },
    });

    if (!section) {
      throw new ResourceNotFoundError(
        'SECTION',
        `${createLessonDto.sectionId}`,
      );
    }

    const lesson = await this.databaseService.lesson.create({
      data: {
        ...createLessonDto,
        videoUrl: videoPath,
      },
    });

    return lesson;
  }

  public async validateLesson(userId: number, lessonId: number) {
    const lesson = await this.databaseService.lesson.findUnique({
      where: {
        id: lessonId,
      },
    });

    if (!lesson) {
      throw new ResourceNotFoundError('LESSON', `${lessonId}`);
    }

    const user = await this.databaseService.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new ResourceNotFoundError('USER', `${userId}`);
    }

    const userLessons = await this.databaseService.userLesson.findUnique({
      where: {
        userId_lessonId: {
          userId,
          lessonId,
        },
      },
    });

    if (userLessons) {
      await this.databaseService.userLesson.update({
        where: {
          userId_lessonId: {
            userId,
            lessonId,
          },
        },
        data: {
          isDone: true,
        },
      });

      return;
    }

    await this.databaseService.userLesson.create({
      data: {
        userId,
        lessonId,
        isDone: true,
      },
    });

    return;
  }

  public async invalidateLesson(userId: number, lessonId: number) {
    const lesson = await this.databaseService.lesson.findUnique({
      where: {
        id: lessonId,
      },
    });

    if (!lesson) {
      throw new ResourceNotFoundError('LESSON', `${lessonId}`);
    }

    const user = await this.databaseService.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new ResourceNotFoundError('USER', `${userId}`);
    }

    const userLessons = await this.databaseService.userLesson.findUnique({
      where: {
        userId_lessonId: {
          userId,
          lessonId,
        },
      },
    });

    if (!userLessons) {
      throw new ResourceNotFoundError('USER_LESSON', `${userId}-${lessonId}`);
    }

    await this.databaseService.userLesson.update({
      where: {
        userId_lessonId: {
          userId,
          lessonId,
        },
      },
      data: {
        isDone: false,
      },
    });

    return;
  }
}
