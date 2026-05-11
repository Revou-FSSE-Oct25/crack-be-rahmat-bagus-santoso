import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ example: 'Parent Demo', description: 'Full name of the user' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 'parent@littlestep.test', description: 'Email address of the user' })
  @IsOptional()
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ example: 'newpassword123', description: 'Password for the user account' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password!: string;
}
