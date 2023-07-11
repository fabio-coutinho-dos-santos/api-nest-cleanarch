import { Test, TestingModule } from '@nestjs/testing';
import { StorageLocalService } from './storage.local.service';
import { IStorageService } from '../../core/interfaces/storage.interface';
import { InternalServerErrorException } from '@nestjs/common';

describe('Storage local services', () => {
  let service: IStorageService;
  const imageData = new Uint8Array([
    255,
    0,
    0,
    255, // Red pixel
    0,
    255,
    0,
    255, // Green pixel
    0,
    0,
    255,
    255, // Blue pixel
    255,
    255,
    0,
    255, // Yellow pixel
  ]);
  const validHash =
    '3d28271ec52e3d07fe14f5f16d01f2c09cbcac1949f9904b305136d0edbee12d';
  const filePath = `./uploads-test/${validHash}.png`;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'IStorageService',
          useValue: StorageLocalService,
        },
        StorageLocalService,
      ],
    }).compile();

    service = module.get<IStorageService>(StorageLocalService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('uploadFile with valid image', () => {
    it('should return true', async () => {
      const image = await service.uploadFile(imageData, validHash);
      expect(image).toEqual(true);
    });
  });

  describe('uploadFile with invalid image', () => {
    it('should return true', async () => {
      await expect(service.uploadFile(-1, 'invalidHash')).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('getFileInBase64 with valid path', () => {
    it('should return a image', async () => {
      const userIdValid = 12;
      let image;
      try {
        image = await service.getFileInBase64(userIdValid);
      } catch (error) {
        image = true;
      }
      expect(image).toEqual(true);
    });
  });

  describe('getFileInBase64 with invalid path', () => {
    it('should return a InternalServerException', async () => {
      const userIdValid = 12;
      await expect(service.getFileInBase64(userIdValid)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('findFile with valid path', () => {
    it('should return a file', async () => {
      const file = await service.findFile(filePath);
      expect(file).toBeDefined();
    });
  });

  describe('findFile with invalid path', () => {
    it('should return an InternalServerErrorException ', async () => {
      await expect(service.findFile('invalidPath')).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('deleteFile', () => {
    it('should return true ', async () => {
      const resp = await service.deleteFile(validHash);
      expect(resp).toBeDefined();
    });
  });
});
