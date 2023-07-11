import {
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { AvatarService } from '../use-cases/avatar/avatar.service';
import { ApiPrefix } from '../constant/common';
import { ApiTags } from '@nestjs/swagger';
import { ReqresApiService } from '../services/reqres-api/reqres-api.service';

@Controller(`${ApiPrefix.Version}/users`)
@ApiTags('Avatars')
export class AvatarController {
  constructor(
    private readonly avatarService: AvatarService,
    private readonly reqresApiService: ReqresApiService,
  ) {}

  @Get(':id/avatar')
  async findAvatar(@Param('id') id: number): Promise<any> {
    const user = await this.reqresApiService.getUserById(id);
    if (!user) {
      throw new NotFoundException('User Not Found');
    }
    return this.avatarService.getAvatar(user);
  }

  @Delete(':id/avatar')
  async deleteAvatar(@Param('id') id: string): Promise<any> {
    const avatar = await this.avatarService.findById(parseInt(id));
    if (!avatar) {
      throw new NotFoundException('User Not Found');
    }
    const imageDeleted = await this.avatarService.deleteImage(avatar.userId);
    const response = await this.avatarService.delete(avatar._id);
    const avatarDeleted = response.raw.deletedCount;
    const result = {
      avatarDeleted: avatarDeleted === 1 ? true : false,
      imageDeleted: imageDeleted,
    };

    return result;
  }
}
