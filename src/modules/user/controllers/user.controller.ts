import {
  Body,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { tmpdir } from 'os';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiParam,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserService } from '../providers/services/user.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { User, UserLesson } from '../types/user.type';
import { ScopeGuard } from '../../../shared/auth/providers/guards/scope.guard';
import { Scope } from '../../../shared/auth/decorator/scope.decorator';
import { ErrorsInterceptor } from '../../../shared/interceptors/errors.interceptor';
import { CompleteActionDto } from '../dto/complete-action.dto';

const UPLOAD_FILE_PATH = `${tmpdir()}/actions/uploads`;

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

  @Get(':userId/lessons')
  @UseGuards(AuthGuard('jwt'), ScopeGuard)
  @Scope('read:users.lessons')
  @ApiOkResponse({
    type: UserLesson,
    isArray: true,
  })
  @ApiParam({ name: 'userId', type: String })
  public async findUserLessons(@Param('userId') userId: string) {
    const userLessons = await this.userService.findUserLessons(+userId);

    return userLessons;
  }

  @Post(':userId/lessons/:lessonId/validate')
  @UseGuards(AuthGuard('jwt'), ScopeGuard)
  @Scope('add:users.lessons')
  @ApiNoContentResponse()
  @ApiParam({ name: 'userId', type: String })
  @ApiParam({ name: 'lessonId', type: Number })
  @HttpCode(204)
  public async validateLesson(
    @Param('userId') userId: number,
    @Param('lessonId') lessonId: number,
  ) {
    await this.userService.validateLesson(+userId, +lessonId);
  }

  @Post(':userId/lessons/:lessonId/invalidate')
  @UseGuards(AuthGuard('jwt'), ScopeGuard)
  @Scope('add:users.lessons')
  @ApiNoContentResponse()
  @ApiParam({ name: 'userId', type: String })
  @ApiParam({ name: 'lessonId', type: Number })
  @HttpCode(204)
  public async invalidateLesson(
    @Param('userId') userId: number,
    @Param('lessonId') lessonId: number,
  ) {
    await this.userService.invalidateLesson(+userId, +lessonId);
  }

  @Post(':userId/actions/:actionId/complete')
  @UseInterceptors(
    ErrorsInterceptor,
    FileInterceptor('file', { dest: UPLOAD_FILE_PATH }),
  )
  @UseGuards(AuthGuard('jwt'), ScopeGuard)
  @Scope('add:users.actions')
  @ApiNoContentResponse()
  @ApiParam({ name: 'userId', type: String })
  @ApiParam({ name: 'actionId', type: Number })
  @HttpCode(204)
  public async completeAction(
    @Param('userId') userId: number,
    @Param('actionId') actionId: number,
    @Body() body: CompleteActionDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (file) {
      await this.userService.completeAction(+userId, +actionId, null, file);

      return;
    }

    await this.userService.completeAction(+userId, +actionId, body.answer);

    return;
  }
}
