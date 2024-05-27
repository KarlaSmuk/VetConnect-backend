import { Router } from "express";
import { addSupplies, addTreatments, createVetClinic, deleteClinic, deleteSupply, deleteTreatment, deleteWorkingHours, getAllVetClinics, getClinicById, getSuppliesByClinicId, getTreatmentsByClinicId, updateClinicInfo, updateSupplyDescription, updateSupplyStock, updateTreatmentDescription, updateTreatmentPrice, updateWorkingHours } from "../controllers/clinic.controller";
import { CreateClinicDto } from "../model/requests/createClinic.dto";
import { UpdateWorkingHourDTO } from "../model/requests/updateWorkingHours.dto";
import { validateRequest } from "../middleware/validateRequest";
import { CreateSupplyDto } from "../model/requests/createSupply.dto";
import { CreateTreatmentDto } from "../model/requests/createTreatment.dto";

const router = Router();

router.post("/", validateRequest(CreateClinicDto), createVetClinic);
router.get("/", getAllVetClinics);
router.get("/:clinicId", getClinicById);
router.put("/", updateClinicInfo)
router.delete("/delete/:clinicId", deleteClinic)

router.put("/hours", validateRequest(UpdateWorkingHourDTO), updateWorkingHours);
router.delete("/hours", deleteWorkingHours);

router.post("/supply/:clinicId", validateRequest(CreateSupplyDto), addSupplies);
router.get("/supply/:clinicId", getSuppliesByClinicId)
router.put("/supply/description/:supplyId", updateSupplyDescription)
router.put("/supply/stock/:supplyId", updateSupplyStock)
router.delete("/supply/:supplyId", deleteSupply)

router.post("/treatment/:clinicId", validateRequest(CreateTreatmentDto), addTreatments);
router.get("/treatment/:clinicId", getTreatmentsByClinicId);
router.put("/treatment/description/:treatmentId", updateTreatmentDescription);
router.put("/treatment/price/:treatmentId", updateTreatmentPrice);
router.delete("/treatment/:treatmentId", deleteTreatment);

export default router;