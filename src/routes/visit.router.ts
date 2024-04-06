import { Router } from "express";
import { CreateVisitDto } from "../model/requests/createVisit.dto";
import { createVisit, getVisitById, getVisitsByPetId } from "../controllers/visit.controller";
import { validateRequest } from "../middleware/validateRequest";

const router = Router();

router.post("/", validateRequest(CreateVisitDto), createVisit);
router.get("/", getVisitById);
router.get("/:petId", getVisitsByPetId);



export default router;