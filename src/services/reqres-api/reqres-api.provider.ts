import { Injectable } from '@nestjs/common';

@Injectable()
export class ReqresProvider {
  getBaseUrl() {
    return process.env.REQRES_URL_BASE;
  }
}
