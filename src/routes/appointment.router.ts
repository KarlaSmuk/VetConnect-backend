
import { Router } from "express";
import { createAppointment, getAppointmentsByClinicId, getAppointmentsByOwnerId} from "../controllers/appointment.controller";
import { CreateAppointmentDto } from "../model/requests/createAppointment";
import { validateRequest } from "../middleware/validateRequest";

const router = Router();

router.post("/", validateRequest(CreateAppointmentDto),createAppointment);
router.get("/byClinic", getAppointmentsByClinicId)
router.get("/byOwner", getAppointmentsByOwnerId)

export default router;