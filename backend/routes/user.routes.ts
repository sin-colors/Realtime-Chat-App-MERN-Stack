import express from "express";
import protectRoute from "../middleware/protectRoute";
import {
  changeUserName,
  getMe,
  getUsersForSidebar,
} from "../controllers/user.controller";

const router = express.Router();
router.get("/", protectRoute, getUsersForSidebar);
router.post("/change-username", protectRoute, changeUserName);
router.get("/me", protectRoute, getMe);
export default router;
