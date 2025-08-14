import { Router } from "express";
import { 
  generateAadhaarOTP, 
  verifyAadhaarOTP, 
  validatePAN 
} from "../controllers/validation.controller.js";

const router = Router();

// Aadhaar validation routes
router.post("/adhaar", generateAadhaarOTP);
router.post("/adhaar/verify", verifyAadhaarOTP);

// PAN validation route
router.post("/pan", validatePAN);

export default router;