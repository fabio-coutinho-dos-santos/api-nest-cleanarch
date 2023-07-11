import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { User } from '../../core/entities/user.entity';
import { UserRepositoryInterface } from '../../core/interfaces/user.repository.interface';
import { CreateUserDto } from '../../core/dtos/user/create-user.dto';
import { ClientProxy } from '@nestjs/microservices';
import { IEmailService } from 'src/core/interfaces/email.inteface';

@Injectable()
export class UsersService {
  constructor(
    @Inject('UserRepositoryInterface')
    private readonly userRepository: UserRepositoryInterface,
    @Inject('IEmailService') private readonly emailService: IEmailService,
    @Inject('QUEUE_SERVICE') private readonly queueClient: ClientProxy,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = new User();
    user.email = createUserDto.email;
    user.first_name = createUserDto.first_name;
    user.last_name = createUserDto.last_name;
    user.id = await this.getUserId();

    const userFound = await this.userRepository.findByCondition({
      email: user.email,
    });

    if (userFound) {
      throw new BadRequestException('Email in use');
    }

    return this.userRepository.create(user);
  }

  async getUserId() {
    const lastUser = await this.userRepository.findOneWithRelations({
      order: { id: 'DESC' },
    });

    if (!lastUser) {
      return 1;
    } else {
      return lastUser.id + 1;
    }
  }

  remove(id: string) {
    return this.userRepository.remove(id);
  }

  async sendEmailUserCreated(user: User): Promise<boolean> {
    try {
      await this.emailService.sendEmail(
        user.email,
        'User created',
        `User ${user.id} created!`,
      );
      return Promise.resolve(true);
    } catch (e) {
      Logger.error(e);
      return Promise.resolve(false);
    }
  }

  async notifyNewUserCreated(userCreated: User) {
    await this.queueClient
      .send(
        {
          cmd: 'create-user',
        },
        userCreated,
      )
      .subscribe({
        error: (error) => {
          Logger.debug(
            `Rabbitmq message NOT sent to user ${
              userCreated.id
            }. Error: ${JSON.stringify(error)}`,
          );
        },
      });
    return Promise.resolve(true);
  }
}
