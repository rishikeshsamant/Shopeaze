import express from "express";
import {
  registerUser,
  loginUser,
  getAllUsers,
  getUserById,
} from "../controllers/user.controller.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/", getAllUsers);
router.get("/:id", getUserById);

export default router;
