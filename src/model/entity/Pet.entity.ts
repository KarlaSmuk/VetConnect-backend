import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Owner } from './Owner.entity';
import { Species } from './Species.entity';
import { Breed } from './Breed.entity';
import { Appointment } from './Appointment.entity';
import { Visit } from './Visit.entity';

@Entity()
export class Pet {

    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    name: string

    @Column()
    dateOfBirth: Date

    @Column({default: false})
    neutered: boolean

    @Column()
    gender: string

    @Column()
    color: string

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

    @OneToMany(() => Appointment, (appointment) => appointment.clinic)
    appointment: Appointment[];

    @OneToMany(() => Visit, (visit) => visit.pet)
    visits: Visit[];
}