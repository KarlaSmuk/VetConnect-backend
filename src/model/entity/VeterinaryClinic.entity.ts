import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Veterinarian } from './Veterinarian.entity';
import { WorkingHours } from './WorkingHours.entity';
import { Supply } from './Supply.entity';
import { Appointment } from './Appointment.entity';
import { Treatment } from './Treatment.entity';

@Entity()
export class VeterinaryClinic {

    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    oib: string

    @Column()
    name: string

    @Column()
    address: string

    @Column()
    county: string //županija

    @Column()
    phoneNumber: string

    @Column()
    email: string

    @Column({nullable: true})
    webAddress?: string

    //relationships

    @OneToMany(() => Veterinarian, (vet) => vet.clinic)
    veterinarians: Veterinarian[];

    @OneToMany(() => WorkingHours, (work) => work.clinic)
    workingHours: WorkingHours[];

    @OneToMany(() => Supply, (supply) => supply.clinic)
    supply: Supply[];

    @OneToMany(() => Treatment, (treatment) => treatment.clinic)
    treatment: Treatment[];

    @OneToMany(() => Appointment, (appointment) => appointment.clinic)
    appointment: Appointment[];
   
    constructor(oib: string, name: string, address: string, county: string, phoneNumber: string, email: string, webAddress?: string) {
        this.oib = oib;
        this.name = name;
        this.address = address;
        this.county = county;
        this.phoneNumber = phoneNumber;
        this.email = email;
        this.webAddress = webAddress;
    }
}