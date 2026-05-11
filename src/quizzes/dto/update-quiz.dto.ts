import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsNumber, IsOptional, IsString, Min, ValidateNested } from 'class-validator';
import { CreateQuizOptionDto } from './create-quiz-option.dto';

export class UpdateQuizDto {
    @ApiPropertyOptional({ example: 'Apa warna buah Apel?'})
    @IsString()
    @IsOptional()
    question?: string;

    @ApiPropertyOptional({ example: 'Warna buah Apel adalah Merah'})
    @IsString()
    @IsOptional()
    explanation?: string;

    @ApiPropertyOptional({ example: 1 })
    @IsNumber()
    @IsOptional()
    orderNumber?: number;

    @ApiPropertyOptional({ example: 10, description: 'Min 10' })
    @IsNumber()
    @Min(10)
    @IsOptional()
    points?: number;

    @ApiPropertyOptional({ type: [CreateQuizOptionDto], description: 'If provided, replace ALL existing options' })
    @IsArray()
    @ArrayMinSize(2)
    @ValidateNested({ each: true })
    @Type(() => CreateQuizOptionDto)
    @IsOptional()
    options?: CreateQuizOptionDto[];
}
