import { Router } from "express";
import { createInvoice, getInvoice, getInvoicesByVisit } from "../controllers/invoice.controller";
import { validateRequest } from "../middleware/validateRequest";
import { CreateInvoiceDto } from "../model/requests/createInvoice.dto";
const router = Router();

router.post("/", validateRequest(CreateInvoiceDto), createInvoice);
router.get("/:invoiceId", getInvoice);
router.get("/", getInvoicesByVisit);

export default router;