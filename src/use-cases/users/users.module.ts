import { Module } from '@nestjs/common';
import { UsersController } from '../../controllers/users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../core/entities/user.entity';
import { UsersService } from './users.service';
import { StorageLocalService } from '../../services/storage/storage.local.service';
import { ReqresApiService } from '../../services/reqres-api/reqres-api.service';
import { ReqresProvider } from '../../services/reqres-api/reqres-api.provider';
import { Avatar } from '../../core/entities/avatar.entity';
import { NodemailerEmailService } from '../../services/mail/nodemailer/nodemailer.email.service';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserRepository } from './user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([User, Avatar, ConfigModule])],
  controllers: [UsersController],
  providers: [
    {
      provide: 'UserRepositoryInterface',
      useClass: UserRepository,
    },
    {
      provide: 'IStorageService',
      useClass: StorageLocalService,
    },
    {
      provide: ReqresApiService,
      useFactory: (reqresProvider: ReqresProvider) => {
        return new ReqresApiService(reqresProvider);
      },
      inject: [ReqresProvider],
    },
    {
      provide: 'IEmailService',
      useClass: NodemailerEmailService,
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
    ReqresProvider,
    UsersService,
  ],
})
export class UsersModule {}
