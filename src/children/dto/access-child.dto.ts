import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class AccessChildDto {
    @ApiProperty({ example: '1234', description: 'Optional PIN for child access'})
    @IsString()
    @IsOptional()
    pin?: string;
}