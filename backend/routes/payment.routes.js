import { Router } from "express"
import { createOrder, verifyPayment } from "../controllers/payment.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
const router = Router();
router.post("/order" , authenticate , createOrder );
router.post("/verify" , authenticate , verifyPayment)
export default router;