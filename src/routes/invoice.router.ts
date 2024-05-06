import { Router } from "express";
import { getInvoice, getInvoiceByVisit } from "../controllers/invoice.controller";
const router = Router();

router.get("/:invoiceId", getInvoice);
router.get("/", getInvoiceByVisit);

export default router;