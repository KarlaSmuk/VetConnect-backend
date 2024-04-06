import { RequestHandler } from 'express';
import { AppDataSource } from "../config/db";
import { Pet } from '../model/entity/Pet.entity';
import { BadRequestError } from '../middleware/errorHandling';
import { Visit } from '../model/entity/Visit.entity';
import { CreateVisitDto } from '../model/requests/createVisit.dto';
import { Treatment } from '../model/entity/Treatment.entity';
import { Veterinarian } from '../model/entity/Veterinarian.entity';

export const createVisit:RequestHandler = async (req, res) => {

    const {petId, vetId} = req.query;
    const dto: CreateVisitDto = req.body;

    if (!petId) {
        throw new BadRequestError('Pet ID is required.')
    }

    if (!vetId) {
        throw new BadRequestError('Vet ID is required.')
    }

    try {

        const petRepository = AppDataSource.getRepository(Pet)
        const treatmentRepository = AppDataSource.getRepository(Treatment)
        const visitRepository = AppDataSource.getRepository(Visit)
        const vetRepository = AppDataSource.getRepository(Veterinarian)

        const pet = await petRepository
            .findOneByOrFail({id: petId.toString()})

        const vet = await vetRepository
            .findOneByOrFail({id: vetId.toString()})
        
        const treatmentPromises = dto.treatmentIds.map(treatmentId =>
            treatmentRepository.findOneByOrFail({ id: treatmentId })
        );

        const treatments = await Promise.all(treatmentPromises);

        await visitRepository.save(new Visit(new Date(dto.time), dto.weight, dto.temperature, dto.diagnosis, dto.notes, pet, vet, treatments));
        
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

        const pet = await petRepository
            .findOneByOrFail({id: petId})

        const visits = await visitRepository
            .createQueryBuilder("visit")
            .leftJoinAndSelect("visit.treatments", "treatment")//to join ids to get treatments
            .where("visit.petId = :petId", { petId: pet.id })
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

    const {visitId} = req.query;

    if (!visitId) {
        throw new BadRequestError('Visit ID is required.')
    }

    try {

        const visitRepository = AppDataSource.getRepository(Visit)

        const visit = await visitRepository
            .createQueryBuilder("visit")
            .leftJoinAndSelect("visit.treatments", "treatment")//to join ids to get treatments
            .where("visit.id = :visitId", { visitId })
            .getOneOrFail()

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