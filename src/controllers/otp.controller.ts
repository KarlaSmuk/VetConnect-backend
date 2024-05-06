import { RequestHandler } from 'express';
import { AppDataSource } from "../config/db";
import { OtpData } from '../model/entity/OtpData.entity';
import otpGenerator from 'otp-generator';
import { User } from '../model/entity/User.entity';
import { sendOtp } from '../utils/mailSender';

export const createOtp:RequestHandler = async (req, res) => {

    const {userId} = req.params;

    try {

        const userRepository = AppDataSource.getRepository(User)
        const otpRepository = AppDataSource.getRepository(OtpData)
        

        const user = await userRepository 
            .findOneByOrFail({
                id: userId
            })

        const otp = otpGenerator.generate(4, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false
        });

        const otpUser = await otpRepository
            .save(new OtpData(Number(otp), user))


        //when is created send email to user
        sendOtp(user.email, Number(otp))

        res.status(200).json({
            success: true,
            message: otpUser
            });
        
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(400).send({
                success: false,
                message: error.message
              });
        }
    }

    
};

export const verifyOtp:RequestHandler = async (req, res) => {

    const {userId} = req.params;
    const enteredOtp = req.body.otp

    try {

        const otpRepository = AppDataSource.getRepository(OtpData)
        const userRepository = AppDataSource.getRepository(User)

        const user = await userRepository
            .findOneByOrFail({
                id: userId
            })

        const otpUser = await otpRepository
            .createQueryBuilder("otp")
            .where("otp.user = :userId", { userId: user.id })
            .andWhere("otp.expiration > :now", { now: new Date() })
            .andWhere("otp.isUsed = :isUsed", { isUsed: false })
            .getOneOrFail()

        //update otp for user
        
        otpUser.attemptsCount = otpUser.attemptsCount + 1
        otpUser.lastAttemptTime = new Date()
        
        if(otpUser.otp === Number(enteredOtp) && otpUser.attemptsCount < 3){

            otpUser.isUsed = true
            await otpRepository.save(otpUser);

            res.status(200).json({
                success: true,
                message: 'Successful otp verification.'
                });
            
            return
        }

        await otpRepository.save(otpUser);

        res.status(400).json({
            success: false,
            message: 'Failed otp verification.'
        });
        
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(400).send({
                success: false,
                message: error.message
              });
        }
    }
};

