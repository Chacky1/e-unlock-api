import { Injectable } from '@nestjs/common';
import { Action } from '@prisma/client';
import { DatabaseService } from '../../../config/database/providers/services/database.service';
import { CreateActionDto } from '../../dto/create-action.dto';

@Injectable()
export class ActionRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createActionDto: CreateActionDto): Promise<Action> {
    return this.databaseService.action.create({
      data: createActionDto,
    });
  }
}
