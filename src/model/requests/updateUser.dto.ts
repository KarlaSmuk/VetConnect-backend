import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {

    @IsString()
    @IsNotEmpty()
    id: string;

    @IsString()
    @IsOptional()
    firstName?: string;

    @IsString()
    @IsOptional()
    lastName?: string;
    
    @IsOptional()
    @IsString()
    email?: string;

    @IsString()
    @IsOptional()
    phoneNumber?: string;

}