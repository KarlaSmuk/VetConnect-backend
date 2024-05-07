import { Router } from "express";
import {  createOtp } from "../controllers/otp.controller";

const router = Router();

router.post("/:userId", createOtp);


export default router;