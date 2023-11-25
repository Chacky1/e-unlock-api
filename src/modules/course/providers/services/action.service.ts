import { Injectable } from '@nestjs/common';
import { Action as PrismaAction } from '@prisma/client';
import { CreateActionDto } from '../../dto/create-action.dto';
import { ActionRepository } from '../repositories/action.repository';
import { Action, ActionType, SearchActionQuery } from '../../types/action.type';
import { StorageService } from '../../../config/cloud/providers/services/storage.service';

const { CLOUD_STORAGE_BUCKET_NAME } = process.env;

const CLOUD_STORAGE_LESSONS_FOLDER = 'actions';

@Injectable()
export class ActionService {
  constructor(
    private readonly actionRepository: ActionRepository,
    private readonly storageService: StorageService,
  ) {}

  async search(filters: SearchActionQuery): Promise<Action[]> {
    const actions = await this.actionRepository.search(filters);

    return actions.map((action) => this.transformPrismaToInterface(action));
  }

  async create(createActionDto: CreateActionDto): Promise<Action> {
    const createdAction = await this.actionRepository.create(createActionDto);

    return this.transformPrismaToInterface(createdAction);
  }

  async complete(
    userId: number,
    actionId: number,
    answer: string,
    file: Express.Multer.File,
  ): Promise<boolean> {
    if (file) {
      const uploadedFile = await this.storageService.upload(
        CLOUD_STORAGE_BUCKET_NAME,
        CLOUD_STORAGE_LESSONS_FOLDER,
        file,
      );

      await this.actionRepository.complete(userId, actionId, uploadedFile.path);

      return true;
    }

    await this.actionRepository.complete(userId, actionId, answer);

    return true;
  }

  private transformPrismaToInterface(action: PrismaAction): Action {
    return {
      ...action,
      type: ActionType[action.type],
    };
  }
}
