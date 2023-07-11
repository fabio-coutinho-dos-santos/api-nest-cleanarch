import { Module } from '@nestjs/common';
import { ReqresApiService } from './reqres-api.service';
import { ReqresProvider } from './reqres-api.provider';

@Module({
  providers: [ReqresApiService, ReqresProvider],
  exports: [ReqresApiService, ReqresProvider],
})
export class ReqresApiModule {}
