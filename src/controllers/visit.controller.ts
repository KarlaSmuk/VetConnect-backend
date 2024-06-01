import { RequestHandler } from 'express';
import { AppDataSource } from "../config/db";
import { Pet } from '../model/entity/Pet.entity';
import { BadRequestError } from '../middleware/errorHandling';
import { Visit } from '../model/entity/Visit.entity';
import { CreateVisitDto } from '../model/requests/createVisit.dto';
import { Veterinarian } from '../model/entity/Veterinarian.entity';

const petRepository = AppDataSource.getRepository(Pet)
const visitRepository = AppDataSource.getRepository(Visit)
const vetRepository = AppDataSource.getRepository(Veterinarian)

export const createVisit: RequestHandler = async (req, res) => {

    const { petId, vetId } = req.query;
    const dto: CreateVisitDto = req.body;

    if (!petId) {
        throw new BadRequestError('Pet ID is required.')
    }

    if (!vetId) {
        throw new BadRequestError('Vet ID is required.')
    }

    try {

        const pet = await petRepository
            .findOneByOrFail({ id: petId.toString() })

        const vet = await vetRepository
            .findOneByOrFail({ id: vetId.toString() })

        const visit = await visitRepository.save(new Visit(new Date(), dto.weight, dto.temperature, dto.diagnosis, dto.notes || '', pet, vet));

        const visitToReturn = await visitRepository
            .createQueryBuilder("visit")
            .leftJoinAndSelect('visit.veterinarian', 'veterinarian')
            .leftJoin('veterinarian.user', 'user')
            .leftJoin('veterinarian.clinic', 'clinic')
            .addSelect(['user.firstName', 'user.lastName', 'user.email', 'clinic.name', 'clinic.email'])
            .where("visit.id = :id", { id: visit.id })
            .orderBy("visit.time", "DESC")
            .getOne()

        return res.status(200).json({
            success: true,
            message: visitToReturn
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

export const getVisitsByPetId: RequestHandler = async (req, res) => {

    const { petId } = req.params;

    if (!petId) {
        throw new BadRequestError('Pet ID is required.')
    }

    try {

        const pet = await petRepository
            .findOneByOrFail({ id: petId })

        const visits = await visitRepository
            .createQueryBuilder("visit")
            .leftJoinAndSelect('visit.veterinarian', 'veterinarian')
            .leftJoin('veterinarian.user', 'user')
            .leftJoin('veterinarian.clinic', 'clinic')
            .addSelect(['user.firstName', 'user.lastName', 'user.email', 'clinic.name', 'clinic.email'])
            .where("visit.petId = :petId", { petId: pet.id })
            .orderBy("visit.time", "DESC")
            .getMany()

        return res.status(200).json({
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

export const getVisitById: RequestHandler = async (req, res) => {

    const { visitId } = req.query;

    if (!visitId) {
        throw new BadRequestError('Visit ID is required.')
    }

    try {

        const visit = await visitRepository
            .createQueryBuilder("visit")
            .where("visit.id = :visitId", { visitId })
            .getOneOrFail()

        return res.status(200).json({
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