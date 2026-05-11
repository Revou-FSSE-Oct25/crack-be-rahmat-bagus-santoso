import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginDto {
    @ApiProperty({ example: 'parent@littlestep.test', description: 'Email address for login' })
    @IsEmail()
    @IsNotEmpty()
    email!: string;

    @ApiProperty({ example: 'parent123', description: 'Password for login' })
    @IsString()
    @IsNotEmpty()
    password!: string;
}
