
import { RequestHandler } from 'express';
import { AppDataSource } from "../config/db";
import { CreateClinicDto } from '../model/requests/createClinic.dto';
import { VeterinaryClinic } from '../model/entity/VeterinaryClinic.entity';
import { WorkingHours } from '../model/entity/WorkingHours.entity';
import { CreateUpdateWorkingHourDTO } from '../model/requests/createUpdateWorkingHours.dto';
import { NotFoundError } from '../middleware/errorHandling';
import { CreateSupplyDto } from '../model/requests/createSupply.dto';
import { Supply } from '../model/entity/Supply.entity';
import { CreateTreatmentDto } from '../model/requests/createTreatment.dto';
import { Treatment } from '../model/entity/Treatment.entity';

export const createVetClinic:RequestHandler = async (req, res) => {

    const dto: CreateClinicDto = req.body;

    try {

        const createdClinic = await AppDataSource
            .manager
            .save(new VeterinaryClinic(dto.oib, dto.name, dto.address, dto.county, dto.phoneNumber, dto.email, dto.webAddress))

        res.status(200).json({
            success: true,
            message: createdClinic
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

export const getAllVetClinics:RequestHandler = async (req, res) => {

    try {

        const clinics = await AppDataSource
            .manager
            .find(VeterinaryClinic)

        res.status(200).json({
            success: true,
            message: clinics
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

export const getVetClinic:RequestHandler = async (req, res) => {

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

    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(400).send({
                success: false,
                message: error.message
              });
        }
    }

    
};

//working hours

export const addWorkingHours:RequestHandler = async (req, res) => {

    const { clinicId } = req.params; 
    const dto: CreateUpdateWorkingHourDTO = req.body;

    try {
        const clinicRepository = AppDataSource.getRepository(VeterinaryClinic);
        const workingHoursRepository = AppDataSource.getRepository(WorkingHours);

        const clinic = await clinicRepository.findOneBy({ id: clinicId });
        if (!clinic) {
            throw new NotFoundError("Clinic not found.")
        }

        for(const wh of dto.workingHours){

            const existingWorkingHour = await workingHoursRepository.findOne({
                where: {
                    clinic: { id: clinicId },
                    dayOfWeek: wh.day
                }
            });

            if (existingWorkingHour) {
                return res.status(400).json({ message: `Working hours for day ${wh.day} already exist.` });
            }

            const newWorkingHour = workingHoursRepository.create({
                clinic: clinic,
                dayOfWeek: wh.day,
                openingTime: wh.openingTime,
                closingTime: wh.closingTime,
                specialNotes: wh.specialNotes
            });

            await workingHoursRepository.save(newWorkingHour);
        }

      

        res.status(200).json({ status: true, message: "Working hours added successfully." });
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(400).send({
                success: false,
                message: error.message
              });
        }
    }
};


export const updateWorkingHours:RequestHandler = async (req, res) => {

    const { clinicId } = req.params; 
    const dto: CreateUpdateWorkingHourDTO = req.body;

    try {
        const clinicRepository = AppDataSource.getRepository(VeterinaryClinic);
        const workingHoursRepository = AppDataSource.getRepository(WorkingHours);

        const clinic = await clinicRepository.findOneBy({ id: clinicId });
        if (!clinic) {
            throw new NotFoundError("Clinic not found.")
        }

        for(const wh of dto.workingHours){

            const existingWorkingHour = await workingHoursRepository.findOne({
                where: {
                    clinic: { id: clinicId },
                    dayOfWeek: wh.day
                }
            });

            if (!existingWorkingHour) {
                throw new NotFoundError(`Working hours for day ${wh.day} do not exist and cannot be updated.`)
            }
            
            //update existing
            existingWorkingHour.openingTime = wh.openingTime;
            existingWorkingHour.closingTime = wh.closingTime;
            existingWorkingHour.specialNotes = wh.specialNotes;
            await workingHoursRepository.save(existingWorkingHour);
        }

      

        res.status(200).json({ status: true, message: "Working hours updated successfully." });
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(400).send({
                success: false,
                message: error.message
              });
        }
    }
};

export const deleteWorkingHours:RequestHandler = async (req, res) => {

    const { clinicId, day } = req.query;

    const dayNumber = Number(day)

    try {
        const clinicRepository = AppDataSource.getRepository(VeterinaryClinic);
        const workingHoursRepository = AppDataSource.getRepository(WorkingHours);

        const clinic = await clinicRepository.findOneBy({ id: clinicId?.toString() });
        if (!clinic) {
            throw new NotFoundError("Clinic not found.")
        }

        const workingHour = await workingHoursRepository.findOneBy({ 
            clinic: { id: clinicId?.toString() },
            dayOfWeek: dayNumber
        });
        if (!workingHour) {
            throw new NotFoundError(`Working hours for day: ${day} for ${clinic.id} not found.`)
        }

        await workingHoursRepository.delete(workingHour.id);
      

        res.status(200).json({ status: true, message: `Working hours for day: ${day} for ${clinic.id} deleted succesfully.` });
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(400).send({
                success: false,
                message: error.message
              });
        }
    }
};

//supplies

export const addSupplies:RequestHandler = async (req, res) => {

    const {clinicId} = req.params;
    const dto: CreateSupplyDto = req.body;

    try {

        const clinicRepository = AppDataSource.getRepository(VeterinaryClinic);
        const supplyRepository = AppDataSource.getRepository(Supply);

        const clinic = await clinicRepository.findOneBy({ id: clinicId });
        if (!clinic) {
            throw new NotFoundError("Clinic not found.")
        }

        supplyRepository
            .save(new Supply(dto.name, dto.description, dto.stockQuantity, dto.minimunRequired, clinic))

        
        res.status(200).json({
            success: true,
            message: `Supply for clinic ${clinic.id} added succesfully.`
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

export const getAllSuppliesForClinic:RequestHandler = async (req, res) => {

    const {clinicId} = req.params;

    try {

        const clinicRepository = AppDataSource.getRepository(VeterinaryClinic);
        const supplyRepository = AppDataSource.getRepository(Supply);

        const clinic = await clinicRepository.findOneBy({ id: clinicId });
        if (!clinic) {
            throw new NotFoundError("Clinic not found.")
        }

        const supplies = await supplyRepository.find({
            where: {
                clinic: clinic
            }
        });


        res.status(200).json({
            success: true,
            message: supplies
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

export const updateSupply:RequestHandler = async (req, res) => {

    const {supplyId} = req.params;
    const stockQuantity = Number(req.query.stockQuantity);

    try {

        const supplyRepository = AppDataSource.getRepository(Supply);
        const supplyToUpdate = await supplyRepository.findOne({
            where: {
                id: supplyId
            }
        });

        if (!supplyToUpdate) {
            throw new NotFoundError(`Supply with id ${supplyId} do not exist and cannot be updated.`)
        }

        supplyToUpdate.stockQuantity = stockQuantity;
        supplyToUpdate.updated = new Date();

        await supplyRepository.save(supplyToUpdate);

        res.status(200).json({
            success: true,
            message: `Supply ${supplyId} updated succesfully.`
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

//treatments

export const addTreatments:RequestHandler = async (req, res) => {

    const {clinicId} = req.params;
    const dto: CreateTreatmentDto = req.body;

    try {

        const clinicRepository = AppDataSource.getRepository(VeterinaryClinic);
        const treatmentRepository = AppDataSource.getRepository(Treatment);

        const clinic = await clinicRepository.findOneBy({ id: clinicId });
        if (!clinic) {
            throw new NotFoundError("Clinic not found.")
        }

        treatmentRepository
            .save(new Treatment(dto.name, dto.description, dto.price, clinic))


        res.status(200).json({
            success: true,
            message: `Treatment for clinic ${clinic.id} added succesfully.`
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

export const getAllTreatmentsForClinic:RequestHandler = async (req, res) => {

    const {clinicId} = req.params;

    try {

        const clinicRepository = AppDataSource.getRepository(VeterinaryClinic);
        const treatmentRepository = AppDataSource.getRepository(Treatment);

        const clinic = await clinicRepository.findOneBy({ id: clinicId });
        if (!clinic) {
            throw new NotFoundError("Clinic not found.")
        }

        const treatments = await treatmentRepository.find({
            where: {
                clinic: clinic
            }
        });


        res.status(200).json({
            success: true,
            message: treatments
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



export const deleteTreatment:RequestHandler = async (req, res) => {

    const {treatmentId} = req.params;

    try {

        const treatmentRepository = AppDataSource.getRepository(Treatment);


        const treatmentToDelete = treatmentRepository
            .findOneByOrFail({id: treatmentId})


        await treatmentRepository.delete((await treatmentToDelete).id)


        res.status(200).json({
            success: true,
            message: `Treatment ${treatmentId} deleted succesfully.`
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


export const updateTreatment:RequestHandler = async (req, res) => {

    const {treatmentId} = req.params;
    const price = Number(req.query.price);

    try {

        const treatmentRepository = AppDataSource.getRepository(Treatment);
        const treatmentToUpdate = await treatmentRepository.findOne({
            where: {
                id: treatmentId
            }
        });

        if (!treatmentToUpdate) {
            throw new NotFoundError(`Treatment with id ${treatmentId} do not exist and cannot be updated.`)
        }

        treatmentToUpdate.price = price;

        await treatmentRepository.save(treatmentToUpdate);

        res.status(200).json({
            success: true,
            message: `Treatment ${treatmentId} updated succesfully.`
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