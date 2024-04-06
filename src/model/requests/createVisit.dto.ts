import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateVisitDto {
    
    @IsDate()
    @IsNotEmpty()
    time: Date;

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
    notes: string;
}