import { Injectable } from '@nestjs/common';
import { Category } from '@prisma/client';
import { DatabaseService } from '../../../../modules/config/database/providers/services/database.service';
import { CreateCategoryDto } from '../../dto/create-category.dto';

@Injectable()
export class CategoryRepository {
  public constructor(private readonly databaseService: DatabaseService) {}

  public async findAll(): Promise<Category[]> {
    const category = await this.databaseService.category.findMany();

    return category;
  }

  public async findOne(id: number): Promise<Category> {
    const course = await this.databaseService.category.findUnique({
      where: {
        id,
      },
    });

    return course;
  }

  public async create(
    createCategoryDto: CreateCategoryDto,
    imagePath?: string,
  ): Promise<Category> {
    const course = await this.databaseService.category.create({
      data: {
        ...createCategoryDto,
        imageUrl: imagePath,
      },
    });

    return course;
  }
}
