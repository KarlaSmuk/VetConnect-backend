import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateVisitDto {

    @IsNumber()
    @IsNotEmpty()
    weight: number;

    @IsNumber()
    @IsNotEmpty()
    temperature: number;

    @IsString()
    @IsNotEmpty()
    diagnosis: string;

    @IsString()
    @IsOptional()
    notes?: string;
}