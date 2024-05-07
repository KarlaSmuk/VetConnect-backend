import { genSalt, hash, compare } from "bcrypt";
import { RequestHandler } from "express";
import { AppDataSource } from "../config/db";
import { User } from "../model/entity/User.entity";
import { OtpData } from "../model/entity/OtpData.entity";
import { BadRequestError } from "../middleware/errorHandling";

const userRepository = AppDataSource.getRepository(User)
const otpRepository = AppDataSource.getRepository(OtpData)

export const verifyOtp: RequestHandler = async (req, res) => {

    const email = req.body.email
    const enteredOtp = req.body.otp

    if (!email || !enteredOtp) {
        return res
          .status(400)
          .json({ success: false, message: "Email and OTP required!" });
    }

    try {

        const user = await userRepository
            .findOneByOrFail({
                email: email
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

        if (otpUser.otp === Number(enteredOtp) && otpUser.attemptsCount < 3) {

            otpUser.isUsed = true
            await otpRepository.save(otpUser);

            return res.status(200).json({
                success: true,
                message: 'Successful otp verification.'
            });

        }

        await otpRepository.save(otpUser);

        return res.status(400).json({
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

export const register: RequestHandler = async (req, res) => {

    const email = req.body.email
    const enteredPassword = req.body.password

    if (!email || !enteredPassword) {
        return res
          .status(400)
          .json({ success: false, message: "Email and password required!" });
    }

    try {

        const user = await userRepository
            .findOneByOrFail({
                email: email
            })
        
        const salt = await genSalt(10)
        const hashedPassword = await hash(enteredPassword, salt)

        user.password = hashedPassword;

        await userRepository.save(user)

        return res.status(201).json({
            success: true,
            message: `Password updated.`
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

export const login: RequestHandler = async (req, res) => {

    const email = req.body.email
    const enteredPassword = req.body.password

    if (!email || !enteredPassword) {
        return res
          .status(400)
          .json({ success: false, message: "Email and password required!" });
    }

    try {

        const user = await userRepository
            .findOneByOrFail({
                email: email
            })
        
        let isLogged;
        if (user && user.password) {  
            isLogged = await compare(enteredPassword, user.password);
         } else {
            throw new BadRequestError("Authentication failed: User or password not found.");
        }

        if(!isLogged){
            return res
                .status(401)
                .json({ 
                    success: false,
                    message: "Invalid credentials"
                });
        }

        return res.status(201).json({
            success: true,
            message: "Login successful"
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