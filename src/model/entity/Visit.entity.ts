import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinTable, ManyToMany } from 'typeorm';
import { Pet } from './Pet.entity';
import { Veterinarian } from './Veterinarian.entity';
import { Treatment } from './Treatment.entity';
import { disconnect } from 'process';

@Entity()
export class Visit {

    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({type: 'timestamptz'})
    time: Date

    @Column({ type: 'numeric', precision: 10, scale: 2 })
    weight: number

    @Column({ type: 'numeric', precision: 10, scale: 2 })
    temperature: number

    @Column()
    diagnosis: string

    @Column()
    notes: string

    //relationships

    @ManyToOne(() => Pet, (pet) => pet.visits)
    pet: Pet;

    @ManyToOne(() => Veterinarian, (vet) => vet.visits)
    veterinarian: Veterinarian;

    // @ManyToMany(() => Treatment)
    // @JoinTable()
    // treatments: Treatment[];

    constructor(time: Date, weight: number, temperature: number, diagnosis: string, notes: string, pet: Pet, veterinarian: Veterinarian) {
        this.time = time;
        this.weight = weight;
        this.temperature = temperature;
        this.diagnosis = diagnosis;
        this.notes = notes;
        this.pet = pet;
        this.veterinarian = veterinarian;
        //this.treatments = treatments;
    }
}