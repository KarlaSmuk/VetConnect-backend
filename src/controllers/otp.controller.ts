import { RequestHandler } from 'express';
import { AppDataSource } from "../config/db";
import { OtpData } from '../model/entity/OtpData.entity';
import otpGenerator from 'otp-generator';
import { User } from '../model/entity/User.entity';
import { sendOtp } from '../middleware/mailSender';

const otpRepository = AppDataSource.getRepository(OtpData)
const userRepository = AppDataSource.getRepository(User)

export const createOtp: RequestHandler = async (req, res) => {

    const { userId } = req.params;

    try {

        const user = await userRepository
            .findOneByOrFail({
                id: userId
            })

        const otp = otpGenerator.generate(4, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false
        });

        await otpRepository.save(new OtpData(Number(otp), user))


        //sending email
        const emailSent = await sendOtp(user.email, Number(otp))
        //const emailSent = true;
        if (emailSent) {
            return res.status(200).json({
                success: true,
                message: 'OTP sent successfully.'
            });
        } else {
            return res.status(500).json({
                success: false,
                message: 'Failed to send OTP.'
            });
        }

    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).send({
                success: false,
                message: 'An error occurred while sending the OTP.'
            });
        }
    }


};



