import { Router } from "express";
import {  createOtp, verifyOtp } from "../controllers/otp.controller";

const router = Router();

router.post("/:userId", createOtp);
router.get("/:userId", verifyOtp);


export default router;