import { HttpException, Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { ReqresProvider } from './reqres-api.provider';

@Injectable()
export class ReqresApiService {
  constructor(private readonly reqresProvider: ReqresProvider) {}
  async getUserById(id: number): Promise<any> {
    try {
      const user = await axios.get(`${this.reqresProvider.getBaseUrl()}/${id}`);
      return user.data.data;
    } catch (e) {
      Logger.debug(e);
      return Promise.resolve(null);
    }
  }

  async getImage(avatarPath): Promise<any> {
    try {
      const image = await axios.get(avatarPath, {
        responseType: 'arraybuffer',
      });
      return image;
    } catch (e) {
      Logger.debug(e);
      throw new HttpException(e.response.statusText, e.response.status);
    }
  }
}
