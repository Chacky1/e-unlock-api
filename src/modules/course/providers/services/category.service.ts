import { Injectable } from '@nestjs/common';
import { CategoryRepository } from '../repositories/category.repository';
import { CreateCategoryDto } from '../../dto/create-category.dto';
import { StorageService } from '../../../config/cloud/providers/services/storage.service';

const { CLOUD_STORAGE_BUCKET_NAME } = process.env;

const CLOUD_STORAGE_CATEGORIES_FOLDER = 'categories';

@Injectable()
export class CategoryService {
  public constructor(
    private readonly categoryRepository: CategoryRepository,
    private readonly storageService: StorageService,
  ) {}

  public async findAll() {
    return await this.categoryRepository.findAll();
  }

  public async findOne(id: number) {
    return await this.categoryRepository.findOne(id);
  }

  public async create(category: CreateCategoryDto, image: Express.Multer.File) {
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
