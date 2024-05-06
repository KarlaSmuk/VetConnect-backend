import { RequestHandler } from "express";
import { AppDataSource } from "../config/db";
import { Veterinarian } from "../model/entity/Veterinarian.entity";
import { BadRequestError } from "../middleware/errorHandling";
import { VeterinaryClinic } from "../model/entity/VeterinaryClinic.entity";

export const getVetsByClinicId:RequestHandler = async (req, res) => {

    const {clinicId} = req.params

    if (!clinicId) {
        throw new BadRequestError('Clinic ID is required.')
    }

    try {

        const clinicRepository = AppDataSource.getRepository(VeterinaryClinic)
        const vetRepository = AppDataSource.getRepository(Veterinarian)

        const clinic = await clinicRepository
            .findOneByOrFail({id: clinicId})

        const vets = await vetRepository
            .findBy({clinic: clinic})

        res.status(201).json({
            success: true,
            message: vets
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