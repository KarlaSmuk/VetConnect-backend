import { Router } from "express";
import { addSupplies, addTreatments, addWorkingHours, createVetClinic, deleteTreatment, deleteWorkingHours, getAllSuppliesForClinic, getAllTreatmentsForClinic, getAllVetClinics, getVetClinic, updateSupply, updateTreatment, updateWorkingHours } from "../controllers/clinic.controller";
import { CreateClinicDto } from "../model/requests/createClinic.dto";
import { CreateUpdateWorkingHourDTO } from "../model/requests/createUpdateWorkingHours.dto";
import { validateRequest } from "../middleware/validateRequest";
import { CreateSupplyDto } from "../model/requests/createSupply.dto";
import { CreateTreatmentDto } from "../model/requests/createTreatment.dto";

const router = Router();

router.post("/", validateRequest(CreateClinicDto), createVetClinic);
router.get("/", getAllVetClinics);
router.get("/:id", getVetClinic);

router.post("/hours/:clinicId", validateRequest(CreateUpdateWorkingHourDTO), addWorkingHours);
router.put("/hours/:clinicId", validateRequest(CreateUpdateWorkingHourDTO), updateWorkingHours);//TODO
router.delete("/hours", deleteWorkingHours);

router.post("/supply/:clinicId", validateRequest(CreateSupplyDto), addSupplies);
router.get("/supply/:clinicId", getAllSuppliesForClinic)
router.put("/supply/:supplyId", updateSupply)

router.post("/treatment/:clinicId", validateRequest(CreateTreatmentDto), addTreatments);
router.get("/treatment/:clinicId", getAllTreatmentsForClinic)
router.put("/treatment/:treatmentId", updateTreatment);
router.delete("/treatment/:treatmentId", deleteTreatment);




export default router;