
import { RequestHandler } from 'express';
import { AppDataSource } from "../config/db";
import { CreateClinicDto } from '../model/requests/createClinic.dto';
import { VeterinaryClinic } from '../model/entity/VeterinaryClinic.entity';
import { WorkingHours } from '../model/entity/WorkingHours.entity';
import { UpdateWorkingHourDTO } from '../model/requests/updateWorkingHours.dto';
import { NotFoundError } from '../middleware/errorHandling';
import { CreateSupplyDto } from '../model/requests/createSupply.dto';
import { Supply } from '../model/entity/Supply.entity';
import { CreateTreatmentDto } from '../model/requests/createTreatment.dto';
import { Treatment } from '../model/entity/Treatment.entity';
import { UpdateClinicInfoDto } from 'model/requests/updateClinicInfo.dto';


const clinicRepository = AppDataSource.getRepository(VeterinaryClinic);
const workingHoursRepository = AppDataSource.getRepository(WorkingHours);
const supplyRepository = AppDataSource.getRepository(Supply);
const treatmentRepository = AppDataSource.getRepository(Treatment);

export const createVetClinic: RequestHandler = async (req, res) => {

    const dto: CreateClinicDto = req.body;

    try {

        const createdClinic = await clinicRepository
            .save(new VeterinaryClinic(dto.oib, dto.name, dto.address, dto.county, dto.phoneNumber, dto.email, dto.webAddress))


        for (const wh of dto.workingHours) {
    
            const newWorkingHour = workingHoursRepository.create({
                clinic: createdClinic,
                day: wh.day,
                openingTime: wh.openingTime,
                closingTime: wh.closingTime,
                specialNotes: wh.specialNotes
            });
            
            await workingHoursRepository.save(newWorkingHour);
        }

        return res.status(200).json({
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

export const updateClinicInfo: RequestHandler = async (req, res) => {

    const dto: UpdateClinicInfoDto = req.body;

    try {

        const existingClinic = await clinicRepository
            .findOneByOrFail({id: dto.id})

        existingClinic.oib = dto.oib || existingClinic.oib;
        existingClinic.name = dto.name || existingClinic.name;
        existingClinic.address = dto.address || existingClinic.address;
        existingClinic.county = dto.county || existingClinic.county;
        existingClinic.phoneNumber = dto.phoneNumber || existingClinic.phoneNumber;
        existingClinic.email = dto.email || existingClinic.email;
        existingClinic.webAddress = dto.webAddress || existingClinic.webAddress;

        await clinicRepository.save(existingClinic)

        const updatedClinic = await clinicRepository
            .createQueryBuilder('clinic')
            .innerJoinAndSelect('clinic.workingHours', 'workingHours')
            .where('clinic.id = :clinicId', {clinicId: dto.id})
            .getOneOrFail()

        return res.status(200).json({
            success: true,
            message: updatedClinic
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


export const deleteClinic: RequestHandler = async (req, res) => {

    const { clinicId } = req.params;

    try {

        const clinic = await clinicRepository
            .findOneByOrFail({
                id: clinicId
            })

        clinic.isDeleted = true;
        clinic.deletedAt = new Date();

        await clinicRepository.save(clinic)

        return res.status(200).json({
            success: true,
            message: 'Clinic deleted succesffuly.'
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

export const getAllVetClinics: RequestHandler = async (req, res) => {

    try {

        const clinics = await clinicRepository
            .createQueryBuilder('clinic')
            .leftJoinAndSelect('clinic.workingHours', 'workingHours')
            .where('clinic.isDeleted = :deleted', {deleted: false})
            .getMany()

        return res.status(200).json({
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

export const getClinicById: RequestHandler = async (req, res) => {

    const { clinicId } = req.params;

    try {

        const clinic = await clinicRepository
            .createQueryBuilder('clinic')
            .innerJoinAndSelect('clinic.workingHours', 'workingHours')
            .where('clinic.id = :clinicId', {clinicId: clinicId})
            .where('clinic.isDeleted = :deleted', {deleted: false})
            .getOneOrFail()

        return res.status(201).json({
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

export const updateWorkingHours: RequestHandler = async (req, res) => {

    const dto: UpdateWorkingHourDTO = req.body;

    try {

        const clinic = await clinicRepository.findOneBy({ id: dto.clinicId });
        if (!clinic) {
            throw new NotFoundError("Clinic not found.")
        }

        for (const wh of dto.workingHours) {

            const existingWorkingHour = await workingHoursRepository.findOne({
                where: {
                    clinic: { id: dto.clinicId },
                    day: wh.day
                }
            });

            if (!existingWorkingHour) {
                throw new NotFoundError(`Working hours for day ${wh.day} do not exist and cannot be updated.`)
            }

            //update existing
            existingWorkingHour.openingTime = wh.openingTime || existingWorkingHour.openingTime;
            existingWorkingHour.closingTime = wh.closingTime || existingWorkingHour.closingTime;
            existingWorkingHour.specialNotes = wh.specialNotes || existingWorkingHour.specialNotes;

            await workingHoursRepository.save(existingWorkingHour);
        }

        const updatedClinic = await clinicRepository
            .createQueryBuilder('clinic')
            .innerJoinAndSelect('clinic.workingHours', 'workingHours')
            .where('clinic.id = :clinicId', {clinicId: dto.clinicId})
            .getOneOrFail()

        return res.status(200).json({ 
            status: true, 
            message: updatedClinic
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

export const deleteWorkingHours: RequestHandler = async (req, res) => {

    const { clinicId, day } = req.query;

    const dayNumber = Number(day)

    try {

        const clinic = await clinicRepository.findOneBy({
            id: clinicId?.toString()
        });

        if (!clinic) {
            throw new NotFoundError("Clinic not found.")
        }

        const workingHour = await workingHoursRepository.findOneBy({
            clinic: { id: clinicId?.toString() },
            day: dayNumber
        });
        if (!workingHour) {
            throw new NotFoundError(`Working hours for day: ${day} for ${clinic.id} not found.`)
        }

        await workingHoursRepository.delete(workingHour.id);


        return res.status(200).json({ 
            status: true, 
            message: `Working hours for day: ${day} for ${clinic.id} deleted succesfully.` 
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

//supplies
export const addSupplies: RequestHandler = async (req, res) => {

    const { clinicId } = req.params;
    const dto: CreateSupplyDto = req.body;

    try {

        const clinic = await clinicRepository.findOneBy({ id: clinicId });
        if (!clinic) {
            throw new NotFoundError("Clinic not found.")
        }

        await supplyRepository
            .save(new Supply(dto.name, dto.description, dto.stockQuantity, dto.minimunRequired, clinic))


        return res.status(200).json({
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

export const getSuppliesByClinicId: RequestHandler = async (req, res) => {

    const { clinicId } = req.params;

    try {

        const clinic = await clinicRepository.findOneBy({ id: clinicId });
        if (!clinic) {
            throw new NotFoundError("Clinic not found.")
        }

        const supplies = await supplyRepository.findBy({
            clinic: clinic
        });


        return res.status(200).json({
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

export const updateSupply: RequestHandler = async (req, res) => {

    const { supplyId } = req.params;
    const stockQuantity = Number(req.query.stockQuantity);

    try {

        const supplyToUpdate = await supplyRepository.findOneBy({
            id: supplyId
        });

        if (!supplyToUpdate) {
            throw new NotFoundError(`Supply with id ${supplyId} do not exist and cannot be updated.`)
        }

        supplyToUpdate.stockQuantity = stockQuantity;
        supplyToUpdate.updated = new Date();

        await supplyRepository.save(supplyToUpdate);

        return res.status(200).json({
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
export const addTreatments: RequestHandler = async (req, res) => {

    const { clinicId } = req.params;
    const dto: CreateTreatmentDto = req.body;

    try {

        const clinic = await clinicRepository.findOneBy({
            id: clinicId
        });

        if (!clinic) {
            throw new NotFoundError("Clinic not found.")
        }

        await treatmentRepository
            .save(new Treatment(dto.name, dto.description, dto.price, clinic))


        return res.status(200).json({
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

export const getTreatmentsByClinicId: RequestHandler = async (req, res) => {

    const { clinicId } = req.params;

    try {

        const clinic = await clinicRepository.findOneBy({ id: clinicId });
        if (!clinic) {
            throw new NotFoundError("Clinic not found.")
        }

        const treatments = await treatmentRepository.findBy({
            clinic: clinic
        });


        return res.status(200).json({
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



export const deleteTreatment: RequestHandler = async (req, res) => {

    const { treatmentId } = req.params;

    try {

        const treatmentToDelete = treatmentRepository
            .findOneByOrFail({ id: treatmentId })

        await treatmentRepository.delete((await treatmentToDelete).id)

        return res.status(200).json({
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


export const updateTreatment: RequestHandler = async (req, res) => {

    const { treatmentId } = req.params;
    const price = Number(req.query.price);

    try {


        const treatmentToUpdate = await treatmentRepository.findOneByOrFail({
            id: treatmentId
        });

        if (!treatmentToUpdate) {
            throw new NotFoundError(`Treatment with id ${treatmentId} do not exist and cannot be updated.`)
        }

        treatmentToUpdate.price = price;

        await treatmentRepository.save(treatmentToUpdate);

        return res.status(200).json({
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