import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn, OneToMany, CreateDateColumn } from 'typeorm';
import { Visit } from './Visit.entity';
import { InvoiceItem } from './InvoiceItem.entity';

@Entity()
export class Invoice {

    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP'})
    issueDate: Date

    @Column('double precision')
    totalPrice: number

    //status of payment?

    //relationships

    @OneToOne(() => Visit)
    @JoinColumn()
    visit: Visit

    @OneToMany(() => InvoiceItem, (item) => item.invoice)
    items: InvoiceItem[];

   
}