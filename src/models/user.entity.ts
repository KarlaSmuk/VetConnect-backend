import { Entity, PrimaryGeneratedColumn, Column, Timestamp, BaseEntity } from 'typeorm';
import { UserRole } from '../constants/roles.enum';

@Entity()
export class User extends BaseEntity {

    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    email: string

    @Column()
    password: string

    @Column({type: 'timestamp'})
    createdAt: Date

    @Column({
        type: 'enum',
        enum: UserRole
    })
    role: UserRole
}