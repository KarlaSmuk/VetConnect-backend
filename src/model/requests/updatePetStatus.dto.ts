import { IsNotEmpty, IsString } from 'class-validator';
import { PetStatus } from '../../constants/petStatus.enum';

export class UpdatePetStatus {

    @IsString()
    @IsNotEmpty()
    petId: string;
    
    @IsString()
    @IsNotEmpty()
    status: PetStatus;

}