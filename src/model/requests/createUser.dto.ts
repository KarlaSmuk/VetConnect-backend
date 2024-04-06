import { IsEmail, IsNotEmpty, IsOptional, IsString, IsUUID, ValidateIf } from 'class-validator';
import { UserRole } from '../../constants/roles.enum';

export class CreateUserDto {
    
    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    role: UserRole.OWNER | UserRole.VET;

    @IsString()
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @IsNotEmpty()
    lastName: string;

    @IsString()
    @IsNotEmpty()
    phoneNumber: string;

}