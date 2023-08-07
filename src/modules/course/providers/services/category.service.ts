import { Injectable } from '@nestjs/common';
import { CategoryRepository } from '../repositories/category.repository';
import { CreateCategoryDto } from '../../dto/create-category.dto';

@Injectable()
export class CategoryService {
  public constructor(private readonly categoryRepository: CategoryRepository) {}

  public async findAll() {
    return await this.categoryRepository.findAll();
  }

  public async findOne(id: number) {
    return await this.categoryRepository.findOne(id);
  }

  public async create(category: CreateCategoryDto) {
    return await this.categoryRepository.create(category);
  }
}
