import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from '../use-cases/users/users.service';
import { ApiTags } from '@nestjs/swagger';
import { ApiPrefix } from '../constant/common';
import { ReqresApiService } from '../services/reqres-api/reqres-api.service';
import { CreateUserDto } from '../core/dtos/user/create-user.dto';

@Controller(`${ApiPrefix.Version}/users`)
@ApiTags('Users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly reqresApiService: ReqresApiService,
  ) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<unknown> {
    const userCreated = await this.usersService.create(createUserDto);
    const emailSent = await this.usersService.sendEmailUserCreated(userCreated);
    await this.usersService.notifyNewUserCreated(userCreated);
    const response = {
      userCreated: {
        email: userCreated.email,
        first_name: userCreated.first_name,
        last_name: userCreated.last_name,
      },
      emailSent: emailSent,
    };
    return response;
  }

  @Get(':id')
  async findById(@Param('id') id: number): Promise<unknown> {
    const user = await this.reqresApiService.getUserById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
