import { Router } from "express";
import { addReview , getAllReviews, getReviews } from "../controllers/review.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";


const router = Router();
router.post('/addreview' , authenticate , addReview);
router.get('/getreviews/:event_id' , authenticate , getReviews);
router.get('/getAllReviews' , getAllReviews);

export default router ;