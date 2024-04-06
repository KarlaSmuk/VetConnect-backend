import { RequestHandler } from 'express';
import { AppDataSource } from "../config/db";
import { Pet } from '../model/entity/Pet.entity';
import { BadRequestError } from '../middleware/errorHandling';
import { Visit } from '../model/entity/Visit.entity';
import { CreateVisitDto } from '../model/requests/createVisit.dto';

export const createVisit:RequestHandler = async (req, res) => {

    const {petId} = req.query;
    const dto: CreateVisitDto = req.body;

    if (!petId) {
        throw new BadRequestError('Pet ID is required.')
    }

    try {

        const petRepository = AppDataSource.getRepository(Pet)
        const visitRepository = AppDataSource.getRepository(Visit)

        const pet = petRepository
            .findOneByOrFail({id: petId?.toString()})

        //TODO add visit
        // const addedVisit = visitRepository
        //     .save(new Visit())


        
        res.status(200).json({
            success: true,
            message: `Succesfully added visit for pet ${petId}`
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

export const getVisitsByPetId:RequestHandler = async (req, res) => {

    const {petId} = req.params;

    if (!petId) {
        throw new BadRequestError('Pet ID is required.')
    }

    try {

        const petRepository = AppDataSource.getRepository(Pet)
        const visitRepository = AppDataSource.getRepository(Visit)

        const pet = petRepository
            .findOneByOrFail({id: petId})

        const visits = visitRepository
            .createQueryBuilder("visit")
            .where("visit.pet = :pet", { pet })
            .getMany()

        res.status(200).json({
            success: true,
            message: visits
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

export const getVisitById:RequestHandler = async (req, res) => {

    const {visitId} = req.params;

    if (!visitId) {
        throw new BadRequestError('Visit ID is required.')
    }

    try {

        const visitRepository = AppDataSource.getRepository(Visit)

        const visit = visitRepository
            .findOneByOrFail({id: visitId})

        res.status(200).json({
            success: true,
            message: visit
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