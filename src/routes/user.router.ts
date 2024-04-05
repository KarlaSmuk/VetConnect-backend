import { Router } from "express";
import { createOwnerUser, createVetUser, getAllUsers, getUser } from "../controllers/user.controller";

const router = Router();

router.post("/", createOwnerUser);
router.post("/:clinicId", createVetUser);
router.get("/", getAllUsers);
router.get("/:id", getUser);


export default router;