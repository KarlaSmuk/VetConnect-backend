import { Router } from "express";
import { createPet, getAllPets, getPet } from "../controllers/pet.controller";

const router = Router();

router.post("/:ownerId", createPet);
router.get("/", getAllPets);
router.get("/:petId", getPet);


export default router;