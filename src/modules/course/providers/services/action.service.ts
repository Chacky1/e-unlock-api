import { Injectable } from '@nestjs/common';
import { Action as PrismaAction } from '@prisma/client';
import { CreateActionDto } from '../../dto/create-action.dto';
import { ActionRepository } from '../repositories/action.repository';
import { Action, ActionType, SearchActionQuery } from '../../types/action.type';

@Injectable()
export class ActionService {
  constructor(private readonly actionRepository: ActionRepository) {}

  async search(filters: SearchActionQuery): Promise<Action[]> {
    const actions = await this.actionRepository.search(filters);

    return actions.map((action) => this.transformPrismaToInterface(action));
  }

  async create(createActionDto: CreateActionDto): Promise<Action> {
    const createdAction = await this.actionRepository.create(createActionDto);

    return this.transformPrismaToInterface(createdAction);
  }

  private transformPrismaToInterface(action: PrismaAction): Action {
    return {
      ...action,
      type: ActionType[action.type],
    };
  }
}
