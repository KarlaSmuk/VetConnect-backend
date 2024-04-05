
import { RequestHandler } from 'express';
import { AppDataSource } from "../config/db";
import { CreateClinicDto } from '../model/requests/createClinic.dto';
import { VeterinaryClinic } from '../model/entity/VeterinaryClinic.entity';

export const createVetClinic:RequestHandler = async (req, res, next) => {

    const dto: CreateClinicDto = req.body;

    try {

        const createdClinic = await AppDataSource
            .manager
            .save(new VeterinaryClinic(dto.oib, dto.name, dto.address, dto.county, dto.phoneNumber, dto.email, dto.webAddress))

        res.status(200).json({
            success: true,
            message: createdClinic
          });
    } catch (error: any) {
        res.status(400).send({
            success: false,
            message: error.message
          });
    }
};

export const getAllVetClinics:RequestHandler = async (req, res, next) => {

    try {

        const clinics = await AppDataSource
            .manager
            .find(VeterinaryClinic)

        res.status(200).json({
            success: true,
            message: clinics
        });
        
    } catch (error: any) {
        res.status(400).send({
            success: false,
            message: error.message
          });
    }

    
};

export const getVetClinic:RequestHandler = async (req, res, next) => {

    const {id} = req.params;

    try {

        const clinic = await AppDataSource
        .manager
        .findOneByOrFail(VeterinaryClinic, {
            id: id
        })

        res.status(201).json({
            success: true,
            message: clinic
        });

    } catch (error: any) {
        res.status(400).send({
            success: false,
            message: error.message
          });
    }

    
};
