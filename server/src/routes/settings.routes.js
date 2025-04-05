import express from "express";
import {
  getSettings,
  updateSettings,
} from "../controllers/settings.controller.js";
import { auth } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Apply auth middleware to all settings routes
router.get("/", auth, getSettings);
router.put("/", auth, updateSettings);

export default router;
