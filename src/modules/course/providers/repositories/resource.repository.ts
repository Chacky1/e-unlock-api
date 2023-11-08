import { Injectable } from '@nestjs/common';

import { DatabaseService } from '../../../config/database/providers/services/database.service';
import { ResourceNotFoundError } from '../../../../shared/error/types/resource-not-found.error';
import { CreateResourceDto } from '../../dto/create-resource.dto';
import { Resource } from '../../types/resource.type';
import { ResourceSearch } from '../services/resource.service';

@Injectable()
export class ResourceRepository {
  public constructor(private readonly databaseService: DatabaseService) {}

  public async search(search: ResourceSearch): Promise<Resource[]> {
    const resource = await this.databaseService.resource.findMany({
      where: {
        id: search.id ?? undefined,
        name: search.name ?? undefined,
        lessonId: search.lessonId ?? undefined,
      },
    });

    return resource;
  }

  public async create(
    createResourceDto: CreateResourceDto,
    resourcePath?: string,
  ): Promise<Resource> {
    const lesson = await this.databaseService.lesson.findUnique({
      where: { id: createResourceDto.lessonId },
    });

    if (!lesson) {
      throw new ResourceNotFoundError(
        'LESSON',
        `${createResourceDto.lessonId}`,
      );
    }

    const resource = await this.databaseService.resource.create({
      data: {
        ...createResourceDto,
        url: resourcePath,
      },
    });

    return resource;
  }
}
