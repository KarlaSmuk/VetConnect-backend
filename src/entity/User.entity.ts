import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from 'typeorm';
import { UserRole } from '../constants/roles.enum';
import { OtpData } from './OtpData.entity';

@Entity()
export class User {

    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({ unique: true })
    email: string

    @Column({
        nullable: true
    })
    password?: string

    @Column()
    @CreateDateColumn({type: 'timestamptz', default: Date.now})
    createdAt: Date

    @Column({
        type: 'enum',
        enum: UserRole
    })
    role: UserRole

    //relationships

    @OneToMany(() => OtpData, (otp) => otp.user)
    otp: OtpData[];

    constructor(email: string, role: UserRole, password?: string) {
        this.email = email;
        this.role = role;
        this.password = password;
    }
}