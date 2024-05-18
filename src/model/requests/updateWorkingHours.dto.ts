import { IsArray, ValidateNested, IsNumber, IsString, IsOptional, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

class WorkingHourDTO {
    
    @IsNumber()
    day: number;

    @IsString()
    openingTime?: string;

    @IsString()
    closingTime?: string;

    @IsString()
    @IsOptional()
    specialNotes?: string;
}

export class UpdateWorkingHourDTO {
    
    @IsString()
    @IsNotEmpty()
    clinicId: string;
    
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => WorkingHourDTO)
    workingHours: WorkingHourDTO[];
}
