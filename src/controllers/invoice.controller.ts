import { RequestHandler } from 'express';
import { AppDataSource } from "../config/db";
import { Visit } from '../model/entity/Visit.entity';
import { Invoice } from '../model/entity/Invoice.entity';
import { InvoiceItem } from '../model/entity/InvoiceItem.entity';
import { CreateInvoiceDto } from 'model/requests/createInvoice.dto';

export const createInvoice:RequestHandler = async (req, res) => {

    const {visitId} = req.params;

    const dto: CreateInvoiceDto = req.body;

    try {

        const visitRepository = AppDataSource.getRepository(Visit)
        const invoiceRepository = AppDataSource.getRepository(Invoice)
        const inoviceItemRepository = AppDataSource.getRepository(InvoiceItem)

        const visit = await visitRepository.findOneByOrFail({id: visitId})

        //TODO


        res.status(200).json({
            success: true,
            message: `Invoice for ${visitId} created succesfully.`
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

export const getInvoice:RequestHandler = async (req, res) => {

    const {invoiceId} = req.params;

    try {

       

        res.status(200).json({
            success: true,
            message: ''
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

export const getInvoiceByVisit:RequestHandler = async (req, res) => {

    const {visitId} = req.query;

    try {

        res.status(200).json({
            success: true,
            message: ''
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

