import { RequestHandler } from 'express';
import { AppDataSource } from "../config/db";
import { BadRequestError } from '../middleware/errorHandling';
import { Invoice } from '../model/entity/Invoice.entity';
import { InvoiceItem } from '../model/entity/InvoiceItem.entity';
import { Visit } from '../model/entity/Visit.entity';

const invoiceRepository = AppDataSource.getRepository(Invoice);
const invoiceItemRepository = AppDataSource.getRepository(InvoiceItem)
const visitRepository = AppDataSource.getRepository(Visit)

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
            invoice: invoice,
            items: invoiceItemsWithTreatments.map(item => ({
                id: item.id,
                quantity: item.quantity,
                totalPrice: item.totalPrice,
                treatment: item.treatment
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

export const getInvoiceByVisit: RequestHandler = async (req, res) => {

    const { visitId } = req.query;

    try {

        const visit = await visitRepository
            .findOneByOrFail({ id: visitId?.toString() })

        const invoice = await invoiceRepository
            .findOneByOrFail({ visit: visit })

        const invoiceItemsWithTreatments = await invoiceItemRepository
            .createQueryBuilder("invoiceItem")
            .leftJoinAndSelect("invoiceItem.treatment", "treatment")
            .where("invoiceItem.invoiceId = :invoiceId", { invoiceId: invoice.id })
            .getMany();

        const result = {
            invoice: invoice,
            items: invoiceItemsWithTreatments.map(item => ({
                id: item.id,
                quantity: item.quantity,
                totalPrice: item.totalPrice,
                treatment: item.treatment
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

