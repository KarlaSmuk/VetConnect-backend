import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, ManyToMany } from 'typeorm';
import { VeterinaryClinic } from './VeterinaryClinic.entity';
import { InvoiceItem } from './InvoiceItem.entity';
import { Visit } from './Visit.entity';

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

    @OneToMany(() => InvoiceItem, (item) => item.treatment)
    item: InvoiceItem[];

    @ManyToMany(() => Visit, visit => visit.treatments) 
    visits: Visit[];
    
    constructor(name: string, description: string, price: number, clinic: VeterinaryClinic) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.clinic = clinic;
    }
   
}