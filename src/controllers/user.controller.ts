import { RequestHandler } from 'express';
import { AppDataSource } from "../config/db";
import { User } from '../entity/User.entity';

export const createUser:RequestHandler = async (req, res, next) => {

    const {email, role} = req.body;

    try {

        const createdUser = await AppDataSource
            .manager
            .save(new User(email, role))

        res.status(200).json({
            success: true,
            message: createdUser
          });
    } catch (error: any) {
        res.status(400).send({
            success: false,
            message: error.message
          });
    }
};

export const getAllUsers:RequestHandler = async (req, res, next) => {

    try {

        const users = await AppDataSource
        .manager
        .find(User)

        res.status(200).json({
            success: true,
            message: users
        });
        
    } catch (error: any) {
        res.status(400).send({
            success: false,
            message: error.message
          });
    }

    
};

export const getUser:RequestHandler = async (req, res, next) => {

    const {id} = req.params;

    try {

        const user = await AppDataSource
        .manager
        .findOneByOrFail(User, {
            id: id
        })

        res.status(201).json({
            success: true,
            message: user
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