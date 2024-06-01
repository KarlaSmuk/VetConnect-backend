import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { AppointmentStatus } from '../../constants/appointmentStatus.enum';
import { VeterinaryClinic } from './VeterinaryClinic.entity';
import { Pet } from './Pet.entity';

@Entity()
export class Appointment {

    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP'})
    time: Date

    @Column()
    purpose: string

    @Column({
        type: 'enum',
        enum: AppointmentStatus
    })
    status: AppointmentStatus

    //relationships

    @ManyToOne(() => Pet, (pet) => pet.appointment)
    pet: Pet;

    @ManyToOne(() => VeterinaryClinic, (clinic) => clinic.appointment)
    clinic: VeterinaryClinic;

    constructor(pet: Pet, clinic: VeterinaryClinic, time: Date, purpose: string, status: AppointmentStatus) {
        this.pet = pet;
        this.clinic = clinic;
        this.time = time;
        this.purpose = purpose;
        this.status = status;
    }
}