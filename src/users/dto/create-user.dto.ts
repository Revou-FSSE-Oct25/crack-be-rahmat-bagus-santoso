import { Role } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
    @ApiProperty({ description: 'Full name of the user' })
    @IsString()
    @IsNotEmpty()
    name!: string;

    @ApiProperty({ description: 'Email address of the user' })
    @IsEmail()
    @IsNotEmpty()
    email!: string;

    @ApiProperty({ description: 'Password for the user account' })
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password!: string;

    @ApiProperty({ description: 'Role assigned to the user' })
    @IsOptional()
    @IsEnum(Role)
    role?: Role;
}
