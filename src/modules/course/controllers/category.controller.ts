import {
  Controller,
  Get,
  UseGuards,
  Param,
  NotFoundException,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { tmpdir } from 'os';
import { ScopeGuard } from '../../../shared/auth/providers/guards/scope.guard';
import { Scope } from '../../../shared/auth/decorator/scope.decorator';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { CategoryService } from '../providers/services/category.service';
import { ErrorsInterceptor } from '../../../shared/interceptors/errors.interceptor';
import { Category } from '../types/category.type';
import { Course } from '../types/course.type';
import { CourseService } from '../providers/services/course.service';

const UPLOAD_FILE_PATH = `${tmpdir()}/categories/uploads`;

@Controller('categories')
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly courseService: CourseService,
  ) {}

  @Get()
  @UseGuards(AuthGuard('jwt'), ScopeGuard)
  @Scope('search:categories')
  @ApiOkResponse({ type: Category, isArray: true })
  public async findAll() {
    return await this.categoryService.findAll();
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: Number })
  @UseGuards(AuthGuard('jwt'), ScopeGuard)
  @Scope('read:categories')
  @ApiOkResponse({ type: Category })
  public async findOne(@Param('id') id: string) {
    const category = await this.categoryService.findOne(+id);

    if (!category) {
      throw new NotFoundException('Category not found.');
    }

    return category;
  }

  @Post()
  @UseInterceptors(
    ErrorsInterceptor,
    FileInterceptor('image', { dest: UPLOAD_FILE_PATH }),
  )
  @UseGuards(AuthGuard('jwt'), ScopeGuard)
  @Scope('add:categories')
  @ApiCreatedResponse({ type: CreateCategoryDto })
  @ApiConsumes('multipart/form-data')
  public async create(
    @Body() createCategoryDto: CreateCategoryDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return await this.categoryService.create(createCategoryDto, image);
  }

  @Get(':id/courses')
  @UseInterceptors(ErrorsInterceptor)
  @ApiParam({ name: 'id', type: Number })
  @UseGuards(AuthGuard('jwt'), ScopeGuard)
  @Scope('search:categories.courses')
  @ApiOkResponse({ type: Course, isArray: true })
  public async findCourses(@Param('id') id: string) {
    const courses = await this.courseService.search({
      categoryId: +id,
    });

    return courses;
  }
}
