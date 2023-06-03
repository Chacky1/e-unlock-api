import { Body, Controller, Post } from '@nestjs/common';
import { LessonService } from '../providers/services/lesson.service';
import { CreateLessonDto } from '../dto/create-lesson.dto';

@Controller('lessons')
export class LessonController {
  public constructor(private readonly lessonService: LessonService) {}

  @Post()
  public async create(@Body() createLessonDto: CreateLessonDto) {
    return await this.lessonService.create(createLessonDto);
  }
}
