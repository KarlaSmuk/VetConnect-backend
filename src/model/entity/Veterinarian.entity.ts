import { Entity, PrimaryGeneratedColumn, OneToMany, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { User } from './User.entity';
import { VeterinaryClinic } from './VeterinaryClinic.entity';
import { Visit } from './Visit.entity';

@Entity()
export class Veterinarian {

    @PrimaryGeneratedColumn("uuid")
    id: string

    //relationships

    @OneToOne(() => User)
    @JoinColumn()
    user: User

    @ManyToOne(() => VeterinaryClinic, (clinic) => clinic.veterinarians)
    clinic: VeterinaryClinic;

    @OneToMany(() => Visit, (visit) => visit.veterinarian)
    visits: Visit[];

    constructor(user: User, clinic: VeterinaryClinic) {
        this.user = user;
        this.clinic = clinic;
    }
   
}