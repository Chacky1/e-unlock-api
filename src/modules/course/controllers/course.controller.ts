import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateCourseDto } from '../dto/create-course.dto';
import { CourseService } from '../providers/services/course.service';

@Controller('courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Get()
  public async findAll() {
    return await this.courseService.findAll();
  }

  @Post()
  public async create(@Body() createCourseDto: CreateCourseDto) {
    return await this.courseService.create(createCourseDto);
  }
}
