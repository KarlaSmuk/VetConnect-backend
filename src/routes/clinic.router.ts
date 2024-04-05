import { createVetClinic, getAllVetClinics, getVetClinic } from "../controllers/clinic.controller";
import { Router } from "express";

const router = Router();

router.post("/", createVetClinic);
router.get("/", getAllVetClinics);
router.get("/:id", getVetClinic);


export default router;