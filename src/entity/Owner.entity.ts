import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { User } from './User.entity';

@Entity()
export class Owner {

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
    photo: Buffer

    //relationships

    @OneToOne(() => User)
    @JoinColumn()
    user: User

   
}