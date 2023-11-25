import { Controller, Post, Body, UseGuards, Get, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { CreateActionDto } from '../dto/create-action.dto';
import { Scope } from '../../../shared/auth/decorator/scope.decorator';
import { ScopeGuard } from '../../../shared/auth/providers/guards/scope.guard';
import { ActionService } from '../providers/services/action.service';
import { Action, SearchActionQuery } from '../types/action.type';

@Controller('actions')
export class ActionController {
  constructor(private readonly actionService: ActionService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'), ScopeGuard)
  @Scope('search:actions')
  @ApiOkResponse({
    type: [Action],
  })
  async search(@Query() query: SearchActionQuery): Promise<Action[]> {
    return this.actionService.search(query);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), ScopeGuard)
  @Scope('add:actions')
  @ApiCreatedResponse({
    type: Action,
  })
  async create(@Body() createActionDto: CreateActionDto): Promise<Action> {
    return this.actionService.create(createActionDto);
  }
}
