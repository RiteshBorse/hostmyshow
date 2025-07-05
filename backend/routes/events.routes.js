import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { getEventById, getEvents, getEventSeatsAndTimings, postEvent } from "../controllers/events.controller.js";

const router = Router();
router.get('/get-events' , authenticate , getEvents);
router.get('/get-events/:id' , authenticate , getEventById);
router.post('/add-events' , authenticate , postEvent);
router.get('/get-seats-times/:id' , authenticate , getEventSeatsAndTimings);
export default router;