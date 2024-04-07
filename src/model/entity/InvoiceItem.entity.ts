import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Treatment } from './Treatment.entity';
import { Invoice } from './Invoice.entity';

@Entity()
export class InvoiceItem {

    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    quantity: number

    @Column({ type: 'numeric', precision: 10, scale: 2 })
    totalPrice: number

    //maybe add later discount variable?

    //relationships

    @ManyToOne(() => Treatment, (treatment) => treatment.item)
    treatment: Treatment

    @ManyToOne(() => Invoice, (invoice) => invoice.items)
    invoice: Invoice;

    constructor(quantity: number, totalPrice: number, invoice: Invoice, treatment: Treatment) {
        this.quantity = quantity;
        this.totalPrice = totalPrice;
        this.invoice = invoice;
        this.treatment = treatment;
    }
   
}