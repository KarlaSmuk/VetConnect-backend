import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { User } from './User.entity';
import { VeterinaryClinic } from './VeterinaryClinic.entity';
import { Visit } from './Visit.entity';

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
    photo?: Buffer

    @Column({default: false})
    isDeleted: boolean

    @Column({
        type: 'timestamptz',
        nullable: true
    })
    deletedAt: Date | null

    //relationships

    @OneToOne(() => User)
    @JoinColumn()
    user: User

    @ManyToOne(() => VeterinaryClinic, (clinic) => clinic.veterinarians)
    clinic: VeterinaryClinic;

    @OneToMany(() => Visit, (visit) => visit.veterinarian)
    visits: Visit[];

    constructor(firstName: string, lastName: string, phoneNumber: string, user: User, clinic: VeterinaryClinic) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.phoneNumber = phoneNumber;
        this.user = user;
        this.clinic = clinic;
    }
   
}