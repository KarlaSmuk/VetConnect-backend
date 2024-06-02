
import { Router } from "express";
import { createAppointment, getAppointmentsByClinicId, getAppointmentsByOwnerId, updateAppointmentStatus} from "../controllers/appointment.controller";
import { CreateAppointmentDto } from "../model/requests/createAppointment";
import { validateRequest } from "../middleware/validateRequest";
import { UpdateAppointmentStatus } from "../model/requests/updateAppointmentStatus.dto";

const router = Router();

router.post("/", validateRequest(CreateAppointmentDto),createAppointment);
router.get("/byClinic", getAppointmentsByClinicId)
router.get("/byOwner", getAppointmentsByOwnerId)
router.put("/", validateRequest(UpdateAppointmentStatus), updateAppointmentStatus)

export default router;