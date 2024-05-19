import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { VeterinaryClinic } from './VeterinaryClinic.entity';

@Entity()
export class WorkingHours {

    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    day: number

    @Column()
    openingTime: string

    @Column()
    closingTime: string

    @Column({ nullable: true })
    specialNotes?: string //županija

    //relationships

    @ManyToOne(() => VeterinaryClinic, (clinic) => clinic.workingHours)
    clinic: VeterinaryClinic;
   
}