import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiNoContentResponse } from '@nestjs/swagger';
import { ScopeGuard } from './shared/auth/providers/guards/scope.guard';
import { Scope } from './shared/auth/decorator/scope.decorator';

@Controller()
export class AppController {
  @Get('/')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  public root(): void {}

  @Get('/protected')
  @UseGuards(AuthGuard('jwt'), ScopeGuard)
  @Scope('read:protected')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  public protected(): void {}
}
