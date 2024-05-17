import { IsArray, ValidateNested, IsNumber, IsString, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

class WorkingHourDTO {
    
    @IsNumber()
    day: number;

    @IsString()
    openingTime: string;

    @IsString()
    closingTime: string;

    @IsString()
    @IsOptional()
    specialNotes?: string;
}

export class CreateUpdateWorkingHourDTO {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => WorkingHourDTO)
    workingHours: WorkingHourDTO[];
}
