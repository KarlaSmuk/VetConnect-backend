import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { VeterinaryClinic } from './VeterinaryClinic.entity';

@Entity()
export class Supply {

    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    name: string

    @Column()
    description?: string

    @Column()
    stockQuantity: number

    @Column()
    minimumRequired: number

    @Column({type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP'})
    updated: Date

    //relationships

    @ManyToOne(() => VeterinaryClinic, (clinic) => clinic.supply)
    clinic: VeterinaryClinic;

    constructor(name: string, description: string, stockQuantity: number, minimumRequired: number, clinic: VeterinaryClinic) {
        this.name = name;
        this.description = description;
        this.stockQuantity = stockQuantity;
        this.minimumRequired = minimumRequired;
        this.clinic = clinic;
    }
   
}