import { Router } from "express";
import { getUserList } from "../controller/user.controller.js";
import { authMiddleware }from "../middleware/auth.middleware.js";

const router = Router();
router.get("/list", authMiddleware, getUserList);
export default router;

