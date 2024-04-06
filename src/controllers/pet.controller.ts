import { RequestHandler } from 'express';
import { AppDataSource } from "../config/db";
import { User } from '../model/entity/User.entity';
import { CreatePetDto } from '../model/requests/createPet.dto';
import { Pet } from '../model/entity/Pet.entity';
import { Species } from '../model/entity/Species.entity';
import { Breed } from '../model/entity/Breed.entity';
import { Owner } from '../model/entity/Owner.entity';

export const createPet:RequestHandler = async (req, res, next) => {

    const {ownerId} = req.params;
    const dto: CreatePetDto = req.body;

    try {

        const owner = await AppDataSource
            .manager
            .findOneByOrFail(Owner, {
                id: ownerId
            })

        // Check if the species exists, if not create it
        let speciesEntity = await AppDataSource
            .getRepository(Species)
            .findOne({ where: { name: dto.speciesName } });

        if (!speciesEntity) {
            speciesEntity = await AppDataSource
                .manager
                .save(new Species(dto.speciesName));
        }

        //Check if the breed exists within the species, if not create it
        let breedEntity = await AppDataSource
        .getRepository(Breed)
        .findOne({ where: { name: dto.breedName, species: speciesEntity } });

        if (!breedEntity) {
            breedEntity = await AppDataSource
                .manager
                .save(new Breed(dto.breedName, speciesEntity));
        }
        
        //create pet

        const createdPet = await AppDataSource
            .manager
            .save(new Pet(dto.name, dto.dateOfBirth, dto.neutered, dto.gender, dto.color, owner, speciesEntity, breedEntity))

        res.status(200).json({
            success: true,
            message: createdPet
          });
    } catch (error: any) {
        res.status(400).send({
            success: false,
            message: error.message
          });
    }
};

export const getAllPets:RequestHandler = async (req, res, next) => {

    const {ownerId} = req.query;

    if (!ownerId) {
        return res.status(400).send({ success: false, message: "Owner ID is required." });
    }

    try {

        const owner = await AppDataSource
            .manager
            .findOneByOrFail(Owner, {
                id: ownerId?.toString()
            })

        const pets = await AppDataSource
            .getRepository(Pet)
            .createQueryBuilder("pet")
            .where("pet.owner = :ownerId", { ownerId: owner.id })
            .getMany()

        res.status(200).json({
            success: true,
            message: pets
          });
    } catch (error: any) {
        res.status(400).send({
            success: false,
            message: error.message
          });
    }
};

export const getPet:RequestHandler = async (req, res, next) => {

    const {petId} = req.params;

    try {

        const pet = await AppDataSource
            .manager
            .findOneByOrFail(Pet, {
                id: petId
            })

        res.status(200).json({
            success: true,
            message: pet
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