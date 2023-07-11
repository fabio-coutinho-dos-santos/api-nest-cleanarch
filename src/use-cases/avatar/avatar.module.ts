import { Module } from '@nestjs/common';
import { AvatarService } from './avatar.service';
import { AvatarController } from '../../controllers/avatar.controller';
import { StorageLocalService } from '../../services/storage/storage.local.service';
import { ReqresApiService } from '../../services/reqres-api/reqres-api.service';
import { ReqresProvider } from '../../services/reqres-api/reqres-api.provider';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Avatar } from '../../core/entities/avatar.entity';
import { AvatarRepository } from './avatar.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Avatar])],
  controllers: [AvatarController],
  providers: [
    {
      provide: 'AvatarRepositoryInterface',
      useClass: AvatarRepository,
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
    ReqresProvider,
    AvatarService,
  ],
})
export class AvatarModule {}
