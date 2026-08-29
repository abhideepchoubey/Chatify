import express from "express";
import { auth } from "../middlewares/auth.middleware.js";
import {
  getRequests,
  respondToRequest,
  sendFriendRequest,
} from "../controllers/request.controller.js";

const router = express.Router();

router.use(auth);
router.get("/", getRequests);
router.post("/friends", sendFriendRequest);
router.patch("/:requestId", respondToRequest);

export default router;
