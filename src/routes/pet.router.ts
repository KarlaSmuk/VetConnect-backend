import { Router } from "express";
import { createPet, getPetsByOwnerId, getPet, getBreedsBySpeciesId, getSpecies } from "../controllers/pet.controller";
import { validateRequest } from "../middleware/validateRequest";
import { CreatePetDto } from "../model/requests/createPet.dto";

const router = Router();

router.get("/breeds/:speciesId", getBreedsBySpeciesId);
router.get("/species", getSpecies);

router.post("/:ownerId", validateRequest(CreatePetDto), createPet);
router.get("/", getPetsByOwnerId);
router.get("/:petId", getPet);




export default router;