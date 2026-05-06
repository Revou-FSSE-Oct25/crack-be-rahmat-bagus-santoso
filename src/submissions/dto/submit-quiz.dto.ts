import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class SubmitQuizDto {
    @ApiProperty({ example: 'childId', description: "Child id that is submitting the quiz" })
    @IsString()
    @IsNotEmpty()
    childId!: string;

    @ApiProperty({ example: 'optionId', description: 'Selected option id for the quiz' })
    @IsString()
    @IsNotEmpty()
    selectedOptionId!: string;
}
