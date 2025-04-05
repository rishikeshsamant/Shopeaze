import express from "express";
import {
  createInvoice,
  getInvoices as getAllInvoices,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
} from "../controllers/invoice.controller.js";
import { auth } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Apply auth middleware to all invoice routes
router.post("/", auth, createInvoice);
router.get("/", auth, getAllInvoices);
router.get("/:id", auth, getInvoiceById);
router.put("/:id", auth, updateInvoice);
router.delete("/:id", auth, deleteInvoice);

export default router;
