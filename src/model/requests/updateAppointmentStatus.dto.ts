import { IsNotEmpty, IsString } from 'class-validator';
import { AppointmentStatus } from '../../constants/appointmentStatus.enum';

export class UpdateAppointmentStatus {

    @IsString()
    @IsNotEmpty()
    appointmentId: string;
    
    @IsString()
    @IsNotEmpty()
    status: AppointmentStatus;

}