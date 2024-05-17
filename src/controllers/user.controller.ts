import { RequestHandler } from 'express';
import { AppDataSource } from "../config/db";
import { User } from '../model/entity/User.entity';
import { CreateUserDto } from '../model/requests/createUser.dto';
import { UserRole } from '../constants/roles.enum';
import { Owner } from '../model/entity/Owner.entity';
import { Veterinarian } from '../model/entity/Veterinarian.entity';
import { VeterinaryClinic } from '../model/entity/VeterinaryClinic.entity';
import { BadRequestError } from '../middleware/errorHandling';
import { authenticateGoogle } from '../middleware/authenticateGoogle ';
import { uploadToGoogleDrive } from '../middleware/uploadToGoogleDrive';
import { google } from 'googleapis';
import { UpdateUserDto } from 'model/requests/updateUser.dto';

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
            .save(new User(dto.email, dto.firstName, dto.lastName, dto.phoneNumber, dto.role))


        const createdOwner = await ownerRepository
            .save(new Owner(createdUser))


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
            .save(new User(dto.email, dto.firstName, dto.lastName, dto.phoneNumber, dto.role))

        const createdVet = await vetRepository
            .save(new Veterinarian(createdUser, clinic))

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
            .find({
                where: {
                    isDeleted: false
                }
            });

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

        if (user.isDeleted) {
            return res.status(400).json({
                success: false,
                message: 'User does not exist.'
            });
        }

        return res.status(201).json({
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

export const updateUser: RequestHandler = async (req, res) => {

    const userToUpdate: UpdateUserDto = req.body;

    try {

        const user = await userRepository
            .findOneByOrFail({
                id: userToUpdate.id
            })

        if (userToUpdate.email && userToUpdate.email != user.email) {
            const emailExists = await userRepository.findOneBy({
                email: userToUpdate.email
            });

            if (emailExists) {
                return res.status(400).json({
                    success: false,
                    message: 'Email already in use.'
                });
            }
        }


        user.firstName = userToUpdate.firstName || user.firstName;
        user.lastName = userToUpdate.lastName || user.lastName;
        user.email = userToUpdate.email || user.email;
        user.phoneNumber = userToUpdate.phoneNumber || user.phoneNumber;

        await userRepository.save(user);

        let userResponse;
        if(user.role == UserRole.OWNER){
            userResponse = await ownerRepository
                .createQueryBuilder('owner')
                .leftJoinAndSelect('owner.user', 'user')
                .select(['owner', 'user'])
                .where('user.id = :id', {id: user.id})
                .getOneOrFail()
        }else{//TODO for vet user

        }

        return res.status(200).json({
            success: true,
            message: userResponse
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


export const deleteUser: RequestHandler = async (req, res) => {

    const { userId } = req.params;

    try {

        const user = await userRepository
            .findOneByOrFail({
                id: userId
            })

        user.isDeleted = true;
        user.deletedAt = new Date();

        await userRepository.save(user)

        return res.status(200).json({
            success: true,
            message: 'User deleted succesffuly.'
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

export const saveProfilePhoto: RequestHandler = async (req, res) => {

    const { userId } = req.params;

    if (!userId.toString()) {
        return res.status(400).send("ID required.");
    }

    if (!req.file) {
        return res.status(400).send("No file uploaded.");
    }

    try {

        const user = await userRepository
            .findOneByOrFail({
                id: userId
            })



        const auth = authenticateGoogle();
        if (!auth) {
            return res.status(500).send("Authentication failed.");
        }

        if (user.photo) { // if already exist first delete it
            const driveService = google.drive({ version: "v3", auth });
            await driveService.files.delete({
                fileId: user.photo
            });
        }

        const response = await uploadToGoogleDrive(req.file, userId.toString(), auth);

        user.photo = response.id?.toString();

        await userRepository.save(user);

        return res.status(400).send({
            success: true,
            message: response
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