/* eslint-disable @typescript-eslint/no-unused-vars */
import { TestingModule, Test } from '@nestjs/testing';
import { Storage } from '@google-cloud/storage';
import { StorageService } from '../../../../../../../../src/modules/config/cloud/providers/services/storage.service';

jest.mock('@google-cloud/storage');
jest.mock('uuid');

describe('StorageService', () => {
  let storageService: StorageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StorageService],
    }).compile();

    storageService = module.get<StorageService>(StorageService);
  });

  it('should be defined', () => {
    expect(storageService).toBeDefined();
  });

  describe('resolveSignedUrl', () => {
    it('should return a signed url', async () => {
      const cloudStorage = new Storage();
      const bucketName = 'bucketName';
      const filePath = 'filePath';

      await storageService.resolveSignedUrl(bucketName, filePath);

      expect(cloudStorage.bucket).toHaveBeenCalledWith(bucketName);
      expect(cloudStorage.bucket(bucketName).file).toHaveBeenCalledWith(
        filePath,
      );
      expect(
        cloudStorage.bucket(bucketName).file(filePath).getSignedUrl,
      ).toHaveBeenCalled();
    });
  });

  describe('upload', () => {
    it('should return an upload response', async () => {
      const cloudStorage = new Storage();
      const bucketName = 'bucketName';
      const destinationPath = 'destinationPath';
      const file = {
        path: 'path',
        originalname: 'originalname.ext',
      } as Express.Multer.File;
      const fileName = 'uuid.ext';
      const uploadResponse = {
        path: `gs://${bucketName}/${destinationPath}/${fileName}`,
        url: 'url',
        name: 'name',
      };

      const result = await storageService.upload(
        bucketName,
        destinationPath,
        file,
      );

      expect(result.path).toEqual(uploadResponse.path);
      expect(cloudStorage.bucket).toHaveBeenCalledWith(bucketName);
      expect(cloudStorage.bucket(bucketName).upload).toHaveBeenCalledWith(
        file.path,
        {
          destination: `${destinationPath}/${fileName}`,
        },
      );
    });
  });
});
