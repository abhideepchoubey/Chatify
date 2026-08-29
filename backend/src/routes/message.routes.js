import express from "express";
import {
  getMessages,
  uploadAttachments,
} from "../controllers/message.controller.js";
import { auth } from "../middlewares/auth.middleware.js";
import { attachmentUpload } from "../middlewares/upload.middleware.js";

const router = express.Router();

router.post(
  "/upload",
  auth,
  attachmentUpload.array("files", 5),
  uploadAttachments
);
router.get("/:room", auth, getMessages);

export default router;
