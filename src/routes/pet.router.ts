import { Router } from "express";
import { createPet, getAllPets, getPet } from "../controllers/pet.controller";
import { validateRequest } from "../middleware/validateRequest";
import { CreatePetDto } from "../model/requests/createPet.dto";

const router = Router();

router.post("/:ownerId", validateRequest(CreatePetDto), createPet);
router.get("/", getAllPets);
router.get("/:petId", getPet);


export default router;