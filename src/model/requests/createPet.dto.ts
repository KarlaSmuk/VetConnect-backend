import { IsBoolean, IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePetDto {
    
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsDate()
    @IsNotEmpty()
    dateOfBirth: Date;

    @IsBoolean()
    @IsNotEmpty()
    neutered: boolean;

    @IsString()
    @IsNotEmpty()
    gender: string;

    @IsString()
    @IsNotEmpty()
    color: string;

    @IsString()
    @IsNotEmpty()
    breedName: string;

    @IsString()
    @IsNotEmpty()
    speciesName: string;

}