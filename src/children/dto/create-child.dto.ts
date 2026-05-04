import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";

export class CreateChildDto {
    @ApiProperty({ example: 'child1', description: 'The name of child'})
    @IsString()
    @IsNotEmpty()
    name!: string;

    @ApiProperty({ example: '', description: 'Child Avatar'})
    @IsString()
    @IsOptional()
    avatar?: string;

    @ApiProperty({ example: 5, description: 'Child age'})
    @IsNumber()
    @IsNotEmpty()
    @Min(4)
    @Max(10)
    age!: number;

    @ApiProperty({ example: '', description: 'Child pin'})
    @IsString()
    @IsOptional()
    pin?: string;
}
