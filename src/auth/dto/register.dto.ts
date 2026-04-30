import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class RegisterDto {
    @ApiProperty({ description: 'Name for registration' })
    @IsString()
    @IsNotEmpty()
    name!: string;

    @ApiProperty({ description: 'Email address for registration' })
    @IsEmail()
    @IsNotEmpty()
    email!: string;

    @ApiProperty({ description: 'Password for registration' })
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password!: string;
}
