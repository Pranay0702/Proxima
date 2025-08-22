import { Router } from "express";
import { getUserList, getUserID, updateUser, upload } from "../controller/user.controller.js";
import { authMiddleware }from "../middleware/auth.middleware.js";

const router = Router();
router.get("/list", authMiddleware, getUserList);
router.get("/profile",authMiddleware, getUserID);
router.put("/upprofile", authMiddleware, upload.fields([
    {name:"profileImage", maxCount:1},
    {name:"coverImage", maxCount:1},]), updateUser);
export default router;

