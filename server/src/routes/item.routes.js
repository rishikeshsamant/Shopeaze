import express from "express";
import {
  createItem,
  getItems as getAllItems,
  getItemById,
  updateItem,
  deleteItem,
} from "../controllers/item.controller.js";
import { auth } from "../middlewares/auth.middleware.js";

const router = express.Router();


router.post("/", auth, createItem);
router.get("/", auth, getAllItems);
router.get("/:id", auth, getItemById);
router.put("/:id", auth, updateItem);
router.delete("/:id", auth, deleteItem);

export default router;
