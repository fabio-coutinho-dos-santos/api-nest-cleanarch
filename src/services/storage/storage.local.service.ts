import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { IStorageService } from '../../core/interfaces/storage.interface';
import * as fs from 'fs';
import { promises as fsPromises } from 'fs';

@Injectable()
export class StorageLocalService implements IStorageService {
  uploadFile(imageReceived: string, hash: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      try {
        const filePath = `./uploads/${hash}.png`;
        const writeStream = fs.createWriteStream(filePath);
        writeStream.write(imageReceived);
        writeStream.end();

        writeStream.on('finish', () => {
          resolve(true);
        });

        writeStream.on('error', (error) => {
          Logger.debug(error);
          reject(error);
        });
      } catch (error) {
        Logger.debug(error);
        throw new InternalServerErrorException();
      }
    });
  }

  async getFileInBase64(userId) {
    try {
      const filePath = `./uploads/${userId}.png`;
      const image = await this.findFile(filePath);
      return image.toString('base64');
    } catch (e) {
      Logger.debug(e);
      throw new InternalServerErrorException();
    }
  }

  async findFile(filePath): Promise<Buffer> {
    try {
      const data = await fsPromises.readFile(filePath);
      return data;
    } catch (error) {
      Logger.debug(error);
      throw new InternalServerErrorException();
    }
  }

  async deleteFile(hash: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const filePath = `./uploads/${hash}.png`;
      fs.unlink(filePath, (err) => {
        if (err) {
          Logger.debug(err);
          reject(new InternalServerErrorException());
        }
        resolve(true);
      });
    });
  }
}
