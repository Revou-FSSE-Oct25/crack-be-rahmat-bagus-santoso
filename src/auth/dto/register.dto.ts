import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class RegisterDto {
    @ApiProperty({ example: 'Parent Demo', description: 'Name for registration' })
    @IsString()
    @IsNotEmpty()
    name!: string;

    @ApiProperty({ example: 'parent@littlestep.test', description: 'Email address for registration' })
    @IsEmail()
    @IsNotEmpty()
    email!: string;

    @ApiProperty({ example: 'parent123', description: 'Password for registration' })
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password!: string;
}
