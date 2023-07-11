import { Test, TestingModule } from '@nestjs/testing';
import { AvatarService } from '../avatar.service';
import { AvatarRepositoryInteface } from '../../../core/interfaces/avatar.repository.interface';
import { Avatar } from '../../../core/entities/avatar.entity';
import { avatarStub, imageStub } from '../stubs/avatarStubs';
import { ReqresApiService } from '../../../services/reqres-api/reqres-api.service';
import { ReqresProvider } from '../../../services/reqres-api/reqres-api.provider';
import { IStorageService } from '../../../core/interfaces/storage.interface';
import { deleteStubTrue } from '../../../use-cases/users/tests/stubs/deteteStub';
import {
  reqresUserStub,
  userStub,
} from '../../../use-cases/users/tests/stubs/userStub';
import { InternalServerErrorException } from '@nestjs/common';

describe('AvatarService', () => {
  let service: AvatarService;
  let fakeAvatarRepository: Partial<AvatarRepositoryInteface>;
  let fakeReqresApiService: Partial<ReqresApiService>;
  let fakeReqresProvider: ReqresProvider;
  let fakeStorageService: Partial<IStorageService>;

  beforeEach(async () => {
    fakeAvatarRepository = {
      findByCondition: () => Promise.resolve(avatarStub() as Avatar),
      create: () => {
        return Promise.resolve(avatarStub() as Avatar);
      },
      remove: () => {
        return Promise.resolve(deleteStubTrue());
      },
    };

    fakeStorageService = {
      uploadFile: () => {
        return Promise.resolve(true);
      },

      getFileInBase64: () => {
        return imageStub();
      },

      deleteFile: () => {
        return Promise.resolve(true);
      },
    };

    fakeReqresApiService = {
      getImage: () => {
        return Promise.resolve(imageStub());
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AvatarService,
        {
          provide: 'AvatarRepositoryInterface',
          useValue: fakeAvatarRepository,
        },
        {
          provide: 'IStorageService',
          useValue: fakeStorageService,
        },
        {
          provide: ReqresApiService,
          useValue: fakeReqresApiService,
        },
        {
          provide: ReqresProvider,
          useValue: fakeReqresProvider,
        },
      ],
    }).compile();

    service = module.get<AvatarService>(AvatarService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create new Avatar', () => {
    it('should return a new Avatar', async () => {
      const avatar = await service.create(avatarStub());
      expect(avatar).toBeDefined();
      expect(avatar).toBeInstanceOf(Object);
      expect(avatar.hash).toEqual(avatarStub().hash);
      expect(avatar.userId).toEqual(avatarStub().userId);
    });
  });

  describe('find Avatar by valid id', () => {
    it('should return a new Avatar', async () => {
      const avatar = await service.findById(1);
      expect(avatar).toBeDefined();
      expect(avatar).toBeInstanceOf(Object);
      expect(avatar.hash).toEqual(avatarStub().hash);
      expect(avatar.userId).toEqual(avatarStub().userId);
    });
  });

  describe('find Avatar by invbalid id', () => {
    it('should return a NotFoundException', async () => {
      fakeAvatarRepository.findByCondition = () => Promise.resolve(null);
      const avatar = await service.findById(1);
      expect(avatar).toBe(null);
    });
  });

  describe('delete Avatar', () => {
    it('should return a new Avatar', async () => {
      const response = await service.delete(1);
      expect(response).toBeDefined();
      expect(response).toBeInstanceOf(Object);
      expect(response).toMatchObject(deleteStubTrue());
    });
  });

  describe('get Avatar with user stored', () => {
    it('should return a Avatar', async () => {
      const avatar = await service.getAvatar(reqresUserStub());
      expect(avatar).toBeInstanceOf(Object);
      expect(avatar).toHaveProperty('userId');
      expect(avatar).toHaveProperty('avatar');
      expect(avatar.userId).toEqual(reqresUserStub().id);
    });
  });

  describe('get Avatar without user stored', () => {
    it('should return a Avatar', async () => {
      fakeAvatarRepository.findByCondition = () => {
        return null;
      };
      const avatar = await service.getAvatar(reqresUserStub());
      expect(avatar).toBeInstanceOf(Object);
      expect(avatar).toHaveProperty('userId');
      expect(avatar).toHaveProperty('avatar');
      expect(avatar.userId).toEqual(reqresUserStub().id);
    });
  });

  describe('store Image', () => {
    it('should return true', async () => {
      const response = await service.storeImage(userStub(), imageStub());
      expect(response).toEqual(true);
    });
  });

  describe('get Image', () => {
    it('should return an image', async () => {
      const response = await service.getImage(avatarStub().userId);
      expect(response).toMatch(imageStub());
    });
  });

  describe('delete valid Image', () => {
    it('should return true', async () => {
      const response = await service.deleteImage(avatarStub().userId);
      expect(response).toEqual(true);
    });
  });

  describe('delete invalid Image', () => {
    it('should return false', async () => {
      fakeStorageService.deleteFile = () => {
        throw new InternalServerErrorException();
      };

      const response = await service.deleteImage(avatarStub().userId);
      expect(response).toEqual(false);
    });
  });
});
