import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { VeterinaryClinic } from './VeterinaryClinic.entity';

@Entity()
export class WorkingHours {

    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    dayOfWeek: number

    @Column({type: 'time'})
    openingTime: Date

    @Column({type: 'time'})
    closingTime: Date

    @Column()
    specialNotes: string //županija

    //relationships

    @ManyToOne(() => VeterinaryClinic, (clinic) => clinic.workingHours)
    clinic: VeterinaryClinic;
   
}