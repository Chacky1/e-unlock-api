import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateCourseDto } from '../dto/create-course.dto';
import { CourseService } from '../providers/services/course.service';
import { ApiParam } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Scope } from '../../../shared/auth/decorator/scope.decorator';
import { ScopeGuard } from '../../../shared/auth/providers/guards/scope.guard';

@Controller('courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'), ScopeGuard)
  @Scope('search:courses')
  public async findAll() {
    return await this.courseService.findAll();
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: Number })
  @UseGuards(AuthGuard('jwt'), ScopeGuard)
  @Scope('read:courses')
  public async findOne(@Param('id') id: string) {
    const course = await this.courseService.findOne(+id);

    if (!course) {
      throw new NotFoundException('Course not found.');
    }

    return course;
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), ScopeGuard)
  @Scope('add:courses')
  public async create(@Body() createCourseDto: CreateCourseDto) {
    return await this.courseService.create(createCourseDto);
  }
}
