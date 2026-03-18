import express from "express";
import { auth } from "../middlewares/auth.middleware.js";
import { createGroupChat, getChats } from "../controllers/chat.controller.js";

const router = express.Router();

router.use(auth);
router.get("/", getChats);
router.post("/groups", createGroupChat);

export default router;
