import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, Min, ValidateNested } from "class-validator";
import { CreateQuizOptionDto } from "./create-quiz-option.dto";

export class CreateQuizDto {
    @ApiProperty({ example: 'Apa warna buah Apel?', description: 'The quiz question'})
    @IsString()
    @IsNotEmpty()
    question!: string;

    @ApiProperty({ example: 'Warna buah Apel adalah Merah', description: 'Shown after answering'})
    @IsString()
    @IsOptional()
    explanation?: string;

    @ApiProperty({ example: 1, description: 'Order of this quiz in the lesson'})
    @IsNumber()
    orderNumber!: number;

    @ApiProperty({ example: 10, description: 'Points for correct answer, min 10'})
    @IsNumber()
    @Min(10)
    @IsOptional()
    points!: number;

    @ApiProperty({ type: [CreateQuizOptionDto], description: 'Answer options, minimum 2 items'})
    @IsArray()
    @ArrayMinSize(2)
    @ValidateNested({ each: true })
    @Type(() => CreateQuizOptionDto)
    options!: CreateQuizOptionDto[];
}
