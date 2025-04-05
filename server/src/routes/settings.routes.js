import express from "express";
import {
  getSettings,
  updateSettings,
  getCompanyInfo,
  updateCompanyInfo,
  getInvoiceSettings,
  updateInvoiceSettings
} from "../controllers/settings.controller.js";
import { auth } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Apply auth middleware to all settings routes
router.get("/", auth, getSettings);
router.put("/", auth, updateSettings);

// Company info routes
router.get("/company", auth, getCompanyInfo);
router.put("/company", auth, updateCompanyInfo);

// Invoice settings routes
router.get("/invoice", auth, getInvoiceSettings);
router.put("/invoice", auth, updateInvoiceSettings);

export default router;
