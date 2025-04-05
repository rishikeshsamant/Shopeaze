import express from "express";
import { getDashboardStats, getSalesData } from "../controllers/dashboard.controller.js";
import { auth } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Route to get dashboard statistics
router.get("/stats", auth, getDashboardStats);

// Route to get sales data by period (daily, weekly, monthly)
router.get("/sales/:period", auth, getSalesData);

export default router; 