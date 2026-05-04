import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateModuleDto {
    @ApiProperty({ example: '', description: ''})
    @IsString()
    @IsNotEmpty()
    title!: string;

    @ApiProperty({ example: '', description: ''})
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ example: '', description: ''})
    @IsString()
    @IsOptional()
    icon?: string;
}
