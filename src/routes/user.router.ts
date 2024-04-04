import { Router } from "express";
import { createUser, getAllUsers, getUser } from "../controllers/user.controller";

const router = Router();

router.post("/", createUser);
router.get("/", getAllUsers);
router.get("/:id", getUser);


export default router;