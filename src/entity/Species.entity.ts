import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Pet } from './Pet.entity';
import { Breed } from './Breed.entity';

@Entity()
export class Species {

    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    name: string

    //relationships

    @OneToMany(() => Pet, (pet) => pet.species)
    pets: Pet[];

    @OneToMany(() => Breed, (breed) => breed.species)
    breeds: Breed[];
}