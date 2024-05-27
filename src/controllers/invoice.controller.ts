import { RequestHandler } from 'express';
import { AppDataSource } from "../config/db";
import { BadRequestError } from '../middleware/errorHandling';
import { Invoice } from '../model/entity/Invoice.entity';
import { InvoiceItem } from '../model/entity/InvoiceItem.entity';
import { Visit } from '../model/entity/Visit.entity';
import { CreateInvoiceDto } from '../model/requests/createInvoice.dto';
import { Treatment } from '../model/entity/Treatment.entity';

const invoiceRepository = AppDataSource.getRepository(Invoice);
const invoiceItemRepository = AppDataSource.getRepository(InvoiceItem)
const visitRepository = AppDataSource.getRepository(Visit)
const treatmentRepository = AppDataSource.getRepository(Treatment)

export const createInvoice: RequestHandler = async (req, res) => {

    const dto: CreateInvoiceDto = req.body;

    try {

        const visit = await visitRepository
            .findOneByOrFail({ id: dto.visitId })

        const treatments = await Promise.all(
            dto.treatments.map(async item => {
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

        const treatmentsInvoice = await Promise.all(
            treatments.map(item => {
                return invoiceItemRepository.save(new InvoiceItem(item.quantity, item.price, invoice, item.treatment));
            })
        );

        const result = {
            invoice: {
                id: invoice.id,
                totalPrice: invoice.totalPrice,
                createdAt: invoice.createdAt
            },
            treatments: treatmentsInvoice.map(item => ({
                id: item.id,
                quantity: item.quantity,
                totalPrice: item.totalPrice,
                treatmentId: item.treatment.id,
                treatmentName: item.treatment.name,
                treatmentDescription: item.treatment.description
            }))
        }

        return res.status(200).json({
            success: true,
            message: result
        });

    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(400).send({
                success: false,
                message: error.message
            });
        }
    }



}

export const getInvoice: RequestHandler = async (req, res) => {

    const { invoiceId } = req.params;

    if (!invoiceId) {
        throw new BadRequestError('Invoice ID is required.')
    }


    try {

        const invoice = await invoiceRepository
            .findOneByOrFail({ id: invoiceId.toString() })

        const invoiceItemsWithTreatments = await invoiceItemRepository
            .createQueryBuilder("invoiceItem")
            .leftJoinAndSelect("invoiceItem.treatment", "treatment")
            .where("invoiceItem.invoiceId = :invoiceId", { invoiceId: invoice.id })
            .getMany();

        const result = {
            invoice:  {
                id: invoice.id,
                totalPrice: invoice.totalPrice,
                createdAt: invoice.createdAt
            },
            items: invoiceItemsWithTreatments.map(item => ({
                id: item.id,
                quantity: item.quantity,
                totalPrice: item.totalPrice,
                treatmentId: item.treatment.id,
                treatmentName: item.treatment.name,
                treatmentDescription: item.treatment.description
            }))
        }

        return res.status(200).json({
            success: true,
            message: result
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

export const getInvoicesByVisit: RequestHandler = async (req, res) => {

    const { visitId } = req.query;

    try {

        const visit = await visitRepository
            .findOneByOrFail({ id: visitId?.toString() })

        const invoices = await invoiceRepository.find({
            where: {
                visit: visit
            },
            order: {
                createdAt: "DESC" 
            }
        });

        if(!invoices){
            return res.status(404).json({
                success: true,
                message: `Invoice for visit ${visitId} does not exist.`
            });  
        }

        let invoiceItemsWithTreatments = [];
        for (const invoice of invoices) { 
            const pom = await invoiceItemRepository
                .createQueryBuilder("invoiceItem")
                .leftJoinAndSelect("invoiceItem.treatment", "treatment")
                .where("invoiceItem.invoiceId = :invoiceId", { invoiceId: invoice.id })
                .getMany();
            invoiceItemsWithTreatments.push({ invoice, treatments: pom });
        }
        
        let result = [];
        for (const { invoice, treatments } of invoiceItemsWithTreatments) { 
            const pom = {
                invoice: {
                    id: invoice.id,
                    totalPrice: invoice.totalPrice,
                    createdAt: invoice.createdAt
                },
                treatments: treatments.map(item => ({
                    id: item.id,
                    quantity: item.quantity,
                    totalPrice: item.totalPrice,
                    treatmentId: item.treatment.id,
                    treatmentName: item.treatment.name,
                    treatmentDescription: item.treatment.description
                }))
            };
            result.push(pom);
        }
        

        return res.status(200).json({
            success: true,
            message: result
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

