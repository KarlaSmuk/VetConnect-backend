import { RequestHandler } from 'express';
import { AppDataSource } from "../config/db";
import { User } from '../entity/User.entity';

export const helloWorld:RequestHandler = (req, res, next) => {
    res.status(201).json(
        {message: 'Hello world'}
    );
};

export const createUser:RequestHandler = async (req, res, next) => {

    const {email, role} = req.body;

    await AppDataSource
        .createQueryBuilder()
        .insert()
        .into(User)
        .values({
            email: email,
            role: role
        })
        .execute()



    res.status(201).json('created');
};