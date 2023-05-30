import { Body, Controller, Post } from '@nestjs/common';
import { CreateCourseDto } from '../dto/create-course.dto';
import { CourseService } from '../providers/services/course.service';

@Controller('courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post()
  public async create(@Body() createCourseDto: CreateCourseDto) {
    return await this.courseService.create(createCourseDto);
  }
}
