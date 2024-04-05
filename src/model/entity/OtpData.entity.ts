import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './User.entity';

@Entity()
export class OtpData {

    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    otp: number

    @Column('timestamptz')
    expiration: Date

    @Column({type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP'})
    createdAt: Date

    @Column({default: 0})
    attemptsCount: number

    @Column({ type: 'timestamptz', nullable: true, default: null})
    lastAttemptTime: Date

    @Column({default: false})
    isUsed: boolean

    //relationships

    @ManyToOne(() => User, (user) => user.otp)
    user: User;

    constructor(otp: number, user: User) {
        this.otp = otp
        this.createdAt = new Date()
        this.expiration = new Date(Date.now() + 3600000)
        this.user = user
    }

}