import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiConsumes, ApiOkResponse } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { tmpdir } from 'os';

import { Scope } from '../../../shared/auth/decorator/scope.decorator';
import { ScopeGuard } from '../../../shared/auth/providers/guards/scope.guard';
import { ResourceService } from '../providers/services/resource.service';
import { Resource, ResourceQuerySearch } from '../types/resource.type';
import { ErrorsInterceptor } from '../providers/interceptors/errors.interceptor';
import { CreateResourceDto } from '../dto/create-resource.dto';

const UPLOAD_FILE_PATH = `${tmpdir()}/resources/uploads`;

@Controller('resources')
export class ResourceController {
  constructor(private readonly resourceService: ResourceService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'), ScopeGuard)
  @Scope('search:resources')
  @ApiOkResponse({
    type: Resource,
    isArray: true,
  })
  public async search(@Query() query: ResourceQuerySearch) {
    return await this.resourceService.search({
      id: +query?.id || undefined,
      name: query.name || undefined,
      lessonId: +query.lessonId || undefined,
    });
  }

  @Post()
  @UseInterceptors(
    ErrorsInterceptor,
    FileInterceptor('file', { dest: UPLOAD_FILE_PATH }),
  )
  @UseGuards(AuthGuard('jwt'), ScopeGuard)
  @Scope('add:resources')
  @ApiOkResponse({
    type: Resource,
  })
  @ApiConsumes('multipart/form-data')
  public async create(
    @Body() createResourceDto: CreateResourceDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.resourceService.create(createResourceDto, file);
  }
}
