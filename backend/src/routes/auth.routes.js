import express from "express";
import {
  register,
  login,
  refreshAccessToken,
  getCurrentUser,
  logout,
} from "../controllers/auth.controller.js";
import { auth } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refreshAccessToken);
router.get("/me", auth, getCurrentUser);
router.post("/logout", auth, logout);

export default router;
