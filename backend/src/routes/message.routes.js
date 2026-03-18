import express from "express";
import { getMessages, uploadPhoto } from "../controllers/message.controller.js";
import { auth } from "../middlewares/auth.middleware.js";
import { imageUpload } from "../middlewares/upload.middleware.js";

const router = express.Router();

router.post("/upload", auth, imageUpload.single("image"), uploadPhoto);
router.get("/:room", auth, getMessages);

export default router;
