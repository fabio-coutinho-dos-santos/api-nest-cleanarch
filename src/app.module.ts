import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './use-cases/users/users.module';
import { DatabaseModule } from './frameworks/database/database.module';
import { ReqresApiModule } from './services/reqres-api/reqres-api.module';
import { AvatarModule } from './use-cases/avatar/avatar.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule,
    UsersModule,
    DatabaseModule,
    ReqresApiModule,
    AvatarModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
