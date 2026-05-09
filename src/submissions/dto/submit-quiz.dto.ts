import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class SubmitQuizDto {
    @ApiProperty({ example: 'a1b2c3d4-e5f6-...', description: 'Id of the selected answer option' })
    @IsString()
    @IsNotEmpty()
    selectedOptionId!: string;
}
