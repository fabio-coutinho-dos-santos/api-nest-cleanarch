import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users.service';
import { UserRepositoryInterface } from '../../../core/interfaces/user.repository.interface';
import { User } from '../../../core/entities/user.entity';
import { BadRequestException } from '@nestjs/common';
import { DeleteResult } from 'typeorm';
import { userDtoStub, userStub } from './stubs/userStub';
import { deleteStubFalse, deleteStubTrue } from './stubs/deteteStub';
import { CreateUserDto } from '../../../core/dtos/user/create-user.dto';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { IEmailService } from '../../../core/interfaces/email.inteface';

describe('UsersService', () => {
  let service: UsersService;
  let fakeUserRepository: Partial<UserRepositoryInterface>;
  const newUser: Partial<User> = userStub();
  let emailServiceFake: IEmailService;

  beforeEach(async () => {
    fakeUserRepository = {
      findByCondition: () => Promise.resolve(newUser as User),
      create: (newUser) => Promise.resolve(newUser),
      remove: () => Promise.resolve(deleteStubTrue()),
      findOneWithRelations: () => Promise.resolve(newUser as User),
    };

    emailServiceFake = {
      sendEmail: () => {
        return Promise.resolve(true);
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [
        {
          provide: 'UserRepositoryInterface',
          useValue: fakeUserRepository,
        },
        {
          provide: 'IEmailService',
          useValue: emailServiceFake,
        },
        {
          provide: 'QUEUE_SERVICE',
          useFactory: (configService: ConfigService) => {
            const user = configService.get('RABBITMQ_USER');
            const password = configService.get('RABBITMQ_PASSWORD');
            const host = configService.get('RABBITMQ_HOST');
            const queueName = configService.get('RABBITMQ_QUEUE_NAME');
            return ClientProxyFactory.create({
              transport: Transport.RMQ,
              options: {
                urls: [`amqp://${user}:${password}@${host}`],
                queue: queueName,
                queueOptions: {
                  durable: false,
                },
              },
            });
          },
          inject: [ConfigService],
        },
        UsersService,
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Create User', () => {
    it('should throw an error when callled with an email in use', async () => {
      await expect(service.create(new CreateUserDto())).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should return an new user when called with new email', async () => {
      fakeUserRepository.findByCondition = () => Promise.resolve(null);
      const userCreated = await service.create(userDtoStub());
      expect(userCreated).toBeDefined();
      expect(userCreated).toBeInstanceOf(Object);
    });
  });

  describe('Delete User', () => {
    it('should return true when called with valid id', async () => {
      const response = await service.remove('1');
      expect(response).toEqual(deleteStubTrue());
    });

    it('should return false when called with invalid id', async () => {
      fakeUserRepository.remove = (): Promise<DeleteResult> => {
        return Promise.resolve(deleteStubFalse());
      };
      const response = await service.remove('1');
      expect(response).toEqual(deleteStubFalse());
    });
  });

  describe('sendEmailUserCreated', () => {
    it('should return true or false', async () => {
      const response = await service.sendEmailUserCreated(userStub() as User);
      expect(response).toEqual(true);
    });
  });
});
