import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { CreateCourseDto } from '../dto/create-course.dto';
import { CourseService } from '../providers/services/course.service';
import { ApiParam } from '@nestjs/swagger';

@Controller('courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Get()
  public async findAll() {
    return await this.courseService.findAll();
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: Number })
  public async findOne(@Param('id') id: string) {
    const course = await this.courseService.findOne(+id);

    if (!course) {
      throw new NotFoundException('Course not found.');
    }

    return course;
  }

  @Post()
  public async create(@Body() createCourseDto: CreateCourseDto) {
    return await this.courseService.create(createCourseDto);
  }
}
