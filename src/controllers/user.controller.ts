import { RequestHandler } from 'express';
import { AppDataSource } from "../config/db";
import { User } from '../model/entity/User.entity';
import { CreateUserDto } from '../model/requests/createUser.dto';
import { UserRole } from '../constants/roles.enum';
import { Owner } from '../model/entity/Owner.entity';
import { Veterinarian } from '../model/entity/Veterinarian.entity';
import { VeterinaryClinic } from '../model/entity/VeterinaryClinic.entity';
import { BadRequestError } from '../middleware/errorHandling';

const userRepository = AppDataSource.getRepository(User)
const ownerRepository = AppDataSource.getRepository(Owner)
const vetRepository = AppDataSource.getRepository(Veterinarian)
const clinicRepository = AppDataSource.getRepository(VeterinaryClinic)

export const createOwnerUser: RequestHandler = async (req, res) => {

    const dto: CreateUserDto = req.body;

    try {

        if (dto.role !== UserRole.OWNER) {
            throw new BadRequestError("Invalid role provided. Must be 'Vlasnik'.")
        }

        const createdUser = await userRepository
            .save(new User(dto.email, dto.role))


        const createdOwner = await ownerRepository
            .save(new Owner(dto.firstName, dto.lastName, dto.phoneNumber, createdUser))


        return res.status(200).json({
            success: true,
            message: createdOwner
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

export const createVetUser: RequestHandler = async (req, res) => {

    const { clinicId } = req.params;

    const dto: CreateUserDto = req.body;

    try {

        if (dto.role !== UserRole.VET) {
            throw new BadRequestError("Invalid role provided. Must be 'Veterinar'.")
        }

        const clinic = await clinicRepository
            .findOneByOrFail({
                id: clinicId
            })

        const createdUser = await userRepository
            .save(new User(dto.email, dto.role))

        const createdVet = await vetRepository
            .save(new Veterinarian(dto.firstName, dto.lastName, dto.phoneNumber, createdUser, clinic))

        return res.status(200).json({
            success: true,
            message: createdVet
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

export const getAllUsers: RequestHandler = async (req, res) => {

    try {

        const users = await userRepository
            .find()

        return res.status(200).json({
            success: true,
            message: users
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

export const getUser: RequestHandler = async (req, res) => {

    const { id } = req.params;

    try {

        const user = await userRepository
            .findOneByOrFail({
                id: id
            })

        res.status(201).json({
            success: true,
            message: user
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