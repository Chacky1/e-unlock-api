import { Injectable } from '@nestjs/common';
import { Action } from '@prisma/client';
import { CreateActionDto } from '../../dto/create-action.dto';
import { ActionRepository } from '../repositories/action.repository';

@Injectable()
export class ActionService {
  constructor(private readonly actionRepository: ActionRepository) {}

  async create(createActionDto: CreateActionDto): Promise<Action> {
    return this.actionRepository.create(createActionDto);
  }
}
