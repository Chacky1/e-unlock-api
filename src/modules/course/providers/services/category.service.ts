import { Injectable } from '@nestjs/common';
import { CategoryRepository } from '../repositories/category.repository';
import { CreateCategoryDto } from '../../dto/create-category.dto';
import { StorageService } from '../../../config/cloud/providers/services/storage.service';
import { Category } from '../../types/category.type';

const { CLOUD_STORAGE_BUCKET_NAME } = process.env;

const CLOUD_STORAGE_CATEGORIES_FOLDER = 'categories';

@Injectable()
export class CategoryService {
  public constructor(
    private readonly categoryRepository: CategoryRepository,
    private readonly storageService: StorageService,
  ) {}

  public async findAll(): Promise<Category[]> {
    const categories = await this.categoryRepository.findAll();

    if (!categories) {
      return undefined;
    }

    const categoriesWithImages: Category[] = [];
    for (const category of categories) {
      if (!category.imageUrl) {
        categoriesWithImages.push(category);
        continue;
      }

      const [categoryImage] = await this.storageService.resolveSignedUrl(
        CLOUD_STORAGE_BUCKET_NAME,
        category.imageUrl,
      );

      categoriesWithImages.push({
        ...category,
        image: categoryImage,
      });
    }

    return categoriesWithImages;
  }

  public async findOne(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOne(id);

    if (!category) {
      return undefined;
    }

    if (!category.imageUrl) {
      return category;
    }

    const [categoryImage] = await this.storageService.resolveSignedUrl(
      CLOUD_STORAGE_BUCKET_NAME,
      category.imageUrl,
    );

    return {
      ...category,
      image: categoryImage,
    };
  }

  public async create(
    category: CreateCategoryDto,
    image: Express.Multer.File,
  ): Promise<Category> {
    if (!image) {
      return await this.categoryRepository.create(category);
    }

    const uploadedImage = await this.storageService.upload(
      CLOUD_STORAGE_BUCKET_NAME,
      CLOUD_STORAGE_CATEGORIES_FOLDER,
      image,
    );

    return await this.categoryRepository.create(category, uploadedImage.path);
  }
}
