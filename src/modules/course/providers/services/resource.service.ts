import { Injectable } from '@nestjs/common';
import { Resource } from '@prisma/client';

import { StorageService } from '../../../config/cloud/providers/services/storage.service';
import { CreateResourceDto } from '../../dto/create-resource.dto';
import { ResourceRepository } from '../repositories/resource.repository';

const { CLOUD_STORAGE_BUCKET_NAME } = process.env;

const CLOUD_STORAGE_RESOURCES_FOLDER = 'resources';

@Injectable()
export class ResourceService {
  public constructor(
    private readonly resourceRepository: ResourceRepository,
    private readonly storageService: StorageService,
  ) {}

  public async search(search: ResourceSearch) {
    const resources = await this.resourceRepository.search(search);

    if (!resources) {
      return [];
    }

    const resourcesWithSignedUrls = [];

    for (const resource of resources) {
      if (!resource.url) {
        resourcesWithSignedUrls.push(resource);
        continue;
      }

      const [signedUrl] = await this.storageService.resolveSignedUrl(
        CLOUD_STORAGE_BUCKET_NAME,
        resource.url,
      );

      resourcesWithSignedUrls.push({
        ...resource,
        url: signedUrl,
      });
    }

    return resourcesWithSignedUrls;
  }

  public async create(
    createResourceDto: CreateResourceDto,
    file?: Express.Multer.File,
  ): Promise<Resource> {
    if (!file) {
      return await this.resourceRepository.create(createResourceDto);
    }

    const uploadedResource = await this.storageService.upload(
      CLOUD_STORAGE_BUCKET_NAME,
      CLOUD_STORAGE_RESOURCES_FOLDER,
      file,
    );

    const resource = await this.resourceRepository.create(
      createResourceDto,
      uploadedResource?.path || undefined,
    );

    return resource;
  }
}

export interface ResourceSearch {
  id?: number;
  name?: string;
  lessonId?: number;
}
