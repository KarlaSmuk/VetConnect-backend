import { RequestHandler } from 'express';
import { AppDataSource } from "../config/db";
import { CreatePetDto } from '../model/requests/createPet.dto';
import { Pet } from '../model/entity/Pet.entity';
import { Species } from '../model/entity/Species.entity';
import { Breed } from '../model/entity/Breed.entity';
import { Owner } from '../model/entity/Owner.entity';

const ownerRepository = AppDataSource.getRepository(Owner)
const speciesRepository = AppDataSource.getRepository(Species)
const breedRepository = AppDataSource.getRepository(Breed)
const petRepository = AppDataSource.getRepository(Pet)

export const createPet: RequestHandler = async (req, res) => {

    const { ownerId } = req.params;
    const dto: CreatePetDto = req.body;

    try {

        const owner = await ownerRepository
            .findOneByOrFail({
                id: ownerId
            })

        // Check if the species exists, if not create it
        let speciesEntity = await speciesRepository
            .findOneByOrFail({
                name: dto.speciesName
            });

        if (!speciesEntity) {
            speciesEntity = await speciesRepository
                .save(new Species(dto.speciesName));
        }

        //Check if the breed exists within the species, if not create it
        let breedEntity = await breedRepository
            .findOneByOrFail({
                name: dto.breedName,
                species: speciesEntity
            });

        if (!breedEntity) {
            breedEntity = await breedRepository
                .save(new Breed(dto.breedName, speciesEntity));
        }

        //create pet

        const createdPet = await petRepository
            .save(new Pet(dto.name, dto.dateOfBirth, dto.neutered, dto.gender, dto.color, owner, speciesEntity, breedEntity))

        return res.status(200).json({
            success: true,
            message: createdPet
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

export const getPetsByOwnerId: RequestHandler = async (req, res) => {

    const { ownerId } = req.query;

    if (!ownerId) {
        return res.status(400).send({ success: false, message: "Owner ID is required." });
    }

    try {

        const owner = await ownerRepository
            .findOneByOrFail({
                id: ownerId?.toString()
            })

        const pets = await AppDataSource
            .getRepository(Pet)
            .createQueryBuilder("pet")
            .where("pet.owner = :ownerId", { ownerId: owner.id })
            .getMany()

        return res.status(200).json({
            success: true,
            message: pets
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

export const getPet: RequestHandler = async (req, res) => {

    const { petId } = req.params;

    try {

        const pet = await petRepository
            .findOneByOrFail({
                id: petId
            })

        return res.status(200).json({
            success: true,
            message: pet
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