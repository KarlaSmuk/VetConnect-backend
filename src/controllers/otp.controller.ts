import { RequestHandler } from 'express';
import { AppDataSource } from "../config/db";
import { OtpData } from '../entity/OtpData.entity';
import otpGenerator from 'otp-generator';
import { User } from '../entity/User.entity';

export const createOtp:RequestHandler = async (req, res, next) => {

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
        
    } catch (error: any) {
        res.status(400).send({
            success: false,
            message: error.message
            });
    }

    
};

export const getOtp:RequestHandler = async (req, res, next) => {

    const {userId} = req.params;

    const now = new Date();

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
            .andWhere("otp.expiration > :now", { now })
            .getOneOrFail()


        //when is created send email to user

        res.status(200).json({
            success: true,
            message: otpUser
            });
        
    } catch (error: any) {
        res.status(400).send({
            success: false,
            message: error.message
            });
    }
};

export const getAllOtps:RequestHandler = async (req, res, next) => {

    try {

        const otpUser = await AppDataSource
            .manager
            .find(OtpData)


        //when is created send email to user

        res.status(200).json({
            success: true,
            message: otpUser
            });
        
    } catch (error: any) {
        res.status(400).send({
            success: false,
            message: error.message
            });
    }
};

export const setPassword:RequestHandler = async (req, res, next) => {
};

