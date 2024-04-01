import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { VeterinaryClinic } from './VeterinaryClinic.entity';

@Entity()
export class Treatment {

    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    name: string

    @Column()
    description: string

    @Column('double precision')
    price: number

    //relationships

    @ManyToOne(() => VeterinaryClinic, (clinic) => clinic.treatment)
    clinic: VeterinaryClinic;

   
}