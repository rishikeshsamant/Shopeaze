import express from "express";
import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller.js";
import { auth } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Apply auth middleware to all category routes
router.post("/", auth, createCategory);
router.get("/", auth, getCategories);
router.get("/:id", auth, getCategoryById);
router.put("/:id", auth, updateCategory);
router.delete("/:id", auth, deleteCategory);

export default router; 