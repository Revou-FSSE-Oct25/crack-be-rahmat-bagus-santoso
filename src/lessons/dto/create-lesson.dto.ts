import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateLessonDto {
    @ApiProperty({ example: '', description: 'Title of the lesson'})
    @IsString()
    @IsNotEmpty()
    title!: string;

    @ApiProperty({ example: '', description: 'Content of the lesson'})
    @IsString()
    @IsNotEmpty()
    content!: string;

    @ApiProperty({ example: 1, description: 'Order number of the lesson'})
    @IsNumber()
    orderNumber!: number;
}
