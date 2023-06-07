import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { tmpdir } from 'os';
import { LessonService } from '../providers/services/lesson.service';
import { CreateLessonDto } from '../dto/create-lesson.dto';
import { ErrorsInterceptor } from '../providers/interceptors/errors.interceptor';
import { ApiConsumes, ApiParam } from '@nestjs/swagger';
import { Lesson } from '../types/lesson.type';

const UPLOAD_FILE_PATH = `${tmpdir()}/lessons/uploads`;

@Controller('lessons')
export class LessonController {
  public constructor(private readonly lessonService: LessonService) {}

  @Get(':id')
  @ApiParam({ name: 'id', type: Number })
  public async findOne(@Param('id') id: string): Promise<Lesson> {
    const lesson = await this.lessonService.findOne(+id);

    if (!lesson) {
      throw new NotFoundException('Lesson not found.');
    }

    return lesson;
  }

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
