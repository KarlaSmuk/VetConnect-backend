
import { verifyOtp, register, login } from "../controllers/auth.controller";
import { Router } from "express";

const router = Router();

router.post("/verify", verifyOtp);
router.put("/register", register);
router.post("/login", login);

export default router;