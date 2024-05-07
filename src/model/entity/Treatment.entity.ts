import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { VeterinaryClinic } from './VeterinaryClinic.entity';
import { InvoiceItem } from './InvoiceItem.entity';

@Entity()
export class Treatment {

    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    name: string

    @Column()
    description: string

    @Column({ type: 'numeric', precision: 10, scale: 2 })
    price: number

    //relationships

    @ManyToOne(() => VeterinaryClinic, (clinic) => clinic.treatment)
    clinic: VeterinaryClinic;

    @OneToMany(() => InvoiceItem, (item) => item.treatment)
    item: InvoiceItem[];

    // @ManyToMany(() => Visit, visit => visit.treatments) 
    // visits: Visit[];
    
    constructor(name: string, description: string, price: number, clinic: VeterinaryClinic) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.clinic = clinic;
    }
   
}