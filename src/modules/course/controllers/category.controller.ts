import {
  Controller,
  Get,
  UseGuards,
  Param,
  NotFoundException,
  Post,
  Body,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiParam } from '@nestjs/swagger';
import { ScopeGuard } from '../../../shared/auth/providers/guards/scope.guard';
import { Scope } from '../../../shared/auth/decorator/scope.decorator';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { CategoryService } from '../providers/services/category.service';

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
  @UseGuards(AuthGuard('jwt'), ScopeGuard)
  @Scope('add:categories')
  public async create(@Body() createCategoryDto: CreateCategoryDto) {
    return await this.categoryService.create(createCategoryDto);
  }
}
