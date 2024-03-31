import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { User } from './User.entity';
import { Veterinarian } from './Veterinarian.entity';
import { WorkingHours } from './WorkingHours.entity';

@Entity()
export class VeterinaryClinic {

    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    oib: string

    @Column()
    name: string

    @Column()
    address: string

    @Column()
    county: string //županija

    @Column()
    phoneNumber: string

    @Column()
    email: string

    @Column()
    webAddress: string

    //relationships

    @OneToMany(() => Veterinarian, (vet) => vet.clinic)
    veterinarians: Veterinarian[];

    @OneToMany(() => WorkingHours, (work) => work.clinic)
    workingHours: WorkingHours[];
   
}