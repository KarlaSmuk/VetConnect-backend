import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UserRole } from '../../constants/roles.enum';
import { OtpData } from './OtpData.entity';

@Entity()
export class User {

    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({ unique: true })
    email: string

    @Column()
    firstName: string

    @Column()
    lastName: string

    @Column()
    phoneNumber: string

    @Column({nullable: true})
    photo?: string

    @Column({
        nullable: true
    })
    password?: string

    @Column({type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP'})
    createdAt: Date

    @Column({
        type: 'enum',
        enum: UserRole
    })
    role: UserRole

    @Column({default: false})
    isDeleted: boolean

    @Column({type: 'timestamptz', default: null})
    deletedAt: Date

    //relationships

    @OneToMany(() => OtpData, (otp) => otp.user)
    otp: OtpData[];

    constructor(email: string, firstName: string, lastName: string, phoneNumber: string, role: UserRole, password?: string) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.phoneNumber = phoneNumber;
        this.email = email;
        this.role = role;
        this.password = password;
    }
}