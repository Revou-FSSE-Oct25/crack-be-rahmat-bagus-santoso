import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateBadgeDto {
    @ApiProperty({ example: 'Petualang Warna', description: 'badge Name'})
    @IsString()
    @IsNotEmpty()
    name!: string;

    @ApiPropertyOptional({ example: 'Menyelesaikan semua quiz di module warna' })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiPropertyOptional({ example: 'http://cdn.littlestep.com/badge/wanderer.png'})
    @IsString()
    @IsOptional()
    imageUrl?: string;
}
