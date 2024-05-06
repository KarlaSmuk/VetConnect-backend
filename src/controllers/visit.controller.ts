import { RequestHandler } from 'express';
import { AppDataSource } from "../config/db";
import { Pet } from '../model/entity/Pet.entity';
import { BadRequestError } from '../middleware/errorHandling';
import { Visit } from '../model/entity/Visit.entity';
import { CreateVisitDto } from '../model/requests/createVisit.dto';
import { Treatment } from '../model/entity/Treatment.entity';
import { Veterinarian } from '../model/entity/Veterinarian.entity';
import { Invoice } from '../model/entity/Invoice.entity';
import { InvoiceItem } from '../model/entity/InvoiceItem.entity';

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
        const invoiceRepository = AppDataSource.getRepository(Invoice)
        const inoviceItemRepository = AppDataSource.getRepository(InvoiceItem)

        const pet = await petRepository
            .findOneByOrFail({id: petId.toString()})

        const vet = await vetRepository
            .findOneByOrFail({id: vetId.toString()})

        const visit = await visitRepository.save(new Visit(new Date(dto.time), dto.weight, dto.temperature, dto.diagnosis, dto.notes, pet, vet));


        if(dto.items){
            const treatments = await Promise.all(
                    dto.items.map(async item =>{
                        const treatment = await treatmentRepository.findOneByOrFail({ id: item.treatmentId })
                        return {
                            treatment: treatment,
                            quantity: item.quantity,
                            price: item.quantity * treatment.price
                        }
                    }
                )
            )

            const totalPrice = treatments.reduce((sum, item) => sum + item.price, 0);
            const invoice = await invoiceRepository.save(new Invoice(totalPrice, visit));

            await Promise.all(
                treatments.map(item => {
                    return inoviceItemRepository.save(new InvoiceItem(item.quantity, item.price, invoice, item.treatment));
                })
            );
        }
        

        
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