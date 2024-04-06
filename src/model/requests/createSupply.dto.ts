import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateSupplyDto {
    
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsOptional()
    description: string;

    @IsNumber()
    @IsNotEmpty()
    stockQuantity: number;

    @IsNumber()
    @IsNotEmpty()
    minimunRequired: number;
}