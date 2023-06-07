import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { tmpdir } from 'os';
import { LessonService } from '../providers/services/lesson.service';
import { CreateLessonDto } from '../dto/create-lesson.dto';
import { ErrorsInterceptor } from '../providers/interceptors/errors.interceptor';
import { ApiConsumes } from '@nestjs/swagger';
import * as fs from 'fs';

const UPLOAD_FILE_PATH = `${tmpdir()}/lessons/uploads`;

@Controller('lessons')
export class LessonController {
  public constructor(private readonly lessonService: LessonService) {}

  @Post()
  @UseInterceptors(
    ErrorsInterceptor,
    FileInterceptor('video', { dest: UPLOAD_FILE_PATH }),
  )
  @ApiConsumes('multipart/form-data')
  public async create(
    @Body() createLessonDto: CreateLessonDto,
    @UploadedFile() video: Express.Multer.File,
  ) {
    return await this.lessonService.create(createLessonDto, video);
  }
}
