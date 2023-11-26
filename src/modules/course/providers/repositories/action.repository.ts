import { Injectable } from '@nestjs/common';
import { Action, UserAction } from '@prisma/client';
import { DatabaseService } from '../../../config/database/providers/services/database.service';
import { CreateActionDto } from '../../dto/create-action.dto';
import { SearchActionQuery } from '../../types/action.type';
import { ResourceNotFoundError } from '../../../../shared/error/types/resource-not-found.error';

@Injectable()
export class ActionRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async search(filters: SearchActionQuery): Promise<Action[]> {
    if (filters.userId) {
      return this.databaseService.action.findMany({
        where: {
          lessonId: filters.lessonId,
        },
        include: {
          userActions: {
            where: {
              userId: filters.userId,
            },
          },
        },
      });
    }

    return this.databaseService.action.findMany({
      where: {
        lessonId: filters.lessonId,
      },
    });
  }

  async create(createActionDto: CreateActionDto): Promise<Action> {
    return this.databaseService.action.create({
      data: createActionDto,
    });
  }

  async complete(
    userId: number,
    actionId: number,
    answer: string,
  ): Promise<boolean> {
    const action = await this.databaseService.action.findUnique({
      where: {
        id: actionId,
      },
    });

    if (!action) {
      throw new ResourceNotFoundError('ACTION', `${actionId}`);
    }

    const user = await this.databaseService.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new ResourceNotFoundError('USER', `${userId}`);
    }

    const userActions = await this.databaseService.userAction.findUnique({
      where: {
        userId_actionId: {
          userId,
          actionId,
        },
      },
    });

    if (userActions) {
      await this.databaseService.userAction.update({
        where: {
          userId_actionId: {
            userId,
            actionId,
          },
        },
        data: {
          isCompleted: true,
          answer,
        },
      });

      return;
    }

    await this.databaseService.userAction.create({
      data: {
        userId,
        actionId,
        isCompleted: true,
        answer,
      },
    });

    return;
  }

  async uncomplete(userId: number, actionId: number): Promise<boolean> {
    const action = await this.databaseService.action.findUnique({
      where: {
        id: actionId,
      },
    });

    if (!action) {
      throw new ResourceNotFoundError('ACTION', `${actionId}`);
    }

    const user = await this.databaseService.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new ResourceNotFoundError('USER', `${userId}`);
    }

    const userActions = await this.databaseService.userAction.findUnique({
      where: {
        userId_actionId: {
          userId,
          actionId,
        },
      },
    });

    if (!userActions) {
      throw new ResourceNotFoundError('USER_ACTION', `${userId}-${actionId}`);
    }

    await this.databaseService.userAction.update({
      where: {
        userId_actionId: {
          userId,
          actionId,
        },
      },
      data: {
        isCompleted: false,
      },
    });

    return;
  }

  async addFeedback(
    actionId: number,
    userId: number,
    feedback: string,
  ): Promise<UserAction> {
    const userAction = await this.databaseService.userAction.findUnique({
      where: {
        userId_actionId: {
          userId,
          actionId,
        },
      },
    });

    if (!userAction) {
      throw new ResourceNotFoundError('USER_ACTION', `${userId}-${actionId}`);
    }

    return this.databaseService.userAction.update({
      where: {
        userId_actionId: {
          userId,
          actionId,
        },
      },
      data: {
        feedback,
      },
    });
  }
}
