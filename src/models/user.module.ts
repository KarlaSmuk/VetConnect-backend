import { Entity, PrimaryGeneratedColumn, Column, Timestamp, BaseEntity } from 'typeorm';
import { Roles } from '../constants/roles.enum';

@Entity()
export class User extends BaseEntity {

    @PrimaryGeneratedColumn("uuid")
    id: number

    @Column()
    email: string

    @Column()
    password: string

    @Column({type: 'timestamp'})
    createdAt: Date

    @Column()
    role: Roles
}