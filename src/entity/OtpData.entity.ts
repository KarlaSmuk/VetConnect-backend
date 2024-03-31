import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './User.entity';

@Entity()
export class OtpData {

    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    otp: number

    @Column({type: 'timestamp'})
    expiration: Date

    @Column({type: 'timestamp', default: () => 'now()'})
    createdAt: Date

    @Column({default: 0})
    attemptsCount: number

    @Column({type: 'timestamp', nullable: true})
    lastAttemptTime: Date

    @Column({default: false})
    isUsed: boolean

    //relationships

    @ManyToOne(() => User, (user) => user.otp)
    user: string;

}