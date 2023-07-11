import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../../../controllers/users.controller';
import { UsersService } from '../users.service';
import { User } from '../../../core/entities/user.entity';
import { ReqresApiService } from '../../../services/reqres-api/reqres-api.service';
import { ReqresProvider } from '../../../services/reqres-api/reqres-api.provider';
import { CreateUserDto } from '../../../core/dtos/user/create-user.dto';
import {
  reqresUserStub,
  userDtoStub,
  userResponseStub,
  userStub,
} from './stubs/userStub';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let userServiceFake: Partial<UsersService>;
  let reqresApiServiceFake: Partial<ReqresApiService>;
  let fakeReqresProvider: ReqresProvider;

  beforeEach(async () => {
    userServiceFake = {
      create: (user: CreateUserDto) => {
        return Promise.resolve(userStub() as User);
      },

      sendEmailUserCreated: () => {
        return Promise.resolve(true);
      },

      notifyNewUserCreated: (user: User): any => {
        return Promise.resolve(true);
      },
    };

    reqresApiServiceFake = {
      getUserById: (id: number) => {
        return Promise.resolve(reqresUserStub());
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: userServiceFake,
        },
        {
          provide: ReqresApiService,
          useValue: reqresApiServiceFake,
        },
        {
          provide: ReqresProvider,
          useValue: fakeReqresProvider,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create a new User', () => {
    it('shold return an CreateUserDtoResponse object', async () => {
      const user = await controller.create(userDtoStub());
      expect(user).toBeInstanceOf(Object);
      expect(user).toMatchObject(userResponseStub());
      expect(user).toHaveProperty('emailSent');
    });
  });

  describe('get user by Id with valid id', () => {
    it('shold return a user from reqres server', async () => {
      const reqresUser = await controller.findById(reqresUserStub().id);
      expect(reqresUser).toBeInstanceOf(Object);
      expect(reqresUser).toMatchObject(reqresUserStub());
    });
  });

  describe('get user by Id with invalid id', () => {
    it('shold return a user from reqres server', async () => {
      reqresApiServiceFake.getUserById = (id: number) => {
        return Promise.resolve(null);
      };
      await expect(controller.findById(12)).rejects.toThrow(NotFoundException);
    });
  });
});
