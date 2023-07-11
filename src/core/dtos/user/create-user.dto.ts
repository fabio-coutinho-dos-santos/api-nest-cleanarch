import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ default: 'teste@gmail.com' })
  email: string;

  @IsNotEmpty()
  @ApiProperty({ default: 'Jonn' })
  first_name: string;

  @IsNotEmpty()
  @ApiProperty({ default: 'Doe' })
  last_name: string;
}
