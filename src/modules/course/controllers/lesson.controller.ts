import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { LessonService } from '../providers/services/lesson.service';
import { CreateLessonDto } from '../dto/create-lesson.dto';
import { ErrorsInterceptor } from '../providers/interceptors/errors.interceptor';

@Controller('lessons')
export class LessonController {
  public constructor(private readonly lessonService: LessonService) {}

  @Post()
  @UseInterceptors(ErrorsInterceptor)
  public async create(@Body() createLessonDto: CreateLessonDto) {
    return await this.lessonService.create(createLessonDto);
  }
}
