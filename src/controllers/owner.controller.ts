import { RequestHandler } from "express";
import { AppDataSource } from "../config/db";
import { Owner } from "../model/entity/Owner.entity";

export const getOwners:RequestHandler = async (req, res) => {

    try {

        const ownerRepository = AppDataSource.getRepository(Owner)
        
        const owners = await ownerRepository.find()

        res.status(201).json({
            success: true,
            message: owners
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