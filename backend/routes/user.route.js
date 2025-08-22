import { Router } from "express";
import { getUserList, getUserID, updateUser } from "../controller/user.controller.js";
import { authMiddleware }from "../middleware/auth.middleware.js";

const router = Router();
router.get("/list", authMiddleware, getUserList);
router.get("/profile",authMiddleware, getUserID);
router.put("/upprofile", authMiddleware, updateUser);
export default router;

