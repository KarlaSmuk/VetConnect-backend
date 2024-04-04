import { Router } from "express";
import {  createOtp, getAllOtps, getOtp } from "../controllers/otp.controller";

const router = Router();

router.post("/:userId", createOtp);
router.get("/", getAllOtps);
router.get("/:userId", getOtp);


export default router;