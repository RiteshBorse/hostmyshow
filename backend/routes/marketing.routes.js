import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { getEmailList, sendBulkEmails } from "../controllers/marketing.controller.js";

const router = Router();
router.get('/get-emails' , authenticate , getEmailList );
router.post('/bulk-email' , authenticate , sendBulkEmails)
export default router;