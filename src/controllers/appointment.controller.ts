import { RequestHandler } from "express";
import { AppDataSource } from "../config/db";
import { Pet } from "../model/entity/Pet.entity";
import { VeterinaryClinic } from "../model/entity/VeterinaryClinic.entity";
import { CreateAppointmentDto } from "../model/requests/createAppointment";
import { Appointment } from "../model/entity/Appointment.entity";
import { WorkingHours } from "../model/entity/WorkingHours.entity";
import { AppointmentStatus } from "../constants/appointmentStatus.enum";
import { Owner } from "../model/entity/Owner.entity";
import { PetStatus } from "../constants/petStatus.enum";

const petRepository = AppDataSource.getRepository(Pet)
const clinicRepository = AppDataSource.getRepository(VeterinaryClinic)
const whRepository = AppDataSource.getRepository(WorkingHours)
const appointmentRepository = AppDataSource.getRepository(Appointment)
const ownerRepository = AppDataSource.getRepository(Owner)

export const createAppointment: RequestHandler = async (req, res) => {

    const dto: CreateAppointmentDto = req.body;

    try {

        const clinic = await clinicRepository
            .findOneBy({id: dto.clinicId})

        const pet = await petRepository
            .findOneBy({id: dto.petId})

        if(!pet || !clinic){
            return res.status(404).json({
                success: false,
                message: 'Pet or clinic doesnt exist.'
            });
        }

        let currentTime = new Date(dto.time);
        let appointmentTime;
        //check if appointment exists, time 14 minutes before and later
        const a = await appointmentRepository
            .createQueryBuilder('appointment')
            .where('appointment.clinicId = :clinicId', {clinicId: clinic.id})
            .where('appointment.status = :status', {status: AppointmentStatus.SCHEDULED})
            .andWhere('appointment.time BETWEEN :beforeCurrentTime AND :afterCurrentTime', {
                beforeCurrentTime: new Date(currentTime.getTime() - 14*60*1000),
                afterCurrentTime: new Date(currentTime.getTime() + 14*60*1000)
            })
            .orderBy("appointment.time", "DESC")
            .getOne()
       
        if(!a){
            const isWithinWorkingHours = await isTimeWithinWorkingHours(clinic, currentTime);
                if (!isWithinWorkingHours) {
                    return res.status(400).json({
                        success: false,
                        message: 'Time is outside the working hours of the clinic'
                    });
                }

            const appointment = await appointmentRepository.save(new Appointment(pet, clinic, currentTime, dto.purpose, AppointmentStatus.SCHEDULED))
            return res.status(200).json({
                success: true,
                message: appointment
            });
        }else{
            currentTime = new Date(a.time.getTime() + 15 * 60 * 1000);
            while(!appointmentTime){
                console.log(currentTime)
                const isWithinWorkingHours = await isTimeWithinWorkingHours(clinic, currentTime);
                if (!isWithinWorkingHours) {
                    return res.status(400).json({
                        success: false,
                        message: 'Time is outside the working hours of the clinic'
                    });
                }
                
                const appointment = await appointmentRepository.findOneBy({clinic: clinic, time: currentTime, status: AppointmentStatus.SCHEDULED})
                if(!appointment){
                    appointmentTime = currentTime
                }else{
                    currentTime = new Date(currentTime.getTime() + 15 * 60 * 1000);
                }
            }
        }
        return res.status(404).json({
            success: false,
            message: {
                nextTime: formatDateTime(currentTime)
            }
        });

    } catch (error: unknown) {
        if (error instanceof Error) {
            console.log(error.message)
            res.status(500).send({
                success: false,
                message: error.message
            });
        }
    }


};

export const getAppointmentsByClinicId: RequestHandler = async (req, res) => {

    const clinicId = req.query.clinicId

    try {

        const clinic = await clinicRepository
            .findOneBy({id: clinicId?.toString()})

        if(!clinic){
            return res.status(404).json({
                success: false,
                message: 'Clinic doesnt exist.'
            });
        }

        
        const appointments = await appointmentRepository.find({
            where: {clinic: clinic, status: AppointmentStatus.SCHEDULED}, 
            relations: ['pet']
        })

        return res.status(200).json({
            success: true,
            message: appointments
        });

    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).send({
                success: false,
                message: error.message
            });
        }
    }


};

export const getAppointmentsByOwnerId: RequestHandler = async (req, res) => {

    const ownerId = req.query.ownerId

    try {

        const owner = await ownerRepository
            .findOneBy({id: ownerId?.toString()})
        if(!owner){
            return res.status(404).json({
                success: false,
                message: 'Owner doesnt exist.'
            });
        }
        const pets = await petRepository
            .findBy({owner: owner, status: PetStatus.ALIVE})

        if(!pets){
            return res.status(404).json({
                success: false,
                message: 'Pet doesnt exist.'
            });
        }

        let allAppointments = [];
        for(const pet of pets){
            const appointments = await appointmentRepository.find({
                where: {pet: pet, status: AppointmentStatus.SCHEDULED}, 
                relations: ['pet', 'clinic']
            }) 
            if(appointments.length > 0) allAppointments.push(appointments)
        }

        return res.status(200).json({
            success: true,
            message: allAppointments
        });

    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).send({
                success: false,
                message: error.message
            });
        }
    }


};

//utilities functions

async function isTimeWithinWorkingHours(clinic: VeterinaryClinic, date: Date) {
    const workingHours = await whRepository.findBy({ clinic: clinic });

    const dayOfWeek = date.getDay() //1-7 mon-sun
    const currentTime = date.getHours().toString().padStart(2, "0") + ':' + date.getMinutes().toString().padStart(2, "0");// HH:MM format
    const hoursForDay = workingHours.find(wh => wh.day === dayOfWeek);
    if (!hoursForDay) {
        return false;
    }

    const end = hoursForDay.closingTime.split(':')
    let endHour = parseInt(end[0]);
    let endMinute = parseInt(end[1]);

    let minutesEnd = 0;
    if (endMinute >= 30) {
        minutesEnd = endMinute - 30;
    } else {
        minutesEnd = endMinute + 30;
        endHour--;
    }

    //calculate to hours and minutes
    if (minutesEnd < 0) {
        minutesEnd += 60;
        endHour--; 
    }

    const endTime = endHour + ':' + minutesEnd

    return currentTime >= hoursForDay.openingTime && currentTime <= endTime;
}

function formatDateTime(date: Date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

