import { BaseAbstractRepository } from '../../core/abstracts/base.abstract.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { AvatarRepositoryInteface } from '../../core/interfaces/avatar.repository.interface';
import { Repository } from 'typeorm';
import { Avatar } from '../../core/entities/avatar.entity';

export class AvatarRepository
  extends BaseAbstractRepository<Avatar>
  implements AvatarRepositoryInteface
{
  constructor(
    @InjectRepository(Avatar)
    private readonly avatarRepository: Repository<Avatar>,
  ) {
    super(avatarRepository);
  }
}
