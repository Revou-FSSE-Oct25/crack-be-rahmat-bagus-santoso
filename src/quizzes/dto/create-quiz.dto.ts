import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateQuizDto {
    @ApiProperty({ example: '', description: ''})
    @IsString()
    @IsNotEmpty()
    question!: string;

    @ApiProperty({ example: '', description: ''})
    @IsString()
    @IsOptional()
    explanation?: string;

    @ApiProperty({ example: '', description: ''})
    @IsNumber()
    orderNumber!: number;

    @ApiProperty({ example: '', description: ''})
    @IsNumber()
    points!: number;

}
