import { Router } from "express";
import { createInvoice, getInvoice, getInvoiceByVisit } from "../controllers/invoice.controller";
const router = Router();

router.post("/:visitId", createInvoice);
router.get("/:id", getInvoice);
router.get("/", getInvoiceByVisit);
//router.get("/visitsByPet/:petId", getOtp);
//router.get("/visitsByOwner/:ownerId", getOtp);

export default router;