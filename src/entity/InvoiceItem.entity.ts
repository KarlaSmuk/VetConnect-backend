import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { Treatment } from './Treatment.entity';
import { Invoice } from './Invoice.entity';

@Entity()
export class InvoiceItem {

    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    quantity: number

    @Column('double precision')
    totalPrice: number

    //relationships

    @ManyToOne(() => Treatment, (treatment) => treatment.item)
    treatment: Treatment

    @ManyToOne(() => Invoice, (invoice) => invoice.items)
    invoice: Invoice;
   
}