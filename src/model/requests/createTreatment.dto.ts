import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTreatmentDto {
    
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsOptional()
    description: string;

    @IsNumber()
    price: number;
}