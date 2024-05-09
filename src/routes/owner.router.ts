import { getOwners } from "../controllers/owner.controller";
import { Router } from "express";

const router = Router();

router.get("/getOwners", getOwners);


export default router;