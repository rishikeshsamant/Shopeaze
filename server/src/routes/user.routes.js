import express from "express";
import {
  registerUser,
  loginUser,
  getAllUsers,
  getUserById,
  updateUser,
  getProfile,
  changePassword,
} from "../controllers/user.controller.js";
import { auth } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", auth, getProfile);
router.put("/profile", auth, updateUser);
router.post("/change-password", auth, changePassword);
router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUser); 

export default router;
