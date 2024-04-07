import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { Visit } from './Visit.entity';
import { InvoiceItem } from './InvoiceItem.entity';

@Entity()
export class Invoice {

    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP'})
    createdAt: Date

    @Column({ type: 'numeric', precision: 10, scale: 2 })
    totalPrice: number

    //status of payment?

    //relationships

    @OneToOne(() => Visit)
    @JoinColumn()
    visit: Visit

    @OneToMany(() => InvoiceItem, (item) => item.invoice)
    items: InvoiceItem[];


    constructor(totalPrice: number, visit: Visit) {
        this.totalPrice = totalPrice;
        this.visit = visit;
    }

   
}