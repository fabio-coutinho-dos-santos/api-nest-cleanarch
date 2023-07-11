import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { AvatarRepositoryInteface } from '../../core/interfaces/avatar.repository.interface';
import { IStorageService } from '../../core/interfaces/storage.interface';
import { ReqresApiService } from '../../services/reqres-api/reqres-api.service';
import { createHash } from 'crypto';

@Injectable()
export class AvatarService {
  constructor(
    @Inject('AvatarRepositoryInterface')
    private readonly avatarRepository: AvatarRepositoryInteface,
    @Inject('IStorageService') private readonly storageService: IStorageService,
    private readonly reqresApiService: ReqresApiService,
  ) {}

  async create(newAvatar) {
    return await this.avatarRepository.create(newAvatar);
  }

  async delete(id: any) {
    return await this.avatarRepository.remove(id);
  }

  async deleteImage(userId: number): Promise<boolean> {
    try {
      const avatar = await this.avatarRepository.findByCondition({
        userId: userId,
      });
      await this.storageService.deleteFile(avatar.hash);
    } catch (error) {
      Logger.debug(error);
      return Promise.resolve(false);
    }
    return Promise.resolve(true);
  }

  async getAvatar(user) {
    const avatar = await this.avatarRepository.findByCondition({
      userId: user.id,
    });
    if (avatar) {
      const imageBase64 = await this.getImage(avatar.hash);
      return {
        userId: user.id,
        avatar: imageBase64,
      };
    } else {
      const image = await this.reqresApiService.getImage(user.avatar);
      const hash = this.buildHash(user.first_name);
      await this.storeImage(image, hash);
      const imageBase64 = await this.getImage(hash);
      const newAvatar = {
        userId: user.id,
        hash: hash,
      };
      await this.create(newAvatar);
      return {
        userId: user.id,
        avatar: imageBase64,
      };
    }
  }

  private buildHash(input: string): string {
    const hash = createHash('sha256'); // Specify the hashing algorithm here (e.g., 'sha256', 'md5', etc.)
    hash.update(input);
    return hash.digest('hex');
  }

  async findById(id: number) {
    const avatar = await this.avatarRepository.findByCondition({
      userId: id,
    });
    return avatar;
  }

  async getImage(userId) {
    try {
      return this.storageService.getFileInBase64(userId);
    } catch (e) {
      Logger.debug(e);
      throw new InternalServerErrorException();
    }
  }

  async storeImage(image, hash): Promise<boolean> {
    try {
      return await this.storageService.uploadFile(image.data, hash);
    } catch (error) {
      Logger.debug(error);
      return Promise.reject(error);
    }
  }
}
