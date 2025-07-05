import { Router } from "express";
import { login, register, verifyOtp } from "../controllers/user.controller.js";

const router = Router();
router.post("/register" , register);
router.post("/otp-verify" , verifyOtp);
router.post("/login" , login);
export default router;