import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateSupplyDto {
    
    @IsString()
    @IsNotEmpty()
    name: string;
    
    @IsOptional()
    @IsString()
    description?: string;

    @IsNumber()
    @IsNotEmpty()
    stockQuantity: number;

    @IsNumber()
    @IsNotEmpty()
    minimumRequired: number;
}