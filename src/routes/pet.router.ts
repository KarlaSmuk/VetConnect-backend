import { Router } from "express";
import { createPet, getPetsByOwnerId, getPet, getBreedsBySpeciesId, getSpecies, savePetImage, updatePetStatus } from "../controllers/pet.controller";
import { validateRequest } from "../middleware/validateRequest";
import { CreatePetDto } from "../model/requests/createPet.dto";
import { multer } from "../middleware/multer";
import { UpdatePetStatus } from "../model/requests/updatePetStatus.dto";

const router = Router();

router.get("/breeds/:speciesId", getBreedsBySpeciesId);
router.get("/species", getSpecies);


router.post("/createPet/:ownerId", validateRequest(CreatePetDto), createPet);
router.post("/savePetImage/:petId", multer.single("file"), savePetImage);
router.get("/", getPetsByOwnerId);
router.get("/getPet/:petId", getPet);

router.put("/updatePetStatus", validateRequest(UpdatePetStatus), updatePetStatus)




export default router;