import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiNoContentResponse } from '@nestjs/swagger';

@Controller()
export class AppController {
  @Get('/')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  public root(): void {}
}
