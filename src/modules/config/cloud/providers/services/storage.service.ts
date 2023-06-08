import { Injectable, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { GetSignedUrlResponse, Storage } from '@google-cloud/storage';

import { UploadResponse } from '../../types/upload.type';

const { CLOUD_PROJECT_ID, CLOUD_CREDENTIALS_FILE_PATH } = process.env;
const URL_TIME_TO_LIVE = 1000 * 60 * 10; // 10 minutes
const CLOUD_STORAGE_PROTOCOL = 'gs';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);

  private clientCredentials = this.resolveClientCredentials();
  private storage = new Storage(this.clientCredentials);

  async resolveSignedUrl(
    bucketName: string,
    filePath: string,
  ): Promise<GetSignedUrlResponse> {
    const filePathWithinBucket = filePath.replace(
      `${CLOUD_STORAGE_PROTOCOL}://${bucketName}/`,
      '',
    );

    const url = await this.storage
      .bucket(bucketName)
      .file(filePathWithinBucket)
      .getSignedUrl({
        action: 'read',
        expires: Date.now() + URL_TIME_TO_LIVE,
      });

    return url;
  }

  async upload(
    bucketName: string,
    destinationPath: string,
    file: Express.Multer.File,
  ): Promise<UploadResponse> {
    const fileParts = file.originalname.split('.');
    const fileExtension = fileParts[fileParts.length - 1];
    const fileName = `${uuidv4()}.${fileExtension}`;
    const bucketFilePath = `${destinationPath}/${fileName}`;

    const [uploadedFile] = await this.storage
      .bucket(bucketName)
      .upload(file.path, {
        destination: bucketFilePath,
      });

    const [publicUrl] = await this.resolveSignedUrl(
      bucketName,
      uploadedFile.name,
    );

    const responseData = {
      path: `${CLOUD_STORAGE_PROTOCOL}://${bucketName}/${bucketFilePath}`,
      url: publicUrl,
      name: uploadedFile.name,
    };

    return responseData;
  }

  private resolveClientCredentials() {
    const projectId = CLOUD_PROJECT_ID;
    const credentialsKeyFilePath = CLOUD_CREDENTIALS_FILE_PATH;

    if (!projectId || !credentialsKeyFilePath) {
      this.logger.warn('Missing Cloud credentials');
    }

    return {
      projectId,
      keyFilename: credentialsKeyFilePath,
    };
  }
}
