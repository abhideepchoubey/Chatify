import express from "express";
import { auth } from "../middlewares/auth.middleware.js";
import { getFriends, searchUsers } from "../controllers/user.controller.js";

const router = express.Router();

router.use(auth);
router.get("/search", searchUsers);
router.get("/friends", getFriends);

export default router;
