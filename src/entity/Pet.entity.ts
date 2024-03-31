import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Owner } from './Owner.entity';
import { Species } from './Species.entity';
import { Breed } from './Breed.entity';

@Entity()
export class Pet {

    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    name: string

    @Column()
    dateOfBirth: Date

    //leave like that for now
    @Column({
        type: 'bytea',
        nullable: true
    })
    photo: Buffer

    //relationships

    @ManyToOne(() => Owner, (owner) => owner.pets)
    owner: Owner;

    @ManyToOne(() => Species, (species) => species.pets)
    species: Species;

    @ManyToOne(() => Breed, (breed) => breed.pets)
    breed: Breed;
}