import { Injectable } from '@nestjs/common';
import { LessonRepository } from '../repositories/lesson.repository';
import { CreateLessonDto } from '../../dto/create-lesson.dto';
import { StorageService } from '../../../config/cloud/providers/services/storage.service';

const { CLOUD_STORAGE_BUCKET_NAME } = process.env;

const CLOUD_STORAGE_LESSONS_FOLDER = 'lessons';

@Injectable()
export class LessonService {
  public constructor(
    private readonly lessonRepository: LessonRepository,
    private readonly storageService: StorageService,
  ) {}

  public async create(lesson: CreateLessonDto, video: Express.Multer.File) {
    if (!video) {
      return await this.lessonRepository.create(lesson);
    }

    const uploadedVideo = await this.storageService.upload(
      CLOUD_STORAGE_BUCKET_NAME,
      CLOUD_STORAGE_LESSONS_FOLDER,
      video,
    );

    return await this.lessonRepository.create(lesson, uploadedVideo.path);
  }
}
