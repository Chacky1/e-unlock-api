import {
  Body,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../providers/services/user.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../types/user.type';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiParam,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
} from '@nestjs/swagger';
import { ScopeGuard } from '../../../shared/auth/providers/guards/scope.guard';
import { Scope } from '../../../shared/auth/decorator/scope.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':code')
  @ApiParam({ name: 'code', type: String })
  @UseGuards(AuthGuard('jwt'), ScopeGuard)
  @Scope('read:users')
  @ApiOkResponse({
    type: User,
  })
  public async findOne(@Param('code') code: string) {
    const user = await this.userService.findOne(code);

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    return user;
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), ScopeGuard)
  @Scope('add:users')
  @ApiCreatedResponse({
    type: CreateUserDto,
  })
  public async create(@Body() user: CreateUserDto) {
    return await this.userService.create(user);
  }

  @Post(':userCode/courses/:courseId')
  @UseGuards(AuthGuard('jwt'), ScopeGuard)
  @Scope('add:users.courses')
  @ApiNoContentResponse()
  @ApiParam({ name: 'userCode', type: String })
  @ApiParam({ name: 'courseId', type: Number })
  @HttpCode(204)
  public async addCourse(
    @Param('userCode') userCode: string,
    @Param('courseId') courseId: number,
  ) {
    await this.userService.addCourse(userCode, +courseId);
  }

  @Post(':userId/lessons/:lessonId/validate')
  @UseGuards(AuthGuard('jwt'), ScopeGuard)
  @Scope('add:users.lessons')
  @ApiNoContentResponse()
  @ApiParam({ name: 'userId', type: String })
  @ApiParam({ name: 'lessonId', type: Number })
  @HttpCode(204)
  public async validateLesson(
    @Param('userId') userId: string,
    @Param('lessonId') lessonId: number,
  ) {
    await this.userService.validateLesson(+userId, +lessonId);
  }
}
