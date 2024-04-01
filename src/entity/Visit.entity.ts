import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Double } from 'typeorm';
import { Pet } from './Pet.entity';
import { Veterinarian } from './Veterinarian.entity';

@Entity()
export class Visit {

    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({ type: 'timestamp' })
    time: Date

    @Column({ type: 'double precision' })
    weight: number

    @Column({ type: 'double precision' })
    temperature: number

    @Column()
    diagnosis: string

    @Column()
    treatment: string

    @Column()
    notes: string

    //relationships

    @ManyToOne(() => Pet, (pet) => pet.visits)
    pet: Pet;

    @ManyToOne(() => Veterinarian, (vet) => vet.visits)
    veterinarian: Veterinarian;
}