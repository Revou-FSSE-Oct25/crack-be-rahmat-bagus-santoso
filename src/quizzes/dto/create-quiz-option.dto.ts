import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsString } from "class-validator";

export class CreateQuizOptionDto {
    @ApiProperty({ example: 'Merah', description: 'Text of the answer option' })
    @IsString()
    @IsNotEmpty()
    optionText!: string;

    @ApiProperty({ example: false, description: 'Whether this option is the correct answer' })
    @IsBoolean()
    isCorrect!: boolean;
}