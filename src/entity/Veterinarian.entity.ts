import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { User } from './User.entity';
import { VeterinaryClinic } from './VeterinaryClinic.entity';

@Entity()
export class Veterinarian {

    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    firstName: string

    @Column()
    lastName: string

    @Column()
    phoneNumber: string

    //leave like that for now
    @Column({
        type: 'bytea',
        nullable: true
    })
    photo: Buffer

    //relationships

    @OneToOne(() => User)
    @JoinColumn()
    user: User

    @ManyToOne(() => VeterinaryClinic, (clinic) => clinic.veterinarians)
    clinic: VeterinaryClinic;

   
}