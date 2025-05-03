import express from "express";
import {
  createCustomer,
  getCustomers as getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
} from "../controllers/customer.controller.js";
import { auth } from "../middlewares/auth.middleware.js";

const router = express.Router();


router.post("/", auth, createCustomer);
router.get("/", auth, getAllCustomers);
router.get("/:id", auth, getCustomerById);
router.put("/:id", auth, updateCustomer);
router.delete("/:id", auth, deleteCustomer);

export default router;
