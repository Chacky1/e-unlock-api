const storageMock = {
  bucket: jest.fn().mockReturnThis(),
  upload: jest.fn().mockResolvedValue([{ name: 'url' }]),
  file: jest.fn().mockReturnThis(),
  getSignedUrl: jest.fn().mockResolvedValue([]),
};

const StorageMock = jest.fn(() => storageMock);

module.exports = { Storage: StorageMock };
