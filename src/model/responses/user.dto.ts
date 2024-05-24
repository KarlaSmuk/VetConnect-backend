import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { UserRole } from 'constants/roles.enum';

export class UserResponseDto {

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
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsString()
    role?: UserRole;

    @IsOptional()
    @IsString()
    photo?: string | null;

    @IsString()
    @IsOptional()
    phoneNumber?: string;

}