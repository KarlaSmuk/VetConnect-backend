import { Type } from 'class-transformer';
import { IsArray, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

class WorkingHourDTO {
    
    @IsNumber()
    @IsNotEmpty()
    day: number;

    @IsString()
    @IsOptional()
    openingTime: string;

    @IsString()
    @IsOptional()
    closingTime: string;

    @IsString()
    @IsOptional()
    specialNotes: string;
}
export class CreateClinicDto {
    
    @IsString()
    @IsNotEmpty()
    oib: string;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    address: string;

    @IsString()
    @IsNotEmpty()
    county: string;

    @IsString()
    @IsNotEmpty()
    phoneNumber: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsOptional()
    @IsString()
    webAddress?: string;

    @IsArray()
    @ValidateNested({ each: true })
    @IsNotEmpty()
    @Type(() => WorkingHourDTO)
    workingHours: WorkingHourDTO[];
}