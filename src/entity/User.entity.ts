import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UserRole } from '../constants/roles.enum';
import { OtpData } from './OtpData.entity';

@Entity()
export class User {

    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    email: string

    @Column({
        nullable: true
    })
    password: string

    @Column({type: 'timestamp'})
    createdAt: Date

    @Column({
        type: 'enum',
        enum: UserRole
    })
    role: UserRole

    //relationships

    @OneToMany(() => OtpData, (otp) => otp.user)
    otp: OtpData[];
}