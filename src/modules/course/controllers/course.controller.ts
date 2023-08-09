import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { tmpdir } from 'os';
import { CreateCourseDto } from '../dto/create-course.dto';
import { CourseService } from '../providers/services/course.service';
import {
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Scope } from '../../../shared/auth/decorator/scope.decorator';
import { ScopeGuard } from '../../../shared/auth/providers/guards/scope.guard';
import { Course, CourseWithSections } from '../types/course.type';
import { ErrorsInterceptor } from '../providers/interceptors/errors.interceptor';
import { FileInterceptor } from '@nestjs/platform-express';

const UPLOAD_FILE_PATH = `${tmpdir()}/courses/uploads`;

@Controller('courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'), ScopeGuard)
  @Scope('search:courses')
  @ApiOkResponse({
    type: Course,
    isArray: true,
  })
  public async findAll() {
    return await this.courseService.findAll();
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: Number })
  @UseGuards(AuthGuard('jwt'), ScopeGuard)
  @Scope('read:courses')
  @ApiOkResponse({
    type: CourseWithSections,
  })
  public async findOne(@Param('id') id: string) {
    const course = await this.courseService.findOne(+id);

    if (!course) {
      throw new NotFoundException('Course not found.');
    }

    return course;
  }

  @Post()
  @UseInterceptors(
    ErrorsInterceptor,
    FileInterceptor('image', { dest: UPLOAD_FILE_PATH }),
  )
  @UseGuards(AuthGuard('jwt'), ScopeGuard)
  @Scope('add:courses')
  @ApiCreatedResponse({
    type: CreateCourseDto,
  })
  @ApiConsumes('multipart/form-data')
  public async create(
    @Body() createCourseDto: CreateCourseDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return await this.courseService.create(createCourseDto, image);
  }
}
