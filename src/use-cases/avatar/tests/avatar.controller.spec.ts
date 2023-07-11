import { Test, TestingModule } from '@nestjs/testing';
import { AvatarController } from '../../../controllers/avatar.controller';
import { AvatarService } from '../avatar.service';
import { ReqresApiService } from '../../../services/reqres-api/reqres-api.service';
import { ReqresProvider } from '../../../services/reqres-api/reqres-api.provider';
import { Avatar } from '../../../core/entities/avatar.entity';
import { avatarStub, avatarStubReponse } from '../stubs/avatarStubs';
import { reqresUserStub } from '../../../use-cases/users/tests/stubs/userStub';
import { NotFoundException } from '@nestjs/common';
import { deleteStubTrue } from '../../../use-cases/users/tests/stubs/deteteStub';

describe('AvatarController', () => {
  let controller: AvatarController;
  let reqresApiServiceFake: Partial<ReqresApiService>;
  let avatarServiceFake: Partial<AvatarService>;

  beforeEach(async () => {
    avatarServiceFake = {
      getAvatar: () => {
        return Promise.resolve(avatarStubReponse());
      },

      findById: () => {
        return Promise.resolve(avatarStub() as Avatar);
      },

      deleteImage: () => {
        return Promise.resolve(true);
      },

      delete: () => {
        return Promise.resolve(deleteStubTrue());
      },
    };

    reqresApiServiceFake = {
      getUserById: () => {
        return Promise.resolve(reqresUserStub());
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AvatarController],
      providers: [
        {
          provide: ReqresApiService,
          useValue: reqresApiServiceFake,
        },
        {
          provide: AvatarService,
          useValue: avatarServiceFake,
        },
        ReqresProvider,
      ],
    }).compile();

    controller = module.get<AvatarController>(AvatarController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAvatar with valid id', () => {
    it('should return a new avatar', async () => {
      const avatar = await controller.findAvatar(avatarStub().userId);
      expect(avatar).toBeInstanceOf(Object);
      expect(avatar).toHaveProperty('userId');
      expect(avatar.userId).toEqual(avatarStub().userId);
      expect(avatar).toHaveProperty('avatar');
    });
  });

  describe('findAvatar with invalid id', () => {
    it('should return a new NotFoundException', async () => {
      const invalidId = -1;
      reqresApiServiceFake.getUserById = () => {
        return Promise.resolve(null);
      };
      await expect(controller.findAvatar(invalidId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('deleteAvatar with valid id', () => {
    it('should return deleted avatar response', async () => {
      const deletedResponse = await controller.deleteAvatar(
        avatarStub().userId.toString(),
      );
      expect(deletedResponse).toBeInstanceOf(Object);
      expect(deletedResponse.avatarDeleted).toEqual(true);
      expect(deletedResponse.imageDeleted).toEqual(true);
    });
  });

  describe('deleteAvatar with invalid id', () => {
    it('should return a new NotFoundException', async () => {
      const invalidId = '-1';
      avatarServiceFake.findById = () => {
        return Promise.resolve(null);
      };
      await expect(controller.deleteAvatar(invalidId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
