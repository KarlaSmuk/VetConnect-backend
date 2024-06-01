import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAppointmentDto {

    @IsString()
    @IsNotEmpty()
    petId: string;

    @IsString()
    @IsNotEmpty()
    clinicId: string;
    
    @IsString()
    @IsNotEmpty()
    time: Date;

    @IsString()
    @IsNotEmpty()
    purpose: string;

}