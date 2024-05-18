import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateClinicInfoDto {

    @IsString()
    @IsNotEmpty()
    id: string;
    
    @IsString()
    oib?: string;

    @IsString()
    name?: string;

    @IsString()
    address?: string;

    @IsString()
    county?: string;

    @IsString()
    phoneNumber?: string;

    @IsEmail()
    email?: string;

    @IsOptional()
    @IsString()
    webAddress?: string;

}