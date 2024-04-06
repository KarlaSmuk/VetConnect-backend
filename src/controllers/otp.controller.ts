import { RequestHandler } from 'express';
import { AppDataSource } from "../config/db";
import { OtpData } from '../model/entity/OtpData.entity';
import otpGenerator from 'otp-generator';
import { User } from '../model/entity/User.entity';

export const createOtp:RequestHandler = async (req, res) => {

    const {userId} = req.params;

    try {

        const user = await AppDataSource
            .manager     
            .findOneByOrFail(User, {
                id: userId
            })

        const otp = otpGenerator.generate(4, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false
        });

        const otpUser = await AppDataSource
            .manager
            .save(new OtpData(Number(otp), user))


        //when is created send email to user

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

export const getOtp:RequestHandler = async (req, res) => {

    const {userId} = req.params;

    try {

        const user = await AppDataSource
            .manager
            .findOneByOrFail(User, {
                id: userId
            })

        const otpUser = await AppDataSource
            .getRepository(OtpData)
            .createQueryBuilder("otp")
            .where("otp.user = :userId", { userId: user.id })
            .andWhere("otp.expiration > :now", { now: new Date() })
            .andWhere("otp.isUsed = :isUsed", { isUsed: false })
            .getOneOrFail()


        //when is created send email to user

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

export const getAllOtps:RequestHandler = async (req, res) => {

    try {

        const otpUser = await AppDataSource
            .manager
            .find(OtpData)

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

