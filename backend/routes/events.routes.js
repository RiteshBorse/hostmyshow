import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { getEventById, getEvents } from "../controllers/events.controller.js";

const router = Router();
router.get('/get-events' , authenticate , getEvents);
router.get('/get-events/:id' , authenticate , getEventById);
export default router;