import { getVetsByClinicId } from "../controllers/vet.controller";
import { Router } from "express";

const router = Router();

router.get("/:clinicId", getVetsByClinicId);


export default router;