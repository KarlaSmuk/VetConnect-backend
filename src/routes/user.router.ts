import { Router } from "express";
import { createUser, helloWorld } from "../controllers/user.controller";

const router = Router();

router.get("/", helloWorld);
router.post("/", createUser);

export default router;