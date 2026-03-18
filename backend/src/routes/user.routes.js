import express from "express";
import { auth } from "../middlewares/auth.middleware.js";
import {
  addFriend,
  getFriends,
  searchUsers,
} from "../controllers/user.controller.js";

const router = express.Router();

router.use(auth);
router.get("/search", searchUsers);
router.get("/friends", getFriends);
router.post("/friends", addFriend);

export default router;
