import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { bookTicket, checkSeatsAvailability, deleteMyEvent, getBookings, getEventById, getEvents, getEventSeatsAndTimings, getMyBookings, getMyEventById, getMyEvents, postEvent, updateMyEvent } from "../controllers/events.controller.js";

const router = Router();
router.get('/get-events' , authenticate , getEvents);
router.get('/get-events/:id' , authenticate , getEventById);
router.post('/add-events' , authenticate , postEvent);
router.get('/get-seats-times/:id' , authenticate , getEventSeatsAndTimings);
router.get('/get-my-bookings' , authenticate , getMyBookings)


router.get('/get-my-events' , authenticate , getMyEvents);
router.get('/get-my-events/:id' , authenticate , getMyEventById);
router.post('/update-my-event/:id' , authenticate , updateMyEvent);
router.delete('/delete-my-event/:id' , authenticate , deleteMyEvent);
router.get('/get-bookings' , authenticate , getBookings); //organizer

router.post('/check-seats' , checkSeatsAvailability);
router.post('/book-ticket' , authenticate , bookTicket);

export default router;