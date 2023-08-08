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
import { ApiConsumes, ApiParam } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { tmpdir } from 'os';
import { ScopeGuard } from '../../../shared/auth/providers/guards/scope.guard';
import { Scope } from '../../../shared/auth/decorator/scope.decorator';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { CategoryService } from '../providers/services/category.service';
import { ErrorsInterceptor } from '../providers/interceptors/errors.interceptor';

const UPLOAD_FILE_PATH = `${tmpdir()}/categories/uploads`;

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'), ScopeGuard)
  @Scope('search:categories')
  public async findAll() {
    return await this.categoryService.findAll();
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: Number })
  @UseGuards(AuthGuard('jwt'), ScopeGuard)
  @Scope('read:categories')
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
  @ApiConsumes('multipart/form-data')
  public async create(
    @Body() createCategoryDto: CreateCategoryDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return await this.categoryService.create(createCategoryDto, image);
  }
}
