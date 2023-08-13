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

  @Get(':id')
  @ApiParam({ name: 'id', type: Number })
  @UseGuards(AuthGuard('jwt'), ScopeGuard)
  @Scope('read:users')
  @ApiOkResponse({
    type: User,
  })
  public async findOne(@Param('id') id: number) {
    const user = await this.userService.findOne(+id);

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

  @Post(':userId/courses/:courseId')
  @UseGuards(AuthGuard('jwt'), ScopeGuard)
  @Scope('add:users.courses')
  @ApiNoContentResponse()
  @ApiParam({ name: 'userId', type: Number })
  @ApiParam({ name: 'courseId', type: Number })
  @HttpCode(204)
  public async addCourse(
    @Param('userId') userId: number,
    @Param('courseId') courseId: number,
  ) {
    await this.userService.addCourse(+userId, +courseId);
  }
}
