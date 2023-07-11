import { CreateUserDto } from '../../../../core/dtos/user/create-user.dto';
import { User } from '../../../../core/entities/user.entity';

export const userStub = (): Partial<User> => {
  return {
    email: 'test@test',
    first_name: 'Johm',
    last_name: 'Doe',
  };
};

export const emailFilterStub = () => {
  return {
    email: 'test@test',
  };
};

export const userDtoStub = (): CreateUserDto => {
  return {
    email: 'test@test',
    first_name: 'Johm',
    last_name: 'Doe',
  };
};

export const reqresUserStub = (): any => {
  return {
    id: 1,
    email: 'test@test',
    first_name: 'Johm',
    last_name: 'Doe',
    avatar: 'avatarPath',
  };
};

export const userResponseStub = () => {
  return {
    userCreated: {
      email: 'test@test',
      first_name: 'Johm',
      last_name: 'Doe',
    },
    emailSent: true,
  };
};
