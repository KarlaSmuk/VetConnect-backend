import { Router } from "express";
import { createOwnerUser, createVetUser, getAllUsers, getUser, getOwners } from "../controllers/user.controller";
import { validateRequest } from "../middleware/validateRequest";
import { CreateUserDto } from "../model/requests/createUser.dto";

const router = Router();

router.post("/", validateRequest(CreateUserDto), createOwnerUser);
router.post("/:clinicId", validateRequest(CreateUserDto), createVetUser);
router.get("/", getAllUsers);
router.get("/fetchOwners", getOwners);
router.get("/:id", getUser);


export default router;