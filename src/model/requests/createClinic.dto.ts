import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

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
    webAddress: string;
}