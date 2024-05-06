import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';

export class CreateVisitDto {
    
    @IsString()
    @IsNotEmpty()
    time: string;

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

    // @IsUUID(4, { each: true })
    // @IsOptional()
    // treatmentIds: string[];

    @IsArray()
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => CreateInvoiceItemDto)
    items: CreateInvoiceItemDto[];
}

class CreateInvoiceItemDto {
    
    @IsUUID()
    @IsNotEmpty()
    treatmentId: string;

    @IsNotEmpty()
    @IsNumber()
    quantity: number;
    
}