import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { Action } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';
import { ApiCreatedResponse } from '@nestjs/swagger';
import { CreateActionDto } from '../dto/create-action.dto';
import { Scope } from '../../../shared/auth/decorator/scope.decorator';
import { ScopeGuard } from '../../../shared/auth/providers/guards/scope.guard';
import { ActionService } from '../providers/services/action.service';

@Controller('actions')
export class ActionController {
  constructor(private readonly actionService: ActionService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), ScopeGuard)
  @Scope('add:actions')
  @ApiCreatedResponse({
    type: CreateActionDto,
  })
  async create(@Body() createActionDto: CreateActionDto): Promise<Action> {
    return this.actionService.create(createActionDto);
  }
}
