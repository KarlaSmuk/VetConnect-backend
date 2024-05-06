import { IsUUID, IsNotEmpty, IsArray, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

class CreateInvoiceItemDto {
    
    @IsUUID()
    @IsNotEmpty()
    treatmentId: string;

    @IsNotEmpty()
    @IsNumber()
    quantity: number;
    
}

export class CreateInvoiceDto {
    
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateInvoiceItemDto)
    items: CreateInvoiceItemDto[];
}
