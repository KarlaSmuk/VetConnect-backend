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

    @Column('double precision')
    price: number

    //relationships

    @ManyToOne(() => VeterinaryClinic, (clinic) => clinic.treatment)
    clinic: VeterinaryClinic;

    @OneToMany(() => InvoiceItem, (item) => item.treatment)
    item: InvoiceItem[];

   
}