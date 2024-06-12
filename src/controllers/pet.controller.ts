import { RequestHandler } from 'express';
import { AppDataSource } from "../config/db";
import { CreatePetDto } from '../model/requests/createPet.dto';
import { Pet } from '../model/entity/Pet.entity';
import { Species } from '../model/entity/Species.entity';
import { Breed } from '../model/entity/Breed.entity';
import { Owner } from '../model/entity/Owner.entity';
import { authenticateGoogle } from '../middleware/authenticateGoogle ';
import { google } from 'googleapis';
import { uploadToGoogleDrive } from '../middleware/uploadToGoogleDrive';
import { PetStatus } from '../constants/petStatus.enum';
import { UpdatePetStatus } from '../model/requests/updatePetStatus.dto';

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
            .findOneBy({
                name: dto.speciesName
            });

        if (!speciesEntity) {
            speciesEntity = await speciesRepository
                .save(new Species(dto.speciesName));
        }

        //Check if the breed exists within the species, if not create it
        let breedEntity = await breedRepository
            .findOneBy({
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

        const pets = await petRepository
            .createQueryBuilder("pet")
            .leftJoinAndSelect('pet.breed', 'breed')
            .leftJoinAndSelect('pet.species', 'species')
            .where("pet.owner = :ownerId", { ownerId: owner.id })
            .andWhere("pet.deceasedAt IS NULL")
            .orderBy("species.name, breed.name")
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
            .createQueryBuilder("pet")
            .leftJoinAndSelect('pet.breed', 'breed')
            .leftJoinAndSelect('pet.species', 'species')
            .where("pet.id = :petId", { petId: petId })
            .andWhere("pet.deceasedAt IS NULL")
            .getOneOrFail()

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

export const updatePetStatus: RequestHandler = async (req, res) => {

    const dto: UpdatePetStatus = req.body;

    try {

        const pet = await petRepository
            .findOneByOrFail({id: dto.petId})
        
        pet.status = dto.status;
        if(dto.status == PetStatus.DECEASED){
            pet.deceasedAt = new Date()
        }

        await petRepository.save(pet)

        const petToReturn = await petRepository
            .createQueryBuilder("pet")
            .leftJoinAndSelect('pet.breed', 'breed')
            .leftJoinAndSelect('pet.species', 'species')
            .where("pet.id = :petId", { petId: dto.petId })
            .getOneOrFail()

        return res.status(200).json({
            success: true,
            message: petToReturn
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

export const updatePetNeutered: RequestHandler = async (req, res) => {

    const petId = req.params.petId;

    try {

        const pet = await petRepository
            .findOneByOrFail({id: petId})
        
        if(pet.neutered == false){
            pet.neutered = true
        }else{
            return res.status(404).send({
                success: false,
                message: 'Pet already neutered.'
            });
        }

        await petRepository.save(pet)

        const petToReturn = await petRepository
            .createQueryBuilder("pet")
            .leftJoinAndSelect('pet.breed', 'breed')
            .leftJoinAndSelect('pet.species', 'species')
            .where("pet.id = :petId", { petId: petId.toString() })
            .getOneOrFail()

        return res.status(200).json({
            success: true,
            message: petToReturn
        });

    } catch (error: unknown) {
        if (error instanceof Error) {
            console.log(error)
            return res.status(400).send({
                success: false,
                message: error.message
            });
        }
    }


};

export const savePetImage: RequestHandler = async (req, res) => {

    const { petId } = req.params;

    if (!petId.toString()) {
        return res.status(400).send("ID required.");
    }

    if (!req.file) {
        return res.status(400).send("No file uploaded.");
    }

    try {

        const pet = await petRepository
            .findOneByOrFail({
                id: petId
            })



        const auth = authenticateGoogle();
        if (!auth) {
            return res.status(500).send("Authentication failed.");
        }

        if (pet.photo) { // if already exist first delete it
            const driveService = google.drive({ version: "v3", auth });
            await driveService.files.delete({
                fileId: pet.photo
            });
        }

        const response = await uploadToGoogleDrive(req.file, petId.toString(), auth);

        pet.photo = response.id?.toString();

        await petRepository.save(pet);

        return res.status(200).send({
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

export const getSpecies: RequestHandler = async (req, res) => {

    try {
        const species = await speciesRepository.find()

        return res.status(200).json({
            success: true,
            message: species
        });

    } catch (error: unknown) {
        console.log(error)
        if (error instanceof Error) {
            console.log(error)
            res.status(400).send({
                success: false,
                message: error.message
            });
        }
    }


};

export const getBreedsBySpeciesId: RequestHandler = async (req, res) => {

    const {speciesId} = req.params;

    try {

        const species = await speciesRepository.findOneByOrFail({id: speciesId})
        const breeds = await breedRepository.findBy({species: species})

        return res.status(200).json({
            success: true,
            message: breeds
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