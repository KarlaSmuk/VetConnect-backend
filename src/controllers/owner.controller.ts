import { RequestHandler } from "express";
import { AppDataSource } from "../config/db";
import { Owner } from "../model/entity/Owner.entity";


const ownerRepository = AppDataSource.getRepository(Owner)

export const getOwners: RequestHandler = async (req, res) => {

    try {

        const owners = await ownerRepository
            .createQueryBuilder('owner')
            .leftJoinAndSelect('owner.user', 'user')
            .select(['owner', 'user'])
            .where('user.isDeleted = :deleted', {deleted: false})
            .getMany()

        return res.status(201).json({
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