import { Test, TestingModule } from '@nestjs/testing';
import { ReqresApiService } from './reqres-api.service';
import { ReqresProvider } from './reqres-api.provider';
import { HttpException } from '@nestjs/common';

describe('ReqresApiService', () => {
  let service: ReqresApiService;
  let reqresProvider: ReqresProvider;
  const validId = 1;
  const invalidId = -1;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReqresApiService, ReqresProvider],
    }).compile();

    service = module.get<ReqresApiService>(ReqresApiService);
    reqresProvider = module.get<ReqresProvider>(ReqresProvider);
    reqresProvider.getBaseUrl = () => {
      return 'https://reqres.in/api/users';
    };
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUserById with valid id', () => {
    it('should return a reqres user', async () => {
      const user = await service.getUserById(validId);
      expect(user).toBeInstanceOf(Object);
      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('first_name');
      expect(user).toHaveProperty('last_name');
      expect(user).toHaveProperty('avatar');
    });
  });

  describe('getUserById with invalid id', () => {
    it('should return null', async () => {
      const response = await service.getUserById(invalidId);
      expect(response).toBe(null);
    });
  });

  describe('getImage avatar with valid Path', () => {
    it('should return a image', async () => {
      const user = await service.getUserById(validId);
      const image = await service.getImage(user.avatar);
      expect(image).toBeDefined();
    });
  });

  describe('getImage avatar with invalid Path', () => {
    it('should return a new HttpEdxception', async () => {
      await expect(service.getImage('')).rejects.toThrow(HttpException);
    });
  });
});
