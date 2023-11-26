import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Query,
  Param,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiCreatedResponse, ApiOkResponse, ApiParam } from '@nestjs/swagger';
import {
  CreateActionDto,
  CreateActionFeedbackDto,
} from '../dto/create-action.dto';
import { Scope } from '../../../shared/auth/decorator/scope.decorator';
import { ScopeGuard } from '../../../shared/auth/providers/guards/scope.guard';
import { ActionService } from '../providers/services/action.service';
import { Action, SearchActionQuery, UserAction } from '../types/action.type';

@Controller('actions')
export class ActionController {
  constructor(private readonly actionService: ActionService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'), ScopeGuard)
  @Scope('search:actions')
  @ApiOkResponse({
    type: Action,
    isArray: true,
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

  @Post('/:actionId/feedback')
  @UseGuards(AuthGuard('jwt'), ScopeGuard)
  @Scope('add:actions.feedback')
  @ApiParam({
    name: 'actionId',
    type: Number,
  })
  @ApiCreatedResponse({
    type: UserAction,
  })
  async addFeedback(
    @Body() body: CreateActionFeedbackDto,
    @Param('actionId') actionId: number,
  ): Promise<UserAction> {
    return this.actionService.addFeedback(
      +actionId,
      body.userId,
      body.feedback,
    );
  }
}
