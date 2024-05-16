import { Router } from "express";
import { createOwnerUser, createVetUser, getAllUsers, getUser, saveProfilePhoto } from "../controllers/user.controller";
import { validateRequest } from "../middleware/validateRequest";
import { CreateUserDto } from "../model/requests/createUser.dto";
import { multer } from "../middleware/multer";

const router = Router();

router.post("/", validateRequest(CreateUserDto), createOwnerUser);
router.post("/:clinicId", validateRequest(CreateUserDto), createVetUser);
router.get("/", getAllUsers);
router.get("/:id", getUser);

router.post("/saveProfileImage/:userId", multer.single("file"), saveProfilePhoto)


export default router;