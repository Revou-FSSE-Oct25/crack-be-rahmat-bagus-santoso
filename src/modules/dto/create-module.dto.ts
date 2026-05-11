import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateModuleDto {
    @ApiProperty({ example: 'Mengenal Warna', description: 'Title of the module'})
    @IsString()
    @IsNotEmpty()
    title!: string;

    @ApiProperty({ example: 'Belajar mengenal warna-warna dasar', description: 'description detail for the module'})
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ example: 'icon-castle.png', description: 'Icon of the module'})
    @IsString()
    @IsOptional()
    icon?: string;
}
